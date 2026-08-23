interface TimerStatusProps {
  remaining: number
  total: number
  running: boolean
  finished: boolean
}

export default function TimerStatus({
  remaining,
  total,
  running,
  finished,
}: TimerStatusProps) {
  const percentage = total > 0 ? remaining / total : 0

  if (finished) {
    return (
      <div className="text-center">
        <div className="text-5xl font-black tracking-tight text-red-500">
          ¡Tiempo!
        </div>

        <p className="mt-2 text-gray-500">El turno ha terminado.</p>
      </div>
    )
  }

  if (remaining <= 10 && running) {
    return (
      <div className="text-center">
        <div className="text-5xl font-black text-orange-500">
          Últimos segundos
        </div>

        <p className="mt-2 text-gray-500">Prepárate para terminar.</p>
      </div>
    )
  }

  if (!running && remaining === total) {
    return (
      <div className="text-center">
        <div className="text-3xl font-bold">Listo para comenzar</div>

        <p className="mt-2 text-gray-500">
          Selecciona una duración y comienza.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="text-3xl font-bold">
        {percentage > 0.5
          ? '🟢 Tiempo disponible'
          : percentage > 0.2
            ? '🟡 Queda poco tiempo'
            : '🟠 Último tramo'}
      </div>

      <p className="mt-2 text-gray-500">Mantén tu turno dentro del tiempo.</p>
    </div>
  )
}
