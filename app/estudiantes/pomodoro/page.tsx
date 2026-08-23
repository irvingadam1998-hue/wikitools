import type { Metadata } from 'next'
import PomodoroTimer from '@/components/students/PomodoroTimer'

export const metadata: Metadata = {
  title: 'Temporizador Pomodoro | ToolHub',
  description:
    'Temporizador Pomodoro gratuito para estudiar, trabajar y concentrarte.',
}

export default function PomodoroPage() {
  return (
    <main>
      <PomodoroTimer />
    </main>
  )
}
