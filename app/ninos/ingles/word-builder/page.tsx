'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getResponsiveVoice } from '@responsivevoice/core'

type Word = {
  word: string
  emoji: string
  translation: string
  category: string
  hint: string
}

const WORDS: Word[] = [
  {
    word: 'APPLE',
    emoji: '🍎',
    translation: 'Manzana',
    category: 'Food',
    hint: 'It is red or green and you can eat it.',
  },
  {
    word: 'CAT',
    emoji: '🐱',
    translation: 'Gato',
    category: 'Animals',
    hint: 'A small animal that says meow.',
  },
  {
    word: 'DOG',
    emoji: '🐶',
    translation: 'Perro',
    category: 'Animals',
    hint: 'A friendly animal that says woof.',
  },
  {
    word: 'SUN',
    emoji: '☀️',
    translation: 'Sol',
    category: 'Nature',
    hint: 'You see it in the sky during the day.',
  },
  {
    word: 'FISH',
    emoji: '🐟',
    translation: 'Pez',
    category: 'Animals',
    hint: 'It lives in water.',
  },
  {
    word: 'BOOK',
    emoji: '📖',
    translation: 'Libro',
    category: 'School',
    hint: 'You read it to learn stories.',
  },
  {
    word: 'TREE',
    emoji: '🌳',
    translation: 'Árbol',
    category: 'Nature',
    hint: 'It has roots, branches and leaves.',
  },
  {
    word: 'BALL',
    emoji: '⚽',
    translation: 'Pelota',
    category: 'Toys',
    hint: 'You can kick or throw it.',
  },
]

const POINTS_PER_WORD = 100

function shuffleLetters(word: string): string[] {
  const letters = word.split('')

  for (let i = letters.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1))

    ;[letters[i], letters[random]] = [letters[random], letters[i]]
  }

  return letters
}

