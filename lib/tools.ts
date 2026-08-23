export type ToolCategory =
  | 'calculadoras'
  | 'conversores'
  | 'texto'
  | 'generadores'
  | 'tiempo'
  | 'imagenes'
  | 'estudiantes'

export interface Tool {
  slug: string
  name: string
  description: string
  category: ToolCategory
  icon: string
}

export const tools: Tool[] = [
  {
    slug: 'calculadora-porcentajes',
    name: 'Calculadora de porcentajes',
    description: 'Calcula porcentajes, aumentos y descuentos.',
    category: 'calculadoras',
    icon: '🧮',
  },
  {
    slug: 'calculadora-edad',
    name: 'Calculadora de edad',
    description: 'Calcula tu edad exacta a partir de tu fecha de nacimiento.',
    category: 'calculadoras',
    icon: '🎂',
  },
  {
    slug: 'conversor-unidades',
    name: 'Conversor de unidades',
    description: 'Convierte longitud, peso, temperatura y otras unidades.',
    category: 'conversores',
    icon: '📐',
  },
  {
    slug: 'contador-palabras',
    name: 'Contador de palabras',
    description: 'Cuenta palabras, caracteres y líneas de un texto.',
    category: 'texto',
    icon: '📝',
  },
  {
    slug: 'generador-contrasenas',
    name: 'Generador de contraseñas',
    description: 'Genera contraseñas aleatorias y seguras.',
    category: 'generadores',
    icon: '🔐',
  },
  {
    slug: 'temporizador',
    name: 'Temporizador',
    description: 'Temporizador online sencillo y rápido.',
    category: 'tiempo',
    icon: '⏱️',
  },
]
