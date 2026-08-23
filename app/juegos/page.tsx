'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { games } from '@/lib/games'

// Si tus juegos en lib/games.ts todavía no tienen "category",
// agrégala para que las secciones de abajo se llenen solas:
//   category: 'palabras' | 'retro' | 'arcade' | 'puzzle'
// Los juegos sin category caen en 'arcade' por defecto.

type Category = 'palabras' | 'retro' | 'arcade' | 'puzzle'

const CATEGORY_LABELS: Record<Category, string> = {
  palabras: '🔤 Palabras',
  retro: '👾 Retro',
  arcade: '⚡ Arcade',
  puzzle: '🧩 Puzzle',
}

const FILTERS: Array<{ id: 'todos' | Category; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: 'palabras', label: CATEGORY_LABELS.palabras },
  { id: 'retro', label: CATEGORY_LABELS.retro },
  { id: 'arcade', label: CATEGORY_LABELS.arcade },
  { id: 'puzzle', label: CATEGORY_LABELS.puzzle },
]

// Reemplaza esto por tus próximos lanzamientos reales,
// o muévelo a lib/games.ts como `upcomingGames` si prefieres.
const upcomingGames = [
  {
    name: 'Conecta 4',
    description: 'El clásico de fichas, contra la máquina o un amigo.',
    icon: '🔴',
    eta: 'Muy pronto',
  },
  {
    name: 'Buscaminas',
    description: 'Encuentra las minas antes de que te encuentren a ti.',
    icon: '💣',
    eta: 'En camino',
  },
  {
    name: 'Serpiente',
    description: 'El snake de siempre, directo desde el navegador.',
    icon: '🐍',
    eta: 'En camino',
  },
]

