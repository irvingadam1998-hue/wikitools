'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Game = {
  slug: string
  title: string
  description: string
  icon: string
  href: string
  category: 'matematicas' | 'aprendizaje' | 'retos'
  enabled: boolean
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  color: string
}

const GAMES: Game[] = [
  {
    slug: 'sumas',
    title: 'Sumas con manzanas',
    description: 'Aprende a sumar ayudando a recoger las manzanas correctas.',
    icon: '🍎',
    href: '/ninos/matematicas/sumas',
    category: 'matematicas',
    enabled: true,
    difficulty: 'Fácil',
    color: '#e2637a',
  },
  {
    slug: 'restas',
    title: 'Restas saltando',
    description:
      'Ayuda a la rana a llegar al otro lado resolviendo las restas.',
    icon: '🐸',
    href: '/ninos/matematicas/restas',
    category: 'matematicas',
    enabled: true,
    difficulty: 'Fácil',
    color: '#7cb87f',
  },
  {
    slug: 'atrapa-numero',
    title: 'Atrapa el número',
    description:
      'Encuentra rápidamente el número correcto antes de que desaparezca.',
    icon: '🔢',
    href: '/ninos/matematicas/atrapa-numero',
    category: 'matematicas',
    enabled: false,
    difficulty: 'Medio',
    color: '#5b8dd9',
  },
  {
    slug: 'secuencias',
    title: 'Completa la secuencia',
    description: 'Descubre qué número falta y completa cada secuencia.',
    icon: '🧩',
    href: '/ninos/matematicas/secuencias',
    category: 'retos',
    enabled: false,
    difficulty: 'Medio',
    color: '#a78bd9',
  },
  {
    slug: 'multiplicaciones',
    title: 'Multiplicaciones bajo el mar',
    description: 'Sumérgete en el océano y practica las tablas de multiplicar.',
    icon: '🐠',
    href: '/ninos/matematicas/multiplicaciones',
    category: 'matematicas',
    enabled: false,
    difficulty: 'Medio',
    color: '#4fb0a5',
  },
  {
    slug: 'reto-matematico',
    title: 'Reto matemático',
    description: 'Supera desafíos matemáticos y consigue la mayor puntuación.',
    icon: '🎯',
    href: '/ninos/matematicas/reto',
    category: 'retos',
    enabled: false,
    difficulty: 'Difícil',
    color: '#f2a93b',
  },
  {
    slug: 'aprende-horas',
    title: 'Aprende las horas',
    description:
      'Aprende a leer un reloj mientras completas pequeños desafíos.',
    icon: '🕐',
    href: '/ninos/aprende-horas',
    category: 'aprendizaje',
    enabled: false,
    difficulty: 'Fácil',
    color: '#5b8dd9',
  },
  {
    slug: 'contar-dinero',
    title: 'Aprende a contar dinero',
    description: 'Aprende monedas y billetes resolviendo pequeños retos.',
    icon: '💰',
    href: '/ninos/contar-dinero',
    category: 'aprendizaje',
    enabled: false,
    difficulty: 'Medio',
    color: '#7cb87f',
  },
]

const CATEGORIES = [
  {
    id: 'todos',
    label: 'Todos',
    icon: '🌈',
  },
  {
    id: 'matematicas',
    label: 'Matemáticas',
    icon: '🔢',
  },
  {
    id: 'aprendizaje',
    label: 'Aprender',
    icon: '🧠',
  },
  {
    id: 'retos',
    label: 'Retos',
    icon: '🏆',
  },
]

const FEATURES = [
  {
    icon: '🎮',
    title: 'Aprende jugando',
    description:
      'Actividades diseñadas para que practicar no se sienta como una tarea.',
  },
  {
    icon: '⭐',
    title: 'Gana puntos',
    description:
      'Los juegos pueden incluir puntos, niveles, rachas y recompensas.',
  },
  {
    icon: '🧠',
    title: 'Entrena tu mente',
    description:
      'Practica matemáticas, memoria, lógica y habilidades cotidianas.',
  },
]

