"use client";

interface PhysicsControlsProps {
  running: boolean;
  gravity: number;
  bodyCount: number;
  onToggle: () => void;
  onGravityChange: (
    value: number
  ) => void;
  onClear: () => void;
  onAddPlanet: () => void;
}

export default function PhysicsControls({
  running,
  gravity,
  bodyCount,
  onToggle,
  onGravityChange,
  onClear,
  onAddPlanet,
}: PhysicsControlsProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105"
        >
          {running
            ? "⏸ Pausar"
            : "▶ Iniciar"}
        </button>

        <button
          type="button"
          onClick={onAddPlanet}
          className="rounded-xl border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
        >
          🪐 Añadir planeta
        </button>

        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
        >
          🗑 Limpiar
        </button>
      </div>

      <div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">
            Gravedad
          </span>

          <span className="text-gray-400">
            {gravity}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="2000"
          step="10"
          value={gravity}
          onChange={(event) =>
            onGravityChange(
              Number(event.target.value)
            )
          }
          className="w-full"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        <span>
          Cuerpos: {bodyCount}
        </span>

        <span>
          Click en el área para crear
        </span>
      </div>
    </div>
  );
}