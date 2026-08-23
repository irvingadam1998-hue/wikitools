'use client'

import { useEffect, useMemo, useState } from 'react'

import Hourglass from './Hourglass'
import SessionSummary from './SessionSummary'
import SpeakerHistory from './SpeakerHistory'
import TimePresets from './TimePresets'
import TimerControls from './TimerControls'
import TimerStatus from './TimerStatus'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface Speaker {
  id: string
  name: string
  limit: number
  elapsed: number
  overtime: number
  completed: boolean
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function TimeGlass() {
  const [speakerName, setSpeakerName] = useState('Participante 1')

  const [totalTime, setTotalTime] = useState(60)
  const [remaining, setRemaining] = useState(60)

  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  const [speakers, setSpeakers] = useState<Speaker[]>([])

  const [totalElapsed, setTotalElapsed] = useState(0)

  const [sessionFinished, setSessionFinished] = useState(false)

  /*
   * Tiempo real que lleva hablando
   * el participante actual.
   */
  const [currentElapsed, setCurrentElapsed] = useState(0)

  useEffect(() => {
    if (!running || sessionFinished) {
      return
    }

    const interval = window.setInterval(() => {
      setCurrentElapsed((value) => value + 1)

      setTotalElapsed((value) => value + 1)

      setRemaining((current) => {
        /*
         * Cuando llega a cero NO terminamos
         * el turno automáticamente.
         *
         * La persona puede seguir hablando
         * y acumulando tiempo extra.
         */
        if (current <= 0) {
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [running, sessionFinished])

  function selectTime(seconds: number) {
    if (running) return

    setTotalTime(seconds)
    setRemaining(seconds)
  }

  function start() {
    if (sessionFinished) return

    setFinished(false)
    setRunning(true)
  }

  function pause() {
    setRunning(false)
  }

  function finishCurrentSpeaker() {
    setRunning(false)

    const overtime = Math.max(0, currentElapsed - totalTime)

    const speaker: Speaker = {
      id: crypto.randomUUID(),
      name: speakerName,
      limit: totalTime,
      elapsed: currentElapsed,
      overtime,
      completed: true,
    }

    setSpeakers((current) => [...current, speaker])

    setFinished(true)
  }

  function nextSpeaker() {
    /*
     * Si estaba corriendo, finalizamos
     * automáticamente el turno actual.
     */
    if (running) {
      finishCurrentSpeaker()
    }

    /*
     * Nuevo participante.
     */
    setSpeakerName(`Participante ${speakers.length + 2}`)

    setTotalTime(60)
    setRemaining(60)

    setCurrentElapsed(0)
    setFinished(false)
    setRunning(false)
  }

  function resetCurrentSpeaker() {
    setRunning(false)
    setFinished(false)
    setCurrentElapsed(0)
    setRemaining(totalTime)
  }

  function finishSession() {
    if (running) {
      finishCurrentSpeaker()
    }

    setRunning(false)
    setSessionFinished(true)
  }

  function newSession() {
    setSpeakerName('Participante 1')

    setTotalTime(60)
    setRemaining(60)

    setRunning(false)
    setFinished(false)

    setCurrentElapsed(0)

    setSpeakers([])
    setTotalElapsed(0)

    setSessionFinished(false)
  }

  const progress = useMemo(() => {
    if (totalTime <= 0) return 0

    return remaining / totalTime
  }, [remaining, totalTime])

  const status =
    finished || sessionFinished
      ? 'finished'
      : remaining <= 10 && running
        ? 'warning'
        : running
          ? 'running'
          : 'idle'

  /*
   * --------------------------------------
   * SESIÓN TERMINADA
   * --------------------------------------
   */

  if (sessionFinished) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border bg-white p-6 shadow-xl sm:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
              TimeGlass
            </p>

            <h1 className="mt-3 text-4xl font-black">Sesión terminada</h1>

            <p className="mt-3 text-gray-500">
              Todos los turnos han sido registrados.
            </p>
          </div>

          <div className="mt-8">
            <SessionSummary
              totalElapsed={totalElapsed}
              completedSpeakers={speakers.length}
            />
          </div>

          <SpeakerHistory speakers={speakers} />

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={newSession}
              className="rounded-xl bg-black px-8 py-3 font-semibold text-white transition hover:scale-105"
            >
              ↻ Nueva sesión
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="rounded-3xl border bg-white p-6 shadow-xl sm:p-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            TimeGlass
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Control de turnos
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Cada persona tiene su tiempo. El contador total acumula toda la
            sesión.
          </p>
        </div>

        {/* Tiempo global */}
        <div className="mt-8 rounded-2xl bg-gray-950 p-5 text-center text-white">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Tiempo total de la sesión
          </p>

          <p className="mt-1 text-4xl font-black tabular-nums">
            {formatTime(totalElapsed)}
          </p>
        </div>

        {/* Participante */}
        <div className="mt-8">
          <label htmlFor="speaker" className="mb-2 block text-sm font-semibold">
            Persona actual
          </label>

          <input
            id="speaker"
            type="text"
            value={speakerName}
            disabled={running}
            onChange={(event) => setSpeakerName(event.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            placeholder="Nombre del participante"
          />
        </div>

        {/* Reloj */}
        <div className="mt-8">
          <DotLottieReact
            src="https://lottie.host/4516d625-5451-483b-bdea-ea84b491c8ec/L51AlGtEpt.lottie"
            loop
            autoplay
          />
        </div>

        {/* Tiempo actual */}
        <div className="mt-2 text-center">
          <p
            className={`text-6xl font-black tabular-nums sm:text-7xl ${
              finished
                ? 'text-red-500'
                : remaining <= 10 && running
                  ? 'text-orange-500'
                  : 'text-gray-900'
            }`}
          >
            {formatTime(remaining)}
          </p>

          <p className="mt-2 text-sm text-gray-500">Tiempo del participante</p>
        </div>

        {/* Estado */}
        <div className="mt-8">
          <TimerStatus
            remaining={remaining}
            total={totalTime}
            running={running}
            finished={finished}
          />
        </div>

        {/* Presets */}
        <div className="mt-8">
          <p className="mb-3 text-center text-sm font-semibold text-gray-500">
            Tiempo asignado
          </p>

          <TimePresets
            selectedTime={totalTime}
            disabled={running}
            onSelect={selectTime}
          />
        </div>

        {/* Controles */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {!running && !finished && (
            <button
              type="button"
              onClick={start}
              className="rounded-xl bg-black px-8 py-3 font-semibold text-white transition hover:scale-105"
            >
              ▶ Iniciar
            </button>
          )}

          {running && (
            <button
              type="button"
              onClick={pause}
              className="rounded-xl border px-8 py-3 font-semibold transition hover:bg-gray-100"
            >
              ⏸ Pausar
            </button>
          )}

          {running && (
            <button
              type="button"
              onClick={finishCurrentSpeaker}
              className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:scale-105"
            >
              ✓ Terminar turno
            </button>
          )}

          {!running && (
            <button
              type="button"
              onClick={resetCurrentSpeaker}
              className="rounded-xl border px-8 py-3 font-semibold transition hover:bg-gray-100"
            >
              ↻ Reiniciar
            </button>
          )}
        </div>

        {/* Siguiente */}
        {finished && (
          <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-center">
            <p className="font-semibold">Turno de {speakerName} terminado</p>

            <p className="mt-1 text-sm text-gray-500">
              Tiempo utilizado: {formatTime(currentElapsed)}
            </p>

            <button
              type="button"
              onClick={nextSpeaker}
              className="mt-4 rounded-xl bg-black px-8 py-3 font-semibold text-white"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Historial */}
        <SpeakerHistory speakers={speakers} />

        {/* Finalizar sesión */}
        {speakers.length > 0 && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={finishSession}
              className="text-sm font-semibold text-gray-500 underline underline-offset-4 hover:text-black"
            >
              Finalizar sesión
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