export default function NinosPage() {
  const [category, setCategory] = useState('todos')
  const [showDisabled, setShowDisabled] = useState(true)

  const enabledGames = GAMES.filter((game) => game.enabled)

  const visibleGames = useMemo(() => {
    return GAMES.filter((game) => {
      const matchesCategory = category === 'todos' || game.category === category

      const matchesStatus = showDisabled || game.enabled

      return matchesCategory && matchesStatus
    })
  }, [category, showDisabled])

  return (
    <div
      className="min-h-screen bg-[#1c242c] text-[#e9edf1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@600;700&display=swap');

        .font-display {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
        }

        .font-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        .font-hand {
          font-family: 'Caveat', cursive;
        }

        .peg-card {
          position: relative;
        }

        .peg-card::before,
        .peg-card::after {
          content: '';
          position: absolute;
          top: 14px;
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: #0f151a;
          box-shadow:
            inset 0 1px 2px rgba(0,0,0,0.6),
            0 1px 0 rgba(255,255,255,0.08);
        }

        .peg-card::before {
          left: 22px;
        }

        .peg-card::after {
          right: 22px;
        }

        @keyframes float-card {
          0%, 100% {
            transform: translateY(0) rotate(-0.5deg);
          }

          50% {
            transform: translateY(-4px) rotate(0.5deg);
          }
        }

        .game-card:hover {
          animation: float-card 1.5s ease-in-out infinite;
        }

        @keyframes rise-in {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rise-in {
          animation: rise-in 0.45s ease both;
        }
      `}</style>

      {/* HERO */}

      <section className="mx-auto max-w-5xl px-6 pb-14 pt-20 text-center">
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● TOOLHUB — ZONA INFANTIL
        </span>

        <h1 className="font-display mt-6 text-5xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-7xl">
          Aprende
          <br />
          <span className="text-[#f2a93b]">jugando.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-[#a9b4bd] sm:text-lg">
          Juegos y actividades para aprender matemáticas, lógica y cosas útiles
          mientras te diviertes.
        </p>

        {/* MINI ESTADÍSTICAS */}

        <div className="font-label mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest text-[#7c8894]">
          <span>🎮 {enabledGames.length} actividades activas</span>

          <span className="text-[#3a4753]">/</span>

          <span>⭐ sin registro</span>

          <span className="text-[#3a4753]">/</span>

          <span>🧠 aprende jugando</span>
        </div>
      </section>

      {/* ACTIVIDAD DESTACADA */}

      {enabledGames.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="relative overflow-hidden rounded-3xl border border-[#f2a93b]/40 bg-gradient-to-br from-[#30271c] to-[#232d36] p-7 shadow-[0_20px_40px_rgba(0,0,0,0.35)] sm:p-10">
            <div className="absolute -right-10 -top-10 text-[150px] opacity-10">
              {enabledGames[0].icon}
            </div>

            <div className="relative max-w-2xl">
              <span className="font-label rounded-full bg-[#f2a93b] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#1c242c]">
                ⭐ Actividad disponible
              </span>

              <h2 className="font-display mt-5 text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
                {enabledGames[0].icon} {enabledGames[0].title}
              </h2>

              <p className="mt-3 text-[#a9b4bd]">
                {enabledGames[0].description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={enabledGames[0].href}
                  className="font-label rounded-md bg-[#f2a93b] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1c242c] transition hover:bg-[#ffbc55]"
                >
                  Jugar ahora →
                </Link>

                <span className="font-label rounded-md border border-[#3a4753] px-4 py-3 text-[10px] uppercase tracking-widest text-[#8a97a3]">
                  Nivel: {enabledGames[0].difficulty}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTROS */}

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="flex flex-col gap-5 border-y border-[#3a4753] py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
              Zona de actividades
            </p>

            <h2 className="font-display mt-1 text-2xl font-semibold uppercase">
              Elige una aventura
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`font-label rounded-full border px-4 py-2 text-[10px] uppercase tracking-widest transition ${
                  category === item.id
                    ? 'border-[#f2a93b] bg-[#f2a93b]/15 text-[#f2a93b]'
                    : 'border-[#3a4753] text-[#8a97a3] hover:border-[#5a6774] hover:text-[#e9edf1]'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID DE JUEGOS */}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleGames.map((game, index) => {
            if (!game.enabled) {
              return (
                <div
                  key={game.slug}
                  className="relative overflow-hidden rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f]/60 p-6 opacity-60"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <span className="font-label absolute right-3 top-3 rounded bg-[#3a4753] px-2 py-1 text-[8px] uppercase tracking-widest text-[#a9b4bd]">
                    Próximamente
                  </span>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#3a4753] bg-[#1c242c] text-4xl grayscale">
                    {game.icon}
                  </div>

                  <h3 className="font-display mt-5 text-lg font-semibold uppercase">
                    {game.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#8a97a3]">
                    {game.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-dashed border-[#3a4753] pt-4">
                    <span className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                      {game.difficulty}
                    </span>

                    <span className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                      🔒 Bloqueado
                    </span>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={game.slug}
                href={game.href}
                className="game-card rise-in group relative overflow-hidden rounded-2xl border border-[#3a4753] bg-[#232d36] p-6 shadow-[0_14px_25px_rgba(0,0,0,0.25)] transition hover:border-[#f2a93b]/60 hover:shadow-[0_20px_35px_rgba(0,0,0,0.35)]"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {/* DECORACIÓN */}

                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10"
                  style={{
                    backgroundColor: game.color,
                  }}
                />

                {/* ESTADO */}

                <span className="font-label absolute right-3 top-3 rounded bg-[#7cb87f]/20 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-[#7cb87f]">
                  ✓ Disponible
                </span>

                {/* ICONO */}

                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl border text-4xl transition duration-200 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    borderColor: `${game.color}66`,
                    backgroundColor: `${game.color}12`,
                  }}
                >
                  {game.icon}
                </div>

                {/* INFORMACIÓN */}

                <h3 className="font-display mt-5 text-lg font-semibold uppercase tracking-tight">
                  {game.title}
                </h3>

                <p className="mt-2 min-h-[48px] text-sm text-[#a9b4bd]">
                  {game.description}
                </p>

                {/* NIVEL */}

                <div className="mt-5 flex items-center justify-between border-t border-[#3a4753] pt-4">
                  <span className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                    Nivel: {game.difficulty}
                  </span>

                  <span className="font-label text-xs font-bold text-[#f2a93b] transition group-hover:translate-x-1">
                    Jugar →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {visibleGames.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-[#3a4753] bg-[#20292f]/60 p-12 text-center">
            <div className="text-5xl">🧸</div>

            <h2 className="font-display mt-5 text-2xl font-semibold uppercase">
              Todavía no hay actividades aquí
            </h2>

            <p className="mt-2 text-sm text-[#8a97a3]">
              Prueba otra categoría.
            </p>
          </div>
        )}
      </section>

      {/* PRÓXIMAMENTE */}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
            Ficha técnica
          </p>

          <h2 className="font-display mt-1 text-2xl font-semibold uppercase sm:text-3xl">
            ¿Qué podemos aprender?
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="peg-card rounded-2xl border border-[#3a4753] bg-[#232d36] p-6 pt-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#3a4753] bg-[#1c242c] text-2xl">
                {feature.icon}
              </div>

              <h3 className="font-display mt-5 text-lg font-semibold uppercase">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm text-[#a9b4bd]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOQUE PARA PADRES */}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f] p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Para familias
              </span>

              <h2 className="font-display mt-2 text-2xl font-semibold uppercase">
                Aprender sin presión
              </h2>

              <p className="mt-2 max-w-xl text-sm text-[#8a97a3]">
                Las actividades están pensadas para practicar habilidades
                básicas de una manera sencilla, visual y divertida.
              </p>
            </div>

            <div className="text-5xl">👨‍👩‍👧‍👦</div>
          </div>
        </div>
      </section>

      {/* CONTROL DE DESARROLLO */}

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                Vista de desarrollo
              </p>

              <p className="mt-1 text-xs text-[#8a97a3]">
                Puedes ocultar las actividades que todavía están en desarrollo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDisabled((current) => !current)}
              className="font-label rounded-md border border-[#3a4753] px-4 py-2 text-[9px] uppercase tracking-widest text-[#8a97a3] transition hover:border-[#f2a93b]/60 hover:text-[#f2a93b]"
            >
              {showDisabled ? 'Ocultar próximamente' : 'Mostrar próximamente'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
