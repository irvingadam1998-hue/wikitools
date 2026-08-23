'use client'

import { useMemo, useState } from 'react'

type Coin = {
  id: string
  value: number
  label: string
  emoji: string
}

const COINS: Coin[] = [
  { id: 'c1', value: 0.01, label: '1¢', emoji: '🟤' },
  { id: 'c5', value: 0.05, label: '5¢', emoji: '🟤' },
  { id: 'c10', value: 0.1, label: '10¢', emoji: '🟡' },
  { id: 'c25', value: 0.25, label: '25¢', emoji: '🟠' },
  { id: 'c50', value: 0.5, label: '50¢', emoji: '🟠' },
  { id: 'b1', value: 1, label: '$1', emoji: '💵' },
  { id: 'b5', value: 5, label: '$5', emoji: '💵' },
  { id: 'b10', value: 10, label: '$10', emoji: '💵' },
  { id: 'b20', value: 20, label: '$20', emoji: '💵' },
]

const TARGETS = [0.35, 0.6, 0.75, 1.25, 1.5, 2, 3.25, 4.5, 5.75, 7, 8.5, 10]

function money(value: number) {
  return `$${value.toFixed(2)}`
}

function randomTarget() {
  return TARGETS[Math.floor(Math.random() * TARGETS.length)]
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function generateOptions(answer: number) {
  const options = new Set<number>([answer])

  while (options.size < 4) {
    const candidate = TARGETS[Math.floor(Math.random() * TARGETS.length)]

    options.add(candidate)
  }

  return shuffle(Array.from(options))
}

export default function AprendeDineroPage() {
  const [target, setTarget] = useState(0.75)
  const [selected, setSelected] = useState<Coin[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [round, setRound] = useState(1)
  const [message, setMessage] = useState('')
  const [showHint, setShowHint] = useState(false)

  const total = useMemo(
    () => selected.reduce((sum, coin) => sum + coin.value, 0),
    [selected]
  )

  const options = useMemo(() => generateOptions(target), [target, round])

  function addCoin(coin: Coin) {
    setSelected((current) => [...current, coin])
    setMessage('')
  }

  function removeCoin(index: number) {
    setSelected((current) => current.filter((_, i) => i !== index))
    setMessage('')
  }

  function clearMoney() {
    setSelected([])
    setMessage('')
  }

  function nextRound() {
    const nextTarget = randomTarget()

    setTarget(nextTarget)
    setSelected([])
    setMessage('')
    setShowHint(false)
    setRound((current) => current + 1)
  }

  function checkAnswer() {
    const correct = Math.abs(total - target) < 0.001

    if (correct) {
      setScore((current) => current + 10)
      setStreak((current) => current + 1)
      setMessage('🎉 ¡Muy bien! ¡Contaste el dinero correctamente!')
    } else {
      setStreak(0)
      setMessage(
        total > target
          ? '🧐 Te pasaste un poquito. Prueba con menos dinero.'
          : '🤔 Todavía falta un poquito. ¡Añade otra moneda o billete!'
      )
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

        .font-kids {
          font-family: 'Baloo 2', sans-serif;
        }

        .font-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }

        .bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }

        @keyframes pop {
          0% { transform: scale(.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .pop {
          animation: pop .25s ease both;
        }
      `}</style>

      {/* HERO */}

      <section className="mx-auto max-w-5xl px-6 pb-8 pt-16 text-center">
        <span className="font-label inline-flex rounded-full border border-dashed border-[#f2a93b]/60 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#f2a93b]">
          🪙 Mundo de las matemáticas
        </span>

        <h1 className="font-kids mt-5 text-5xl font-extrabold leading-none sm:text-7xl">
          ¡Aprende a contar dinero! 💰
        </h1>

        <p className="font-kids mx-auto mt-4 max-w-xl text-xl text-[#a9b4bd]">
          Elige las monedas y billetes necesarios para conseguir exactamente la
          cantidad indicada.
        </p>
      </section>

      {/* ESTADÍSTICAS */}

      <section className="mx-auto grid max-w-4xl grid-cols-3 gap-3 px-6 pb-6">
        <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-4 text-center">
          <div className="text-2xl">⭐</div>
          <p className="font-label mt-1 text-[9px] uppercase text-[#6c7a86]">
            Puntos
          </p>
          <p className="font-kids text-2xl font-bold text-[#f2a93b]">{score}</p>
        </div>

        <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-4 text-center">
          <div className="text-2xl">🔥</div>
          <p className="font-label mt-1 text-[9px] uppercase text-[#6c7a86]">
            Racha
          </p>
          <p className="font-kids text-2xl font-bold text-[#e2637a]">
            {streak}
          </p>
        </div>

        <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-4 text-center">
          <div className="text-2xl">🎯</div>
          <p className="font-label mt-1 text-[9px] uppercase text-[#6c7a86]">
            Ronda
          </p>
          <p className="font-kids text-2xl font-bold text-[#4fb0a5]">{round}</p>
        </div>
      </section>

      {/* OBJETIVO */}

      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-[#f2a93b]/40 bg-gradient-to-br from-[#3a2d1d] to-[#232d36] p-7 text-center shadow-[0_20px_40px_rgba(0,0,0,.3)]">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
            ¿Cuánto dinero necesitamos?
          </p>

          <div className="bounce-soft font-kids mt-3 text-6xl font-extrabold text-[#f2a93b] sm:text-7xl">
            {money(target)}
          </div>

          <p className="font-kids mt-2 text-lg text-[#a9b4bd]">
            ¡Forma exactamente esta cantidad!
          </p>
        </div>
      </section>

      {/* DINERO SELECCIONADO */}

      <section className="mx-auto max-w-5xl px-6 pt-8">
        <div className="rounded-3xl border border-[#3a4753] bg-[#20292f] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                Tu dinero
              </p>

              <p className="font-kids text-3xl font-bold">{money(total)}</p>
            </div>

            <button
              type="button"
              onClick={clearMoney}
              className="font-label rounded-lg border border-[#3a4753] px-3 py-2 text-[10px] uppercase text-[#8a97a3] hover:border-[#e2637a] hover:text-[#e2637a]"
            >
              🗑️ Borrar
            </button>
          </div>

          <div className="mt-5 flex min-h-[110px] flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#3a4753] bg-[#1c242c] p-5">
            {selected.length === 0 ? (
              <p className="font-kids text-lg text-[#6c7a86]">
                👇 Selecciona monedas o billetes
              </p>
            ) : (
              selected.map((coin, index) => (
                <button
                  key={`${coin.id}-${index}`}
                  type="button"
                  onClick={() => removeCoin(index)}
                  className="pop rounded-xl border border-[#3a4753] bg-[#232d36] px-4 py-3 text-center transition hover:-translate-y-1 hover:border-[#e2637a]"
                  title="Quitar"
                >
                  <div className="text-3xl">{coin.emoji}</div>
                  <div className="font-kids font-bold">{coin.label}</div>
                </button>
              ))
            )}
          </div>

          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="h-3 w-full overflow-hidden rounded-full bg-[#1c242c]">
              <div
                className="h-full rounded-full bg-[#4fb0a5] transition-all"
                style={{
                  width: `${Math.min((total / target) * 100, 100)}%`,
                }}
              />
            </div>

            <span className="font-label text-[10px] uppercase tracking-widest text-[#6c7a86]">
              {money(total)} de {money(target)}
            </span>
          </div>
        </div>
      </section>

      {/* MONEDAS */}

      <section className="mx-auto max-w-5xl px-6 py-8">
        <p className="font-label mb-4 text-center text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
          Elige tu dinero
        </p>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {COINS.map((coin) => (
            <button
              key={coin.id}
              type="button"
              onClick={() => addCoin(coin)}
              className="group rounded-2xl border border-[#3a4753] bg-[#232d36] p-3 transition hover:-translate-y-2 hover:border-[#f2a93b]/60 hover:bg-[#2b3741]"
            >
              <div className="text-3xl transition group-hover:scale-110">
                {coin.emoji}
              </div>

              <div className="font-kids mt-1 text-lg font-bold">
                {coin.label}
              </div>

              <div className="font-label text-[8px] uppercase text-[#6c7a86]">
                + añadir
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ACCIONES */}

      <section className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3 px-6">
        <button
          type="button"
          onClick={checkAnswer}
          className="font-kids rounded-2xl bg-[#4fb0a5] px-8 py-4 text-xl font-extrabold text-[#14211f] shadow-[0_8px_0_#347d75] transition hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          🎯 ¡Comprobar!
        </button>

        <button
          type="button"
          onClick={() => setShowHint((current) => !current)}
          className="font-kids rounded-2xl border border-[#f2a93b]/50 bg-[#232d36] px-7 py-4 text-lg font-bold text-[#f2a93b]"
        >
          💡 Pista
        </button>

        {message && (
          <button
            type="button"
            onClick={nextRound}
            className="font-kids rounded-2xl bg-[#f2a93b] px-7 py-4 text-lg font-bold text-[#1c242c]"
          >
            ➡️ Siguiente
          </button>
        )}
      </section>

      {/* RESULTADO */}

      {message && (
        <section className="mx-auto max-w-3xl px-6 pt-6">
          <div
            className={`rounded-2xl border p-5 text-center ${
              Math.abs(total - target) < 0.001
                ? 'border-[#7cb87f]/50 bg-[#24372a]'
                : 'border-[#e2637a]/50 bg-[#38252b]'
            }`}
          >
            <p className="font-kids text-2xl font-bold">{message}</p>

            {Math.abs(total - target) < 0.001 && (
              <p className="font-kids mt-1 text-[#a9b4bd]">
                ¡Ganaste 10 puntos! 🏆
              </p>
            )}
          </div>
        </section>
      )}

      {/* PISTA */}

      {showHint && (
        <section className="mx-auto max-w-3xl px-6 pt-5">
          <div className="rounded-2xl border border-dashed border-[#a78bd9]/50 bg-[#2b2638] p-5 text-center">
            <p className="font-kids text-xl font-bold text-[#d5c7f0]">
              💡 Pista
            </p>

            <p className="font-kids mt-2 text-lg text-[#b8adc9]">
              Intenta primero con los billetes grandes y después completa los
              centavos con monedas.
            </p>
          </div>
        </section>
      )}

      {/* APRENDIZAJE */}

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-6">
            <div className="text-4xl">🪙</div>
            <h2 className="font-kids mt-3 text-2xl font-bold">Las monedas</h2>
            <p className="font-kids mt-2 text-[#8a97a3]">
              Aprende que diferentes monedas pueden combinarse para formar la
              misma cantidad.
            </p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-6">
            <div className="text-4xl">💵</div>
            <h2 className="font-kids mt-3 text-2xl font-bold">Los billetes</h2>
            <p className="font-kids mt-2 text-[#8a97a3]">
              Practica contando cantidades cada vez más grandes.
            </p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-6">
            <div className="text-4xl">🧠</div>
            <h2 className="font-kids mt-3 text-2xl font-bold">
              Piensa y combina
            </h2>
            <p className="font-kids mt-2 text-[#8a97a3]">
              Descubre diferentes formas de llegar exactamente al mismo
              resultado.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
