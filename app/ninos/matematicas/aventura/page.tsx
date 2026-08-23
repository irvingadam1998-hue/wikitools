'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/* Tipos y datos                                                       */
/* ------------------------------------------------------------------ */

type WorldId =
  | 'aldea-sumas'
  | 'bosque-restas'
  | 'oceano-multiplicaciones'
  | 'montana-numeros'
  | 'castillo-reto'

type WorldDef = {
  id: WorldId
  title: string
  shortLabel: string
  subtitle: string
  icon: string
  color: string
  description: string
  /** Solo `true` cuando el mundo ya tiene preguntas reales implementadas. */
  implemented: boolean
}

type Question = {
  a: number
  b: number
  answer: number
  options: number[]
}

type LevelResult = 'success' | 'fail' | null
type WorldStatus = 'locked' | 'soon' | 'available' | 'completed'

const WORLDS: WorldDef[] = [
  {
    id: 'aldea-sumas',
    title: 'Aldea de las Sumas',
    shortLabel: 'Aldea',
    subtitle: 'Sumas sencillas',
    icon: '🏡',
    color: '#e2637a',
    description: 'Ayuda a los aldeanos sumando manzanas, ovejas y monedas.',
    implemented: true,
  },
  {
    id: 'bosque-restas',
    title: 'Bosque de las Restas',
    shortLabel: 'Bosque',
    subtitle: 'Restas',
    icon: '🌳',
    color: '#7cb87f',
    description: 'Cruza el bosque resolviendo restas entre los árboles.',
    implemented: true,
  },
  {
    id: 'oceano-multiplicaciones',
    title: 'Océano de las Multiplicaciones',
    shortLabel: 'Océano',
    subtitle: 'Multiplicaciones',
    icon: '🌊',
    color: '#4fb0a5',
    description: 'Nada entre las tablas de multiplicar.',
    implemented: false,
  },
  {
    id: 'montana-numeros',
    title: 'Montaña de los Números',
    shortLabel: 'Montaña',
    subtitle: 'Secuencias',
    icon: '🏔️',
    color: '#5b8dd9',
    description: 'Sube la montaña completando secuencias numéricas.',
    implemented: false,
  },
  {
    id: 'castillo-reto',
    title: 'Castillo del Reto',
    shortLabel: 'Castillo',
    subtitle: 'Retos combinados',
    icon: '🏰',
    color: '#f2a93b',
    description: 'El reto final: un poco de todo lo que aprendiste.',
    implemented: false,
  },
]

const QUESTIONS_PER_LEVEL = 6
const MAX_LIVES = 3

/* ------------------------------------------------------------------ */
/* Geometría del mapa                                                  */
/* ------------------------------------------------------------------ */

const MAP_WIDTH = 800
const MAP_HEIGHT = 2180

const WORLD_POSITIONS: Record<WorldId, { x: number; y: number }> = {
  'aldea-sumas': { x: 220, y: 200 },
  'bosque-restas': { x: 560, y: 600 },
  'oceano-multiplicaciones': { x: 190, y: 1020 },
  'montana-numeros': { x: 580, y: 1460 },
  'castillo-reto': { x: 260, y: 1920 },
}

function buildRoadPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midY = (p0.y + p1.y) / 2
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`
  }
  return d
}

const ROAD_PATH = buildRoadPath([
  { x: 220, y: 90 },
  WORLD_POSITIONS['aldea-sumas'],
  WORLD_POSITIONS['bosque-restas'],
  WORLD_POSITIONS['oceano-multiplicaciones'],
  WORLD_POSITIONS['montana-numeros'],
  WORLD_POSITIONS['castillo-reto'],
  { x: 260, y: 2040 },
])

function generateStars(count: number, seed: number) {
  const stars: { x: number; y: number; r: number; opacity: number }[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: (((i * 53 + seed * 17) % 97) / 97) * MAP_WIDTH,
      y: (((i * 31 + seed * 7) % 89) / 89) * MAP_HEIGHT,
      r: 0.6 + (((i * 13) % 5) / 5) * 1.2,
      opacity: 0.2 + (((i * 19) % 6) / 6) * 0.5,
    })
  }
  return stars
}

const STARS = generateStars(36, 3)

/* ------------------------------------------------------------------ */
/* Motor de sonido (sintetizado, sin archivos externos)                */
/* ------------------------------------------------------------------ */

let sharedAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return null
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AC()
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {})
  }
  return sharedAudioCtx
}

function playTone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.15
) {
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = 0

  osc.connect(gain)
  gain.connect(ctx.destination)

  const t0 = ctx.currentTime + start
  gain.gain.linearRampToValueAtTime(gainValue, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)

  osc.start(t0)
  osc.stop(t0 + duration + 0.03)
}

function playCorrectSound() {
  playTone(523.25, 0, 0.14, 'triangle', 0.14)
  playTone(659.25, 0.09, 0.14, 'triangle', 0.14)
  playTone(783.99, 0.18, 0.22, 'triangle', 0.16)
}

function playWrongSound() {
  playTone(220, 0, 0.18, 'sawtooth', 0.1)
  playTone(174.61, 0.14, 0.26, 'sawtooth', 0.1)
}

function playWhooshSound() {
  playTone(300, 0, 0.16, 'sine', 0.05)
  playTone(520, 0.06, 0.16, 'sine', 0.05)
}

function playDeniedSound() {
  playTone(160, 0, 0.12, 'square', 0.06)
}

function playChimeSound() {
  playTone(880, 0, 0.1, 'sine', 0.07)
  playTone(1174.66, 0.05, 0.14, 'sine', 0.07)
}

function playFanfareSound() {
  ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    playTone(freq, i * 0.12, 0.26, 'triangle', 0.15)
  )
}

function playSadTromboneSound() {
  playTone(392, 0, 0.3, 'sawtooth', 0.09)
  playTone(349.23, 0.26, 0.3, 'sawtooth', 0.09)
  playTone(311.13, 0.52, 0.45, 'sawtooth', 0.09)
}

/* ------------------------------------------------------------------ */
/* Generador de preguntas (Aldea de las Sumas)                         */
/* ------------------------------------------------------------------ */

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function generateSumQuestion(): Question {
  const a = randInt(1, 9)
  const b = randInt(1, 9)
  const answer = a + b

  const options = new Set<number>([answer])
  let guard = 0

  while (options.size < 4 && guard < 40) {
    guard++
    const offset = randInt(-5, 5)
    const candidate = answer + offset
    if (candidate >= 0 && candidate <= 20 && candidate !== answer) {
      options.add(candidate)
    }
  }

  return {
    a,
    b,
    answer,
    options: shuffle(Array.from(options)),
  }
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export default function AventuraMatematicaPage() {
  const [screen, setScreen] = useState<'mapa' | 'nivel'>('mapa')
  const [activeWorldId, setActiveWorldId] = useState<WorldId | null>(null)

  const [unlockedWorlds, setUnlockedWorlds] = useState<WorldId[]>([
    'aldea-sumas',
  ])
  const [completedWorlds, setCompletedWorlds] = useState<WorldId[]>([])

  const [coins, setCoins] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const [lives, setLives] = useState(MAX_LIVES)
  const [streak, setStreak] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [correctInLevel, setCorrectInLevel] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateSumQuestion()
  )
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [levelResult, setLevelResult] = useState<LevelResult>(null)
  const [soundOn, setSoundOn] = useState(true)

  const activeWorld = useMemo(
    () => WORLDS.find((world) => world.id === activeWorldId) ?? null,
    [activeWorldId]
  )

  /* ---------------------------------------------------------------- */
  /* Acciones                                                          */
  /* ---------------------------------------------------------------- */

  function startWorld(world: WorldDef) {
    if (!world.implemented) return
    if (!unlockedWorlds.includes(world.id)) return

    setActiveWorldId(world.id)
    setLives(MAX_LIVES)
    setStreak(0)
    setQuestionNumber(0)
    setCorrectInLevel(0)
    setCurrentQuestion(generateSumQuestion())
    setSelectedOption(null)
    setFeedback(null)
    setLevelResult(null)
    setScreen('nivel')
  }

  function handleAnswer(option: number) {
    if (feedback) return

    setSelectedOption(option)
    const isCorrect = option === currentQuestion.answer

    if (isCorrect) {
      setFeedback('correct')
      if (soundOn) playCorrectSound()
      const gained = 10 + streak * 2
      setCoins((c) => c + gained)
      const newStreak = streak + 1
      setStreak(newStreak)
      setBestStreak((b) => Math.max(b, newStreak))
      setCorrectInLevel((c) => c + 1)
    } else {
      setFeedback('wrong')
      if (soundOn) playWrongSound()
      setStreak(0)
    }

    const newLives = isCorrect ? lives : lives - 1
    if (!isCorrect) setLives(newLives)

    window.setTimeout(() => {
      if (!isCorrect && newLives <= 0) {
        setLevelResult('fail')
        if (soundOn) playSadTromboneSound()
        return
      }

      const nextQuestionNumber = questionNumber + 1

      if (nextQuestionNumber >= QUESTIONS_PER_LEVEL) {
        setLevelResult('success')
        if (soundOn) playFanfareSound()

        if (activeWorldId) {
          setCompletedWorlds((prev) =>
            prev.includes(activeWorldId) ? prev : [...prev, activeWorldId]
          )

          const idx = WORLDS.findIndex((w) => w.id === activeWorldId)
          const next = WORLDS[idx + 1]

          if (next) {
            setUnlockedWorlds((prev) =>
              prev.includes(next.id) ? prev : [...prev, next.id]
            )
          }
        }
        return
      }

      setQuestionNumber(nextQuestionNumber)
      setCurrentQuestion(generateSumQuestion())
      setSelectedOption(null)
      setFeedback(null)
    }, 900)
  }

  function retryLevel() {
    setLives(MAX_LIVES)
    setStreak(0)
    setQuestionNumber(0)
    setCorrectInLevel(0)
    setCurrentQuestion(generateSumQuestion())
    setSelectedOption(null)
    setFeedback(null)
    setLevelResult(null)
  }

  function backToMap() {
    setScreen('mapa')
    setActiveWorldId(null)
    setLevelResult(null)
  }

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div
      className="min-h-screen bg-[#1c242c] text-[#e9edf1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@600;700&display=swap');

        .font-display { font-family: 'Oswald', 'Arial Narrow', sans-serif; }
        .font-label { font-family: 'IBM Plex Mono', monospace; }
        .font-hand { font-family: 'Caveat', cursive; }

        .peg-card { position: relative; }
        .peg-card::before,
        .peg-card::after {
          content: '';
          position: absolute;
          top: 14px;
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: #0f151a;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08);
        }
        .peg-card::before { left: 22px; }
        .peg-card::after { right: 22px; }

        @keyframes rise-in {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.45s ease both; }

        @keyframes pop-correct {
          0% { transform: scale(1); }
          40% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .pop-correct { animation: pop-correct 0.4s ease; }

        @keyframes shake-wrong {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .shake-wrong { animation: shake-wrong 0.4s ease; }

        @keyframes coin-pop {
          0% { transform: scale(0.6) translateY(6px); opacity: 0; }
          60% { transform: scale(1.15) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .coin-pop { animation: coin-pop 0.5s ease both; }

        @keyframes pulse-ring {
          0%, 100% { opacity: 0.9; r: 3.5; }
          50% { opacity: 0.3; r: 5; }
        }
        .pulse-ring { animation: pulse-ring 1.6s ease-in-out infinite; transform-origin: center; }

        @keyframes node-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.12); }
        }
        .node-pulse { animation: node-pulse 2s ease-in-out infinite; transform-origin: center; }

        @keyframes char-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .character-idle { animation: char-bob 1.6s ease-in-out infinite; }

        @keyframes char-walk {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .character-walk { animation: char-walk 0.26s ease-in-out infinite; }

        @keyframes apple-wiggle-kf {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .apple-wiggle { display: inline-block; animation: apple-wiggle-kf 1.8s ease-in-out infinite; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.8; }
        }
        .twinkle { animation: twinkle 2.4s ease-in-out infinite; }

        @keyframes firefly-float {
          0% { transform: translate(0,0); opacity: 0.4; }
          25% { transform: translate(6px,-8px); opacity: 1; }
          50% { transform: translate(-4px,-14px); opacity: 0.6; }
          75% { transform: translate(8px,-6px); opacity: 1; }
          100% { transform: translate(0,0); opacity: 0.4; }
        }
        .firefly { animation: firefly-float 3.6s ease-in-out infinite; }

        @keyframes mascot-idle-bob {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-4px) rotate(3deg); }
        }
        .mascot-idle { animation: mascot-idle-bob 2s ease-in-out infinite; }

        @keyframes mascot-jump-kf {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-18px) scale(1.15); }
          55% { transform: translateY(0) scale(1); }
          70% { transform: translateY(-6px) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }
        .mascot-jump { animation: mascot-jump-kf 0.6s ease; }

        .crate-button { transition: transform 0.15s ease, filter 0.15s ease; }
        .crate-button:hover:not(:disabled) { transform: scale(1.06) rotate(-1deg); }
        .crate-button:active:not(:disabled) { transform: scale(0.94); }

        @keyframes confetti-fly {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); opacity: 0; }
        }
        .confetti-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: 18px;
          opacity: 0;
          animation: confetti-fly 0.8s ease-out forwards;
        }
      `}</style>

      {screen === 'mapa' ? (
        <MapaScreen
          coins={coins}
          bestStreak={bestStreak}
          unlockedWorlds={unlockedWorlds}
          completedWorlds={completedWorlds}
          onEnterWorld={startWorld}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
        />
      ) : (
        activeWorld && (
          <NivelScreen
            world={activeWorld}
            lives={lives}
            coins={coins}
            streak={streak}
            questionNumber={questionNumber}
            correctInLevel={correctInLevel}
            currentQuestion={currentQuestion}
            selectedOption={selectedOption}
            feedback={feedback}
            levelResult={levelResult}
            onAnswer={handleAnswer}
            onRetry={retryLevel}
            onBackToMap={backToMap}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
          />
        )
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* HUD reutilizable                                                    */
/* ------------------------------------------------------------------ */

function Hud({
  coins,
  lives,
  streak,
  soundOn,
  onToggleSound,
}: {
  coins: number
  lives?: number
  streak: number
  soundOn?: boolean
  onToggleSound?: () => void
}) {
  return (
    <div className="font-label flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-widest text-[#a9b4bd]">
      {typeof lives === 'number' && (
        <span className="flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} className={i < lives ? '' : 'opacity-25 grayscale'}>
              ❤️
            </span>
          ))}
        </span>
      )}

      <span className="flex items-center gap-1">
        <span className={streak > 0 ? 'text-[#f2a93b]' : ''}>🔥</span>
        {streak}
      </span>

      <span className="flex items-center gap-1 text-[#f2a93b]">⭐ {coins}</span>

      {typeof soundOn === 'boolean' && onToggleSound && (
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundOn ? 'Silenciar sonido' : 'Activar sonido'}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#3a4753] text-[11px] transition hover:border-[#5a6774]"
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Escenografía SVG                                                    */
/* ------------------------------------------------------------------ */

function Pine({
  x,
  y,
  scale = 1,
  color,
}: {
  x: number
  y: number
  scale?: number
  color: string
}) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <polygon
        points="0,-46 -18,-10 18,-10"
        fill="#20292f"
        stroke={color}
        strokeOpacity="0.35"
      />
      <polygon
        points="0,-34 -22,6 22,6"
        fill="#232d36"
        stroke={color}
        strokeOpacity="0.3"
      />
      <polygon
        points="0,-20 -26,22 26,22"
        fill="#1c242c"
        stroke={color}
        strokeOpacity="0.25"
      />
      <rect x="-3" y="20" width="6" height="12" fill="#2a2015" />
    </g>
  )
}

