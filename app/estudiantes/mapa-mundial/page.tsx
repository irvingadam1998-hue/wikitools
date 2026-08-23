'use client'

import { useEffect, useMemo, useState } from 'react'

type Country = {
  id: string
  name: string
  capital: string
  continent: string
  population: string
  area: string
  language: string
  currency: string
  flag: string
  fact: string
  x: number
  y: number
  width: number
  height: number
}

type GameMode = 'explore' | 'country' | 'flag' | 'find' | 'speed'

const COUNTRIES: Country[] = [
  {
    id: 'panama',
    name: 'Panamá',
    capital: 'Ciudad de Panamá',
    continent: 'América',
    population: '4.5 M',
    area: '75,417 km²',
    language: 'Español',
    currency: 'Balboa / USD',
    flag: '🇵🇦',
    fact: 'Panamá conecta América del Norte y América del Sur.',
    x: 45,
    y: 47,
    width: 6,
    height: 4,
  },
  {
    id: 'mexico',
    name: 'México',
    capital: 'Ciudad de México',
    continent: 'América',
    population: '130 M',
    area: '1,964,375 km²',
    language: 'Español',
    currency: 'Peso mexicano',
    flag: '🇲🇽',
    fact: 'México es uno de los países con mayor diversidad cultural del mundo.',
    x: 25,
    y: 36,
    width: 14,
    height: 12,
  },
  {
    id: 'usa',
    name: 'Estados Unidos',
    capital: 'Washington D. C.',
    continent: 'América',
    population: '340 M',
    area: '9,833,520 km²',
    language: 'Inglés',
    currency: 'Dólar estadounidense',
    flag: '🇺🇸',
    fact: 'Estados Unidos tiene territorios en el Pacífico y el Caribe.',
    x: 30,
    y: 28,
    width: 18,
    height: 9,
  },
  {
    id: 'brazil',
    name: 'Brasil',
    capital: 'Brasilia',
    continent: 'América',
    population: '216 M',
    area: '8,515,767 km²',
    language: 'Portugués',
    currency: 'Real brasileño',
    flag: '🇧🇷',
    fact: 'Brasil es el país más grande de América del Sur.',
    x: 55,
    y: 58,
    width: 16,
    height: 18,
  },
  {
    id: 'argentina',
    name: 'Argentina',
    capital: 'Buenos Aires',
    continent: 'América',
    population: '46 M',
    area: '2,780,400 km²',
    language: 'Español',
    currency: 'Peso argentino',
    flag: '🇦🇷',
    fact: 'Argentina se extiende desde el norte subtropical hasta zonas cercanas a la Antártida.',
    x: 52,
    y: 76,
    width: 9,
    height: 17,
  },
  {
    id: 'spain',
    name: 'España',
    capital: 'Madrid',
    continent: 'Europa',
    population: '48 M',
    area: '505,990 km²',
    language: 'Español',
    currency: 'Euro',
    flag: '🇪🇸',
    fact: 'España está formada por una península y varios archipiélagos.',
    x: 46,
    y: 31,
    width: 6,
    height: 4,
  },
  {
    id: 'france',
    name: 'Francia',
    capital: 'París',
    continent: 'Europa',
    population: '68 M',
    area: '551,695 km²',
    language: 'Francés',
    currency: 'Euro',
    flag: '🇫🇷',
    fact: 'Francia tiene territorios de ultramar en varios océanos.',
    x: 52,
    y: 28,
    width: 5,
    height: 6,
  },
  {
    id: 'germany',
    name: 'Alemania',
    capital: 'Berlín',
    continent: 'Europa',
    population: '84 M',
    area: '357,022 km²',
    language: 'Alemán',
    currency: 'Euro',
    flag: '🇩🇪',
    fact: 'Alemania está formada por 16 estados federados.',
    x: 57,
    y: 27,
    width: 5,
    height: 6,
  },
  {
    id: 'uk',
    name: 'Reino Unido',
    capital: 'Londres',
    continent: 'Europa',
    population: '68 M',
    area: '243,610 km²',
    language: 'Inglés',
    currency: 'Libra esterlina',
    flag: '🇬🇧',
    fact: 'El Reino Unido está formado por cuatro países constituyentes.',
    x: 50,
    y: 23,
    width: 4,
    height: 6,
  },
  {
    id: 'italy',
    name: 'Italia',
    capital: 'Roma',
    continent: 'Europa',
    population: '59 M',
    area: '301,340 km²',
    language: 'Italiano',
    currency: 'Euro',
    flag: '🇮🇹',
    fact: 'Italia tiene forma de bota y posee numerosas islas.',
    x: 59,
    y: 34,
    width: 4,
    height: 8,
  },
  {
    id: 'egypt',
    name: 'Egipto',
    capital: 'El Cairo',
    continent: 'África',
    population: '114 M',
    area: '1,001,450 km²',
    language: 'Árabe',
    currency: 'Libra egipcia',
    flag: '🇪🇬',
    fact: 'Las pirámides de Guiza se encuentran cerca de El Cairo.',
    x: 62,
    y: 43,
    width: 6,
    height: 7,
  },
  {
    id: 'south-africa',
    name: 'Sudáfrica',
    capital: 'Pretoria',
    continent: 'África',
    population: '62 M',
    area: '1,221,037 km²',
    language: 'Varias lenguas oficiales',
    currency: 'Rand',
    flag: '🇿🇦',
    fact: 'Sudáfrica tiene tres capitales oficiales.',
    x: 61,
    y: 73,
    width: 8,
    height: 9,
  },
  {
    id: 'india',
    name: 'India',
    capital: 'Nueva Delhi',
    continent: 'Asia',
    population: '1,400 M',
    area: '3,287,263 km²',
    language: 'Hindi / Inglés y otras',
    currency: 'Rupia india',
    flag: '🇮🇳',
    fact: 'India es uno de los países más poblados del planeta.',
    x: 76,
    y: 49,
    width: 9,
    height: 13,
  },
  {
    id: 'china',
    name: 'China',
    capital: 'Pekín',
    continent: 'Asia',
    population: '1,410 M',
    area: '9,596,960 km²',
    language: 'Chino mandarín',
    currency: 'Yuan',
    flag: '🇨🇳',
    fact: 'La Gran Muralla China es una de las construcciones más famosas del mundo.',
    x: 78,
    y: 36,
    width: 15,
    height: 14,
  },
  {
    id: 'japan',
    name: 'Japón',
    capital: 'Tokio',
    continent: 'Asia',
    population: '124 M',
    area: '377,975 km²',
    language: 'Japonés',
    currency: 'Yen',
    flag: '🇯🇵',
    fact: 'Japón está formado por miles de islas.',
    x: 93,
    y: 42,
    width: 4,
    height: 8,
  },
  {
    id: 'australia',
    name: 'Australia',
    capital: 'Canberra',
    continent: 'Oceanía',
    population: '27 M',
    area: '7,688,287 km²',
    language: 'Inglés',
    currency: 'Dólar australiano',
    flag: '🇦🇺',
    fact: 'Australia es al mismo tiempo un país y un continente.',
    x: 84,
    y: 76,
    width: 15,
    height: 12,
  },
]

