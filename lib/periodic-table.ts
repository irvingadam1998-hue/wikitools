export type ElementCategory =
  | 'metal-alcalino'
  | 'alcalinoterreo'
  | 'metal-transicion'
  | 'post-transicion'
  | 'metaloide'
  | 'no-metal'
  | 'halogeno'
  | 'gas-noble'
  | 'lantanido'
  | 'actinido'

export type ElementBlock = 's' | 'p' | 'd' | 'f'

export interface ChemicalElement {
  atomicNumber: number
  symbol: string
  name: string
  mass: string
  category: ElementCategory
  period: number
  group: number | null
  block: ElementBlock
  state: 'Sólido' | 'Líquido' | 'Gas'
  electronConfiguration: string
  location: string
  uses: string[]
}

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'metal-alcalino': 'Metal alcalino',
  alcalinoterreo: 'Alcalinotérreo',
  'metal-transicion': 'Metal de transición',
  'post-transicion': 'Metal post-transición',
  metaloide: 'Metaloide',
  'no-metal': 'No metal',
  halogeno: 'Halógeno',
  'gas-noble': 'Gas noble',
  lantanido: 'Lantánido',
  actinido: 'Actínido',
}

export const ELEMENTS: ChemicalElement[] = [
  {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hidrógeno',
    mass: '1.008',
    category: 'no-metal',
    period: 1,
    group: 1,
    block: 's',
    state: 'Gas',
    electronConfiguration: '1s¹',
    location:
      'Se encuentra principalmente en estrellas y forma parte del agua.',
    uses: ['Combustible', 'Producción de amoníaco', 'Industria química'],
  },
  {
    atomicNumber: 2,
    symbol: 'He',
    name: 'Helio',
    mass: '4.0026',
    category: 'gas-noble',
    period: 1,
    group: 18,
    block: 's',
    state: 'Gas',
    electronConfiguration: '1s²',
    location:
      'Está presente en pequeñas cantidades en la atmósfera y en depósitos de gas natural.',
    uses: ['Globos', 'Criogenia', 'Equipos científicos'],
  },
  {
    atomicNumber: 3,
    symbol: 'Li',
    name: 'Litio',
    mass: '6.94',
    category: 'metal-alcalino',
    period: 2,
    group: 1,
    block: 's',
    state: 'Sólido',
    electronConfiguration: '[He] 2s¹',
    location: 'Se encuentra en minerales y salmueras.',
    uses: ['Baterías', 'Cerámica', 'Aleaciones'],
  },
  {
    atomicNumber: 4,
    symbol: 'Be',
    name: 'Berilio',
    mass: '9.0122',
    category: 'alcalinoterreo',
    period: 2,
    group: 2,
    block: 's',
    state: 'Sólido',
    electronConfiguration: '[He] 2s²',
    location: 'Se encuentra en minerales como el berilo.',
    uses: ['Aeroespacial', 'Instrumentos científicos', 'Aleaciones'],
  },
  {
    atomicNumber: 5,
    symbol: 'B',
    name: 'Boro',
    mass: '10.81',
    category: 'metaloide',
    period: 2,
    group: 13,
    block: 'p',
    state: 'Sólido',
    electronConfiguration: '[He] 2s² 2p¹',
    location: 'Está presente en minerales de borato.',
    uses: ['Vidrio', 'Detergentes', 'Materiales resistentes'],
  },

  // Continúa aquí el resto de elementos.
]
