'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { isValidWord } from '@/lib/daily/words'

interface WordDailyProps {
  solution: string
  dailyNumber: number
}

type LetterState = 'correct' | 'present' | 'absent' | 'empty'

interface DailySave {
  date: string
  guesses: string[]
  finished: boolean
  won: boolean
}

interface Stats {
  played: number
  wins: number
  streak: number
  bestStreak: number
  distribution: Record<string, number>
}

const MAX_ATTEMPTS = 6

const KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

const STATE_EMOJI: Record<LetterState, string> = {
  correct: '🟢',
  present: '🟡',
  absent: '⬛',
  empty: '⬜',
}

// Rotación fija por columna para que los sellos se vean
// aplicados a mano, no perfectamente alineados.
const TILE_TILT = [-2, 1.5, -1, 2, -1.5, 1, -2.5]

function getDateKey() {
  const now = new Date()

  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getUTCDate()).padStart(2, '0')}`
}

function getLetterStates(guess: string, solution: string): LetterState[] {
  const result: LetterState[] = Array(solution.length).fill('absent')

  const remaining = solution.split('')

  for (let i = 0; i < solution.length; i++) {
    if (guess[i] === solution[i]) {
      result[i] = 'correct'
      remaining[i] = ''
    }
  }

  for (let i = 0; i < solution.length; i++) {
    if (result[i] === 'correct') {
      continue
    }

    const index = remaining.indexOf(guess[i])

    if (index !== -1) {
      result[i] = 'present'
      remaining[index] = ''
    }
  }

  return result
}

function emptyStats(): Stats {
  return {
    played: 0,
    wins: 0,
    streak: 0,
    bestStreak: 0,
    distribution: {},
  }
}

function useCountdownToNextChallenge() {
  const [label, setLabel] = useState('')

  useEffect(() => {
    function tick() {
      const now = new Date()

      const next = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0,
          0,
          0
        )
      )

      const diff = Math.max(0, next.getTime() - now.getTime())

      const hours = Math.floor(diff / 3_600_000)
      const minutes = Math.floor((diff % 3_600_000) / 60_000)
      const seconds = Math.floor((diff % 60_000) / 1_000)

      setLabel(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
          2,
          '0'
        )}:${String(seconds).padStart(2, '0')}`
      )
    }

    tick()

    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [])

  return label
}

/**
 * Sello circular de goma que "golpea" el documento
 * al ganar, con anillo de texto tipo sello postal.
 */
function ApprovalStamp({ label }: { label: string }) {
  return (
    <div className="stamp-hit pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="h-40 w-40 -rotate-[10deg] drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] sm:h-52 sm:w-52"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="#2f5233"
          strokeWidth="6"
          strokeDasharray="10 7"
        />
        <circle
          cx="100"
          cy="100"
          r="76"
          fill="none"
          stroke="#2f5233"
          strokeWidth="2.5"
        />
        <path
          id="stampCircle"
          d="M 100,100 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
          fill="none"
        />
        <text
          fill="#2f5233"
          fontSize="15"
          fontWeight="700"
          letterSpacing="3"
          fontFamily="var(--font-stamp)"
        >
          <textPath href="#stampCircle" startOffset="2%">
            {label} · PALABRA · {label} ·
          </textPath>
        </text>
        <text
          x="100"
          y="95"
          textAnchor="middle"
          fill="#2f5233"
          fontSize="34"
          fontWeight="800"
          fontFamily="var(--font-stamp)"
        >
          ✓
        </text>
        <text
          x="100"
          y="122"
          textAnchor="middle"
          fill="#2f5233"
          fontSize="11"
          fontWeight="700"
          letterSpacing="2"
          fontFamily="var(--font-stamp)"
        >
          APROBADO
        </text>
      </svg>
    </div>
  )
}

