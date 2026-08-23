'use client'

interface TimerControlsProps {
  running: boolean
  finished: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export default function TimerControls({
  running,
  finished,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {!running && !finished ? (
        <button
          type="button"
          onClick={onStart}
          className="rounded-xl bg-black px-8 py-3 font-semibold text-white transition hover:scale-105"
        >
          ▶ Iniciar
        </button>
      ) : running ? (
        <button
          type="button"
          onClick={onPause}
          className="rounded-xl border bg-white px-8 py-3 font-semibold transition hover:bg-gray-100"
        >
          ⏸ Pausar
        </button>
      ) : null}

      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border bg-white px-8 py-3 font-semibold transition hover:bg-gray-100"
      >
        ↻ Reiniciar
      </button>
    </div>
  )
}
