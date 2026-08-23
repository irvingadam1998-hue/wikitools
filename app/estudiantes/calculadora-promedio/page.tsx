import type { Metadata } from 'next'
import GradeCalculator from '@/components/students/GradeCalculator'

export const metadata: Metadata = {
  title: 'Calculadora de promedio | ToolHub',
  description: 'Calcula tu promedio ponderado por materias o créditos.',
}

export default function CalculadoraPromedioPage() {
  return (
    <main>
      <GradeCalculator />
    </main>
  )
}
