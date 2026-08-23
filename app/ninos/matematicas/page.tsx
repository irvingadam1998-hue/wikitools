'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Operation = 'suma' | 'resta' | 'multiplicacion'

const FRUITS = ['🍎', '🍌', '🍊', '🍓', '🍐', '🍇']

const LEVELS = [
  {
    name: 'Pequeño explorador',
    min: 1,
    max: 5,
    operation: 'suma' as Operation,
  },
  {
    name: 'Aprendiz de números',
    min: 2,
    max: 10,
    operation: 'suma' as Operation,
  },
  {
    name: 'Maestro de las cuentas',
    min: 3,
    max: 12,
    operation: 'resta' as Operation,
  },
]

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function createQuestion(levelIndex: number) {
  const level = LEVELS[levelIndex]

  let a = randomNumber(level.min, level.max)
  let b = randomNumber(level.min, level.max)

  if (level.operation === 'resta' && b > a) {
    ;[a, b] = [b, a]
  }

  let answer = a + b

  if (level.operation === 'resta') {
    answer = a - b
  }

  if (level.operation === 'multiplicacion') {
    answer = a * b
  }

  const answers = new Set<number>()

  answers.add(answer)

  while (answers.size < 3) {
    const variation = randomNumber(1, 4)
    const wrong = Math.max(
      0,
      answer + (Math.random() > 0.5 ? variation : -variation)
    )

    if (wrong !== answer) {
      answers.add(wrong)
    }
  }

  return {
    a,
    b,
    answer,
    options: Array.from(answers).sort(() => Math.random() - 0.5),
    fruit: FRUITS[randomNumber(0, FRUITS.length - 1)],
    operation: level.operation,
  }
}