/** Salpicadura de gotas de tinta al ganar. */
function InkSplatter() {
  const drops = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.4
      const distance = 70 + Math.random() * 160

      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 4 + Math.random() * 9,
        delay: Math.random() * 0.25,
        color: Math.random() > 0.35 ? '#2f5233' : '#b8892b',
      }
    })
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {drops.map((d) => (
        <span
          key={d.id}
          className="ink-drop absolute rounded-full"
          style={
            {
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
              animationDelay: `${d.delay}s`,
              '--dx': `${d.x}px`,
              '--dy': `${d.y}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Tachón de tinta roja garabateado al perder. */
function RejectionScrawl() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox="0 0 300 220"
      preserveAspectRatio="none"
    >
      <path
        className="scrawl-path"
        d="M 20,20 C 90,70 150,110 280,200"
        fill="none"
        stroke="#8a2d1f"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        className="scrawl-path scrawl-path-delay"
        d="M 280,25 C 200,80 120,110 20,195"
        fill="none"
        stroke="#8a2d1f"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function WordDaily({ solution, dailyNumber }: WordDailyProps) {
  const length = solution.length

  const [guesses, setGuesses] = useState<string[]>([])

  const [current, setCurrent] = useState('')

  const [finished, setFinished] = useState(false)

  const [won, setWon] = useState(false)

  const [message, setMessage] = useState('')

  const [stats, setStats] = useState<Stats>(emptyStats())

  const [hydrated, setHydrated] = useState(false)

  const [shakeRow, setShakeRow] = useState<number | null>(null)

  const [revealingRow, setRevealingRow] = useState<number | null>(null)

  const [showCelebration, setShowCelebration] = useState(false)

  const [showRejection, setShowRejection] = useState(false)

  const [shareLabel, setShareLabel] = useState('Compartir resultado')

  const [hardMode, setHardMode] = useState(false)

  const [pressedKey, setPressedKey] = useState<string | null>(null)

  const countdown = useCountdownToNextChallenge()

  const shakeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const today = getDateKey()

    const savedGame = localStorage.getItem('palabra-daily-game')

    const savedStats = localStorage.getItem('palabra-daily-stats')

    const savedHardMode = localStorage.getItem('palabra-hard-mode')

    if (savedHardMode) {
      setHardMode(savedHardMode === 'true')
    }

    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats))
      } catch {
        setStats(emptyStats())
      }
    }

    if (savedGame) {
      try {
        const game: DailySave = JSON.parse(savedGame)

        if (game.date === today) {
          setGuesses(game.guesses)

          setFinished(game.finished)

          setWon(game.won)

          if (game.finished) {
            setMessage(
              game.won
                ? 'Sello de aprobado. Reto de hoy resuelto.'
                : `La palabra era ${solution}`
            )
          }
        }
      } catch {
        localStorage.removeItem('palabra-daily-game')
      }
    }

    setHydrated(true)
  }, [solution])

  useEffect(() => {
    if (!hydrated) return

    const save: DailySave = {
      date: getDateKey(),
      guesses,
      finished,
      won,
    }

    localStorage.setItem('palabra-daily-game', JSON.stringify(save))
  }, [guesses, finished, won, hydrated])

  useEffect(() => {
    if (finished && won) {
      setShowCelebration(true)

      const timeout = setTimeout(() => setShowCelebration(false), 2400)

      return () => clearTimeout(timeout)
    }

    if (finished && !won) {
      setShowRejection(true)

      const timeout = setTimeout(() => setShowRejection(false), 2200)

      return () => clearTimeout(timeout)
    }
  }, [finished, won])

  useEffect(() => {
    return () => {
      if (shakeTimeout.current) clearTimeout(shakeTimeout.current)
    }
  }, [])

  const keyboardState = useMemo(() => {
    const states: Record<string, LetterState> = {}

    for (const guess of guesses) {
      const result = getLetterStates(guess, solution)

      guess.split('').forEach((letter, index) => {
        const state = result[index]

        if (state === 'correct') {
          states[letter] = 'correct'
        } else if (state === 'present' && states[letter] !== 'correct') {
          states[letter] = 'present'
        } else if (!states[letter]) {
          states[letter] = 'absent'
        }
      })
    }

    return states
  }, [guesses, solution])

  function updateStats(didWin: boolean, attempts: number) {
    const oldStats = stats

    const nextStreak = didWin ? oldStats.streak + 1 : 0

    const nextStats: Stats = {
      played: oldStats.played + 1,
      wins: oldStats.wins + (didWin ? 1 : 0),
      streak: nextStreak,
      bestStreak: Math.max(oldStats.bestStreak, nextStreak),
      distribution: {
        ...oldStats.distribution,
        ...(didWin
          ? { [attempts]: (oldStats.distribution[attempts] ?? 0) + 1 }
          : {}),
      },
    }

    setStats(nextStats)

    localStorage.setItem('palabra-daily-stats', JSON.stringify(nextStats))
  }

  function triggerShake(row: number) {
    setShakeRow(row)

    if (shakeTimeout.current) clearTimeout(shakeTimeout.current)

    shakeTimeout.current = setTimeout(() => setShakeRow(null), 480)
  }

  function toggleHardMode() {
    setHardMode((value) => {
      const next = !value

      localStorage.setItem('palabra-hard-mode', String(next))

      return next
    })
  }

  function submitGuess() {
    if (finished) return

    const guess = current.toUpperCase()

    const row = guesses.length

    if (guess.length !== length) {
      setMessage(`Necesitas ${length} letras`)

      triggerShake(row)

      return
    }

    if (hardMode && !isValidWord(guess)) {
      setMessage('Esa palabra no está en nuestro diccionario')

      triggerShake(row)

      return
    }

    const nextGuesses = [...guesses, guess]

    setGuesses(nextGuesses)
    setCurrent('')
    setMessage('')

    setRevealingRow(row)

    const revealDuration = length * 200 + 320

    const didWin = guess === solution
    const isLastAttempt = nextGuesses.length >= MAX_ATTEMPTS

    setTimeout(() => {
      setRevealingRow(null)

      if (didWin) {
        setFinished(true)
        setWon(true)

        setMessage('Sello de aprobado. Encontraste la palabra.')

        updateStats(true, nextGuesses.length)
      } else if (isLastAttempt) {
        setFinished(true)
        setWon(false)

        setMessage(`La palabra era ${solution}`)

        updateStats(false, MAX_ATTEMPTS)
      }
    }, revealDuration)
  }

  function pressKey(key: string) {
    if (finished || revealingRow !== null) return

    setPressedKey(key)
    setTimeout(() => setPressedKey(null), 120)

    if (key === 'ENTER') {
      submitGuess()
      return
    }

    if (key === '⌫') {
      setCurrent((value) => value.slice(0, -1))

      return
    }

    if (current.length >= length) {
      return
    }

    setCurrent((value) => value + key)
  }

  function handleKeyboard(event: React.KeyboardEvent) {
    const key = event.key.toUpperCase()

    if (key === 'ENTER') {
      submitGuess()
      return
    }

    if (key === 'BACKSPACE') {
      pressKey('⌫')
      return
    }

    if (/^[A-ZÑ]$/.test(key)) {
      pressKey(key)
    }
  }

  async function shareResult() {
    const grid = guesses
      .map((guess) =>
        getLetterStates(guess, solution)
          .map((state) => STATE_EMOJI[state])
          .join('')
      )
      .join('\n')

    const text = `Palabra #${dailyNumber} ${
      won ? guesses.length : 'X'
    }/${MAX_ATTEMPTS}\n\n${grid}`

    try {
      await navigator.clipboard.writeText(text)

      setShareLabel('Copiado al portapapeles')
    } catch {
      setShareLabel('No se pudo copiar')
    }

    setTimeout(() => setShareLabel('Compartir resultado'), 2200)
  }

  const winRate =
    stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0

  return (
    <div
      className="mx-auto flex w-full max-w-xl flex-col items-center rounded-[28px] bg-[#171310] p-5 outline-none sm:p-8"
      style={{
        backgroundImage:
          'radial-gradient(circle at 15% 0%, rgba(184,137,43,0.08), transparent 45%), radial-gradient(circle at 100% 100%, rgba(47,82,51,0.1), transparent 40%)',
      }}
      tabIndex={0}
      onKeyDown={handleKeyboard}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Courier+Prime:wght@400;700&display=swap');

        :root { --font-stamp: 'Special Elite', 'Courier Prime', monospace; }

        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-typewriter { font-family: 'Courier Prime', 'Special Elite', monospace; }

        @keyframes tile-stamp {
          0% { transform: scale(1) rotate(0deg); box-shadow: none; }
          38% { transform: scale(1.22) rotate(var(--tilt)); }
          60% { transform: scale(0.9) rotate(calc(var(--tilt) * -1)); }
          100% { transform: scale(1) rotate(var(--tilt)); }
        }
        @keyframes key-clack {
          0% { transform: translateY(0); }
          40% { transform: translateY(3px); }
          100% { transform: translateY(0); }
        }
        @keyframes row-shake {
          10%, 90% { transform: translateX(-3px) rotate(-0.4deg); }
          20%, 80% { transform: translateX(5px) rotate(0.4deg); }
          30%, 50%, 70% { transform: translateX(-9px) rotate(-0.6deg); }
          40%, 60% { transform: translateX(9px) rotate(0.6deg); }
        }
        @keyframes board-lift {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-10px) scale(1.015); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes board-slump {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(4px) rotate(-0.6deg); }
          50% { transform: translateY(0) rotate(0.6deg); }
          100% { transform: translateY(3px) rotate(0deg); }
        }
        @keyframes stamp-hit {
          0% { transform: scale(2.6) rotate(-24deg); opacity: 0; }
          45% { transform: scale(0.92) rotate(-10deg); opacity: 1; }
          60% { transform: scale(1.06) rotate(-10deg); }
          75% { transform: scale(1) rotate(-10deg); }
          100% { transform: scale(1) rotate(-10deg); opacity: 0; }
        }
        @keyframes ink-drop {
          0% { transform: translate(0, 0) scale(0.3); opacity: 0.95; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; }
        }
        @keyframes scrawl-draw {
          0% { stroke-dashoffset: 420; opacity: 0; }
          15% { opacity: 1; }
          70% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.85; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fire-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        .tile-stamp { animation: tile-stamp 0.55s cubic-bezier(.36,.07,.19,.97) forwards; }
        .row-shake { animation: row-shake 0.48s ease; }
        .board-lift { animation: board-lift 0.6s ease; }
        .board-slump { animation: board-slump 0.6s ease forwards; }
        .stamp-hit { animation: stamp-hit 2.2s cubic-bezier(.2,.9,.3,1) forwards; }
        .ink-drop { animation: ink-drop 0.9s cubic-bezier(.2,.7,.3,1) forwards; }
        .scrawl-path { stroke-dasharray: 420; animation: scrawl-draw 0.9s ease forwards; }
        .scrawl-path-delay { animation-delay: 0.25s; }
        .fade-in-up { animation: fade-in-up 0.35s ease; }
        .fire-anim { display: inline-block; animation: fire-pulse 1.1s ease-in-out infinite; }
      `}</style>

      {/* HEADER: ficha de archivo */}

      <header className="w-full text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-typewriter rounded-full border border-dashed border-[#b8892b]/50 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#d9b876]">
            Expediente n.º {dailyNumber}
          </span>

          <button
            type="button"
            onClick={toggleHardMode}
            disabled={guesses.length > 0}
            title="Modo riguroso: exige palabras válidas del diccionario"
            className={`font-typewriter rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 ${
              hardMode
                ? 'border-[#3f6b3f] bg-[#2f5233]/20 text-[#7fae7f]'
                : 'border-[#4a4038] text-[#8a7f70]'
            }`}
          >
            Riguroso {hardMode ? 'ON' : 'OFF'}
          </button>
        </div>

        <h1 className="font-display mt-3 text-5xl font-black tracking-tight text-[#efe6d3]">
          Palabra
        </h1>

        <p className="font-typewriter mt-2 text-xs uppercase tracking-[0.2em] text-[#8a7f70]">
          Seis intentos · un sello por acierto
        </p>
      </header>

      {/* STATS: tarjeta de ficha */}

      <div className="font-typewriter mt-6 grid w-full grid-cols-4 gap-2 rounded-xl border border-[#3a322c] bg-[#1f1a15] p-4 text-center">
        <div>
          <p className="font-display text-2xl font-black text-[#efe6d3]">
            {stats.played}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[#8a7f70]">
            Jugadas
          </p>
        </div>
        <div>
          <p className="font-display text-2xl font-black text-[#efe6d3]">
            {winRate}%
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[#8a7f70]">
            Aciertos
          </p>
        </div>
        <div>
          <p className="font-display text-2xl font-black text-[#efe6d3]">
            {stats.streak > 0 && <span className="fire-anim">🔥</span>}{' '}
            {stats.streak}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[#8a7f70]">
            Racha
          </p>
        </div>
        <div>
          <p className="font-display text-2xl font-black text-[#efe6d3]">
            {stats.bestStreak}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[#8a7f70]">
            Récord
          </p>
        </div>
      </div>

      {/* BOARD: el documento sobre el escritorio */}

      <div
        className={`relative mt-8 w-full rounded-2xl border-2 border-[#d8cbae] bg-[#efe6d3] p-4 shadow-[0_18px_30px_rgba(0,0,0,0.35)] sm:p-6 ${
          showCelebration ? 'board-lift' : ''
        } ${showRejection ? 'board-slump' : ''}`}
      >
        {showCelebration && <InkSplatter />}
        {showCelebration && <ApprovalStamp label={`#${dailyNumber}`} />}
        {showRejection && <RejectionScrawl />}

        <div
          className="mx-auto grid max-w-md gap-2"
          style={{
            gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: MAX_ATTEMPTS }).map((_, row) => {
            const guess =
              guesses[row] ?? (row === guesses.length ? current : '')

            const isRevealing = revealingRow === row

            const states =
              guesses[row] && !isRevealing
                ? getLetterStates(guesses[row], solution)
                : []

            return (
              <div
                key={row}
                className={`contents ${shakeRow === row ? 'row-shake' : ''}`}
              >
                {Array.from({ length }).map((_, column) => {
                  const letter = guess[column] ?? ''

                  const state = states[column] ?? 'empty'

                  const tilt = TILE_TILT[column % TILE_TILT.length]

                  let style = 'border-[#c9bc9c] bg-transparent text-[#171310]'

                  if (state === 'correct') {
                    style = 'border-[#2f5233] bg-[#2f5233] text-[#efe6d3]'
                  }

                  if (state === 'present') {
                    style = 'border-[#b8892b] bg-[#b8892b] text-[#1c1512]'
                  }

                  if (state === 'absent') {
                    style = 'border-[#8f8574] bg-[#8f8574]/25 text-[#5a5347]'
                  }

                  const revealStyle =
                    isRevealing && letter
                      ? ({
                          '--tilt': `${tilt}deg`,
                          animation:
                            'tile-stamp 0.55s cubic-bezier(.36,.07,.19,.97) forwards',
                          animationDelay: `${column * 0.2}s`,
                        } as React.CSSProperties)
                      : letter && !guesses[row]
                        ? { transform: `rotate(${tilt * 0.4}deg)` }
                        : undefined

                  return (
                    <div
                      key={`${row}-${column}`}
                      style={revealStyle}
                      className={`font-typewriter flex h-14 w-14 items-center justify-center rounded-md border-[3px] text-2xl font-bold transition-colors sm:h-16 sm:w-16 ${
                        !isRevealing ? style : 'border-[#c9bc9c]'
                      }`}
                    >
                      {letter}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* MESSAGE */}

      <div className="mt-5 h-8 text-center">
        {message && (
          <p className="font-typewriter fade-in-up text-sm font-bold text-[#d9b876]">
            {message}
          </p>
        )}
      </div>

      {/* KEYBOARD: teclas de máquina de escribir */}

      <div className="mt-2 w-full space-y-2">
        {KEYBOARD.map((row, index) => (
          <div key={index} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const state = keyboardState[key]

              let style = 'bg-[#2a231d] text-[#efe6d3] hover:bg-[#372e26]'

              if (state === 'correct') {
                style = 'bg-[#2f5233] text-[#efe6d3]'
              }

              if (state === 'present') {
                style = 'bg-[#b8892b] text-[#1c1512]'
              }

              if (state === 'absent') {
                style = 'bg-[#1f1a15] text-[#5a5347]'
              }

              return (
                <button
                  key={key}
                  type="button"
                  disabled={finished || revealingRow !== null}
                  onClick={() => pressKey(key)}
                  style={
                    pressedKey === key
                      ? { animation: 'key-clack 0.12s ease' }
                      : undefined
                  }
                  className={`font-typewriter h-12 min-w-8 rounded-[4px] border border-black/30 px-2 text-xs font-bold uppercase shadow-[0_2px_0_rgba(0,0,0,0.4)] transition active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 ${style}`}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* RESULT: ficha de cierre */}

      {finished && (
        <div className="font-typewriter fade-in-up mt-8 w-full rounded-2xl border-2 border-dashed border-[#4a4038] bg-[#1f1a15] p-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7f70]">
            Expediente #{dailyNumber} · cerrado
          </p>

          <h2 className="font-display mt-2 text-3xl font-black text-[#efe6d3]">
            {won ? 'Aprobado' : 'Sin resolver'}
          </h2>

          <p className="mt-3 text-sm text-[#a89c88]">
            {won
              ? `Sellado en ${guesses.length} ${
                  guesses.length === 1 ? 'intento' : 'intentos'
                }.`
              : `La palabra era ${solution}.`}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#3a322c] bg-[#171310] p-4">
              <p className="font-display text-2xl font-black text-[#efe6d3]">
                <span className={stats.streak > 0 ? 'fire-anim' : ''}>🔥</span>{' '}
                {stats.streak}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#8a7f70]">
                Racha actual
              </p>
            </div>

            <div className="rounded-xl border border-[#3a322c] bg-[#171310] p-4">
              <p className="font-display text-2xl font-black text-[#efe6d3]">
                {stats.bestStreak}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#8a7f70]">
                Récord
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={shareResult}
            className="mt-6 w-full rounded-lg border border-[#b8892b]/60 bg-[#b8892b]/15 py-3 text-sm font-bold uppercase tracking-wide text-[#d9b876] transition hover:bg-[#b8892b]/25 active:scale-[0.98]"
          >
            {shareLabel}
          </button>

          <div className="mt-6 rounded-xl border border-[#3a322c] bg-[#171310] p-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7f70]">
              Próximo expediente en
            </p>
            <p className="font-display mt-1 text-xl font-bold text-[#7fae7f]">
              {countdown}
            </p>
          </div>
        </div>
      )}

      {/* DISTRIBUTION */}

      {finished && stats.played > 0 && (
        <div className="font-typewriter fade-in-up mt-6 w-full rounded-2xl border border-[#3a322c] bg-[#1f1a15] p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-[#efe6d3]">
            Distribución
          </h3>

          <div className="mt-4 space-y-2">
            {Array.from({ length: 6 }).map((_, index) => {
              const attempt = index + 1

              const count = stats.distribution[attempt] ?? 0

              const max = Math.max(...Object.values(stats.distribution), 1)

              const width = Math.max(8, (count / max) * 100)

              const isThisAttempt = won && guesses.length === attempt

              return (
                <div key={attempt} className="flex items-center gap-2">
                  <span className="w-4 text-xs text-[#8a7f70]">{attempt}</span>

                  <div className="h-6 flex-1 overflow-hidden rounded bg-[#171310]">
                    <div
                      className={`flex h-full items-center justify-end rounded px-2 text-xs font-bold transition-all ${
                        isThisAttempt
                          ? 'bg-[#b8892b] text-[#1c1512]'
                          : 'bg-[#2f5233] text-[#efe6d3]'
                      }`}
                      style={{ width: `${width}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
