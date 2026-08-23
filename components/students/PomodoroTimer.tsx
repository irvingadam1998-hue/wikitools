'use client'

import { useEffect, useMemo, useState } from 'react'

type Mode = 'focus' | 'short' | 'long'

const MODES: Record<
  Mode,
  {
    label: string
    minutes: number
    description: string
  }
> = {
  focus: {
    label: 'Concentración',
    minutes: 25,
    description: 'Trabaja sin distracciones.',
  },
  short: {
    label: 'Descanso corto',
    minutes: 5,
    description: 'Levántate, respira y desconecta.',
  },
  long: {
    label: 'Descanso largo',
    minutes: 15,
    description: 'Tómate un descanso más completo.',
  },
}

const PRESETS = [
  {
    name: 'Clásico',
    focus: 25,
    short: 5,
    long: 15,
  },
  {
    name: 'Intenso',
    focus: 50,
    short: 10,
    long: 20,
  },
  {
    name: 'Profundo',
    focus: 90,
    short: 15,
    long: 30,
  },
]

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`
}

function getInitialCompleted() {
  if (typeof window === 'undefined') return 0

  const saved = localStorage.getItem('toolhub-pomodoro-sessions')

  return saved ? Number(saved) : 0
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('focus')

  const [preset, setPreset] = useState(PRESETS[0])

  const [seconds, setSeconds] = useState(PRESETS[0].focus * 60)

  const [running, setRunning] = useState(false)

  const [completedSessions, setCompletedSessions] = useState(0)

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setCompletedSessions(getInitialCompleted())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!running) return

    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false)

          if (mode === 'focus') {
            setCompletedSessions((currentSessions) => {
              const next = currentSessions + 1

              localStorage.setItem('toolhub-pomodoro-sessions', String(next))

              return next
            })
          }

          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [running, mode])

  const totalSeconds = MODES[mode].minutes * 60

  const progress = useMemo(() => {
    if (totalSeconds <= 0) return 0

    return ((totalSeconds - seconds) / totalSeconds) * 100
  }, [seconds, totalSeconds])

  function selectMode(nextMode: Mode) {
    setRunning(false)
    setMode(nextMode)

    const minutes =
      nextMode === 'focus'
        ? preset.focus
        : nextMode === 'short'
          ? preset.short
          : preset.long

    setSeconds(minutes * 60)
  }

  function selectPreset(nextPreset: (typeof PRESETS)[number]) {
    setRunning(false)
    setPreset(nextPreset)

    setMode('focus')
    setSeconds(nextPreset.focus * 60)
  }

  function toggleTimer() {
    if (seconds <= 0) {
      resetTimer()
      return
    }

    setRunning((current) => !current)
  }

  function resetTimer() {
    setRunning(false)

    const minutes =
      mode === 'focus'
        ? preset.focus
        : mode === 'short'
          ? preset.short
          : preset.long

    setSeconds(minutes * 60)
  }

  function skipPhase() {
    setRunning(false)

    if (mode === 'focus') {
      setMode('short')
      setSeconds(preset.short * 60)
      return
    }

    setMode('focus')
    setSeconds(preset.focus * 60)
  }

  function resetSessions() {
    setCompletedSessions(0)

    localStorage.setItem('toolhub-pomodoro-sessions', '0')
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

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.35;
          }
        }

        .pulse-dot {
          animation: pulse-dot 1.5s ease-in-out infinite;
        }

        @keyframes timer-pop {
          0% {
            transform: scale(0.98);
          }

          100% {
            transform: scale(1);
          }
        }

        .timer-pop {
          animation: timer-pop 0.25s ease-out;
        }
      `}</style>

      {/* HERO */}

      <section className="mx-auto max-w-5xl px-6 pb-10 pt-20 text-center">
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● Herramienta de estudio
        </span>

        <h1 className="font-display mt-6 text-5xl font-semibold uppercase tracking-tight sm:text-6xl">
          ⏱️ Pomodoro
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9b4bd]">
          Divide tu tiempo en bloques de concentración y descansos. Menos
          distracciones, más trabajo hecho.
        </p>
      </section>

      {/* TIMER */}

      <section className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* MAIN TIMER */}

          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] sm:p-10">
            {/* MODE SELECTOR */}

            <div className="flex flex-wrap justify-center gap-2 border-b border-[#3a4753] pb-6">
              {(Object.keys(MODES) as Mode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectMode(item)}
                  className={`font-label rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${
                    mode === item
                      ? 'border-[#f2a93b] bg-[#f2a93b]/15 text-[#f2a93b]'
                      : 'border-[#3a4753] text-[#8a97a3] hover:border-[#5a6774] hover:text-[#e9edf1]'
                  }`}
                >
                  {MODES[item].label}
                </button>
              ))}
            </div>

            {/* TIMER CIRCLE */}

            <div className="flex justify-center py-10">
              <div
                className="relative flex h-72 w-72 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(
                    #f2a93b ${progress}%,
                    #303b45 ${progress}% 100%
                  )`,
                }}
              >
                <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-[#1c242c]">
                  <span className="font-label text-[10px] uppercase tracking-[0.3em] text-[#6c7a86]">
                    {running ? (
                      <span className="flex items-center gap-2">
                        <span className="pulse-dot h-2 w-2 rounded-full bg-[#f2a93b]" />
                        En marcha
                      </span>
                    ) : (
                      'Listo'
                    )}
                  </span>

                  <div
                    key={`${mode}-${seconds}`}
                    className="timer-pop font-display mt-3 text-6xl font-semibold tracking-tight sm:text-7xl"
                  >
                    {formatTime(seconds)}
                  </div>

                  <span className="mt-2 max-w-[190px] text-center text-xs text-[#8a97a3]">
                    {MODES[mode].description}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTROLS */}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleTimer}
                className="font-label min-w-40 rounded-md bg-[#f2a93b] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#1c242c] transition hover:bg-[#ffbc55] active:scale-95"
              >
                {running ? 'Pausar' : 'Comenzar'}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="font-label rounded-md border border-[#3a4753] bg-[#1c242c] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-[#a9b4bd] transition hover:border-[#f2a93b]/50 hover:text-[#e9edf1]"
              >
                Reiniciar
              </button>

              <button
                type="button"
                onClick={skipPhase}
                className="font-label rounded-md border border-[#3a4753] bg-[#1c242c] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-[#a9b4bd] transition hover:border-[#f2a93b]/50 hover:text-[#e9edf1]"
              >
                Siguiente →
              </button>
            </div>

            {/* CURRENT INFO */}

            <div className="mt-8 border-t border-dashed border-[#3a4753] pt-5 text-center">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#6c7a86]">
                Sesión actual
              </p>

              <p className="font-display mt-1 text-xl font-semibold uppercase">
                {MODES[mode].label}
              </p>
            </div>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-5">
            {/* SESSIONS */}

            <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Tus sesiones
              </p>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="font-display text-5xl font-semibold">
                    {hydrated ? completedSessions : 0}
                  </p>

                  <p className="mt-1 text-sm text-[#8a97a3]">
                    sesiones completadas
                  </p>
                </div>

                <span className="text-4xl">🍅</span>
              </div>

              <button
                type="button"
                onClick={resetSessions}
                className="font-label mt-5 text-[10px] uppercase tracking-widest text-[#6c7a86] hover:text-[#f2a93b]"
              >
                Reiniciar contador
              </button>
            </div>

            {/* PRESETS */}

            <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Presets
              </p>

              <div className="mt-4 space-y-2">
                {PRESETS.map((item) => {
                  const active = preset.name === item.name

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => selectPreset(item)}
                      className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                        active
                          ? 'border-[#f2a93b]/60 bg-[#f2a93b]/10'
                          : 'border-[#3a4753] bg-[#1c242c] hover:border-[#5a6774]'
                      }`}
                    >
                      <span>
                        <span className="font-display block text-sm font-semibold uppercase">
                          {item.name}
                        </span>

                        <span className="font-label text-[10px] text-[#6c7a86]">
                          {item.focus} / {item.short} / {item.long}
                        </span>
                      </span>

                      {active && <span className="text-[#f2a93b]">●</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* TIP */}

            <div
              className="relative rounded-lg border border-[#c9a876]/30 bg-[#f4e9c8] p-5 text-[#3a2c1a] shadow-[0_12px_20px_rgba(0,0,0,0.3)]"
              style={{
                transform: 'rotate(1deg)',
              }}
            >
              <p className="font-label text-[9px] uppercase tracking-[0.3em] text-[#8a6a4a]">
                Nota rápida
              </p>

              <p className="font-hand mt-2 text-xl leading-snug">
                Durante el bloque de concentración, intenta no cambiar de tarea.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* CICLO */}

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="border-y border-[#3a4753] py-8 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
            Cómo funciona
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-lg border border-[#3a4753] bg-[#232d36] px-5 py-3">
              <span className="text-xl">🎯</span>
              <p className="font-display mt-1 text-sm font-semibold uppercase">
                Concentración
              </p>
            </div>

            <span className="text-[#f2a93b]">→</span>

            <div className="rounded-lg border border-[#3a4753] bg-[#232d36] px-5 py-3">
              <span className="text-xl">☕</span>
              <p className="font-display mt-1 text-sm font-semibold uppercase">
                Descanso
              </p>
            </div>

            <span className="text-[#f2a93b]">→</span>

            <div className="rounded-lg border border-[#3a4753] bg-[#232d36] px-5 py-3">
              <span className="text-xl">🔥</span>
              <p className="font-display mt-1 text-sm font-semibold uppercase">
                Repetir
              </p>
            </div>

            <span className="text-[#f2a93b]">→</span>

            <div className="rounded-lg border border-[#3a4753] bg-[#232d36] px-5 py-3">
              <span className="text-xl">🏆</span>
              <p className="font-display mt-1 text-sm font-semibold uppercase">
                Progreso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f] p-8 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
            ToolHub / Estudiantes
          </p>

          <h2 className="font-display mt-3 text-2xl font-semibold uppercase">
            Una sesión a la vez.
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#8a97a3]">
            Usa el temporizador, completa tus bloques y construye tu racha de
            estudio.
          </p>
        </div>
      </section>
    </div>
  )
}
