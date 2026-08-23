export interface Game {
  slug: string
  name: string
  description: string
  icon: string
}

export const games: Game[] = [
  {
    slug: 'tres-en-raya',
    name: 'Tres en raya',
    description: 'Juega una partida clásica de tres en raya.',
    icon: '❌',
  },
  {
    slug: 'memoria',
    name: 'Juego de memoria',
    description: 'Encuentra las parejas de cartas.',
    icon: '🧠',
  },
  {
    slug: 'adivina-el-numero',
    name: 'Adivina el número',
    description: 'Intenta descubrir el número secreto.',
    icon: '🎲',
  },
  {
    slug: 'snake',
    name: 'Snake',
    description: 'Come la comida, crece y consigue la mayor puntuación.',
    icon: '🐍',
  },
  {
    slug: 'breakout',
    name: 'Breakout',
    description: 'Rompe todos los bloques y supera los niveles.',
    icon: '🧱',
  },
  {
    slug: 'space-shooter',
    name: 'Space Shooter',
    description:
      'Destruye enemigos, supera oleadas y consigue la mayor puntuación.',
    icon: '🚀',
  },
  {
    slug: 'retos/palabra',
    name: 'Retos Palabra',
    description: 'El reto diario',
    icon: '🟩',
  },
]
