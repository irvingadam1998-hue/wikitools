import type { Metadata } from 'next'

import WordDaily from '@/components/daily/WordDaily'
import { getDailyNumber, getDailyWord } from '@/lib/daily/words'

export const metadata: Metadata = {
  title: 'Palabra Daily',
  description: 'Descubre la palabra diaria. Un nuevo reto cada día.',
}

export const dynamic = 'force-dynamic'

export default function WordDailyPage() {
  const dailyNumber = getDailyNumber()

  const solution = getDailyWord()

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <WordDaily solution={solution} dailyNumber={dailyNumber} />
    </main>
  )
}
