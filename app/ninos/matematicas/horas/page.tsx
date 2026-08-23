'use client'

import { useEffect, useMemo, useState } from 'react'

type Difficulty = 'facil' | 'medio' | 'dificil'

interface Question {
  hour: number
  minute: number
  answer: string
  label: string
}

const COLORS = [
  '#f2a93b',
  '#4fb0a5',
  '#5b8dd9',
  '#e2637a',
  '#7cb87f',
  '#a78bd9',
  '#d9c25b',
]

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatTime(hour: number, minute: number) {
  return `${pad(hour)}:${pad(minute)}`
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function createQuestion(difficulty: Difficulty): Question {
  let hour = randomInt(1, 12)
  let minute = 0

  if (difficulty === 'facil') {
    minute = 0
  }

  if (difficulty === 'medio') {
    minute = [0, 15, 30, 45][randomInt(0, 3)]
  }

  if (difficulty === 'dificil') {
    minute = randomInt(0, 11) * 5
  }

  return {
    hour,
    minute,
    answer: formatTime(hour, minute),
    label: minute === 0 ? `${hour}:00` : `${hour}:${pad(minute)}`,
  }
}

function playTone(
  frequency: number,
  duration = 0.12,
  type: OscillatorType = 'sine'
) {
  if (typeof window === 'undefined') return

  try {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext
        }
      ).webkitAudioContext

    if (!AudioContextClass) return

    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    gain.gain.setValueAtTime(0.001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    )

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.start()
    oscillator.stop(context.currentTime + duration)

    oscillator.onended = () => {
      context.close()
    }
  } catch {
    // El sonido es opcional.
  }
}

function playSuccessSound() {
  playTone(660, 0.1)

  setTimeout(() => {
    playTone(880, 0.16)
  }, 100)
}

function playErrorSound() {
  playTone(180, 0.18, 'square')

  setTimeout(() => {
    playTone(130, 0.22, 'square')
  }, 130)
}

function playWinSound() {
  playTone(523, 0.12)

  setTimeout(() => playTone(659, 0.12), 100)
  setTimeout(() => playTone(784, 0.12), 200)
  setTimeout(() => playTone(1047, 0.22), 300)
}

function Clock({
  hour,
  minute,
  showHint,
}: {
  hour: number
  minute: number
  showHint: 'hour' | 'minute' | null
}) {
  const hourAngle = ((hour % 12) + minute / 60) * 30
  const minuteAngle = minute * 6

  return (
    <div className="clock-wrap">
      <div className="clock">
        <div className="clock-shadow" />

        <div className="clock-face">
          {/* MARCAS DE MINUTOS */}

          {Array.from({ length: 60 }).map((_, index) => {
            const angle = index * 6
            const major = index % 5 === 0

            return (
              <span
                key={index}
                className={`minute-mark ${major ? 'major' : ''}`}
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              />
            )
          })}

          {/* NÚMEROS */}

          {Array.from({ length: 12 }).map((_, index) => {
            const number = index + 1
            const angle = number * 30
            const radius = 39

            const x = 50 + Math.sin((angle * Math.PI) / 180) * radius
            const y = 50 - Math.cos((angle * Math.PI) / 180) * radius

            return (
              <span
                key={number}
                className="clock-number"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {number}
              </span>
            )
          })}

          {/* MANECILLA DE HORAS */}

          <div
            className={`clock-hand hour-hand ${
              showHint === 'hour' ? 'hint-hand' : ''
            }`}
            style={{
              transform: `translateX(-50%) rotate(${hourAngle}deg)`,
            }}
          />

          {/* MANECILLA DE MINUTOS */}

          <div
            className={`clock-hand minute-hand ${
              showHint === 'minute' ? 'hint-hand' : ''
            }`}
            style={{
              transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
            }}
          />

          {/* CENTRO */}

          <div className="clock-center" />
        </div>
      </div>
    </div>
  )
}