function VillageScenery({
  x,
  y,
  color,
}: {
  x: number
  y: number
  color: string
}) {
  return (
    <g opacity={0.9}>
      <g transform={`translate(${x - 110},${y + 30})`}>
        <rect
          x="-22"
          y="0"
          width="44"
          height="30"
          rx="2"
          fill="#2a333d"
          stroke={color}
          strokeOpacity="0.4"
        />
        <polygon
          points="-28,0 28,0 0,-24"
          fill="#232d36"
          stroke={color}
          strokeOpacity="0.5"
        />
        <rect x="-6" y="12" width="12" height="18" fill="#1c242c" />
        <circle cx="10" cy="-6" r="2" fill={color} opacity="0.8" />
      </g>

      <g transform={`translate(${x + 100},${y + 10}) scale(1.15)`}>
        <rect
          x="-22"
          y="0"
          width="44"
          height="30"
          rx="2"
          fill="#2a333d"
          stroke={color}
          strokeOpacity="0.4"
        />
        <polygon
          points="-28,0 28,0 0,-24"
          fill="#232d36"
          stroke={color}
          strokeOpacity="0.5"
        />
        <rect x="-6" y="12" width="12" height="18" fill="#1c242c" />
        <circle cx="10" cy="-6" r="2" fill={color} opacity="0.8" />
      </g>

      <g transform={`translate(${x},${y + 74})`}>
        <ellipse
          cx="0"
          cy="0"
          rx="16"
          ry="6"
          fill="#2a333d"
          stroke={color}
          strokeOpacity="0.4"
        />
        <rect
          x="-14"
          y="-14"
          width="28"
          height="14"
          fill="#20292f"
          stroke={color}
          strokeOpacity="0.3"
        />
      </g>

      {[-1, 0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={x - 60 + i * 22}
          y={y + 58}
          width="3"
          height="14"
          fill="#3a4753"
        />
      ))}
    </g>
  )
}