export default function WordBuilder() {
  const [currentIndex, setCurrentIndex] = useState(0)

  /*
   * IMPORTANTE:
   * No usamos Math.random() durante el render inicial.
   * Así evitamos el hydration mismatch.
   */
  const [letters, setLetters] = useState<string[]>(WORDS[0].word.split(''))

  const [answer, setAnswer] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [message, setMessage] = useState('')
  const [finished, setFinished] = useState(false)

  const [voiceReady, setVoiceReady] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  /*
   * Guardamos ResponsiveVoice en un ref.
   * Así no provoca renders innecesarios.
   */
  const voiceRef = useRef<any>(null)

  const currentWord = WORDS[currentIndex]

  const progress = useMemo(() => {
    return Math.round(((currentIndex + 1) / WORDS.length) * 100)
  }, [currentIndex])

  /*
   * ============================================================
   * RESPONSIVEVOICE
   * ============================================================
   */

  useEffect(() => {
    let mounted = true

    async function initializeVoice() {
      try {
        /*
         * Esta es tu API key.
         *
         * Si la clave que pegaste anteriormente fue revocada,
         * reemplázala por la nueva del dashboard.
         */
        const API_KEY = 'I82laftn'

        const rv = await getResponsiveVoice({
          apiKey: API_KEY,
        })

        if (!mounted) return

        voiceRef.current = rv
        setVoiceReady(true)

        console.log('ResponsiveVoice ready')
      } catch (error) {
        console.error('ResponsiveVoice initialization failed:', error)

        if (mounted) {
          setVoiceReady(false)
        }
      }
    }

    initializeVoice()

    return () => {
      mounted = false

      try {
        voiceRef.current?.cancel?.()
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [])

  /*
   * ============================================================
   * SHUFFLE DESPUÉS DEL MONTAJE
   * ============================================================
   */

  useEffect(() => {
    setLetters(shuffleLetters(WORDS[0].word))
  }, [])

  /*
   * ============================================================
   * SPEAK
   * ============================================================
   */

  function speakWord() {
    const rv = voiceRef.current

    if (!rv || !voiceReady) {
      setMessage('⏳ Loading voice...')
      return
    }

    try {
      /*
       * Detener cualquier audio anterior.
       */
      rv.cancel?.()

      setIsSpeaking(true)
      setMessage('🔊 Listening...')

      /*
       * ResponsiveVoice recomienda rv.speak(...)
       * directamente.
       *
       * UK English Female:
       * voz inglesa clara para el ejercicio.
       */
      rv.speak(currentWord.word.toLowerCase(), 'UK English Female', {
        rate: 0.75,
        pitch: 1,
        volume: 1,

        onstart: () => {
          setIsSpeaking(true)
          setMessage('🔊 Listening...')
        },

        onend: () => {
          setIsSpeaking(false)
          setMessage('')
        },

        onerror: (error: unknown) => {
          console.error('ResponsiveVoice speech error:', error)

          setIsSpeaking(false)
          setMessage('⚠️ Could not play the pronunciation.')
        },
      })
    } catch (error) {
      console.error('ResponsiveVoice speak error:', error)

      setIsSpeaking(false)
      setMessage('⚠️ Could not play the pronunciation.')
    }
  }

  /*
   * ============================================================
   * SELECT LETTER
   * ============================================================
   */

  function selectLetter(letter: string, index: number) {
    setAnswer((current) => [...current, letter])

    setLetters((current) =>
      current.filter((_, letterIndex) => letterIndex !== index)
    )

    setMessage('')
  }

  /*
   * ============================================================
   * REMOVE LETTER
   * ============================================================
   */

  function removeLetter(index: number) {
    const letter = answer[index]

    setAnswer((current) =>
      current.filter((_, letterIndex) => letterIndex !== index)
    )

    setLetters((current) => [...current, letter])

    setMessage('')
  }

  /*
   * ============================================================
   * CHECK ANSWER
   * ============================================================
   */

  function checkAnswer() {
    const formedWord = answer.join('')

    if (formedWord === currentWord.word) {
      const newStreak = streak + 1

      const earnedPoints = POINTS_PER_WORD + streak * 20

      setScore((current) => current + earnedPoints)

      setStreak(newStreak)

      setBestStreak((current) => Math.max(current, newStreak))

      setMessage('🎉 ¡Great job!')

      setTimeout(() => {
        if (currentIndex + 1 >= WORDS.length) {
          setFinished(true)
          return
        }

        const nextIndex = currentIndex + 1

        setCurrentIndex(nextIndex)

        setLetters(shuffleLetters(WORDS[nextIndex].word))

        setAnswer([])
        setShowHint(false)
        setMessage('')
      }, 900)
    } else {
      setMistakes((current) => current + 1)

      setStreak(0)

      setMessage('💪 Almost! Try again.')
    }
  }

  /*
   * ============================================================
   * RESET
   * ============================================================
   */

  function resetGame() {
    try {
      voiceRef.current?.cancel?.()
    } catch {
      // Ignore
    }

    setCurrentIndex(0)

    setLetters(shuffleLetters(WORDS[0].word))

    setAnswer([])
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setMistakes(0)
    setShowHint(false)
    setMessage('')
    setFinished(false)
    setIsSpeaking(false)
  }

  /*
   * ============================================================
   * FINISHED
   * ============================================================
   */

  if (finished) {
    return (
      <div className="min-h-screen bg-[#1c242c] px-6 py-16 text-[#e9edf1]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#3a4753] bg-[#232d36] p-8 text-center shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
          <div className="text-7xl">🏆</div>

          <p className="kids-label mt-6 text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
            Word Builder complete
          </p>

          <h1 className="kids-title mt-2 text-4xl font-bold uppercase">
            Amazing!
          </h1>

          <p className="mt-3 text-[#a9b4bd]">You finished all the words.</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-4">
              <div className="text-2xl">⭐</div>

              <p className="kids-label mt-2 text-[9px] uppercase text-[#6c7a86]">
                Score
              </p>

              <p className="kids-title mt-1 text-2xl font-bold text-[#f2a93b]">
                {score}
              </p>
            </div>

            <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-4">
              <div className="text-2xl">🔥</div>

              <p className="kids-label mt-2 text-[9px] uppercase text-[#6c7a86]">
                Best streak
              </p>

              <p className="kids-title mt-1 text-2xl font-bold">{bestStreak}</p>
            </div>

            <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-4">
              <div className="text-2xl">❌</div>

              <p className="kids-label mt-2 text-[9px] uppercase text-[#6c7a86]">
                Mistakes
              </p>

              <p className="kids-title mt-1 text-2xl font-bold">{mistakes}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="kids-label mt-8 rounded-xl bg-[#f2a93b] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#1c242c] transition hover:bg-[#ffbc55]"
          >
            🔄 Jugar otra vez
          </button>
        </div>
      </div>
    )
  }

  /*
   * ============================================================
   * GAME
   * ============================================================
   */

  return (
    <div
      className="min-h-screen bg-[#1c242c] px-4 py-10 text-[#e9edf1] sm:px-6"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=IBM+Plex+Mono:wght@400;600&display=swap');

        .kids-title {
          font-family: 'Nunito', sans-serif;
        }

        .kids-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        @keyframes pop {
          0% {
            transform: scale(.85);
            opacity: .5;
          }

          70% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .pop {
          animation: pop .3s ease both;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        .bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style>

      <main className="mx-auto max-w-4xl">
        {/* HEADER */}

        <div className="text-center">
          <span className="kids-label inline-flex rounded-full border border-dashed border-[#f2a93b]/60 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f2a93b]">
            🇬🇧 English Zone
          </span>

          <h1 className="kids-title mt-5 text-4xl font-black uppercase sm:text-6xl">
            🧩 Word Builder
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm text-[#a9b4bd] sm:text-base">
            Build the English word by choosing the correct letters!
          </p>
        </div>

        {/* STATS */}

        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <div className="text-xl">⭐</div>

            <p className="kids-label mt-1 text-[9px] uppercase text-[#6c7a86]">
              Points
            </p>

            <p className="kids-title text-xl font-black text-[#f2a93b]">
              {score}
            </p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <div className="text-xl">🔥</div>

            <p className="kids-label mt-1 text-[9px] uppercase text-[#6c7a86]">
              Streak
            </p>

            <p className="kids-title text-xl font-black">{streak}</p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-3 text-center">
            <div className="text-xl">📚</div>

            <p className="kids-label mt-1 text-[9px] uppercase text-[#6c7a86]">
              Word
            </p>

            <p className="kids-title text-xl font-black">
              {currentIndex + 1}/{WORDS.length}
            </p>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-5">
          <div className="mb-2 flex justify-between">
            <span className="kids-label text-[9px] uppercase text-[#6c7a86]">
              Progress
            </span>

            <span className="kids-label text-[9px] text-[#f2a93b]">
              {progress}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full border border-[#3a4753] bg-[#232d36]">
            <div
              className="h-full rounded-full bg-[#f2a93b] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* GAME */}

        <section className="mt-6 rounded-3xl border border-[#3a4753] bg-[#232d36] p-5 shadow-[0_25px_50px_rgba(0,0,0,0.35)] sm:p-8">
          {/* WORD CARD */}

          <div className="rounded-3xl border border-[#3a4753] bg-[#1c242c] p-7 text-center sm:p-10">
            <div className="bounce text-7xl sm:text-8xl">
              {currentWord.emoji}
            </div>

            <div className="kids-label mt-4 text-[9px] uppercase tracking-[0.3em] text-[#f2a93b]">
              {currentWord.category}
            </div>

            <p className="kids-title mt-2 text-sm text-[#8a97a3]">
              {currentWord.translation}
            </p>

            {/* VOICE BUTTON */}

            <button
              type="button"
              onClick={speakWord}
              disabled={!voiceReady || isSpeaking}
              className="mt-4 rounded-full border border-[#3a4753] bg-[#232d36] px-5 py-2 text-sm transition hover:border-[#f2a93b] hover:bg-[#2b3741] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSpeaking
                ? '🔊 Listening...'
                : voiceReady
                  ? '🔊 Hear the word'
                  : '⏳ Loading voice...'}
            </button>
          </div>

          {/* ANSWER */}

          <div className="mt-6">
            <p className="kids-label text-center text-[9px] uppercase tracking-[0.25em] text-[#6c7a86]">
              Your word
            </p>

            <div className="mt-3 flex min-h-[74px] flex-wrap justify-center gap-2 rounded-2xl border-2 border-dashed border-[#3a4753] bg-[#1c242c] p-4">
              {answer.length === 0 ? (
                <span className="self-center text-sm text-[#5c6975]">
                  Choose the letters below 👇
                </span>
              ) : (
                answer.map((letter, index) => (
                  <button
                    key={`${letter}-${index}`}
                    type="button"
                    onClick={() => removeLetter(index)}
                    className="pop kids-title flex h-12 w-12 items-center justify-center rounded-xl border border-[#f2a93b]/50 bg-[#f2a93b]/10 text-xl font-black text-[#f2a93b]"
                  >
                    {letter}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* LETTERS */}

          <div className="mt-6">
            <p className="kids-label text-center text-[9px] uppercase tracking-[0.25em] text-[#6c7a86]">
              Choose a letter
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {letters.map((letter, index) => (
                <button
                  key={`${letter}-${index}`}
                  type="button"
                  onClick={() => selectLetter(letter, index)}
                  className="kids-title flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#3a4753] bg-[#faf6ea] text-xl font-black text-[#2c2418] shadow-[0_5px_0_#c9bc9c] transition hover:-translate-y-1 hover:border-[#f2a93b] hover:bg-[#fffaf0] active:translate-y-1 active:shadow-none"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGE */}

          {message && (
            <div
              className={`pop mt-5 rounded-2xl border p-4 text-center font-bold ${
                message.includes('Great') ||
                message.includes('Listening') ||
                message.includes('Loading')
                  ? 'border-[#7cb87f]/50 bg-[#7cb87f]/10 text-[#7cb87f]'
                  : 'border-[#e2637a]/50 bg-[#e2637a]/10 text-[#e2637a]'
              }`}
            >
              {message}
            </div>
          )}

          {/* ACTIONS */}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowHint((current) => !current)}
              className="kids-label rounded-xl border border-[#3a4753] px-5 py-3 text-xs uppercase tracking-wider text-[#a9b4bd] transition hover:border-[#f2a93b]"
            >
              💡 {showHint ? 'Hide hint' : 'Hint'}
            </button>

            <button
              type="button"
              onClick={checkAnswer}
              disabled={answer.length !== currentWord.word.length}
              className="kids-label rounded-xl bg-[#f2a93b] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#1c242c] transition hover:bg-[#ffbc55] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ✓ Check word
            </button>
          </div>

          {/* HINT */}

          {showHint && (
            <div className="mt-5 rounded-2xl border border-[#5b8dd9]/40 bg-[#5b8dd9]/10 p-4 text-center">
              <span className="text-xl">💡</span>

              <p className="kids-title mt-1 text-sm text-[#b9cbe4]">
                {currentWord.hint}
              </p>
            </div>
          )}
        </section>

        {/* LEARNING */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-5">
            <div className="text-2xl">🧠</div>

            <h2 className="kids-title mt-3 text-lg font-black uppercase">
              Learn
            </h2>

            <p className="mt-2 text-sm text-[#8a97a3]">
              Look at the picture, listen to the pronunciation and build the
              word letter by letter.
            </p>
          </div>

          <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-5">
            <div className="text-2xl">🚀</div>

            <h2 className="kids-title mt-3 text-lg font-black uppercase">
              Challenge
            </h2>

            <p className="mt-2 text-sm text-[#8a97a3]">
              Build your streak and earn extra points for consecutive correct
              answers.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
