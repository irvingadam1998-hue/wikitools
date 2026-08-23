'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Fruit = '🍎' | '🍌' | '🍊' | '🍓'

const FRUITS: Fruit[] = ['🍎', '🍌', '🍊', '🍓']

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeQuestion(level: number) {
  const max = Math.min(5 + level * 2, 20)

  const a = randomNumber(1, max)
  const b = randomNumber(1, max)

  return {
    a,
    b,
    answer: a + b,
    fruit: FRUITS[randomNumber(0, FRUITS.length - 1)],
  }
}

export default function SumasPage() {
  const [level, setLevel] = useState(1)
  const [question, setQuestion] = useState(() => makeQuestion(1))
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

  const options = useMemo(() => {
    const values = new Set<number>()

    values.add(question.answer)

    while (values.size < 4) {
      const offset = randomNumber(-5, 5)
      const value = Math.max(0, question.answer + offset)

      values.add(value)
    }

    return Array.from(values).sort(() => Math.random() - 0.5)
  }, [question])

  useEffect(() => {
    const saved = localStorage.getItem('toolhub-sumas-score')

    if (saved) {
      setScore(Number(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('toolhub-sumas-score', String(score))
  }, [score])

  function nextQuestion(nextLevel = level) {
    setQuestion(makeQuestion(nextLevel))
    setAnswered(false)
    setSelected(null)
  }

  function answer(value: number) {
    if (answered) return

    setSelected(value)
    setAnswered(true)

    if (value === question.answer) {
      const bonus = 10 + streak * 2

      setScore((current) => current + bonus)
      setStreak((current) => current + 1)
      setCorrect((current) => current + 1)

      if ((correct + 1) % 5 === 0) {
        setLevel((current) => Math.min(current + 1, 10))
      }
    } else {
      setStreak(0)
    }
  }

  function restart() {
    setLevel(1)
    setScore(0)
    setStreak(0)
    setCorrect(0)
    setQuestion(makeQuestion(1))
    setAnswered(false)
    setSelected(null)
  }

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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        .fruit-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }

        @keyframes correct {
          0% {
            transform: scale(.9);
          }

          60% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
          }
        }

        .correct-answer {
          animation: correct .35s ease;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-6px);
          }

          75% {
            transform: translateX(6px);
          }
        }

        .wrong-answer {
          animation: shake .3s ease;
        }
      `}</style>

      {/* HEADER */}

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/ninos"
          className="font-label text-[10px] uppercase tracking-widest text-[#8a97a3] transition hover:text-[#f2a93b]"
        >
          ← Volver a juegos
        </Link>

        <div className="font-label flex gap-4 text-[10px] uppercase tracking-widest">
          <span className="text-[#f2a93b]">⭐ {score}</span>

          <span className="text-[#e2637a]">🔥 {streak}</span>

          <span className="text-[#5b8dd9]">Nivel {level}</span>
        </div>
      </header>

      {/* HERO */}

      <section className="mx-auto max-w-4xl px-6 pt-6 text-center">
        <span className="font-label rounded-full border border-[#e2637a]/40 bg-[#e2637a]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#e2637a]">
          🍎 Aventura matemática
        </span>

        <h1 className="font-kids mt-5 text-5xl font-bold sm:text-6xl">
          ¡Sumemos frutas!
        </h1>

        <p className="font-kids mt-3 text-lg text-[#a9b4bd]">
          Junta las frutas y descubre cuántas hay en total.
        </p>
      </section>

      {/* JUEGO */}

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        <div className="rounded-[2rem] border border-[#3a4753] bg-[#232d36] p-5 shadow-[0_25px_60px_rgba(0,0,0,.35)] sm:p-8">
          {/* PROGRESO */}

          <div className="flex items-center justify-between">
            <span className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
              Pregunta {correct + 1}
            </span>

            <span className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
              {correct} correctas
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1c242c]">
            <div
              className="h-full rounded-full bg-[#f2a93b] transition-all"
              style={{
                width: `${Math.min(((correct % 10) + 1) * 10, 100)}%`,
              }}
            />
          </div>

          {/* FRUTAS */}

          <div className="mt-10 rounded-3xl border border-[#3a4753] bg-[#1c242c] p-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: question.a }).map((_, index) => (
                <span
                  key={`a-${index}`}
                  className="fruit-bounce text-4xl sm:text-5xl"
                  style={{
                    animationDelay: `${index * 0.04}s`,
                  }}
                >
                  {question.fruit}
                </span>
              ))}
            </div>

            <div className="my-5 text-center font-kids text-4xl font-bold text-[#f2a93b]">
              +
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: question.b }).map((_, index) => (
                <span
                  key={`b-${index}`}
                  className="fruit-bounce text-4xl sm:text-5xl"
                  style={{
                    animationDelay: `${index * 0.04 + 0.3}s`,
                  }}
                >
                  {question.fruit}
                </span>
              ))}
            </div>
          </div>

          {/* OPERACIÓN */}

          <div className="mt-8 text-center">
            <div className="font-kids text-5xl font-bold">
              {question.a} + {question.b} = ?
            </div>

            <p className="font-kids mt-2 text-sm text-[#8a97a3]">
              ¿Cuántas frutas hay en total?
            </p>
          </div>

          {/* OPCIONES */}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {options.map((option) => {
              const isCorrect = option === question.answer
              const isSelected = selected === option

              let stateClass =
                'border-[#3a4753] bg-[#1c242c] hover:border-[#f2a93b] hover:-translate-y-1'

              if (answered && isCorrect) {
                stateClass =
                  'correct-answer border-[#7cb87f] bg-[#7cb87f]/20 text-[#7cb87f]'
              }

              if (answered && isSelected && !isCorrect) {
                stateClass =
                  'wrong-answer border-[#e2637a] bg-[#e2637a]/20 text-[#e2637a]'
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => answer(option)}
                  className={`font-kids rounded-2xl border p-5 text-3xl font-bold transition ${stateClass}`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {/* RESULTADO */}

          {answered && (
            <div className="mt-7 text-center">
              {selected === question.answer ? (
                <div>
                  <div className="text-5xl">🎉</div>

                  <h2 className="font-kids mt-2 text-2xl font-bold text-[#7cb87f]">
                    ¡Excelente!
                  </h2>

                  <p className="font-kids mt-1 text-[#a9b4bd]">
                    ¡Has ganado {10 + (streak - 1) * 2} puntos!
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-5xl">💪</div>

                  <h2 className="font-kids mt-2 text-2xl font-bold text-[#f2a93b]">
                    ¡Casi!
                  </h2>

                  <p className="font-kids mt-1 text-[#a9b4bd]">
                    La respuesta era {question.answer}. ¡Vamos con otra!
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => nextQuestion(level)}
                className="font-kids mt-5 rounded-2xl bg-[#f2a93b] px-8 py-3 text-base font-bold text-[#1c242c] transition hover:-translate-y-1 hover:bg-[#ffbc55]"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        {/* ESTADÍSTICAS */}

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-4 text-center">
            <div className="text-2xl">⭐</div>

            <p className="font-label mt-2 text-[9px] uppercase tracking-widest text-[#6c7a86]">
              Puntos
            </p>

            <p className="font-kids mt-1 text-xl font-bold">{score}</p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-4 text-center">
            <div className="text-2xl">🔥</div>

            <p className="font-label mt-2 text-[9px] uppercase tracking-widest text-[#6c7a86]">
              Racha
            </p>

            <p className="font-kids mt-1 text-xl font-bold">{streak}</p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-4 text-center">
            <div className="text-2xl">🏆</div>

            <p className="font-label mt-2 text-[9px] uppercase tracking-widest text-[#6c7a86]">
              Nivel
            </p>

            <p className="font-kids mt-1 text-xl font-bold">{level}</p>
          </div>
        </div>

        {/* REINICIAR */}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={restart}
            className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86] transition hover:text-[#e2637a]"
          >
            Reiniciar partida
          </button>
        </div>
      </main>
    </div>
  )
}
