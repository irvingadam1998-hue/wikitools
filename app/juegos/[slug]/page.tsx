import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { games } from '@/lib/games'
import GuessNumber from '@/components/games/GuessNumber'
import SnakeGame from '@/components/games/SnakeGame'
import BreakoutGame from '@/components/games/BreakoutGame'
import SpaceShooterGame from '@/components/games/SpaceShooterGame'
interface GamePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }))
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { slug } = await params

  const game = games.find((item) => item.slug === slug)

  if (!game) {
    return {}
  }

  return {
    title: game.name,
    description: game.description,
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params

  const game = games.find((item) => item.slug === slug)

  if (!game) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <div className="text-6xl">{game.icon}</div>

        <h1 className="mt-5 text-4xl font-bold">{game.name}</h1>

        <p className="mt-4 text-lg text-gray-600">{game.description}</p>
      </div>

      {slug === 'snake' ? (
        <SnakeGame />
      ) : slug === 'breakout' ? (
        <BreakoutGame />
      ) : slug === 'space-shooter' ? (
        <SpaceShooterGame />
      ) : slug === 'adivina-el-numero' ? (
        <GuessNumber />
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-gray-600">
            Este juego estará disponible próximamente.
          </p>
        </div>
      )}
    </main>
  )
}
