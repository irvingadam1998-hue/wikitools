import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          ToolHub
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/herramientas"
            className="text-sm font-medium hover:text-gray-600"
          >
            Herramientas
          </Link>

          <Link
            href="/estudiantes"
            className="text-sm font-medium hover:text-gray-600"
          >
            Estudiantes
          </Link>

          <Link
            href="/juegos"
            className="text-sm font-medium hover:text-gray-600"
          >
            Juegos
          </Link>
        </nav>
      </div>
    </header>
  )
}
