'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type GameState = 'ready' | 'playing' | 'finished'

interface NumberBubble {
  id: number
  value: number
  x: number
  y: number
  size: number
  rotation: number
}

const GAME_TIME = 30
const START_LIVES = 3

const BUBBLE_COLORS = [
  '#f2a93b',
  '#4fb0a5',
  '#5b8dd9',
  '#e2637a',
  '#7cb87f',
  '#a78bd9',
  '#d9c25b',
]

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function createBubbles(level: number, target: number): NumberBubble[] {
  const amount = Math.min(5 + level, 11)
  const values = new Set<number>()

  values.add(target)

  while (values.size < amount) {
    const spread = Math.max(10, level * 5)

    const value = randomNumber(Math.max(1, target - spread), target + spread)

    values.add(value)
  }

  return Array.from(values)
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: Date.now() + index + Math.random(),
      value,
      x: randomNumber(5, 88),
      y: randomNumber(5, 84),
      size: randomNumber(58, 82),
      rotation: randomNumber(-12, 12),
    }))
}

function createTarget(level: number) {
  if (level <= 2) {
    return randomNumber(1, 20)
  }

  if (level <= 4) {
    return randomNumber(10, 50)
  }

  if (level <= 6) {
    return randomNumber(20, 100)
  }

  if (level <= 8) {
    return randomNumber(50, 200)
  }

  return randomNumber(100, 500)
}