export default function AprendeLasHorasPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('facil')

  const [question, setQuestion] = useState<Question>(() =>
    createQuestion('facil')
  )

  const [selected, setSelected] = useState<string | null>(null)

  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [round, setRound] = useState(1)

  const [sound, setSound] = useState(true)
  const [hint, setHint] = useState<'hour' | 'minute' | null>(null)

  const [message, setMessage] = useState('¡Mira el reloj y descubre la hora!')

  const [finished, setFinished] = useState(false)

  const options = useMemo(() => {
    const answers = new Set<string>()

    answers.add(question.answer)

    while (answers.size < 4) {
      const fakeHour = randomInt(1, 12)

      let fakeMinute = 0

      if (difficulty === 'facil') {
        fakeMinute = 0
      } else if (difficulty === 'medio') {
        fakeMinute = [0, 15, 30, 45][randomInt(0, 3)]
      } else {
        fakeMinute = randomInt(0, 11) * 5
      }

      answers.add(formatTime(fakeHour, fakeMinute))
    }

    return Array.from(answers).sort(() => Math.random() - 0.5)
  }, [question, difficulty])

  useEffect(() => {
    if (lives <= 0) {
      setFinished(true)

      if (sound) {
        playErrorSound()
      }
    }
  }, [lives, sound])

  function nextQuestion() {
    setQuestion(createQuestion(difficulty))
    setSelected(null)
    setHint(null)
    setMessage('¡Nueva hora! Mira atentamente el reloj.')
    setRound((value) => value + 1)
  }

  function answer(value: string) {
    if (selected || finished) return

    setSelected(value)

    if (value === question.answer) {
      setScore((value) => value + 100 + streak * 10)
      setStreak((value) => value + 1)
      setMessage('🎉 ¡Excelente! ¡Leíste el reloj correctamente!')

      if (sound) {
        playSuccessSound()
      }

      setTimeout(() => {
        nextQuestion()
      }, 900)
    } else {
      setLives((value) => Math.max(0, value - 1))
      setStreak(0)

      setMessage(`❌ Casi. La respuesta correcta era ${question.answer}.`)

      if (sound) {
        playErrorSound()
      }

      setTimeout(() => {
        if (lives > 1) {
          nextQuestion()
        }
      }, 1100)
    }
  }

  function useHint() {
    if (hint === 'hour') {
      setHint('minute')
      setMessage('💡 La manecilla azul es la de los minutos.')
    } else {
      setHint('hour')
      setMessage('💡 La manecilla corta es la de las horas.')
    }
  }

  function restart() {
    const newQuestion = createQuestion(difficulty)

    setQuestion(newQuestion)
    setScore(0)
    setStreak(0)
    setLives(3)
    setRound(1)
    setSelected(null)
    setHint(null)
    setFinished(false)
    setMessage('¡Vamos! ¿Qué hora marca el reloj?')
  }

  function changeDifficulty(value: Difficulty) {
    setDifficulty(value)

    const newQuestion = createQuestion(value)

    setQuestion(newQuestion)
    setSelected(null)
    setHint(null)
    setScore(0)
    setStreak(0)
    setLives(3)
    setRound(1)
    setFinished(false)
    setMessage('Nuevo nivel preparado. ¡A jugar!')
  }

  if (finished) {
    return (
      <div className="page">
        <style>{styles}</style>

        <main className="game-shell">
          <div className="finish-card">
            <div className="finish-icon">🏆</div>

            <span className="eyebrow">NIVEL COMPLETADO</span>

            <h1>¡Excelente trabajo!</h1>

            <p>
              Terminaste esta partida de <strong>Aprende las horas</strong>.
            </p>

            <div className="final-stats">
              <div>
                <span>⭐</span>
                <strong>{score}</strong>
                <small>PUNTOS</small>
              </div>

              <div>
                <span>🔥</span>
                <strong>{streak}</strong>
                <small>RACHA</small>
              </div>
            </div>

            <button type="button" className="primary-button" onClick={restart}>
              🔄 JUGAR DE NUEVO
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <style>{styles}</style>

      <main className="game-shell">
        {/* HEADER */}

        <header className="topbar">
          <div>
            <span className="eyebrow">🕐 TOOLHUB / NIÑOS / MATEMÁTICAS</span>

            <h1>Aprende las horas</h1>

            <p>Mira las manecillas y descubre qué hora marca el reloj.</p>
          </div>

          <button
            type="button"
            className="sound-button"
            onClick={() => setSound((value) => !value)}
            aria-label="Activar o desactivar sonido"
          >
            {sound ? '🔊' : '🔇'}
          </button>
        </header>

        {/* ESTADÍSTICAS */}

        <section className="stats">
          <div className="stat">
            <span>⭐</span>
            <div>
              <small>PUNTOS</small>
              <strong>{score}</strong>
            </div>
          </div>

          <div className="stat">
            <span>🔥</span>
            <div>
              <small>RACHA</small>
              <strong>{streak}</strong>
            </div>
          </div>

          <div className="stat">
            <span>❤️</span>
            <div>
              <small>VIDAS</small>
              <strong>{'❤️'.repeat(lives)}</strong>
            </div>
          </div>

          <div className="stat">
            <span>🎯</span>
            <div>
              <small>RONDA</small>
              <strong>{round}</strong>
            </div>
          </div>
        </section>

        {/* DIFICULTAD */}

        <section className="difficulty">
          <span>NIVEL</span>

          {(
            [
              ['facil', '🌱 Fácil'],
              ['medio', '🚀 Medio'],
              ['dificil', '🔥 Difícil'],
            ] as [Difficulty, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => changeDifficulty(id)}
              className={difficulty === id ? 'active' : ''}
            >
              {label}
            </button>
          ))}
        </section>

        {/* JUEGO */}

        <section className="game-card">
          <div className="question-area">
            <span className="question-label">PREGUNTA #{round}</span>

            <h2>¿Qué hora marca el reloj?</h2>

            <p>{message}</p>
          </div>

          {/* RELOJ */}

          <Clock
            hour={question.hour}
            minute={question.minute}
            showHint={hint}
          />

          {/* REFERENCIA DE MANECILLAS */}

          <div className="legend">
            <div>
              <span className="legend-hour" />
              <b>Manecilla corta</b>
              <small>Horas</small>
            </div>

            <div>
              <span className="legend-minute" />
              <b>Manecilla larga</b>
              <small>Minutos</small>
            </div>
          </div>

          {/* RESPUESTAS */}

          <div className="answers">
            {options.map((option) => {
              const isCorrect = option === question.answer
              const isSelected = selected === option

              let className = 'answer'

              if (isSelected && isCorrect) {
                className += ' correct'
              }

              if (isSelected && !isCorrect) {
                className += ' wrong'
              }

              if (selected && isCorrect) {
                className += ' reveal'
              }

              return (
                <button
                  key={option}
                  type="button"
                  className={className}
                  onClick={() => answer(option)}
                  disabled={Boolean(selected)}
                >
                  <span>🕐</span>
                  {option}
                </button>
              )
            })}
          </div>

          {/* PISTA */}

          <div className="hint-area">
            <button
              type="button"
              className="hint-button"
              onClick={useHint}
              disabled={Boolean(selected)}
            >
              💡 Dame una pista
            </button>
          </div>
        </section>

        {/* MINI EXPLICACIÓN */}

        <section className="learn-box">
          <div className="learn-icon">🧠</div>

          <div>
            <span>TRUCO PARA APRENDER</span>

            <h3>Primero mira la manecilla corta</h3>

            <p>
              La manecilla corta indica la <strong>hora</strong>. La manecilla
              larga indica los <strong>minutos</strong>. Cada número representa
              5 minutos cuando hablamos de la manecilla larga.
            </p>
          </div>
        </section>

        {/* FOOTER */}

        <footer>
          <span>🎒 TOOLHUB KIDS</span>
          <span>Aprender jugando</span>
        </footer>
      </main>
    </div>
  )
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .page {
    min-height: 100vh;
    background:
      radial-gradient(
        rgba(255,255,255,0.055) 1.4px,
        transparent 1.4px
      ),
      #1c242c;
    background-size: 26px 26px;
    color: #e9edf1;
    padding: 40px 20px 80px;
  }

  .game-shell {
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 28px;
  }

  .eyebrow {
    display: inline-block;
    color: #f2a93b;
    font-family: monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .topbar h1 {
    margin: 8px 0 6px;
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: clamp(38px, 7vw, 64px);
    line-height: .95;
    text-transform: uppercase;
    letter-spacing: -.025em;
  }

  .topbar p {
    margin: 0;
    color: #a9b4bd;
    font-size: 15px;
  }

  .sound-button {
    width: 48px;
    height: 48px;
    border: 1px solid #3a4753;
    border-radius: 12px;
    background: #232d36;
    font-size: 21px;
    cursor: pointer;
    transition: .2s;
  }

  .sound-button:hover {
    transform: translateY(-2px);
    border-color: #f2a93b;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 15px;
    background: #232d36;
    border: 1px solid #3a4753;
    border-radius: 12px;
  }

  .stat > span {
    font-size: 22px;
  }

  .stat small {
    display: block;
    color: #6c7a86;
    font: 700 8px monospace;
    letter-spacing: .15em;
  }

  .stat strong {
    display: block;
    margin-top: 2px;
    font-family: monospace;
    font-size: 15px;
  }

  .difficulty {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .difficulty > span {
    margin-right: 5px;
    color: #6c7a86;
    font: 700 9px monospace;
    letter-spacing: .18em;
  }

  .difficulty button {
    border: 1px solid #3a4753;
    border-radius: 999px;
    background: #20292f;
    color: #a9b4bd;
    padding: 8px 14px;
    font: 700 11px monospace;
    cursor: pointer;
    transition: .2s;
  }

  .difficulty button:hover,
  .difficulty button.active {
    border-color: #f2a93b;
    background: rgba(242,169,59,.12);
    color: #f2a93b;
  }

  .game-card {
    position: relative;
    overflow: hidden;
    border: 1px solid #3a4753;
    border-radius: 24px;
    background:
      radial-gradient(
        circle at 50% 35%,
        rgba(242,169,59,.08),
        transparent 35%
      ),
      #20292f;
    padding: 30px 20px 28px;
    box-shadow: 0 25px 55px rgba(0,0,0,.3);
  }

  .question-area {
    text-align: center;
  }

  .question-label {
    color: #f2a93b;
    font: 700 9px monospace;
    letter-spacing: .25em;
  }

  .question-area h2 {
    margin: 7px 0 5px;
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: clamp(27px, 5vw, 40px);
    text-transform: uppercase;
  }

  .question-area p {
    min-height: 22px;
    margin: 0;
    color: #a9b4bd;
    font-size: 14px;
  }

  /* RELOJ */

  .clock-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 34px 0 20px;
  }

  .clock {
    position: relative;
    width: min(390px, 78vw);
    aspect-ratio: 1;
  }

  .clock-shadow {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    background: rgba(0,0,0,.4);
    filter: blur(10px);
  }

  .clock-face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border: 12px solid #f2a93b;
    border-radius: 50%;
    background:
      radial-gradient(
        circle at 35% 25%,
        rgba(255,255,255,.9),
        transparent 30%
      ),
      #fff8df;
    box-shadow:
      inset 0 0 0 5px #30281d,
      inset 0 0 25px rgba(0,0,0,.2),
      0 15px 35px rgba(0,0,0,.35);
  }

  .minute-mark {
    position: absolute;
    left: 50%;
    top: 2.5%;
    width: 2px;
    height: 7px;
    transform-origin: 50% 650%;
    background: #b9aa8a;
  }

  .minute-mark.major {
    top: 1.8%;
    width: 4px;
    height: 14px;
    background: #30281d;
    transform-origin: 50% 350%;
  }

  .clock-number {
    position: absolute;
    z-index: 3;
    transform: translate(-50%, -50%);
    color: #30281d;
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: clamp(22px, 4vw, 32px);
    line-height: 1;
  }

  .clock-hand {
    position: absolute;
    z-index: 5;
    left: 50%;
    bottom: 50%;
    transform-origin: 50% 100%;
    border-radius: 999px;
  }

  .hour-hand {
    width: 13px;
    height: 27%;
    background: #e2637a;
    box-shadow: 0 2px 4px rgba(0,0,0,.25);
  }

  .minute-hand {
    width: 9px;
    height: 38%;
    background: #5b8dd9;
    box-shadow: 0 2px 4px rgba(0,0,0,.25);
  }

  .clock-center {
    position: absolute;
    z-index: 8;
    left: 50%;
    top: 50%;
    width: 23px;
    height: 23px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 4px solid #30281d;
    background: #f2a93b;
    box-shadow: 0 2px 5px rgba(0,0,0,.3);
  }

  .hint-hand {
    animation: pulse-hand .7s infinite alternate;
  }

  @keyframes pulse-hand {
    from {
      filter: brightness(1);
      box-shadow: 0 0 0 rgba(242,169,59,0);
    }
    to {
      filter: brightness(1.5);
      box-shadow: 0 0 18px #f2a93b;
    }
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
    margin: 0 auto 23px;
  }

  .legend > div {
    display: grid;
    grid-template-columns: 12px auto;
    column-gap: 8px;
    align-items: center;
  }

  .legend span {
    width: 9px;
    height: 25px;
    border-radius: 99px;
    grid-row: span 2;
  }

  .legend-hour {
    background: #e2637a;
  }

  .legend-minute {
    background: #5b8dd9;
  }

  .legend b {
    font-size: 12px;
  }

  .legend small {
    color: #6c7a86;
    font-size: 10px;
  }

  .answers {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    max-width: 700px;
    margin: 0 auto;
  }

  .answer {
    min-height: 65px;
    border: 2px solid #3a4753;
    border-radius: 13px;
    background: #232d36;
    color: #e9edf1;
    font: 700 20px monospace;
    cursor: pointer;
    transition: .18s;
  }

  .answer span {
    margin-right: 7px;
    font-size: 15px;
  }

  .answer:hover:not(:disabled) {
    transform: translateY(-3px);
    border-color: #f2a93b;
    background: #2b3741;
  }

  .answer.correct,
  .answer.reveal {
    border-color: #7cb87f;
    background: rgba(124,184,127,.18);
    color: #bce5be;
  }

  .answer.wrong {
    border-color: #e2637a;
    background: rgba(226,99,122,.18);
    color: #ffb4c1;
    animation: shake .25s;
  }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .hint-area {
    display: flex;
    justify-content: center;
    margin-top: 18px;
  }

  .hint-button {
    border: 1px dashed #566575;
    border-radius: 999px;
    background: transparent;
    color: #a9b4bd;
    padding: 8px 15px;
    font: 700 10px monospace;
    cursor: pointer;
  }

  .hint-button:hover:not(:disabled) {
    color: #f2a93b;
    border-color: #f2a93b;
  }

  .hint-button:disabled {
    opacity: .4;
    cursor: default;
  }

  .learn-box {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-top: 16px;
    padding: 20px;
    border: 1px dashed #3a4753;
    border-radius: 16px;
    background: #20292f;
  }

  .learn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 46px;
    height: 46px;
    border-radius: 12px;
    background: #f2a93b;
    color: #1c242c;
    font-size: 23px;
  }

  .learn-box span {
    color: #f2a93b;
    font: 700 9px monospace;
    letter-spacing: .18em;
  }

  .learn-box h3 {
    margin: 4px 0;
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: 20px;
    text-transform: uppercase;
  }

  .learn-box p {
    margin: 0;
    color: #8a97a3;
    font-size: 13px;
    line-height: 1.6;
  }

  footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    color: #596673;
    font: 700 9px monospace;
    letter-spacing: .12em;
  }

  .finish-card {
    max-width: 600px;
    margin: 10vh auto 0;
    padding: 45px 25px;
    border: 1px solid #3a4753;
    border-radius: 25px;
    background: #232d36;
    text-align: center;
    box-shadow: 0 25px 60px rgba(0,0,0,.35);
  }

  .finish-icon {
    font-size: 65px;
    margin-bottom: 10px;
  }

  .finish-card h1 {
    margin: 8px 0;
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: 48px;
    text-transform: uppercase;
  }

  .finish-card p {
    color: #a9b4bd;
  }

  .final-stats {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 25px 0;
  }

  .final-stats > div {
    min-width: 130px;
    padding: 18px;
    border: 1px solid #3a4753;
    border-radius: 15px;
    background: #1c242c;
  }

  .final-stats span {
    display: block;
    font-size: 25px;
  }

  .final-stats strong {
    display: block;
    margin-top: 5px;
    font: 700 23px monospace;
  }

  .final-stats small {
    color: #6c7a86;
    font: 700 8px monospace;
    letter-spacing: .15em;
  }

  .primary-button {
    border: 0;
    border-radius: 10px;
    background: #f2a93b;
    color: #1c242c;
    padding: 13px 23px;
    font: 700 12px monospace;
    cursor: pointer;
  }

  .primary-button:hover {
    background: #ffbc55;
  }

  @media (max-width: 700px) {
    .page {
      padding: 25px 12px 50px;
    }

    .topbar {
      align-items: center;
    }

    .stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .game-card {
      padding-left: 12px;
      padding-right: 12px;
    }

    .answers {
      grid-template-columns: repeat(2, 1fr);
    }

    .answer {
      min-height: 58px;
      font-size: 17px;
    }

    .clock {
      width: min(330px, 82vw);
    }

    .learn-box {
      flex-direction: column;
    }

    footer {
      flex-direction: column;
      gap: 7px;
    }
  }

  @media (max-width: 420px) {
    .stats {
      gap: 6px;
    }

    .stat {
      padding: 10px;
    }

    .stat > span {
      font-size: 18px;
    }

    .clock-face {
      border-width: 8px;
    }

    .clock-number {
      font-size: 20px;
    }

    .final-stats {
      flex-direction: column;
    }
  }
`
