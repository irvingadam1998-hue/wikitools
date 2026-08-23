import type { Metadata } from 'next'

import GravityLab from '@/components/physics/GravityLab'

export const metadata: Metadata = {
  title: 'Gravity Lab — Physics Lab',
  description:
    'Experimenta con gravedad, masa y movimiento en un simulador interactivo.',
}

export default function GravityPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16">
      <GravityLab />
    </main>
  )
}
