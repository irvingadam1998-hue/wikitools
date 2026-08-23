import Link from 'next/link'

const categories = [
  {
    title: 'Herramientas',
    description: 'Calculadoras, conversores, generadores y mucho más.',
    href: '/herramientas',
    icon: '🧰',
    ref: '04-A',
    count: '86 herramientas',
  },
  {
    title: 'Estudiantes',
    description: 'Recursos para estudiar, organizarse y aprender.',
    href: '/estudiantes',
    icon: '📚',
    ref: '12-B',
    count: '34 recursos',
  },
  {
    title: 'Juegos',
    description: 'Juegos rápidos para pasar el rato.',
    href: '/juegos',
    icon: '🎮',
    ref: '07-C',
    count: '19 juegos',
  },
  {
    title: 'Niños',
    description:
      'Juegos educativos, actividades y herramientas para aprender jugando.',
    href: '/ninos',
    icon: '🧒',
    ref: '15-D',
    count: '25 recursos',
  },
]

const popularTools = [
  {
    name: 'Calculadora de propinas',
    href: '/herramientas/propinas',
    icon: '💵',
    rank: 1,
  },
  {
    name: 'Conversor de unidades',
    href: '/herramientas/conversor',
    icon: '📏',
    rank: 2,
  },
  {
    name: 'Generador de contraseñas',
    href: '/herramientas/contrasenas',
    icon: '🔐',
    rank: 3,
  },
  {
    name: 'Temporizador Pomodoro',
    href: '/estudiantes/pomodoro',
    icon: '⏱️',
    rank: 4,
  },
  {
    name: 'Calculadora de IMC',
    href: '/herramientas/imc',
    icon: '⚖️',
    rank: 5,
  },
  {
    name: 'Generador de códigos QR',
    href: '/herramientas/qr',
    icon: '🔳',
    rank: 6,
  },
  {
    name: 'Contador de palabras',
    href: '/herramientas/contador-palabras',
    icon: '📝',
    rank: 7,
  },
  {
    name: 'Citas en formato APA',
    href: '/estudiantes/apa',
    icon: '🎓',
    rank: 8,
  },
]

const valueProps = [
  {
    label: 'REF. 100% GRATIS',
    title: 'Sin costo, sin letra chica',
    description:
      'Todas las herramientas están disponibles sin pagos ni versiones limitadas.',
  },
  {
    label: 'REF. SIN CUENTA',
    title: 'Entra y úsalo, ya',
    description:
      'No pedimos registro. Abres la herramienta y la usas al instante.',
  },
  {
    label: 'REF. LIVIANO',
    title: 'Carga rápido en cualquier equipo',
    description:
      'Pensado para funcionar bien incluso con conexión lenta o celulares viejos.',
  },
]

export default function HomePage() {
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
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        .font-display { font-family: 'Oswald', 'Arial Narrow', sans-serif; }
        .font-label { font-family: 'IBM Plex Mono', monospace; }

        .peg-card { position: relative; }
        .peg-card::before,
        .peg-card::after {
          content: '';
          position: absolute;
          top: 14px;
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: #0f151a;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08);
        }
        .peg-card::before { left: 22px; }
        .peg-card::after { right: 22px; }

        @keyframes sway {
          0%, 100% { transform: rotate(-0.6deg); }
          50% { transform: rotate(0.6deg); }
        }
        .peg-card { transform-origin: top center; }
        .peg-card:hover { animation: sway 1.6s ease-in-out infinite; }

        @keyframes rise-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.5s ease both; }
      `}</style>

      {/* HERO */}

      <section className="mx-auto max-w-5xl px-6 pb-14 pt-24 text-center">
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● TOOLHUB — CAJA DE HERRAMIENTAS
        </span>

        <h1 className="font-display mt-6 text-5xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-7xl">
          Todo lo que necesitas
          <br />
          cuelga aquí.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-[#a9b4bd] sm:text-lg">
          Herramientas útiles, recursos para estudiantes y juegos gratuitos. Sin
          cuentas, sin descargas.
        </p>

        <div className="mx-auto mt-9 max-w-xl">
          <div className="flex items-center rounded-md border border-[#3a4753] bg-[#232d36] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <span className="font-label mr-3 text-[#6c7a86]">SCAN /</span>

            <input
              type="search"
              placeholder="Busca una herramienta..."
              className="font-label w-full bg-transparent text-sm text-[#e9edf1] outline-none placeholder:text-[#5c6975]"
            />

            <span className="ml-2 text-lg">🔎</span>
          </div>
        </div>

        <div className="font-label mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest text-[#7c8894]">
          <span>139+ herramientas</span>
          <span className="text-[#3a4753]">/</span>
          <span>100% gratis</span>
          <span className="text-[#3a4753]">/</span>
          <span>sin registro</span>
        </div>
      </section>

      {/* CATEGORÍAS — pegboard */}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
              Pasillo 01
            </p>
            <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
              Categorías
            </h2>
          </div>
        </div>

        <div className="grid gap-8 pt-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="peg-card group rounded-2xl border border-[#3a4753] bg-[#232d36] p-7 pt-9 shadow-[0_18px_28px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#f2a93b]/60"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#3a4753] bg-[#1c242c] text-3xl">
                  {category.icon}
                </div>

                <span className="font-label rounded border border-dashed border-[#3a4753] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#6c7a86]">
                  {category.ref}
                </span>
              </div>

              <h3 className="font-display mt-6 text-xl font-semibold uppercase tracking-tight">
                {category.title}
              </h3>

              <p className="mt-2 text-sm text-[#a9b4bd]">
                {category.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-[#3a4753] pt-4">
                <span className="font-label text-[11px] uppercase tracking-widest text-[#6c7a86]">
                  {category.count}
                </span>

                <span className="font-label text-sm font-semibold text-[#f2a93b] transition group-hover:translate-x-1">
                  Explorar →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MÁS POPULARES */}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
            Pasillo 02
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            Estante de los más usados
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rise-in group relative flex items-center gap-3 rounded-lg border border-[#3a4753] bg-[#232d36] px-4 py-3 transition hover:-translate-y-0.5 hover:border-[#f2a93b]/50"
            >
              <span className="font-label absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f2a93b] text-[10px] font-bold text-[#1c242c]">
                {tool.rank}
              </span>

              <span className="text-xl">{tool.icon}</span>

              <span className="text-sm font-medium text-[#e9edf1]">
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* POR QUÉ TOOLHUB */}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
            Ficha técnica
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            Por qué usar ToolHub
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {valueProps.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-dashed border-[#3a4753] bg-[#20292f] p-6"
            >
              <span className="font-label text-[10px] uppercase tracking-widest text-[#f2a93b]">
                {item.label}
              </span>

              <h3 className="font-display mt-3 text-lg font-semibold uppercase tracking-tight">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-[#a9b4bd]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-[#f2a93b]/40 bg-gradient-to-br from-[#2a2118] to-[#232d36] px-6 py-12 text-center">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            ¿No encuentras lo que buscas?
          </h2>

          <p className="max-w-md text-sm text-[#a9b4bd]">
            Explora todas las categorías o dinos qué herramienta te gustaría ver
            en ToolHub.
          </p>

          <Link
            href="/herramientas"
            className="font-label rounded-md bg-[#f2a93b] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#1c242c] transition hover:bg-[#ffbc55]"
          >
            Ver todas las herramientas
          </Link>
        </div>
      </section>
    </div>
  )
}
