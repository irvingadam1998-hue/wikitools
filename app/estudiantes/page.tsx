'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

// TODO: cuando tengas datos reales, mueve esto a algo como
// lib/students.ts y reemplaza el array de abajo por el import,
// igual que ya haces con `tools` y `games`.

interface Resource {
  slug: string
  name: string
  description: string
  icon: string
  category:
    | 'organizacion'
    | 'escritura'
    | 'matematicas'
    | 'examenes'
    | 'motivacion'
    | 'ciencias'
}

const CATEGORY_LABELS: Record<Resource['category'], string> = {
  organizacion: '🗂️ Organización',
  escritura: '✍️ Escritura',
  matematicas: '➗ Matemáticas',
  examenes: '📝 Exámenes',
  motivacion: '💡 Motivación',
  ciencias: '🧪 Ciencias',
}

const resources: Resource[] = [
  {
    slug: 'pomodoro',
    name: 'Temporizador Pomodoro',
    description:
      'Bloques de estudio de 25 minutos con descansos cronometrados.',
    icon: '⏱️',
    category: 'organizacion',
  },
  {
    slug: 'horario-semanal',
    name: 'Generador de horario semanal',
    description:
      'Arma tu horario de clases y estudio en una cuadrícula visual.',
    icon: '🗓️',
    category: 'organizacion',
  },
  {
    slug: 'citas-apa',
    name: 'Generador de citas APA',
    description: 'Da formato a tus referencias bibliográficas en segundos.',
    icon: '🎓',
    category: 'escritura',
  },
  {
    slug: 'contador-palabras',
    name: 'Contador de palabras y caracteres',
    description: 'Controla la extensión de tus ensayos y trabajos.',
    icon: '📝',
    category: 'escritura',
  },
  {
    slug: 'calculadora-promedio',
    name: 'Calculadora de promedio',
    description: 'Calcula tu promedio ponderado por créditos o materias.',
    icon: '📊',
    category: 'matematicas',
  },
  {
    slug: 'conversor-fracciones',
    name: 'Conversor de fracciones a decimales',
    description:
      'Convierte entre fracciones, decimales y porcentajes al vuelo.',
    icon: '➗',
    category: 'matematicas',
  },
  {
    slug: 'fichas-repaso',
    name: 'Generador de fichas de repaso',
    description: 'Crea flashcards de pregunta y respuesta para memorizar.',
    icon: '🗂️',
    category: 'examenes',
  },
  {
    slug: 'cuenta-regresiva-examen',
    name: 'Cuenta regresiva para exámenes',
    description: 'Guarda tus fechas de examen y mira cuánto falta.',
    icon: '📅',
    category: 'examenes',
  },
  {
    slug: 'frase-del-dia',
    name: 'Frase de motivación diaria',
    description: 'Un recordatorio corto para arrancar la sesión de estudio.',
    icon: '💡',
    category: 'motivacion',
  },
  {
    slug: 'tabla-periodica',
    name: 'Tabla periódica interactiva',
    description:
      'Explora los 118 elementos, descubre sus propiedades, juega y pon a prueba tus conocimientos.',
    icon: '🧪',
    category: 'ciencias',
  },
]

const studyTips = [
  'Técnica Pomodoro: estudia 25 minutos, descansa 5. Cada 4 bloques, un descanso largo de 20-30 minutos.',
  'Recuperación activa: en vez de releer el material, cierra el libro e intenta recordarlo desde cero.',
  'Repetición espaciada: repasa un tema al día siguiente, luego a la semana, luego al mes. Se te queda para siempre.',
  'La regla de los dos minutos: si una tarea toma menos de 2 minutos (anotar una fecha, enviar un correo), hazla ya.',
  'Enseña lo que aprendiste a alguien más, aunque sea en voz alta y solo. Si no puedes explicarlo, no lo entendiste del todo.',
  'Cambia de lugar de estudio de vez en cuando. Ayuda a que el cerebro no asocie el conocimiento a un solo contexto.',
]

