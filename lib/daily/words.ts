export const VALID_WORDS = [
  'ARBOL',
  'AVION',
  'BAILE',
  'BARCO',
  'BLUSA',
  'BOLSA',
  'CAMPO',
  'CANTO',
  'CARRO',
  'CASA',
  'CIELO',
  'CINCO',
  'CLAVE',
  'COLOR',
  'COMER',
  'CORAL',
  'DADOS',
  'DANZA',
  'DULCE',
  'FUEGO',
  'GATOS',
  'GLOBO',
  'GRANO',
  'JUEGO',
  'LAPIZ',
  'LIBRO',
  'LUNA',
  'MAGIA',
  'MARCO',
  'MUNDO',
  'NIEVE',
  'NORTE',
  'NUBE',
  'PARED',
  'PERRO',
  'PIANO',
  'PLATA',
  'PLAYA',
  'PLUMA',
  'QUESO',
  'RADIO',
  'RAYO',
  'RELOJ',
  'ROBOT',
  'SILLA',
  'SUELO',
  'SUEÑO',
  'TIEMPO',
  'TIGRE',
  'TREN',
  'VERDE',
  'VIAJE',
  'VIDA',
]

export const DAILY_WORDS = [
  'LUNA',
  'FUEGO',
  'ROBOT',
  'PLAYA',
  'MAGIA',
  'CIELO',
  'NIEVE',
  'JUEGO',
  'RAYO',
  'MUNDO',
  'TIEMPO',
  'CAMPO',
  'LIBRO',
  'COLOR',
  'BAILE',
  'NORTE',
  'GLOBO',
  'DULCE',
  'PIANO',
  'VIAJE',
]

export function getDailyNumber(date = new Date()) {
  const start = new Date('2026-01-01T00:00:00Z')

  const current = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )

  return Math.floor((current - start.getTime()) / 86_400_000) + 1
}

export function getDailyWord(date = new Date()) {
  const number = getDailyNumber(date)

  return DAILY_WORDS[(number - 1) % DAILY_WORDS.length]
}

export function isValidWord(word: string) {
  return VALID_WORDS.includes(word.toUpperCase())
}
