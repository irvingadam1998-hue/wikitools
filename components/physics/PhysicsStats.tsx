'use client'

interface PhysicsStatsProps {
  bodyCount: number
  gravity: number
  running: boolean
}

export default function PhysicsStats({
  bodyCount,
  gravity,
  running,
}: PhysicsStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-gray-400">Cuerpos</p>

        <p className="mt-1 text-3xl font-black">{bodyCount}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-gray-400">Gravedad</p>

        <p className="mt-1 text-3xl font-black">{gravity}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-gray-400">Estado</p>

        <p className="mt-1 text-3xl font-black">{running ? '▶' : '⏸'}</p>
      </div>
    </div>
  )
}