const upcomingResources = [
  {
    name: 'Generador de mapas mentales',
    description: 'Organiza ideas y conceptos en un mapa visual exportable.',
    icon: '🧠',
    eta: 'Muy pronto',
  },
  {
    name: 'Modo enfoque con sonido ambiente',
    description: 'Ruido blanco, lluvia o café de fondo mientras estudias.',
    icon: '🎧',
    eta: 'En camino',
  },
  {
    name: 'Seguimiento de hábitos de estudio',
    description: 'Marca tus sesiones diarias y arma tu propia racha.',
    icon: '🔥',
    eta: 'En camino',
  },
]

const FILTERS: Array<{ id: 'todos' | Resource['category']; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: 'organizacion', label: CATEGORY_LABELS.organizacion },
  { id: 'escritura', label: CATEGORY_LABELS.escritura },
  { id: 'matematicas', label: CATEGORY_LABELS.matematicas },
  { id: 'examenes', label: CATEGORY_LABELS.examenes },
  { id: 'motivacion', label: CATEGORY_LABELS.motivacion },
]

const BIN_COLORS = [
  '#f2a93b',
  '#4fb0a5',
  '#5b8dd9',
  '#e2637a',
  '#7cb87f',
  '#a78bd9',
  '#d9c25b',
]

function colorFor(key: string) {
  const sum = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return BIN_COLORS[sum % BIN_COLORS.length]
}