export default function MatematicasPage() {
  const [level, setLevel] = useState(0)
  const [question, setQuestion] = useState(() => createQuestion(0))
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questions, setQuestions] = useState(0)
  const [lives, setLives] = useState(3)
  const [showResult, setShowResult] = useState(false)

  const fruitsA = useMemo(
    () => Array.from({ length: question.a }),
    [question.a]
  )

  const fruitsB = useMemo(
    () => Array.from({ length: question.b }),
    [question.b]
  )

  useEffect(() => {
    if (lives <= 0) {
      setShowResult(true)
    }
  }, [lives])

  function answer(value: number) {
    if (selected !== null || lives <= 0) return

    setSelected(value)
    setQuestions((current) => current + 1)

    if (value === question.answer) {
      setScore((current) => current + 10 + streak * 2)
      setStreak((current) => current + 1)
    } else {
      setLives((current) => current - 1)
      setStreak(0)
    }
  }

  function nextQuestion() {
    if (lives <= 0) return

    setSelected(null)
    setQuestion(createQuestion(level))
  }

  function restart() {
    setScore(0)
    setStreak(0)
    setQuestions(0)
    setLives(3)
    setSelected(null)
    setShowResult(false)
    setQuestion(createQuestion(level))
  }

  function changeLevel(index: number) {
    setLevel(index)
    setScore(0)
    setStreak(0)
    setQuestions(0)
    setLives(3)
    setSelected(null)
    setShowResult(false)
    setQuestion(createQuestion(index))
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
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@600;700&display=swap');

        .font-display {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
        }

        .font-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        .font-hand {
          font-family: 'Caveat', cursive;
        }

        @keyframes bounce-fruit {
          0%, 100% {
            transform: translateY(0) rotate(-4deg);
          }
          50% {
            transform: translateY(-8px) rotate(4deg);
          }
        }

        .fruit {
          animation: bounce-fruit 1.5s ease-in-out infinite;
        }

        @keyframes correct {
          0% {
            transform: scale(.8);
          }
          60% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        .correct {
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

        .wrong {
          animation: shake .3s ease;
        }
      `}</style>

      {/* HEADER */}

      <header className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between">
          <Link
            href="/ninos"
            className="font-label text-xs uppercase tracking-wider text-[#8a97a3] transition hover:text-[#f2a93b]"
          >
            ← Volver a aventuras
          </Link>

          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-[#f2a93b]">
            🧮 Matemáticas
          </span>
        </div>
      </header>

      {/* HERO */}

      <section className="mx-auto max-w-5xl px-6 pb-8 pt-10 text-center">
        <span className="text-5xl">🍎</span>

        <h1 className="font-display mt-4 text-5xl font-bold uppercase tracking-tight sm:text-6xl">
          La granja de las
          <span className="text-[#f2a93b]"> sumas</span>
        </h1>

        <p className="font-hand mx-auto mt-3 max-w-xl text-2xl text-[#a9b4bd]">
          ¡Cuenta las frutas y descubre la respuesta!
        </p>
      </section>

      {/* NIVEL */}

      <section className="mx-auto max-w-5xl px-6 pb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {LEVELS.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => changeLevel(index)}
              className={`rounded-full border px-4 py-2 transition ${
                level === index
                  ? 'border-[#f2a93b] bg-[#f2a93b]/15 text-[#f2a93b]'
                  : 'border-[#3a4753] bg-[#232d36] text-[#8a97a3]'
              }`}
            >
              <span className="font-label text-[10px] uppercase tracking-wider">
                {index === 0 && '🌱 '}
                {index === 1 && '⭐ '}
                {index === 2 && '🏆 '}
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ESTADÍSTICAS */}

      <section className="mx-auto max-w-4xl px-6 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <span className="font-label block text-[8px] uppercase tracking-widest text-[#6c7a86]">
              Puntos
            </span>
            <strong className="font-display mt-1 block text-2xl text-[#f2a93b]">
              ⭐ {score}
            </strong>
          </div>

          <div className="rounded-xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <span className="font-label block text-[8px] uppercase tracking-widest text-[#6c7a86]">
              Racha
            </span>
            <strong className="font-display mt-1 block text-2xl">
              🔥 {streak}
            </strong>
          </div>

          <div className="rounded-xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <span className="font-label block text-[8px] uppercase tracking-widest text-[#6c7a86]">
              Vidas
            </span>
            <strong className="mt-1 block text-xl">
              {'❤️'.repeat(lives)}
              {'🖤'.repeat(3 - lives)}
            </strong>
          </div>
        </div>
      </section>

      {/* JUEGO */}

      <main className="mx-auto max-w-4xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-[#f2a93b]/40 bg-[#f4e9c8] p-6 text-[#332819] shadow-[0_25px_60px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="absolute -right-5 -top-5 text-8xl opacity-10">🍎</div>

          {!showResult ? (
            <div className="relative">
              <div className="text-center">
                <span className="font-label text-[9px] uppercase tracking-[0.3em] text-[#8a6a4a]">
                  Pregunta #{questions + 1}
                </span>

                <h2 className="font-display mt-3 text-4xl font-bold uppercase">
                  ¿Cuántas frutas hay?
                </h2>
              </div>

              {/* FRUTAS */}

              <div className="mt-8 flex flex-col items-center gap-7">
                <div className="flex min-h-[80px] max-w-2xl flex-wrap justify-center gap-2 rounded-2xl bg-white/40 p-5">
                  {fruitsA.map((_, index) => (
                    <span
                      key={`a-${index}`}
                      className="fruit text-4xl"
                      style={{
                        animationDelay: `${index * 40}ms`,
                      }}
                    >
                      {question.fruit}
                    </span>
                  ))}
                </div>

                <div className="font-display text-4xl font-bold">+</div>

                <div className="flex min-h-[80px] max-w-2xl flex-wrap justify-center gap-2 rounded-2xl bg-white/40 p-5">
                  {fruitsB.map((_, index) => (
                    <span
                      key={`b-${index}`}
                      className="fruit text-4xl"
                      style={{
                        animationDelay: `${index * 40}ms`,
                      }}
                    >
                      {question.fruit}
                    </span>
                  ))}
                </div>

                <div className="font-display text-4xl font-bold">= ❓</div>
              </div>

              {/* RESPUESTAS */}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {question.options.map((option) => {
                  const isSelected = selected === option
                  const isCorrect = option === question.answer

                  let className =
                    'border-[#d4c49f] bg-white/60 hover:-translate-y-1 hover:bg-white'

                  if (selected !== null && isCorrect) {
                    className =
                      'correct border-[#4f9c67] bg-[#dff0df] text-[#285a36]'
                  }

                  if (isSelected && !isCorrect) {
                    className =
                      'wrong border-[#e2637a] bg-[#f8dddd] text-[#7b2838]'
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={selected !== null}
                      onClick={() => answer(option)}
                      className={`rounded-2xl border-2 p-5 font-display text-4xl font-bold transition ${className}`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {/* RESULTADO */}

              {selected !== null && (
                <div className="mt-7 text-center">
                  {selected === question.answer ? (
                    <>
                      <div className="text-5xl">🎉</div>

                      <p className="font-display mt-2 text-2xl font-bold text-[#357244]">
                        ¡Muy bien!
                      </p>

                      <p className="font-hand text-2xl">
                        ¡Tu respuesta es correcta!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl">💡</div>

                      <p className="font-display mt-2 text-2xl font-bold text-[#9a394a]">
                        ¡Casi!
                      </p>

                      <p className="font-hand text-2xl">
                        La respuesta correcta es {question.answer}.
                      </p>
                    </>
                  )}

                  {lives > 0 && (
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="font-label mt-5 rounded-xl bg-[#332819] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5"
                    >
                      Siguiente pregunta →
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* FINAL */

            <div className="relative py-8 text-center">
              <div className="text-7xl">🏆</div>

              <h2 className="font-display mt-5 text-4xl font-bold uppercase">
                ¡Terminaste!
              </h2>

              <p className="font-hand mt-3 text-3xl">
                Mira todo lo que conseguiste.
              </p>

              <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/50 p-4">
                  <span className="font-label block text-[9px] uppercase">
                    Puntos
                  </span>
                  <strong className="font-display text-3xl">⭐ {score}</strong>
                </div>

                <div className="rounded-xl bg-white/50 p-4">
                  <span className="font-label block text-[9px] uppercase">
                    Preguntas
                  </span>
                  <strong className="font-display text-3xl">{questions}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={restart}
                className="font-label mt-7 rounded-xl bg-[#332819] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                🔄 Jugar otra vez
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
