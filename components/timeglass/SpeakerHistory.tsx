interface Speaker {
  id: string
  name: string
  limit: number
  elapsed: number
  overtime: number
  completed: boolean
}

interface SpeakerHistoryProps {
  speakers: Speaker[]
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export default function SpeakerHistory({ speakers }: SpeakerHistoryProps) {
  if (speakers.length === 0) {
    return null
  }

  return (
    <div className="mt-8 rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-bold">Historial de turnos</h2>

      <div className="mt-4 space-y-3">
        {speakers.map((speaker) => {
          const overtime = speaker.overtime > 0

          return (
            <div
              key={speaker.id}
              className="flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                    overtime ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  {overtime ? '🔥' : '✓'}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold">{speaker.name}</p>

                  <p className="text-sm text-gray-500">
                    Límite: {formatTime(speaker.limit)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">{formatTime(speaker.elapsed)}</p>

                {overtime ? (
                  <p className="text-sm font-semibold text-red-500">
                    +{formatTime(speaker.overtime)}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-green-600">
                    A tiempo
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
