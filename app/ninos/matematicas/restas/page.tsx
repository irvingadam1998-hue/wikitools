'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Question = {
  a: number
  b: number
  answer: number
}

const TOTAL_ROUNDS = 10

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function createQuestion(level: number): Question {
  const max = Math.min(6 + level * 3, 30)

  const a = randomNumber(3, max)
  const b = randomNumber(1, a)

  return {
    a,
    b,
    answer: a - b,
  }
}

function createOptions(answer: number) {
  const values = new Set<number>()

  values.add(answer)

  while (values.size < 3) {
    const offset = randomNumber(-4, 4)
    const value = Math.max(0, answer + offset)

    values.add(value)
  }

  return Array.from(values).sort(() => Math.random() - 0.5)
}

export default function RestasPage() {
  const [level, setLevel] = useState(1)
  const [round, setRound] = useState(1)
  const [question, setQuestion] = useState(() => createQuestion(1))
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [bestScore, setBestScore] = useState(0)

  const [frogPosition, setFrogPosition] = useState(0)
  const [jumping, setJumping] = useState(false)

  const [finished, setFinished] = useState(false)

  const options = useMemo(() => createOptions(question.answer), [question])

  useEffect(() => {
    const saved = localStorage.getItem('toolhub-restas-best')

    if (saved) {
      setBestScore(Number(saved))
    }
  }, [])

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem('toolhub-restas-best', String(score))
    }
  }, [score, bestScore])

  function nextQuestion() {
    if (round >= TOTAL_ROUNDS) {
      setFinished(true)
      return
    }

    const nextRound = round + 1

    if (nextRound % 4 === 0) {
      setLevel((current) => Math.min(current + 1, 10))
    }

    const nextLevel = nextRound % 4 === 0 ? Math.min(level + 1, 10) : level

    setRound(nextRound)
    setQuestion(createQuestion(nextLevel))
    setSelected(null)
    setAnswered(false)
  }

  function answer(value: number) {
    if (answered || finished) return

    setSelected(value)
    setAnswered(true)

    if (value === question.answer) {
      const points = 10 + streak * 3

      setScore((current) => current + points)
      setStreak((current) => current + 1)

      setJumping(true)

      setTimeout(() => {
        setFrogPosition((current) => Math.min(current + 1, 5))
        setJumping(false)
      }, 350)
    } else {
      setStreak(0)

      setLives((current) => {
        const next = current - 1

        if (next <= 0) {
          setFinished(true)
        }

        return Math.max(0, next)
      })
    }
  }

  function restart() {
    setLevel(1)
    setRound(1)
    setQuestion(createQuestion(1))
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setStreak(0)
    setLives(3)
    setFrogPosition(0)
    setFinished(false)
    setJumping(false)
  }

  const progress = Math.min((round / TOTAL_ROUNDS) * 100, 100)

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
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Oswald:wght@400;500;600;700&display=swap');

        .font-kids {
          font-family: 'Fredoka', sans-serif;
        }

        .font-display {
          font-family: 'Oswald', sans-serif;
        }

        .font-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        .pond {
          background:
            radial-gradient(circle at 20% 20%, rgba(79,176,165,.18) 0 3px, transparent 4px),
            radial-gradient(circle at 75% 65%, rgba(255,255,255,.08) 0 3px, transparent 4px),
            linear-gradient(180deg, #18363b, #162a32);
        }

        .lily {
          position: relative;
          width: 76px;
          height: 38px;
          border-radius: 50%;
          background: #4f8f70;
          box-shadow:
            inset -8px -5px 0 rgba(0,0,0,.12),
            0 5px 10px rgba(0,0,0,.25);
        }

        .lily::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          width: 25px;
          height: 22px;
          background: #18363b;
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }

        @keyframes jump {
          0% {
            transform: translateY(0) rotate(0);
          }

          45% {
            transform: translateY(-55px) rotate(-5deg);
          }

          100% {
            transform: translateY(0) rotate(0);
          }
        }

        .frog-jump {
          animation: jump .7s ease;
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0);
          }

          50% {
            transform: rotate(4deg);
          }
        }

        .frog-idle {
          animation: wiggle 2s ease-in-out infinite;
        }

        @keyframes pop {
          0% {
            transform: scale(.85);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .pop {
          animation: pop .3s ease;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-7px);
          }

          75% {
            transform: translateX(7px);
          }
        }

        .shake {
          animation: shake .35s ease;
        }
      `}</style>

      {/* HEADER */}

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/ninos"
          className="font-label text-[10px] uppercase tracking-widest text-[#8a97a3] transition hover:text-[#f2a93b]"
        >
          ← Zona de juegos
        </Link>

        <div className="font-label flex items-center gap-4 text-[10px] uppercase tracking-widest">
          <span>⭐ {score}</span>
          <span className="text-[#e2637a]">🔥 {streak}</span>
          <span className="text-[#f2a93b]">{'❤️'.repeat(lives)}</span>
        </div>
      </header>

      {/* TITULO */}

      <section className="mx-auto max-w-4xl px-6 pt-5 text-center">
        <span className="font-label inline-flex rounded-full border border-[#7cb87f]/40 bg-[#7cb87f]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#7cb87f]">
          🐸 Aventura matemática
        </span>

        <h1 className="font-kids mt-5 text-5xl font-bold sm:text-6xl">
          ¡Restas saltando!
        </h1>

        <p className="font-kids mt-3 text-lg text-[#a9b4bd]">
          Ayuda a la ranita a cruzar el estanque.
        </p>
      </section>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-8">
        {/* HUD */}

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <p className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
              Ronda
            </p>

            <p className="font-kids mt-1 text-xl font-bold">
              {round}/{TOTAL_ROUNDS}
            </p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <p className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
              Nivel
            </p>

            <p className="font-kids mt-1 text-xl font-bold">{level}</p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <p className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
              Récord
            </p>

            <p className="font-kids mt-1 text-xl font-bold">{bestScore}</p>
          </div>
        </div>

        {/* PROGRESO */}

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#20292f]">
          <div
            className="h-full rounded-full bg-[#7cb87f] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* ESTANQUE */}

        <div className="pond relative overflow-hidden rounded-[2rem] border border-[#4fb0a5]/30 p-6 shadow-[0_25px_60px_rgba(0,0,0,.35)] sm:p-8">
          <div className="absolute left-6 top-5 text-2xl opacity-50">💧</div>

          <div className="absolute right-8 top-12 text-xl opacity-40">🫧</div>

          <div className="relative mx-auto flex h-[170px] max-w-2xl items-end justify-between px-2 sm:px-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="relative flex h-full items-end justify-center"
              >
                <div className="lily" />

                {frogPosition === index && (
                  <div
                    className={`absolute bottom-5 text-5xl ${
                      jumping ? 'frog-jump' : 'frog-idle'
                    }`}
                  >
                    🐸
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 text-center">
            <span className="font-label rounded-full bg-[#0f252b]/70 px-3 py-1 text-[9px] uppercase tracking-widest text-[#8cc9bf]">
              ¡Cruza el estanque!
            </span>
          </div>
        </div>

        {/* PREGUNTA */}

        {!finished && (
          <div className="mt-5 rounded-[2rem] border border-[#3a4753] bg-[#232d36] p-6 text-center sm:p-8">
            <p className="font-label text-[9px] uppercase tracking-[0.3em] text-[#f2a93b]">
              Ayuda a la ranita
            </p>

            <h2 className="font-kids mt-4 text-5xl font-bold">
              {question.a} − {question.b} = ?
            </h2>

            <p className="font-kids mt-3 text-[#a9b4bd]">
              ¿Cuál es la respuesta correcta?
            </p>

            {/* OPCIONES */}

            <div className="mt-7 grid grid-cols-3 gap-3">
              {options.map((option) => {
                const correct = option === question.answer
                const wrong = selected === option && option !== question.answer

                let className =
                  'border-[#3a4753] bg-[#1c242c] hover:-translate-y-1 hover:border-[#7cb87f]'

                if (answered && correct) {
                  className =
                    'pop border-[#7cb87f] bg-[#7cb87f]/20 text-[#7cb87f]'
                }

                if (wrong) {
                  className =
                    'shake border-[#e2637a] bg-[#e2637a]/20 text-[#e2637a]'
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={answered}
                    onClick={() => answer(option)}
                    className={`font-kids rounded-2xl border p-5 text-3xl font-bold transition ${className}`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {/* FEEDBACK */}

            {answered && (
              <div className="mt-6">
                {selected === question.answer ? (
                  <>
                    <div className="text-5xl">🎉</div>

                    <h3 className="font-kids mt-2 text-2xl font-bold text-[#7cb87f]">
                      ¡Muy bien!
                    </h3>

                    <p className="font-kids mt-1 text-[#a9b4bd]">
                      La ranita avanzó un salto.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl">💪</div>

                    <h3 className="font-kids mt-2 text-2xl font-bold text-[#f2a93b]">
                      ¡Sigue intentando!
                    </h3>

                    <p className="font-kids mt-1 text-[#a9b4bd]">
                      La respuesta era {question.answer}.
                    </p>
                  </>
                )}

                {!finished && (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="font-kids mt-5 rounded-2xl bg-[#f2a93b] px-8 py-3 font-bold text-[#1c242c] transition hover:-translate-y-1 hover:bg-[#ffbc55]"
                  >
                    Siguiente salto 🐸 →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* FINAL */}

        {finished && (
          <div className="mt-5 rounded-[2rem] border border-[#f2a93b]/40 bg-[#2a2118] p-8 text-center">
            <div className="text-7xl">{lives === 0 ? '🐸' : '🏆'}</div>

            <h2 className="font-kids mt-4 text-4xl font-bold">
              {lives === 0
                ? '¡La ranita necesita descansar!'
                : '¡Llegaste al otro lado!'}
            </h2>

            <p className="font-kids mt-3 text-[#a9b4bd]">
              Conseguías {score} puntos en esta aventura.
            </p>

            <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#3a4753] bg-[#1c242c] p-4">
                <span className="text-2xl">⭐</span>

                <p className="font-label mt-2 text-[8px] uppercase tracking-widest text-[#6c7a86]">
                  Puntos
                </p>

                <p className="font-kids mt-1 text-2xl font-bold">{score}</p>
              </div>

              <div className="rounded-2xl border border-[#3a4753] bg-[#1c242c] p-4">
                <span className="text-2xl">🏆</span>

                <p className="font-label mt-2 text-[8px] uppercase tracking-widest text-[#6c7a86]">
                  Récord
                </p>

                <p className="font-kids mt-1 text-2xl font-bold">{bestScore}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={restart}
              className="font-kids mt-7 rounded-2xl bg-[#f2a93b] px-8 py-3 font-bold text-[#1c242c] transition hover:-translate-y-1 hover:bg-[#ffbc55]"
            >
              Jugar otra vez 🔄
            </button>
          </div>
        )}

        {/* TIP */}

        <div className="mt-5 rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f] p-5 text-center">
          <span className="text-2xl">💡</span>

          <p className="font-kids mt-2 text-sm text-[#a9b4bd]">
            Recuerda: restar es quitar una cantidad de otra. ¡Puedes usar tus
            dedos para ayudarte!
          </p>
        </div>
      </main>
    </div>
  )
}
