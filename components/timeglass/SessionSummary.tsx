interface SessionSummaryProps {
  totalElapsed: number
  completedSpeakers: number
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export default function SessionSummary({
  totalElapsed,
  completedSpeakers,
}: SessionSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border bg-white p-5">
        <p className="text-sm font-medium text-gray-500">Tiempo total</p>

        <p className="mt-1 text-4xl font-black tabular-nums">
          {formatTime(totalElapsed)}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Tiempo hablado en la sesión
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <p className="text-sm font-medium text-gray-500">Participantes</p>

        <p className="mt-1 text-4xl font-black">{completedSpeakers}</p>

        <p className="mt-1 text-sm text-gray-500">Turnos completados</p>
      </div>
    </div>
  )
}