const CONTINENTS = ['Todos', 'América', 'Europa', 'África', 'Asia', 'Oceanía']

const GAME_LABELS: Record<GameMode, string> = {
  explore: 'Explorar',
  country: 'Adivina el país',
  flag: 'Adivina la bandera',
  find: 'Encuentra el país',
  speed: 'Contrarreloj',
}

function randomCountry(exclude?: string) {
  const available = COUNTRIES.filter((country) => country.id !== exclude)

  return available[Math.floor(Math.random() * available.length)]
}

export default function MapaMundialPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    COUNTRIES[0]
  )

  const [continent, setContinent] = useState('Todos')
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<GameMode>('explore')

  const [discovered, setDiscovered] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const [challenge, setChallenge] = useState<Country | null>(null)
  const [message, setMessage] = useState('')

  const [timeLeft, setTimeLeft] = useState(30)
  const [speedRunning, setSpeedRunning] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('toolhub-world-map')

      if (saved) {
        const data = JSON.parse(saved)

        setDiscovered(data.discovered ?? [])
        setScore(data.score ?? 0)
        setCorrect(data.correct ?? 0)
        setStreak(data.streak ?? 0)
        setBestStreak(data.bestStreak ?? 0)
      }
    } catch {
      // Datos locales opcionales.
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'toolhub-world-map',
      JSON.stringify({
        discovered,
        score,
        correct,
        streak,
        bestStreak,
      })
    )
  }, [discovered, score, correct, streak, bestStreak])

  useEffect(() => {
    if (!speedRunning) return

    if (timeLeft <= 0) {
      setSpeedRunning(false)
      setMessage('⏰ ¡Se acabó el tiempo!')
      return
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [speedRunning, timeLeft])

  const visibleCountries = useMemo(() => {
    return COUNTRIES.filter((country) => {
      const matchesContinent =
        continent === 'Todos' || country.continent === continent

      const matchesSearch =
        query.trim() === '' ||
        country.name.toLowerCase().includes(query.toLowerCase())

      return matchesContinent && matchesSearch
    })
  }, [continent, query])

  function selectCountry(country: Country) {
    setSelectedCountry(country)

    if (!discovered.includes(country.id)) {
      setDiscovered((current) => [...current, country.id])
    }

    if (mode === 'explore') return

    if (!challenge) return

    if (country.id === challenge.id) {
      const points = mode === 'speed' ? 150 : 100

      setScore((value) => value + points)
      setCorrect((value) => value + 1)

      const nextStreak = streak + 1

      setStreak(nextStreak)

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak)
      }

      setMessage(`✓ ¡Correcto! +${points} puntos`)

      setTimeout(() => {
        const next = randomCountry()

        setChallenge(next)
        setMessage('')

        if (mode === 'speed') {
          setTimeLeft(20)
        }
      }, 700)
    } else {
      setStreak(0)
      setMessage(`✕ No era ${country.name}. ¡Inténtalo otra vez!`)
    }
  }

  function startGame(nextMode: GameMode) {
    setMode(nextMode)

    const next = randomCountry()

    setChallenge(next)
    setMessage('')

    if (nextMode === 'speed') {
      setTimeLeft(30)
      setSpeedRunning(true)
    } else {
      setSpeedRunning(false)
    }
  }

  function answerFlag(countryId: string) {
    if (!challenge) return

    if (countryId === challenge.id) {
      const points = mode === 'speed' ? 150 : 100

      setScore((value) => value + points)
      setCorrect((value) => value + 1)

      const nextStreak = streak + 1
      setStreak(nextStreak)

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak)
      }

      setMessage(`✓ ¡Correcto! +${points}`)

      setTimeout(() => {
        setChallenge(randomCountry())
        setMessage('')
      }, 700)
    } else {
      setStreak(0)
      setMessage('✕ Respuesta incorrecta')
    }
  }

  function resetProgress() {
    if (!window.confirm('¿Quieres borrar todo tu progreso?')) return

    setDiscovered([])
    setScore(0)
    setCorrect(0)
    setStreak(0)
    setBestStreak(0)
    localStorage.removeItem('toolhub-world-map')
  }

  const mapCountries = visibleCountries.length ? visibleCountries : COUNTRIES

  return (
    <main
      className="min-h-screen bg-[#1c242c] text-[#e9edf1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');

        .font-display {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
        }

        .font-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        .country-shape {
          transition:
            transform 160ms ease,
            opacity 160ms ease,
            filter 160ms ease;
          transform-box: fill-box;
          transform-origin: center;
        }

        .country-shape:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }

        .country-shape.selected {
          filter: brightness(1.35);
        }
      `}</style>

      {/* HERO */}

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-20 text-center">
        <span className="font-label inline-flex rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● ToolHub / Geografía interactiva
        </span>

        <h1 className="font-display mt-6 text-5xl font-semibold uppercase tracking-tight sm:text-7xl">
          🌎 Mapa mundial
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-[#a9b4bd]">
          Explora países, aprende geografía y pon a prueba tus conocimientos.
        </p>
      </section>

      {/* SEARCH */}

      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center rounded-md border border-[#3a4753] bg-[#1c242c] px-4 py-3">
              <span className="font-label mr-3 text-[#6c7a86]">SCAN /</span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca un país..."
                className="font-label w-full bg-transparent text-sm outline-none placeholder:text-[#5c6975]"
              />

              <span>🔎</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {CONTINENTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setContinent(item)}
                  className={`font-label rounded-full border px-3 py-2 text-[10px] uppercase tracking-wider transition ${
                    continent === item
                      ? 'border-[#f2a93b] bg-[#f2a93b]/10 text-[#f2a93b]'
                      : 'border-[#3a4753] text-[#8a97a3] hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GAME MODES */}

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(GAME_LABELS) as GameMode[]).map((game) => (
            <button
              key={game}
              type="button"
              onClick={() =>
                game === 'explore' ? setMode('explore') : startGame(game)
              }
              className={`rounded-xl border p-4 text-left transition ${
                mode === game
                  ? 'border-[#f2a93b] bg-[#f2a93b]/10'
                  : 'border-[#3a4753] bg-[#20292f] hover:border-[#5a6774]'
              }`}
            >
              <span className="text-xl">
                {game === 'explore'
                  ? '🌎'
                  : game === 'country'
                    ? '🧠'
                    : game === 'flag'
                      ? '🏳️'
                      : game === 'find'
                        ? '📍'
                        : '⚡'}
              </span>

              <p className="font-display mt-2 text-sm font-semibold uppercase">
                {GAME_LABELS[game]}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* CHALLENGE */}

      {mode !== 'explore' && challenge && (
        <section className="mx-auto max-w-7xl px-6 pb-6">
          <div className="rounded-2xl border border-[#f2a93b]/40 bg-[#2a2118] p-6 text-center">
            {mode === 'flag' ? (
              <>
                <span className="text-7xl">{challenge.flag}</span>

                <h2 className="font-display mt-4 text-2xl font-semibold uppercase">
                  ¿Qué país tiene esta bandera?
                </h2>

                <div className="mx-auto mt-5 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
                  {COUNTRIES.sort(() => Math.random() - 0.5)
                    .slice(0, 4)
                    .map((country) => (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => answerFlag(country.id)}
                        className="rounded-lg border border-[#3a4753] bg-[#232d36] p-3 transition hover:border-[#f2a93b]"
                      >
                        {country.flag} {country.name}
                      </button>
                    ))}
                </div>
              </>
            ) : (
              <>
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                  {mode === 'speed'
                    ? `Contrarreloj · ${timeLeft}s`
                    : mode === 'find'
                      ? 'Encuentra en el mapa'
                      : 'Pregunta'}
                </p>

                <h2 className="font-display mt-2 text-3xl font-semibold uppercase">
                  Encuentra {challenge.name}
                </h2>
              </>
            )}

            {message && (
              <p className="font-label mt-4 text-sm text-[#f2a93b]">
                {message}
              </p>
            )}
          </div>
        </section>
      )}

      {/* MAP + INFO */}

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-10 lg:grid-cols-[1.6fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-[#3a4753] bg-[#162027] shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
          <div className="border-b border-[#3a4753] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                  Cartografía
                </p>

                <h2 className="font-display text-xl font-semibold uppercase">
                  Explora el mundo
                </h2>
              </div>

              <span className="font-label text-[10px] text-[#6c7a86]">
                {mapCountries.length} resultados
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden bg-[#10191f]">
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full"
              role="img"
              aria-label="Mapa mundial interactivo"
            >
              {/* Océanos / líneas */}

              <rect width="100" height="100" fill="#10191f" />

              {[20, 40, 60, 80].map((line) => (
                <line
                  key={`lat-${line}`}
                  x1="0"
                  y1={line}
                  x2="100"
                  y2={line}
                  stroke="#263741"
                  strokeWidth="0.25"
                />
              ))}

              {[20, 40, 60, 80].map((line) => (
                <line
                  key={`lng-${line}`}
                  x1={line}
                  y1="0"
                  x2={line}
                  y2="100"
                  stroke="#263741"
                  strokeWidth="0.25"
                />
              ))}

              {mapCountries.map((country) => {
                const isSelected = selectedCountry?.id === country.id
                const isDiscovered = discovered.includes(country.id)

                return (
                  <g
                    key={country.id}
                    className={`country-shape ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectCountry(country)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={country.x}
                      y={country.y}
                      width={country.width}
                      height={country.height}
                      rx="1"
                      fill={
                        isSelected
                          ? '#f2a93b'
                          : isDiscovered
                            ? '#4fb0a5'
                            : '#38505b'
                      }
                      stroke="#8da3ad"
                      strokeWidth="0.35"
                    />

                    {country.width >= 6 && (
                      <text
                        x={country.x + country.width / 2}
                        y={country.y + country.height / 2 + 1}
                        textAnchor="middle"
                        fontSize="1.8"
                        fill="#e9edf1"
                        pointerEvents="none"
                      >
                        {country.flag}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            <div className="absolute bottom-4 left-4 rounded-lg border border-[#3a4753] bg-[#162027]/90 px-3 py-2 backdrop-blur">
              <p className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                Leyenda
              </p>

              <div className="mt-2 flex gap-4 text-[10px]">
                <span>🟧 Seleccionado</span>
                <span>🟩 Descubierto</span>
              </div>
            </div>
          </div>
        </div>

        {/* COUNTRY PANEL */}

        <aside className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-6">
          {selectedCountry ? (
            <>
              <div className="flex items-start justify-between">
                <div className="text-6xl">{selectedCountry.flag}</div>

                <span className="font-label rounded border border-[#3a4753] px-2 py-1 text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  {selectedCountry.continent}
                </span>
              </div>

              <h2 className="font-display mt-5 text-3xl font-semibold uppercase">
                {selectedCountry.name}
              </h2>

              <p className="mt-1 text-sm text-[#8a97a3]">
                Capital: {selectedCountry.capital}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <Info label="Población" value={selectedCountry.population} />
                <Info label="Superficie" value={selectedCountry.area} />
                <Info label="Idioma" value={selectedCountry.language} />
                <Info label="Moneda" value={selectedCountry.currency} />
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-[#3a4753] bg-[#1c242c] p-4">
                <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#f2a93b]">
                  ¿Sabías que...?
                </p>

                <p className="mt-2 text-sm leading-relaxed text-[#a9b4bd]">
                  {selectedCountry.fact}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDiscovered((current) =>
                    current.includes(selectedCountry.id)
                      ? current
                      : [...current, selectedCountry.id]
                  )
                }
                className="font-label mt-5 w-full rounded-md bg-[#f2a93b] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#1c242c]"
              >
                ✓ Marcar como descubierto
              </button>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center text-center text-[#6c7a86]">
              Selecciona un país en el mapa.
            </div>
          )}
        </aside>
      </section>

      {/* STATS */}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon="🌎"
            label="Países descubiertos"
            value={`${discovered.length}/${COUNTRIES.length}`}
          />

          <Stat icon="🏆" label="Puntuación" value={score.toString()} />

          <Stat icon="🔥" label="Racha actual" value={streak.toString()} />

          <Stat icon="⚡" label="Mejor racha" value={bestStreak.toString()} />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={resetProgress}
            className="font-label text-[10px] uppercase tracking-widest text-[#6c7a86] hover:text-[#e2637a]"
          >
            Reiniciar progreso
          </button>
        </div>
      </section>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#3a4753] bg-[#1c242c] p-3">
      <p className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-[#e9edf1]">{value}</p>
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-[#3a4753] bg-[#20292f] p-5">
      <span className="text-2xl">{icon}</span>

      <p className="font-label mt-4 text-[9px] uppercase tracking-widest text-[#6c7a86]">
        {label}
      </p>

      <p className="font-display mt-1 text-2xl font-semibold uppercase text-[#f2a93b]">
        {value}
      </p>
    </div>
  )
}
