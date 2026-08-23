import type { Metadata } from 'next'

import TimeGlass from '@/components/timeglass/TimeGlass'

export const metadata: Metadata = {
  title: 'TimeGlass — Temporizador de turnos',
  description:
    'Controla turnos y el tiempo total de una sesión con un reloj de arena visual.',
}

export default function TimeGlassPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 sm:py-20">
      <TimeGlass />
    </main>
  )
}
