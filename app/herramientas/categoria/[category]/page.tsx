import { notFound } from 'next/navigation'
import ToolCard from '@/components/tools/ToolCard'
import { tools } from '@/lib/tools'
import { categories } from '@/lib/categories'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params

  const currentCategory = categories.find((item) => item.slug === category)

  if (!currentCategory) {
    return {}
  }

  return {
    title: currentCategory.name,
    description: currentCategory.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  const currentCategory = categories.find((item) => item.slug === category)

  if (!currentCategory) {
    notFound()
  }

  const categoryTools = tools.filter((tool) => tool.category === category)

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <div className="text-5xl">{currentCategory.icon}</div>

        <h1 className="mt-5 text-4xl font-bold">{currentCategory.name}</h1>

        <p className="mt-4 text-lg text-gray-600">
          {currentCategory.description}
        </p>
      </div>

      {categoryTools.length > 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed p-12 text-center">
          <p className="text-gray-600">
            Todavía estamos preparando herramientas para esta categoría.
          </p>
        </div>
      )}
    </div>
  )
}
