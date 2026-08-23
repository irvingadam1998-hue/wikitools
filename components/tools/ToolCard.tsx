import Link from 'next/link'
import type { Tool } from '@/lib/tools'

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/herramientas/${tool.slug}`}
      className="group rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="text-3xl">{tool.icon}</div>

      <h2 className="mt-4 font-semibold group-hover:underline">{tool.name}</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">{tool.description}</p>
    </Link>
  )
}
