import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} ToolHub</p>

        <nav className="flex gap-5">
          <Link href="/herramientas">Herramientas</Link>
          <Link href="/estudiantes">Estudiantes</Link>
          <Link href="/juegos">Juegos</Link>
        </nav>
      </div>
    </footer>
  )
}