export default function AtrapaNumeroPage() {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [target, setTarget] = useState(7)
  const [bubbles, setBubbles] = useState<NumberBubble[]>([])
  const [message, setMessage] = useState('')

  const [bestScore, setBestScore] = useState(0)

  const [lastAnswer, setLastAnswer] = useState<'correct' | 'wrong' | null>(null)

  const [round, setRound] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('toolhub-atrapa-numero-best')

    if (saved) {
      setBestScore(Number(saved))
    }
  }, [])

  const difficultyText = useMemo(() => {
    if (level <= 2) return 'Calentando'
    if (level <= 4) return 'Fácil'
    if (level <= 6) return 'Medio'
    if (level <= 8) return 'Difícil'
    return '¡Experto!'
  }, [level])

  const startRound = useCallback((nextLevel: number) => {
    const nextTarget = createTarget(nextLevel)

    setTarget(nextTarget)
    setBubbles(createBubbles(nextLevel, nextTarget))
    setLastAnswer(null)
    setMessage('')
    setRound((current) => current + 1)
  }, [])

  const startGame = useCallback(() => {
    setGameState('playing')
    setLevel(1)
    setScore(0)
    setStreak(0)
    setLives(START_LIVES)
    setTimeLeft(GAME_TIME)
    setMessage('')
    setLastAnswer(null)

    const firstTarget = createTarget(1)

    setTarget(firstTarget)
    setBubbles(createBubbles(1, firstTarget))
    setRound(1)
  }, [])

  const finishGame = useCallback(() => {
    setGameState('finished')
    setBubbles([])

    setScore((currentScore) => {
      const savedBest = Number(
        localStorage.getItem('toolhub-atrapa-numero-best') || '0'
      )

      if (currentScore > savedBest) {
        localStorage.setItem('toolhub-atrapa-numero-best', String(currentScore))

        setBestScore(currentScore)
      }

      return currentScore
    })
  }, [])

  useEffect(() => {
    if (gameState !== 'playing') return

    if (timeLeft <= 0) {
      finishGame()
      return
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [gameState, timeLeft, finishGame])

  function handleBubbleClick(bubble: NumberBubble) {
    if (gameState !== 'playing') return

    if (bubble.value === target) {
      const newStreak = streak + 1
      const streakBonus = Math.min(newStreak * 2, 20)
      const points = 10 + level * 5 + streakBonus

      setScore((current) => current + points)
      setStreak(newStreak)
      setLastAnswer('correct')
      setMessage(
        newStreak >= 3
          ? `🔥 ¡Racha de ${newStreak}! +${points}`
          : `⭐ ¡Correcto! +${points}`
      )

      const nextLevel = newStreak % 5 === 0 ? Math.min(level + 1, 10) : level

      if (nextLevel !== level) {
        setLevel(nextLevel)
      }

      window.setTimeout(() => {
        startRound(nextLevel)
      }, 450)
    } else {
      const newLives = lives - 1

      setLives(newLives)
      setStreak(0)
      setLastAnswer('wrong')
      setMessage('❌ ¡Ese no es!')

      if (newLives <= 0) {
        window.setTimeout(() => {
          finishGame()
        }, 450)
      }
    }
  }

  return (
    <main
      className="min-h-screen bg-[#1c242c] text-[#e9edf1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap');

        .kids-title {
          font-family: 'Baloo 2', sans-serif;
        }

        .kids-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation));
          }
          50% {
            transform: translateY(-8px) rotate(var(--rotation));
          }
        }

        .number-bubble {
          animation: float 2.2s ease-in-out infinite;
        }

        @keyframes correct-pop {
          0% {
            transform: scale(.8);
            opacity: 0;
          }
          70% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .correct-pop {
          animation: correct-pop .3s ease both;
        }

        @keyframes pulse-target {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

        .target-pulse {
          animation: pulse-target 1.4s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .wrong-shake {
          animation: shake .25s ease;
        }
      `}</style>

      {/* HEADER */}

      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="kids-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
              🎮 ToolHub / Zona infantil
            </span>

            <h1 className="kids-title mt-2 text-4xl font-extrabold sm:text-5xl">
              🔢 ¡Atrapa el número!
            </h1>

            <p className="mt-2 max-w-xl text-sm text-[#9da9b3]">
              Encuentra el número correcto antes de que se acabe el tiempo.
            </p>
          </div>

          <div className="kids-label rounded-xl border border-[#3a4753] bg-[#232d36] px-4 py-3 text-center">
            <p className="text-[9px] uppercase tracking-widest text-[#687681]">
              Récord
            </p>

            <p className="mt-1 text-xl font-bold text-[#f2a93b]">{bestScore}</p>
          </div>
        </div>
      </section>

      {/* PANEL DE JUEGO */}

      <section className="mx-auto max-w-6xl px-6 pb-20">
        {gameState === 'ready' && (
          <div className="overflow-hidden rounded-3xl border border-[#3a4753] bg-[#232d36] shadow-[0_25px_50px_rgba(0,0,0,0.3)]">
            <div className="grid gap-8 p-8 sm:p-12 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-7xl">🔢</div>

                <h2 className="kids-title mt-5 text-4xl font-extrabold">
                  ¿Listo para atrapar números?
                </h2>

                <p className="mt-4 leading-7 text-[#9da9b3]">
                  Busca el número que aparece arriba y toca la burbuja correcta.
                  ¡Cada respuesta correcta te da puntos!
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-3 text-center">
                    <div className="text-xl">⭐</div>
                    <p className="kids-label mt-1 text-[8px] text-[#687681]">
                      PUNTOS
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-3 text-center">
                    <div className="text-xl">🔥</div>
                    <p className="kids-label mt-1 text-[8px] text-[#687681]">
                      RACHA
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-3 text-center">
                    <div className="text-xl">❤️</div>
                    <p className="kids-label mt-1 text-[8px] text-[#687681]">
                      VIDAS
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startGame}
                  className="kids-label mt-8 w-full rounded-xl bg-[#f2a93b] px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#1c242c] transition hover:bg-[#ffbc55] sm:w-auto"
                >
                  🚀 ¡Empezar juego!
                </button>
              </div>

              <div className="relative flex min-h-[300px] items-center justify-center rounded-3xl border border-[#3a4753] bg-[#1c242c]">
                <div className="absolute left-[18%] top-[15%] text-4xl">⭐</div>

                <div className="absolute right-[15%] top-[25%] text-3xl">
                  ✨
                </div>

                <div className="absolute bottom-[20%] left-[20%] text-3xl">
                  🎯
                </div>

                <div className="absolute bottom-[15%] right-[20%] text-4xl">
                  🧠
                </div>

                <div className="target-pulse flex h-36 w-36 items-center justify-center rounded-full border-8 border-[#f2a93b]/30 bg-[#f2a93b]/10 shadow-[0_0_60px_rgba(242,169,59,0.12)]">
                  <span className="kids-title text-7xl font-extrabold text-[#f2a93b]">
                    7
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            {/* ESTADÍSTICAS */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Stat label="Puntos" value={score} icon="⭐" />

              <Stat label="Racha" value={streak} icon="🔥" />

              <Stat label="Nivel" value={level} icon="📈" />

              <Stat
                label="Tiempo"
                value={`${timeLeft}s`}
                icon="⏱️"
                danger={timeLeft <= 5}
              />

              <Stat label="Vidas" value={'❤️'.repeat(lives)} icon="" />
            </div>

            {/* OBJETIVO */}

            <div className="mt-5 rounded-3xl border border-[#3a4753] bg-[#232d36] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div>
                  <p className="kids-label text-[9px] uppercase tracking-[0.3em] text-[#687681]">
                    Encuentra este número
                  </p>

                  <div
                    className={`kids-title mt-1 text-5xl font-extrabold ${
                      lastAnswer === 'wrong'
                        ? 'wrong-shake text-[#e2637a]'
                        : 'text-[#f2a93b]'
                    }`}
                  >
                    {target}
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="kids-label text-[9px] uppercase tracking-widest text-[#687681]">
                    Dificultad
                  </p>

                  <p className="kids-title text-xl font-bold text-[#e9edf1]">
                    {difficultyText}
                  </p>

                  <p className="text-xs text-[#687681]">Ronda {round}</p>
                </div>
              </div>

              {message && (
                <div
                  className={`mt-3 rounded-xl px-4 py-2 text-center text-sm font-bold ${
                    lastAnswer === 'correct'
                      ? 'bg-[#7cb87f]/10 text-[#7cb87f]'
                      : 'bg-[#e2637a]/10 text-[#e2637a]'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            {/* ZONA DE ATRAPAR */}

            <div className="relative mt-5 h-[520px] overflow-hidden rounded-3xl border border-[#3a4753] bg-[#20292f] shadow-[inset_0_0_50px_rgba(0,0,0,0.25)] sm:h-[560px]">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-[10%] top-[20%] text-3xl">✨</div>
                <div className="absolute left-[75%] top-[12%] text-2xl">⭐</div>
                <div className="absolute left-[40%] top-[75%] text-2xl">✨</div>
                <div className="absolute left-[85%] top-[70%] text-3xl">⭐</div>
              </div>

              <div className="absolute left-4 top-4 z-10">
                <span className="kids-label rounded-full border border-[#3a4753] bg-[#1c242c]/80 px-3 py-1 text-[8px] uppercase tracking-widest text-[#687681]">
                  🎯 ¡Encuéntralo!
                </span>
              </div>

              {bubbles.map((bubble, index) => {
                const color = BUBBLE_COLORS[index % BUBBLE_COLORS.length]

                return (
                  <button
                    key={bubble.id}
                    type="button"
                    onClick={() => handleBubbleClick(bubble)}
                    className="number-bubble absolute flex items-center justify-center rounded-full border-4 font-bold shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition hover:scale-110 active:scale-95"
                    style={{
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                      width: bubble.size,
                      height: bubble.size,
                      backgroundColor: `${color}20`,
                      borderColor: `${color}80`,
                      color,
                      fontSize: bubble.size * 0.35,
                      ['--rotation' as string]: `${bubble.rotation}deg`,
                      animationDelay: `${index * -0.15}s`,
                    }}
                    aria-label={`Número ${bubble.value}`}
                  >
                    {bubble.value}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {gameState === 'finished' && (
          <div className="overflow-hidden rounded-3xl border border-[#f2a93b]/40 bg-[#232d36] shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
            <div className="p-8 text-center sm:p-14">
              <div className="text-7xl">🏆</div>

              <h2 className="kids-title mt-4 text-5xl font-extrabold">
                ¡Buen trabajo!
              </h2>

              <p className="mt-2 text-[#9da9b3]">Terminaste el desafío.</p>

              <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                <ResultCard icon="⭐" label="Puntos" value={score} />

                <ResultCard icon="📈" label="Nivel" value={level} />

                <ResultCard icon="🏆" label="Récord" value={bestScore} />
              </div>

              {score >= bestScore && score > 0 && (
                <div className="mt-6 rounded-xl border border-[#f2a93b]/30 bg-[#f2a93b]/10 px-5 py-3 text-sm font-bold text-[#f2a93b]">
                  🎉 ¡Nuevo récord!
                </div>
              )}

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={startGame}
                  className="kids-label rounded-xl bg-[#f2a93b] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#1c242c] transition hover:bg-[#ffbc55]"
                >
                  🔄 Jugar otra vez
                </button>

                <a
                  href="/ninos"
                  className="kids-label rounded-xl border border-[#3a4753] bg-[#1c242c] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#e9edf1] transition hover:border-[#f2a93b]"
                >
                  🎒 Otras actividades
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function Stat({
  label,
  value,
  icon,
  danger = false,
}: {
  label: string
  value: string | number
  icon: string
  danger?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border bg-[#232d36] p-3 text-center ${
        danger ? 'border-[#e2637a]/60' : 'border-[#3a4753]'
      }`}
    >
      <div className="text-lg">{icon}</div>

      <p className="kids-label mt-1 text-[8px] uppercase tracking-widest text-[#687681]">
        {label}
      </p>

      <p
        className={`kids-title mt-1 min-h-[28px] text-xl font-extrabold ${
          danger ? 'text-[#e2637a]' : 'text-[#e9edf1]'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function ResultCard({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-[#3a4753] bg-[#1c242c] p-5">
      <div className="text-3xl">{icon}</div>

      <p className="kids-label mt-2 text-[8px] uppercase tracking-widest text-[#687681]">
        {label}
      </p>

      <p className="kids-title mt-1 text-3xl font-extrabold text-[#f2a93b]">
        {value}
      </p>
    </div>
  )
}
