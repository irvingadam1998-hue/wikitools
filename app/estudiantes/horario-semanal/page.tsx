import type { Metadata } from 'next'
import WeeklySchedule from '@/components/students/WeeklySchedule'

export const metadata: Metadata = {
  title: 'Generador de horario semanal | ToolHub',
  description:
    'Crea tu horario de clases de lunes a viernes y personalízalo para imprimirlo o guardarlo como PDF.',
}

export default function HorarioSemanalPage() {
  return <WeeklySchedule />
}