export default function JuegosPage() {
  const [filter, setFilter] = useState<'todos' | Category>('todos')

  const normalized = useMemo(
    () =>
      games.map((game) => ({
        ...game,
        category: (game as { category?: Category }).category ?? 'arcade',
      })),
    []
  )

  const wordGames = normalized.filter((g) => g.category === 'palabras')
  const retroGames = normalized.filter((g) => g.category === 'retro')

  const visibleGames =
    filter === 'todos'
      ? normalized
      : normalized.filter((g) => g.category === filter)

  return (
    <div
      className="bg-[#1c242c] text-[#e9edf1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Press+Start+2P&display=swap');
        .font-display { font-family: 'Oswald', 'Arial Narrow', sans-serif; }
        .font-label { font-family: 'IBM Plex Mono', monospace; }
        .font-pixel { font-family: 'Press Start 2P', monospace; }

        .marquee {
          background-image: repeating-linear-gradient(
            90deg, #f2a93b 0 18px, transparent 18px 40px
          );
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        .marquee span { animation: blink 1.4s ease-in-out infinite; }
        .marquee span:nth-child(3n) { animation-delay: 0.3s; }
        .marquee span:nth-child(5n) { animation-delay: 0.6s; }

        .scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            180deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px
          );
          pointer-events: none;
        }

        .cartridge { position: relative; }
        .cartridge::before, .cartridge::after {
          content: '';
          position: absolute;
          top: 12px;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #0f151a;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
        }
        .cartridge::before { left: 18px; }
        .cartridge::after { right: 18px; }

        @keyframes rise-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.4s ease both; }
      `}</style>

      {/* HERO estilo marquesina de arcade */}

      <section className="relative overflow-hidden">
        <div className="marquee flex justify-center gap-3 py-2">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#f2a93b]" />
          ))}
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-16 pt-14 text-center">
          <span className="font-pixel inline-block text-[10px] text-[#f2a93b]">
            INSERT COIN
          </span>

          <h1 className="font-display mt-5 text-5xl font-semibold uppercase tracking-tight sm:text-6xl">
            🎮 Sala de juegos
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-[#a9b4bd]">
            Juegos rápidos y gratuitos para pasar el rato. Sin instalar, sin
            cuentas, directo en el navegador.
          </p>
        </div>
      </section>

      {/* FILTROS por categoría */}

      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap justify-center gap-2 border-y border-[#3a4753] py-4">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`font-label rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
                filter === f.id
                  ? 'border-[#f2a93b] bg-[#f2a93b]/15 text-[#f2a93b]'
                  : 'border-[#3a4753] text-[#8a97a3] hover:border-[#5a6774] hover:text-[#e9edf1]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* JUEGOS DE PALABRAS — estante destacado */}

      {wordGames.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Estante 01
              </p>
              <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
                Juegos de palabras
              </h2>
              <p className="mt-1 text-sm text-[#a9b4bd]">
                Al estilo Wordle: una palabra, intentos limitados, un reto nuevo
                cada día.
              </p>
            </div>
          </div>

          <GameGrid gameList={wordGames} />
        </section>
      )}

      {/* RETRO — con scanlines */}

      {retroGames.length > 0 && (
        <section className="relative mt-16 overflow-hidden border-y border-[#3a4753] bg-[#171e24] py-14">
          <div className="scanlines relative mx-auto max-w-7xl px-6">
            <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
              Estante 02
            </p>
            <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
              Clásicos retro
            </h2>
            <p className="mt-1 text-sm text-[#a9b4bd]">
              Los de siempre, tal como los recuerdas.
            </p>

            <div className="mt-6">
              <GameGrid gameList={retroGames} />
            </div>
          </div>
        </section>
      )}

      {/* TODOS LOS JUEGOS (filtrable) */}

      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
            Estante general
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            {filter === 'todos'
              ? 'Todos los juegos'
              : FILTERS.find((f) => f.id === filter)?.label}
          </h2>
        </div>

        {visibleGames.length > 0 ? (
          <GameGrid gameList={visibleGames} />
        ) : (
          <p className="font-label rounded-xl border border-dashed border-[#3a4753] p-8 text-center text-sm text-[#8a97a3]">
            Todavía no hay juegos en esta categoría.
          </p>
        )}
      </section>

      {/* PRÓXIMAMENTE */}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
            En desarrollo
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            Próximamente
          </h2>
          <p className="mt-1 text-sm text-[#a9b4bd]">
            Lo que estamos armando para las próximas semanas.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingGames.map((game) => (
            <div
              key={game.name}
              className="cartridge relative overflow-hidden rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f]/60 p-6 pt-9 opacity-70"
            >
              <span className="font-pixel absolute right-3 top-3 rounded bg-[#f2a93b] px-2 py-1 text-[8px] text-[#1c242c]">
                PRÓXIMAMENTE
              </span>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#3a4753] bg-[#1c242c] text-3xl grayscale">
                {game.icon}
              </div>

              <h3 className="font-display mt-5 text-lg font-semibold uppercase tracking-tight text-[#c7d0d8]">
                {game.name}
              </h3>

              <p className="mt-2 text-sm text-[#8a97a3]">{game.description}</p>

              <p className="font-label mt-4 text-[10px] uppercase tracking-widest text-[#f2a93b]">
                {game.eta}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function GameGrid({
  gameList,
}: {
  gameList: Array<{
    slug: string
    icon: string
    name: string
    description: string
    category?: Category
  }>
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {gameList.map((game, index) => (
        <Link
          key={game.slug}
          href={`/juegos/${game.slug}`}
          className="cartridge rise-in group rounded-2xl border border-[#3a4753] bg-[#232d36] p-6 pt-9 shadow-[0_18px_28px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-[#f2a93b]/60 hover:shadow-[0_0_0_1px_rgba(242,169,59,0.3),0_18px_28px_rgba(0,0,0,0.4)]"
          style={{ animationDelay: `${index * 0.04}s` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#3a4753] bg-[#1c242c] text-3xl transition group-hover:scale-105">
              {game.icon}
            </div>

            {game.category && (
              <span className="font-label rounded border border-dashed border-[#3a4753] px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#6c7a86]">
                {CATEGORY_LABELS[game.category]}
              </span>
            )}
          </div>

          <h3 className="font-display mt-5 text-xl font-semibold uppercase tracking-tight group-hover:text-[#f2a93b]">
            {game.name}
          </h3>

          <p className="mt-2 text-sm text-[#a9b4bd]">{game.description}</p>

          <div className="mt-6 flex items-center justify-between border-t border-[#3a4753] pt-4">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#6c7a86]">
              1 jugador
            </span>

            <span className="font-label text-sm font-semibold text-[#f2a93b] transition group-hover:translate-x-1">
              Jugar →
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
