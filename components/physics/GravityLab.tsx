'use client'

import { useRef, useState } from 'react'

import { Body } from '@/lib/physics/Body'
import { PhysicsEngine } from '@/lib/physics/PhysicsEngine'
import { Vector } from '@/lib/physics/Vector'

import PhysicsCanvas from './PhysicsCanvas'
import PhysicsControls from './PhysicsControls'
import PhysicsStats from './PhysicsStats'

export default function GravityLab() {
  const engineRef = useRef<PhysicsEngine | null>(null)

  if (!engineRef.current) {
    engineRef.current = new PhysicsEngine()
  }

  const engine = engineRef.current

  const [running, setRunning] = useState(false)

  const [gravity, setGravity] = useState(500)

  const [bodyCount, setBodyCount] = useState(0)

  function toggleRunning() {
    setRunning((current) => !current)
  }

  function changeGravity(value: number) {
    setGravity(value)
    engine.gravity = value
  }

  function clear() {
    engine.clear()
    setBodyCount(0)
  }

  function addPlanet() {
    const body = new Body(150, 22, new Vector(400, 250))

    engine.addBody(body)

    setBodyCount(engine.bodies.length)
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400">
          Physics Lab
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">Gravity Lab</h1>

        <p className="mt-4 max-w-2xl text-gray-400">
          Crea cuerpos y observa cómo la gravedad modifica sus trayectorias.
        </p>
      </header>

      <div className="space-y-6">
        <PhysicsStats
          bodyCount={bodyCount}
          gravity={gravity}
          running={running}
        />

        <PhysicsCanvas
          engine={engine}
          running={running}
          onBodyCountChange={setBodyCount}
        />

        <PhysicsControls
          running={running}
          gravity={gravity}
          bodyCount={bodyCount}
          onToggle={toggleRunning}
          onGravityChange={changeGravity}
          onClear={clear}
          onAddPlanet={addPlanet}
        />
      </div>
    </div>
  )
}
