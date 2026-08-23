'use client'

import { useState } from 'react'

export default function GuessNumber() {
  const [secret, setSecret] = useState(
    () => Math.floor(Math.random() * 100) + 1
  )

  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('He elegido un número entre 1 y 100.')

  const [attempts, setAttempts] = useState(0)

  function checkGuess() {
    const number = Number(guess)

    if (!Number.isInteger(number) || number < 1 || number > 100) {
      setMessage('Introduce un número entre 1 y 100.')
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (number === secret) {
      setMessage(`🎉 ¡Correcto! Lo conseguiste en ${newAttempts} intentos.`)
    } else if (number < secret) {
      setMessage('📈 El número secreto es mayor.')
    } else {
      setMessage('📉 El número secreto es menor.')
    }
  }

  function resetGame() {
    setSecret(Math.floor(Math.random() * 100) + 1)
    setGuess('')
    setAttempts(0)
    setMessage('He elegido un nuevo número entre 1 y 100.')
  }

  return (
    <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-bold">🎲 Adivina el número</h2>

      <p className="mt-3 text-gray-600">Intenta descubrir el número secreto.</p>

      <input
        type="number"
        min="1"
        max="100"
        value={guess}
        onChange={(event) => setGuess(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            checkGuess()
          }
        }}
        className="mx-auto mt-8 block w-full max-w-xs rounded-xl border px-4 py-3 text-center text-xl outline-none"
        placeholder="1 - 100"
      />

      <div className="mt-5 flex justify-center gap-3">
        <button
          onClick={checkGuess}
          className="rounded-xl bg-black px-6 py-3 font-medium text-white"
        >
          Comprobar
        </button>

        <button
          onClick={resetGame}
          className="rounded-xl border px-6 py-3 font-medium"
        >
          Reiniciar
        </button>
      </div>

      <div className="mt-8 rounded-xl bg-gray-50 p-5">
        <p className="font-medium">{message}</p>
        <p className="mt-2 text-sm text-gray-500">Intentos: {attempts}</p>
      </div>
    </div>
  )
}