function dayOfYear() {
  const now = new Date()

  const start = new Date(now.getFullYear(), 0, 0)

  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

const CARD_TILT = [-1.5, 1, -1, 1.8, -2, 1.2, -1.2, 2, -1]

export default function EstudiantesPage() {
  const [filter, setFilter] = useState<'todos' | Resource['category']>('todos')
  const [query, setQuery] = useState('')

  const tipOfTheDay = studyTips[dayOfYear() % studyTips.length]

  const visibleResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = filter === 'todos' || resource.category === filter

      const matchesQuery =
        query.trim() === '' ||
        resource.name.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase())

      return matchesCategory && matchesQuery
    })
  }, [filter, query])

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
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@600;700&display=swap');
        .font-display { font-family: 'Oswald', 'Arial Narrow', sans-serif; }
        .font-label { font-family: 'IBM Plex Mono', monospace; }
        .font-hand { font-family: 'Caveat', cursive; }

        .cork {
          background-color: #7a5c3e;
          background-image:
            radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1.4px),
            radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.4px);
          background-size: 9px 9px, 13px 13px;
          background-position: 0 0, 4px 6px;
        }

        .pin::before {
          content: '';
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: var(--pin-color, #e2637a);
          box-shadow: 0 2px 3px rgba(0,0,0,0.45), inset 0 -2px 2px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.4);
        }

        @keyframes rise-in {
          0% { opacity: 0; transform: translateY(10px) rotate(var(--tilt, 0deg)); }
          100% { opacity: 1; transform: translateY(0) rotate(var(--tilt, 0deg)); }
        }
        .rise-in { animation: rise-in 0.4s ease both; }
      `}</style>

      {/* HERO */}

      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 text-center">
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● Tablón de estudiantes
        </span>

        <h1 className="font-display mt-6 text-5xl font-semibold uppercase tracking-tight sm:text-6xl">
          🎒 Estudiantes
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9b4bd]">
          Recursos para estudiar, organizarte y llegar al examen sin entrar en
          pánico.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <div className="flex items-center rounded-md border border-[#3a4753] bg-[#232d36] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <span className="font-label mr-3 text-[#6c7a86]">SCAN /</span>

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca un recurso para estudiar..."
              className="font-label w-full bg-transparent text-sm text-[#e9edf1] outline-none placeholder:text-[#5c6975]"
            />

            <span className="ml-2 text-lg">🔎</span>
          </div>
        </div>
      </section>

      {/* CONSEJO DEL DÍA — tarjeta pineada destacada */}

      <section className="mx-auto max-w-3xl px-6 pb-4">
        <div
          className="relative mx-auto max-w-xl rounded-lg border border-[#c9a876]/30 bg-[#f4e9c8] p-6 text-center shadow-[0_14px_24px_rgba(0,0,0,0.35)]"
          style={{
            transform: 'rotate(-1.2deg)',
            ['--pin-color' as string]: '#e2637a',
          }}
        >
          <span className="pin absolute inset-0" />

          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#8a6a4a]">
            Consejo del día
          </p>

          <p className="font-hand mt-2 text-2xl leading-snug text-[#3a2c1a]">
            {tipOfTheDay}
          </p>
        </div>
      </section>

      {/* FILTROS */}

      <section className="mx-auto max-w-7xl px-6 pt-8">
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

      {/* TABLÓN DE CORCHO con recursos pineados */}

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-label mb-6 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
            {visibleResources.length}{' '}
            {visibleResources.length === 1 ? 'recurso' : 'recursos'} pineados
          </p>

          {visibleResources.length > 0 ? (
            <div className="cork grid gap-8 rounded-2xl border border-[#3a2c1a]/40 p-8 shadow-[inset_0_2px_18px_rgba(0,0,0,0.35)] sm:grid-cols-2 lg:grid-cols-3">
              {visibleResources.map((resource, index) => {
                const tilt = CARD_TILT[index % CARD_TILT.length]
                const color = colorFor(resource.slug)

                return (
                  <Link
                    key={resource.slug}
                    href={`/estudiantes/${resource.slug}`}
                    className="pin rise-in group relative rounded-md border border-[#e5dcc3] bg-[#faf6ea] p-5 text-[#2c2418] shadow-[0_10px_18px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:shadow-[0_16px_24px_rgba(0,0,0,0.4)]"
                    style={
                      {
                        '--tilt': `${tilt}deg`,
                        '--pin-color': color,
                        transform: `rotate(${tilt}deg)`,
                        animationDelay: `${index * 0.04}s`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{resource.icon}</span>

                      <span
                        className="font-label rounded px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#2c2418]"
                        style={{ backgroundColor: `${color}55` }}
                      >
                        {CATEGORY_LABELS[resource.category].split(' ')[0]}
                      </span>
                    </div>

                    <h3 className="font-display mt-4 text-lg font-semibold uppercase tracking-tight">
                      {resource.name}
                    </h3>

                    <p className="mt-2 text-sm text-[#5a4d3a]">
                      {resource.description}
                    </p>

                    <div className="mt-5 border-t border-dashed border-[#c9bc9c] pt-3">
                      <span className="font-label text-xs font-semibold text-[#8a5a2e] transition group-hover:translate-x-1">
                        Abrir →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[#3a4753] bg-[#232d36]/60 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[#f2a93b]/50 text-3xl">
                📌
              </div>

              <h2 className="font-display mt-5 text-xl font-semibold uppercase tracking-tight">
                Nada por aquí todavía
              </h2>

              <p className="mt-2 text-[#a9b4bd]">
                Prueba con otro término o revisa otra categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PRÓXIMAMENTE */}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          En desarrollo
        </p>
        <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
          Próximamente
        </h2>
        <p className="mt-1 text-sm text-[#a9b4bd]">
          Lo que se viene para hacer más fácil estudiar aquí.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingResources.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f]/60 p-6 opacity-70"
            >
              <span className="font-label absolute right-3 top-3 rounded bg-[#f2a93b] px-2 py-1 text-[9px] uppercase tracking-widest text-[#1c242c]">
                {item.eta}
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#3a4753] bg-[#1c242c] text-2xl grayscale">
                {item.icon}
              </div>

              <h3 className="font-display mt-4 text-base font-semibold uppercase tracking-tight text-[#c7d0d8]">
                {item.name}
              </h3>

              <p className="mt-2 text-sm text-[#8a97a3]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
