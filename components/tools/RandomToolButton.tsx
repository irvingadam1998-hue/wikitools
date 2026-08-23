'use client'

import { useRouter } from 'next/navigation'

export default function RandomToolButton({ slugs }: { slugs: string[] }) {
  const router = useRouter()

  function goRandom() {
    if (slugs.length === 0) return

    const pick = slugs[Math.floor(Math.random() * slugs.length)]

    router.push(`/herramientas/${pick}`)
  }

  return (
    <button
      type="button"
      onClick={goRandom}
      className="font-label group inline-flex items-center gap-2 rounded-full border border-[#3a4753] bg-[#232d36] px-5 py-2.5 text-xs uppercase tracking-widest text-[#e9edf1] transition hover:border-[#f2a93b] hover:text-[#f2a93b]"
    >
      <span className="inline-block transition group-hover:rotate-180">🎲</span>
      Herramienta al azar
    </button>
  )
}
