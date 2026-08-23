import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tools } from '@/lib/tools'
import PercentageCalculator from '@/components/tools/PercentageCalculator'

interface ToolPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }))
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params

  const tool = tools.find((item) => item.slug === slug)

  if (!tool) {
    return {}
  }

  return {
    title: tool.name,
    description: tool.description,
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params

  const tool = tools.find((item) => item.slug === slug)

  if (!tool) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <header className="max-w-3xl">
        <div className="text-5xl">{tool.icon}</div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          {tool.name}
        </h1>

        <p className="mt-4 text-lg text-gray-600">{tool.description}</p>
      </header>

      <div className="mt-10">
        {slug === 'calculadora-porcentajes' ? (
          <PercentageCalculator />
        ) : (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <p className="text-gray-600">
              Esta herramienta estará disponible próximamente.
            </p>
          </div>
        )}
      </div>

      <section className="prose mt-16 max-w-none">
        <h2>¿Cómo calcular porcentajes?</h2>

        <p>
          Los porcentajes permiten expresar una cantidad como una parte de 100.
          Son útiles para calcular descuentos, aumentos, proporciones y
          diferencias entre valores.
        </p>

        <h3>Ejemplo</h3>

        <p>
          Para calcular el 20% de 150, multiplicamos 150 por 20 y dividimos el
          resultado entre 100.
        </p>

        <p>
          Puedes utilizar la calculadora de arriba para realizar estos cálculos
          automáticamente.
        </p>
      </section>
    </article>
  )
}
