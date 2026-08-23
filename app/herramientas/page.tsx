import Link from 'next/link'
import ToolCard from '@/components/tools/ToolCard'
import RandomToolButton from '@/components/tools/RandomToolButton'
import { tools } from '@/lib/tools'
import { categories } from '@/lib/categories'

interface ToolsPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export const metadata = {
  title: 'Herramientas online',
  description:
    'Calculadoras, conversores, generadores y otras herramientas online gratuitas.',
}

// Paleta de "cajones de colores" — cada categoría/herramienta
// recibe un color por hash, así el grid se ve vivo y variado
// sin depender de que cada tool tenga un color asignado a mano.
const BIN_COLORS = [
  '#f2a93b', // naranja
  '#4fb0a5', // turquesa
  '#5b8dd9', // azul
  '#e2637a', // coral
  '#7cb87f', // verde
  '#a78bd9', // violeta
  '#d9c25b', // mostaza
]

function colorFor(key: string) {
  const sum = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return BIN_COLORS[sum % BIN_COLORS.length]
}

function dayOfYear() {
  const now = new Date()

  const start = new Date(now.getFullYear(), 0, 0)

  const diff = now.getTime() - start.getTime()

  return Math.floor(diff / 86_400_000)
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams
  const query = params.q?.trim().toLowerCase() ?? ''

  const filteredTools = query
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      )
    : tools

  const featured = tools.length > 0 ? tools[dayOfYear() % tools.length] : null

  const tickerItems = [...tools, ...tools].slice(0, 40)

  return (
    <div
      className="overflow-hidden bg-[#1c242c] text-[#e9edf1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        .font-display { font-family: 'Oswald', 'Arial Narrow', sans-serif; }
        .font-label { font-family: 'IBM Plex Mono', monospace; }

        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 38s linear infinite;
        }
        .ticker-wrap:hover .ticker-track {
          animation-play-state: paused;
        }

        @keyframes rise-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.4s ease both; }

        .bin-card { position: relative; overflow: hidden; }
        .bin-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--bin-color);
        }
      `}</style>

      {/* TICKER de variedad */}

      <div className="ticker-wrap border-b border-[#3a4753] bg-[#171e24] py-2">
        <div className="ticker-track flex w-max gap-8 whitespace-nowrap">
          {tickerItems.map((tool, i) => (
            <span
              key={`${tool.slug}-${i}`}
              className="font-label flex items-center gap-2 text-xs uppercase tracking-widest text-[#6c7a86]"
            >
              <span style={{ color: colorFor(tool.slug) }}>●</span>
              {tool.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* HEADER */}

        <div className="max-w-3xl">
          <span className="font-label inline-flex items-center gap-2 rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
            ● {tools.length}+ herramientas · toda la variedad
          </span>

          <h1 className="font-display mt-5 text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
            Herramientas online
          </h1>

          <p className="mt-4 text-lg text-[#a9b4bd]">
            Calculadoras, conversores, generadores y utilidades gratuitas. Un
            cajón para cada necesidad.
          </p>
        </div>

        {/* BUSCADOR + AL AZAR */}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            action="/herramientas"
            method="GET"
            className="max-w-2xl flex-1"
          >
            <div className="flex items-center rounded-md border border-[#3a4753] bg-[#232d36] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <span className="font-label pl-4 text-sm text-[#6c7a86]">
                SCAN /
              </span>

              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Buscar una herramienta..."
                className="font-label min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-[#e9edf1] outline-none placeholder:text-[#5c6975]"
              />

              <button
                type="submit"
                className="font-label m-1.5 rounded bg-[#f2a93b] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#1c242c] transition hover:bg-[#ffbc55]"
              >
                Buscar
              </button>
            </div>
          </form>

          <RandomToolButton slugs={tools.map((t) => t.slug)} />
        </div>

        {/* CATEGORÍAS a color */}

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/herramientas"
            className="font-label rounded-full border border-[#f2a93b] bg-[#f2a93b]/15 px-4 py-2 text-xs uppercase tracking-widest text-[#f2a93b]"
          >
            Todas
          </Link>

          {categories.map((category) => {
            const color = colorFor(category.slug)

            return (
              <Link
                key={category.slug}
                href={`/herramientas/categoria/${category.slug}`}
                style={{ borderColor: `${color}55`, color }}
                className="font-label rounded-full border bg-white/[0.02] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-white/[0.06]"
              >
                {category.icon} {category.name}
              </Link>
            )
          })}
        </div>

        {/* DESTACADA DEL DÍA */}

        {!query && featured && (
          <div className="mt-12">
            <p className="font-label mb-3 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
              Herramienta destacada de hoy
            </p>

            <Link
              href={`/herramientas/${featured.slug}`}
              className="bin-card group flex flex-col items-start gap-5 rounded-2xl border border-[#3a4753] bg-[#232d36] p-7 transition hover:-translate-y-1 hover:border-[#f2a93b]/60 sm:flex-row sm:items-center"
              style={{ ['--bin-color' as string]: colorFor(featured.slug) }}
            >
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-4xl"
                style={{
                  backgroundColor: `${colorFor(featured.slug)}22`,
                }}
              >
                {featured.icon}
              </div>

              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-tight group-hover:text-[#f2a93b]">
                  {featured.name}
                </h2>
                <p className="mt-1 text-sm text-[#a9b4bd]">
                  {featured.description}
                </p>
              </div>

              <span className="font-label shrink-0 text-sm font-semibold text-[#f2a93b] transition group-hover:translate-x-1">
                Probarla →
              </span>
            </Link>
          </div>
        )}

        {/* RESULTADOS */}

        <div className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#3a4753] pt-6">
            <p className="font-label text-[11px] uppercase tracking-widest text-[#6c7a86]">
              {query ? (
                <>
                  Resultados para{' '}
                  <span className="text-[#f2a93b]">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                'Inventario completo'
              )}
            </p>

            <p className="font-label text-[11px] uppercase tracking-widest text-[#6c7a86]">
              {filteredTools.length}{' '}
              {filteredTools.length === 1 ? 'herramienta' : 'herramientas'}
            </p>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool, index) => (
                <div
                  key={tool.slug}
                  className="bin-card rise-in rounded-2xl"
                  style={{
                    ['--bin-color' as string]: colorFor(tool.slug),
                    animationDelay: `${index * 0.03}s`,
                  }}
                >
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[#3a4753] bg-[#232d36]/60 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[#f2a93b]/50 text-3xl">
                🔎
              </div>

              <h2 className="font-display mt-5 text-xl font-semibold uppercase tracking-tight">
                No encontramos esa herramienta
              </h2>

              <p className="mt-2 text-[#a9b4bd]">
                Prueba con otro término de búsqueda o revisa las categorías de
                arriba.
              </p>

              <Link
                href="/herramientas"
                className="font-label mt-6 inline-block rounded-full border border-[#f2a93b] px-5 py-2 text-xs uppercase tracking-widest text-[#f2a93b] transition hover:bg-[#f2a93b]/10"
              >
                Ver todo el inventario
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