function ForestScenery({
  x,
  y,
  color,
}: {
  x: number
  y: number
  color: string
}) {
  const offsets = [
    { dx: -130, dy: 40, s: 1 },
    { dx: -90, dy: 62, s: 0.75 },
    { dx: 110, dy: 30, s: 1.1 },
    { dx: 148, dy: 66, s: 0.8 },
    { dx: 42, dy: 82, s: 0.65 },
  ]

  return (
    <g opacity={0.9}>
      {offsets.map((o, i) => (
        <Pine key={i} x={x + o.dx} y={y + o.dy} scale={o.s} color={color} />
      ))}
    </g>
  )
}

function OceanScenery({
  x,
  y,
  color,
}: {
  x: number
  y: number
  color: string
}) {
  return (
    <g opacity={0.9}>
      {[0, 1, 2].map((row) => (
        <path
          key={row}
          d={`M ${x - 160} ${y + 50 + row * 22} q 20 -14 40 0 t 40 0 t 40 0 t 40 0`}
          fill="none"
          stroke={color}
          strokeOpacity={0.35 - row * 0.08}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}

      <g transform={`translate(${x + 90},${y - 20})`}>
        <polygon
          points="-20,10 20,10 12,22 -12,22"
          fill="#232d36"
          stroke={color}
          strokeOpacity="0.5"
        />
        <line x1="0" y1="10" x2="0" y2="-22" stroke="#3a4753" strokeWidth="2" />
        <polygon
          points="0,-22 0,4 16,-6"
          fill="#2a333d"
          stroke={color}
          strokeOpacity="0.4"
        />
      </g>

      {[
        { dx: -110, dy: -10 },
        { dx: -70, dy: 10 },
        { dx: 130, dy: 32 },
      ].map((f, i) => (
        <g key={i} transform={`translate(${x + f.dx},${y + f.dy})`}>
          <ellipse cx="0" cy="0" rx="8" ry="4" fill={color} opacity="0.5" />
          <polygon points="-8,0 -14,-4 -14,4" fill={color} opacity="0.5" />
        </g>
      ))}
    </g>
  )
}

function MountainScenery({
  x,
  y,
  color,
}: {
  x: number
  y: number
  color: string
}) {
  return (
    <g opacity={0.92}>
      <polygon
        points={`${x - 140},${y + 40} ${x - 40},${y - 70} ${x + 30},${y + 40}`}
        fill="#20292f"
        stroke={color}
        strokeOpacity="0.35"
      />
      <polygon
        points={`${x - 70},${y + 40} ${x + 40},${y - 100} ${x + 140},${y + 40}`}
        fill="#232d36"
        stroke={color}
        strokeOpacity="0.45"
      />
      <polygon
        points={`${x + 10},${y - 72} ${x + 40},${y - 100} ${x + 70},${y - 72} ${x + 40},${y - 60}`}
        fill="#e9edf1"
        opacity="0.85"
      />
      <polygon
        points={`${x - 52},${y - 42} ${x - 40},${y - 70} ${x - 28},${y - 42} ${x - 40},${y - 32}`}
        fill="#e9edf1"
        opacity="0.65"
      />
      <Pine x={x - 120} y={y + 40} scale={0.6} color={color} />
      <Pine x={x + 110} y={y + 42} scale={0.7} color={color} />
    </g>
  )
}

function CastleScenery({
  x,
  y,
  color,
}: {
  x: number
  y: number
  color: string
}) {
  return (
    <g opacity={0.95}>
      <rect
        x={x - 70}
        y={y + 10}
        width="140"
        height="50"
        fill="#232d36"
        stroke={color}
        strokeOpacity="0.4"
      />

      {[-70, -40, -10, 20, 50].map((dx, i) => (
        <rect
          key={i}
          x={x + dx}
          y={y + 2}
          width="10"
          height="10"
          fill="#232d36"
          stroke={color}
          strokeOpacity="0.4"
        />
      ))}

      <g transform={`translate(${x - 70},${y})`}>
        <rect
          x="-16"
          y="-40"
          width="32"
          height="60"
          fill="#20292f"
          stroke={color}
          strokeOpacity="0.5"
        />
        <polygon
          points="-20,-40 20,-40 0,-64"
          fill="#1c242c"
          stroke={color}
          strokeOpacity="0.5"
        />
        <line
          x1="0"
          y1="-64"
          x2="0"
          y2="-80"
          stroke="#3a4753"
          strokeWidth="2"
        />
        <polygon points="0,-80 14,-74 0,-68" fill={color} opacity="0.8" />
      </g>

      <g transform={`translate(${x + 70},${y})`}>
        <rect
          x="-16"
          y="-40"
          width="32"
          height="60"
          fill="#20292f"
          stroke={color}
          strokeOpacity="0.5"
        />
        <polygon
          points="-20,-40 20,-40 0,-64"
          fill="#1c242c"
          stroke={color}
          strokeOpacity="0.5"
        />
        <line
          x1="0"
          y1="-64"
          x2="0"
          y2="-80"
          stroke="#3a4753"
          strokeWidth="2"
        />
        <polygon points="0,-80 14,-74 0,-68" fill={color} opacity="0.8" />
      </g>

      <path
        d={`M ${x - 18} ${y + 60} L ${x - 18} ${y + 20} Q ${x} ${y + 2} ${x + 18} ${y + 20} L ${x + 18} ${y + 60} Z`}
        fill="#12181d"
      />

      <circle
        cx={x - 30}
        cy={y + 18}
        r="3.5"
        fill="#f2a93b"
        className="pulse-ring"
      />
      <circle
        cx={x + 30}
        cy={y + 18}
        r="3.5"
        fill="#f2a93b"
        className="pulse-ring"
      />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Personaje                                                           */
/* ------------------------------------------------------------------ */

function Character({
  pos,
  isMoving,
}: {
  pos: { x: number; y: number }
  isMoving: boolean
}) {
  return (
    <g
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transformBox: 'view-box',
        transformOrigin: '0px 0px',
        transition: 'transform 0.9s cubic-bezier(0.65,0.05,0.36,1)',
      }}
    >
      <g
        className={isMoving ? 'character-walk' : 'character-idle'}
        style={{ transformOrigin: '0px -38px' }}
      >
        <ellipse cx="0" cy="6" rx="14" ry="4" fill="#000" opacity="0.35" />
        <circle
          cx="14"
          cy="-24"
          r="10"
          fill="#f2a93b"
          opacity="0.25"
          filter="url(#soft-glow)"
        />

        <rect x="-7" y="-14" width="5" height="14" rx="2" fill="#2a333d" />
        <rect x="2" y="-14" width="5" height="14" rx="2" fill="#2a333d" />

        <rect x="-10" y="-40" width="20" height="28" rx="8" fill="#e9edf1" />
        <rect x="-10" y="-40" width="20" height="7" rx="3" fill="#f2a93b" />

        <line
          x1="9"
          y1="-30"
          x2="15"
          y2="-22"
          stroke="#e9edf1"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="15" cy="-20" r="4" fill="#f2a93b" />

        <circle cx="0" cy="-48" r="11" fill="#f2c9a1" />
        <path
          d="M -12 -52 Q 0 -70 12 -52 Z"
          fill="#232d36"
          stroke="#f2a93b"
          strokeWidth="1.5"
        />
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Nodo de mundo                                                       */
/* ------------------------------------------------------------------ */

function WorldNode({
  world,
  pos,
  status,
  isShaking,
  onClick,
}: {
  world: WorldDef
  pos: { x: number; y: number }
  status: WorldStatus
  isShaking: boolean
  onClick: () => void
}) {
  const clickable = status === 'available' || status === 'completed'
  const ringColor =
    status === 'completed'
      ? '#7cb87f'
      : status === 'available'
        ? world.color
        : '#3a4753'

  return (
    <g
      transform={`translate(${pos.x},${pos.y})`}
      className={isShaking ? 'shake-wrong' : ''}
      style={{ cursor: clickable ? 'pointer' : 'not-allowed' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={world.title}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {status === 'available' && (
        <circle
          r="34"
          fill="none"
          stroke={world.color}
          strokeWidth="2"
          className="node-pulse"
        />
      )}

      <circle
        r="30"
        fill={status === 'locked' || status === 'soon' ? '#20292f' : '#232d36'}
        stroke={ringColor}
        strokeWidth="3"
        filter={clickable ? 'url(#soft-glow)' : undefined}
      />

      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="26"
        style={{
          filter:
            status === 'locked' || status === 'soon'
              ? 'grayscale(1)'
              : undefined,
          opacity: status === 'locked' || status === 'soon' ? 0.5 : 1,
        }}
      >
        {world.icon}
      </text>

      {status === 'locked' && (
        <text textAnchor="middle" y="47" fontSize="14">
          🔒
        </text>
      )}
      {status === 'soon' && (
        <text textAnchor="middle" y="47" fontSize="14">
          🛠️
        </text>
      )}
      {status === 'completed' && (
        <text textAnchor="middle" x="22" y="-22" fontSize="16">
          ✓
        </text>
      )}

      <g transform="translate(0,50)">
        <rect
          x="-46"
          y="0"
          width="92"
          height="20"
          rx="10"
          fill="#12181d"
          opacity="0.85"
        />
        <text
          textAnchor="middle"
          y="14"
          className="font-label"
          fontSize="9"
          letterSpacing="1"
          fill={
            status === 'locked' || status === 'soon' ? '#6c7a86' : '#e9edf1'
          }
          style={{ textTransform: 'uppercase' }}
        >
          {world.shortLabel}
        </text>
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Modal de entrada a un mundo                                         */
/* ------------------------------------------------------------------ */

function WorldIntroModal({
  world,
  isCompleted,
  onEnter,
  onClose,
}: {
  world: WorldDef
  isCompleted: boolean
  onEnter: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-6"
      onClick={onClose}
    >
      <div
        className="rise-in peg-card w-full max-w-sm rounded-2xl border border-[#3a4753] bg-[#232d36] p-7 pt-9 text-center shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-4xl"
          style={{
            borderColor: `${world.color}66`,
            backgroundColor: `${world.color}12`,
          }}
        >
          {world.icon}
        </div>

        <h3 className="font-display mt-4 text-xl font-semibold uppercase tracking-tight">
          {world.title}
        </h3>

        <p className="font-label mt-1 text-[10px] uppercase tracking-widest text-[#6c7a86]">
          {world.subtitle}
        </p>

        <p className="mt-3 text-sm text-[#a9b4bd]">{world.description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onEnter}
            className="font-label rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1c242c] transition hover:brightness-110"
            style={{ backgroundColor: world.color }}
          >
            {isCompleted ? 'Jugar de nuevo →' : 'Entrar →'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="font-label rounded-md border border-[#3a4753] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#a9b4bd] transition hover:border-[#5a6774] hover:text-[#e9edf1]"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pantalla: Mapa                                                      */
/* ------------------------------------------------------------------ */

function MapaScreen({
  coins,
  bestStreak,
  unlockedWorlds,
  completedWorlds,
  onEnterWorld,
  soundOn,
  onToggleSound,
}: {
  coins: number
  bestStreak: number
  unlockedWorlds: WorldId[]
  completedWorlds: WorldId[]
  onEnterWorld: (world: WorldDef) => void
  soundOn: boolean
  onToggleSound: () => void
}) {
  const initialWorldId = (completedWorlds[completedWorlds.length - 1] ??
    'aldea-sumas') as WorldId

  const [characterWorldId, setCharacterWorldId] =
    useState<WorldId>(initialWorldId)
  const [characterPos, setCharacterPos] = useState(
    WORLD_POSITIONS[initialWorldId]
  )
  const [isMoving, setIsMoving] = useState(false)
  const [shakeId, setShakeId] = useState<WorldId | null>(null)
  const [introWorld, setIntroWorld] = useState<WorldDef | null>(null)
  const characterRef = useRef<SVGGElement>(null)

  function statusFor(world: WorldDef): WorldStatus {
    if (!world.implemented) return 'soon'
    if (completedWorlds.includes(world.id)) return 'completed'
    if (unlockedWorlds.includes(world.id)) return 'available'
    return 'locked'
  }

  function triggerShake(id: WorldId) {
    setShakeId(id)
    window.setTimeout(() => {
      setShakeId((current) => (current === id ? null : current))
    }, 450)
  }

  function handleNodeClick(world: WorldDef) {
    const status = statusFor(world)

    if (status === 'locked' || status === 'soon') {
      triggerShake(world.id)
      if (soundOn) playDeniedSound()
      return
    }

    if (world.id === characterWorldId) {
      if (soundOn) playChimeSound()
      setIntroWorld(world)
      return
    }

    const target = WORLD_POSITIONS[world.id]
    const distance = Math.hypot(
      target.x - characterPos.x,
      target.y - characterPos.y
    )
    const duration = Math.min(1800, Math.max(500, distance * 1.1))

    if (soundOn) playWhooshSound()
    setIsMoving(true)
    setCharacterPos(target)
    setCharacterWorldId(world.id)

    window.setTimeout(() => {
      characterRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 60)

    window.setTimeout(() => {
      setIsMoving(false)
      setIntroWorld(world)
      if (soundOn) playChimeSound()
    }, duration)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <div className="flex items-center justify-between px-2">
        <Link
          href="/ninos"
          className="font-label inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#6c7a86] transition hover:text-[#f2a93b]"
        >
          ← Zona Infantil
        </Link>

        <Hud
          coins={coins}
          streak={bestStreak}
          soundOn={soundOn}
          onToggleSound={onToggleSound}
        />
      </div>

      <div className="mt-6 text-center">
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● MAPA — AVENTURA MATEMÁTICA
        </span>

        <h1 className="font-display mt-6 text-4xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-6xl">
          Aventura
          <br />
          <span className="text-[#f2a93b]">matemática.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm text-[#a9b4bd] sm:text-base">
          Toca un lugar del mapa. Tu explorador caminará hasta allí para empezar
          el reto.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border-4 border-[#3a4753] bg-[#12181d] shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]">
        <div className="max-h-[65vh] overflow-y-auto">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            width="100%"
            style={{ display: 'block' }}
          >
            <defs>
              <filter
                id="soft-glow"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx={MAP_WIDTH - 130}
              cy="70"
              r="26"
              fill="#f4e9c9"
              opacity="0.9"
              filter="url(#soft-glow)"
            />
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#e9edf1"
                opacity={s.opacity}
              />
            ))}

            <path
              d={ROAD_PATH}
              fill="none"
              stroke="#20292f"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d={ROAD_PATH}
              fill="none"
              stroke="#2a333d"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d={ROAD_PATH}
              fill="none"
              stroke="#f2a93b"
              strokeWidth="2"
              strokeDasharray="2 10"
              strokeLinecap="round"
              opacity="0.45"
            />

            <g
              transform={`translate(${WORLD_POSITIONS['aldea-sumas'].x},${
                WORLD_POSITIONS['aldea-sumas'].y - 90
              })`}
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="30"
                stroke="#3a4753"
                strokeWidth="3"
              />
              <rect
                x="-38"
                y="-16"
                width="76"
                height="20"
                rx="3"
                fill="#232d36"
                stroke="#f2a93b"
                strokeOpacity="0.5"
              />
              <text
                textAnchor="middle"
                y="-2"
                className="font-label"
                fontSize="8"
                letterSpacing="1"
                fill="#f2a93b"
                style={{ textTransform: 'uppercase' }}
              >
                Comienza aquí
              </text>
            </g>

            <VillageScenery
              x={WORLD_POSITIONS['aldea-sumas'].x}
              y={WORLD_POSITIONS['aldea-sumas'].y}
              color={WORLDS[0].color}
            />
            <ForestScenery
              x={WORLD_POSITIONS['bosque-restas'].x}
              y={WORLD_POSITIONS['bosque-restas'].y}
              color={WORLDS[1].color}
            />
            <OceanScenery
              x={WORLD_POSITIONS['oceano-multiplicaciones'].x}
              y={WORLD_POSITIONS['oceano-multiplicaciones'].y}
              color={WORLDS[2].color}
            />
            <MountainScenery
              x={WORLD_POSITIONS['montana-numeros'].x}
              y={WORLD_POSITIONS['montana-numeros'].y}
              color={WORLDS[3].color}
            />
            <CastleScenery
              x={WORLD_POSITIONS['castillo-reto'].x}
              y={WORLD_POSITIONS['castillo-reto'].y}
              color={WORLDS[4].color}
            />

            {WORLDS.map((world) => (
              <WorldNode
                key={world.id}
                world={world}
                pos={WORLD_POSITIONS[world.id]}
                status={statusFor(world)}
                isShaking={shakeId === world.id}
                onClick={() => handleNodeClick(world)}
              />
            ))}

            <g ref={characterRef}>
              <Character pos={characterPos} isMoving={isMoving} />
            </g>
          </svg>
        </div>
      </div>

      <p className="font-label mt-4 text-center text-[9px] uppercase tracking-widest text-[#6c7a86]">
        Desliza dentro del mapa para ver todo el camino
      </p>

      {introWorld && (
        <WorldIntroModal
          world={introWorld}
          isCompleted={completedWorlds.includes(introWorld.id)}
          onEnter={() => {
            onEnterWorld(introWorld)
            setIntroWorld(null)
          }}
          onClose={() => setIntroWorld(null)}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pantalla: Nivel                                                     */
/* ------------------------------------------------------------------ */

function AppleGroup({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex flex-wrap items-center justify-center gap-1 rounded-2xl border-2 p-3"
        style={{
          maxWidth: 140,
          borderColor: '#6b4a28',
          background: 'linear-gradient(180deg, #7a5230 0%, #5c3d22 100%)',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="apple-wiggle text-xl"
            style={{ animationDelay: `${(i % 5) * 0.15}s` }}
          >
            🍎
          </span>
        ))}
      </div>
      <span className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
        {label}
      </span>
    </div>
  )
}

function Mascot({ feedback }: { feedback: 'correct' | 'wrong' | null }) {
  const emoji =
    feedback === 'correct' ? '🤩' : feedback === 'wrong' ? '😯' : '🦊'
  const animClass =
    feedback === 'correct'
      ? 'mascot-jump'
      : feedback === 'wrong'
        ? 'shake-wrong'
        : 'mascot-idle'

  return (
    <div className={`text-5xl ${animClass}`} aria-hidden="true">
      {emoji}
    </div>
  )
}

function AldeaDiorama({ color }: { color: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        cx: (i * 41) % 400,
        cy: ((i * 23) % 40) + 6,
        r: 0.8 + (i % 3) * 0.4,
        delay: (i % 5) * 0.4,
      })),
    []
  )

  return (
    <svg viewBox="0 0 400 150" width="100%" style={{ display: 'block' }}>
      <defs>
        <filter id="glow-level" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="400" height="150" fill="#12181d" />

      {stars.map((s, i) => (
        <circle
          key={i}
          className="twinkle"
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="#e9edf1"
          opacity={0.4}
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}

      <rect x="0" y="96" width="400" height="54" fill="#1c242c" />

      <g transform="translate(70,96)">
        <rect
          x="-26"
          y="-34"
          width="52"
          height="34"
          fill="#2a333d"
          stroke={color}
          strokeOpacity="0.4"
        />
        <polygon
          points="-32,-34 32,-34 0,-62"
          fill="#232d36"
          stroke={color}
          strokeOpacity="0.5"
        />
        <rect
          x="6"
          y="-24"
          width="12"
          height="12"
          fill={color}
          opacity="0.75"
          filter="url(#glow-level)"
        />
        <rect x="-10" y="-14" width="10" height="14" fill="#12181d" />
      </g>

      <g transform="translate(320,96) scale(1.15)">
        <rect
          x="-26"
          y="-34"
          width="52"
          height="34"
          fill="#2a333d"
          stroke={color}
          strokeOpacity="0.4"
        />
        <polygon
          points="-32,-34 32,-34 0,-62"
          fill="#232d36"
          stroke={color}
          strokeOpacity="0.5"
        />
        <rect
          x="-18"
          y="-24"
          width="12"
          height="12"
          fill={color}
          opacity="0.75"
          filter="url(#glow-level)"
        />
        <rect x="4" y="-14" width="10" height="14" fill="#12181d" />
      </g>

      <g transform="translate(200,100)">
        <rect x="-4" y="-30" width="8" height="30" fill="#3a2a18" />
        <circle
          cx="0"
          cy="-46"
          r="26"
          fill="#20292f"
          stroke={color}
          strokeOpacity="0.35"
        />
        <circle cx="-9" cy="-50" r="3" fill="#e2637a" opacity="0.85" />
        <circle cx="8" cy="-42" r="3" fill="#e2637a" opacity="0.85" />
        <circle cx="2" cy="-58" r="3" fill="#e2637a" opacity="0.85" />
      </g>

      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          className="firefly"
          cx={60 + i * 90}
          cy={70 + (i % 2) * 10}
          r="2.4"
          fill="#f2a93b"
          filter="url(#glow-level)"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </svg>
  )
}

function ConfettiBurst({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2
        const distance = 60 + ((i * 17) % 40)
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          delay: (i % 4) * 0.03,
          isStar: i % 3 === 0,
        }
      }),
    []
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            ['--dx' as string]: `${p.dx}px`,
            ['--dy' as string]: `${p.dy}px`,
            animationDelay: `${p.delay}s`,
            color,
          }}
        >
          {p.isStar ? '⭐' : '✨'}
        </span>
      ))}
    </div>
  )
}

function NivelScreen({
  world,
  lives,
  coins,
  streak,
  questionNumber,
  correctInLevel,
  currentQuestion,
  selectedOption,
  feedback,
  levelResult,
  onAnswer,
  onRetry,
  onBackToMap,
  soundOn,
  onToggleSound,
}: {
  world: WorldDef
  lives: number
  coins: number
  streak: number
  questionNumber: number
  correctInLevel: number
  currentQuestion: Question
  selectedOption: number | null
  feedback: 'correct' | 'wrong' | null
  levelResult: LevelResult
  onAnswer: (option: number) => void
  onRetry: () => void
  onBackToMap: () => void
  soundOn: boolean
  onToggleSound: () => void
}) {
  if (levelResult === 'success') {
    const stars =
      correctInLevel === QUESTIONS_PER_LEVEL ? 3 : lives >= 2 ? 2 : 1

    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="rise-in peg-card w-full rounded-2xl border border-[#3a4753] bg-[#232d36] p-8 pt-10 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <div className="text-6xl">{world.icon}</div>

          <span className="font-label mt-4 inline-block rounded-full bg-[#7cb87f]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7cb87f]">
            ¡Mundo superado!
          </span>

          <h2 className="font-display mt-4 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            {world.title}
          </h2>

          <div className="mt-4 flex justify-center gap-2 text-3xl">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={i < stars ? 'coin-pop' : 'opacity-20 grayscale'}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                ⭐
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm text-[#a9b4bd]">
            Respondiste {correctInLevel} de {QUESTIONS_PER_LEVEL} correctas y
            terminaste con {lives} {lives === 1 ? 'vida' : 'vidas'}.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onBackToMap}
              className="font-label rounded-md bg-[#f2a93b] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1c242c] transition hover:bg-[#ffbc55]"
            >
              Volver al mapa →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (levelResult === 'fail') {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="rise-in peg-card w-full rounded-2xl border border-[#3a4753] bg-[#232d36] p-8 pt-10 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <div className="text-6xl">💔</div>

          <span className="font-label mt-4 inline-block rounded-full bg-[#e2637a]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e2637a]">
            Sin vidas
          </span>

          <h2 className="font-display mt-4 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            ¡Casi lo logras!
          </h2>

          <p className="mt-3 text-sm text-[#a9b4bd]">
            Respondiste {correctInLevel} de {QUESTIONS_PER_LEVEL} antes de
            quedarte sin vidas. Puedes intentarlo de nuevo.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onRetry}
              className="font-label rounded-md bg-[#f2a93b] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1c242c] transition hover:bg-[#ffbc55]"
            >
              Intentar de nuevo
            </button>

            <button
              type="button"
              onClick={onBackToMap}
              className="font-label rounded-md border border-[#3a4753] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#a9b4bd] transition hover:border-[#5a6774] hover:text-[#e9edf1]"
            >
              Volver al mapa
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 pb-20 pt-10">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToMap}
          className="font-label text-[10px] uppercase tracking-widest text-[#6c7a86] transition hover:text-[#f2a93b]"
        >
          ← Mapa
        </button>

        <Hud
          coins={coins}
          lives={lives}
          streak={streak}
          soundOn={soundOn}
          onToggleSound={onToggleSound}
        />
      </div>

      <h1 className="font-display mt-4 text-center text-xl font-semibold uppercase tracking-tight sm:text-2xl">
        {world.title}
      </h1>

      <div className="mt-4 flex justify-center gap-1.5">
        {Array.from({ length: QUESTIONS_PER_LEVEL }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-7 rounded-full transition-colors"
            style={{
              backgroundColor:
                i < questionNumber
                  ? world.color
                  : i === questionNumber
                    ? '#f2a93b'
                    : '#3a4753',
            }}
          />
        ))}
      </div>

      {/* diorama de la escena */}
      <div className="relative mt-6 overflow-hidden rounded-t-2xl border-4 border-b-0 border-[#3a4753]">
        <AldeaDiorama color={world.color} />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <Mascot feedback={feedback} />
        </div>
      </div>

      {/* panel interactivo */}
      <div
        className={`peg-card relative overflow-hidden rounded-b-2xl border-4 border-t-0 border-[#3a4753] bg-[#232d36] p-6 pt-8 text-center shadow-[0_14px_25px_rgba(0,0,0,0.25)] ${
          feedback === 'wrong' ? 'shake-wrong' : ''
        }`}
      >
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-[#6c7a86]">
          Pregunta {questionNumber + 1} de {QUESTIONS_PER_LEVEL}
        </span>

        <div className="mt-5 flex items-end justify-center gap-3">
          <AppleGroup count={currentQuestion.a} label="Cesta 1" />
          <span className="font-display pb-6 text-3xl font-bold text-[#f2a93b]">
            +
          </span>
          <AppleGroup count={currentQuestion.b} label="Cesta 2" />
          <span className="font-display pb-6 text-3xl font-bold text-[#f2a93b]">
            =
          </span>
          <div className="flex flex-col items-center gap-2 pb-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl font-bold ${
                feedback === 'correct'
                  ? 'border-[#7cb87f] text-[#7cb87f]'
                  : feedback === 'wrong'
                    ? 'border-[#e2637a] text-[#e2637a]'
                    : 'border-[#f2a93b] text-[#f2a93b]'
              }`}
            >
              {feedback ? currentQuestion.answer : '?'}
            </div>
            <span className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
              Total
            </span>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option
            const isCorrectOption = option === currentQuestion.answer

            let stateClasses =
              'border-[#6b4a28] bg-[#2a333d] text-[#e9edf1] hover:brightness-110'

            if (feedback) {
              if (isCorrectOption) {
                stateClasses = 'border-[#7cb87f] bg-[#7cb87f]/15 text-[#7cb87f]'
              } else if (isSelected) {
                stateClasses = 'border-[#e2637a] bg-[#e2637a]/15 text-[#e2637a]'
              } else {
                stateClasses = 'border-[#3a4753] bg-[#1c242c] text-[#5a6774]'
              }
            }

            return (
              <button
                key={option}
                type="button"
                disabled={Boolean(feedback)}
                onClick={() => onAnswer(option)}
                className={`crate-button flex flex-col items-center justify-center gap-1 rounded-2xl border-4 py-4 transition disabled:cursor-not-allowed ${stateClasses}`}
              >
                <span className="text-2xl">🧺</span>
                <span className="font-display text-2xl font-bold">
                  {option}
                </span>
              </button>
            )
          })}
        </div>

        {feedback && (
          <p
            className={`font-label mt-5 text-xs font-bold uppercase tracking-widest ${
              feedback === 'correct' ? 'text-[#7cb87f]' : 'text-[#e2637a]'
            }`}
          >
            {feedback === 'correct'
              ? `¡Correcto! +${10 + Math.max(streak - 1, 0) * 2} ⭐`
              : `Ups, la respuesta era ${currentQuestion.answer}`}
          </p>
        )}

        {feedback === 'correct' && (
          <ConfettiBurst key={questionNumber} color={world.color} />
        )}
      </div>
    </div>
  )
}
