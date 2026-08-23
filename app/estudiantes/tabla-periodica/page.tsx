'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type ElementCategory =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'lanthanide'
  | 'actinide'

type ElementData = {
  number: number
  symbol: string
  name: string
  mass: string
  group?: number
  period: number
  category: ElementCategory
  state: 'Sólido' | 'Líquido' | 'Gas'
  discovered: string
  discoverer: string
  config: string
  uses: string[]
  found: string[]
  fact: string
  description: string
  x: number
  y: number
}

type View = 'explore' | 'game' | 'exam'

const CATEGORY_INFO: Record<ElementCategory, { label: string; color: string }> =
  {
    alkali: { label: 'Metal alcalino', color: '#f2a93b' },
    alkaline: { label: 'Alcalinotérreo', color: '#e2637a' },
    transition: { label: 'Metal de transición', color: '#5b8dd9' },
    'post-transition': { label: 'Metal post-transición', color: '#4fb0a5' },
    metalloid: { label: 'Metaloide', color: '#a78bd9' },
    nonmetal: { label: 'No metal', color: '#7cb87f' },
    halogen: { label: 'Halógeno', color: '#d9c25b' },
    noble: { label: 'Gas noble', color: '#6ea8c7' },
    lanthanide: { label: 'Lantánido', color: '#d98bb4' },
    actinide: { label: 'Actínido', color: '#c98568' },
  }

const ELEMENTS: ElementData[] = [
  {
    number: 1,
    symbol: 'H',
    name: 'Hidrógeno',
    mass: '1.008',
    group: 1,
    period: 1,
    category: 'nonmetal',
    state: 'Gas',
    discovered: '1766',
    discoverer: 'Henry Cavendish',
    config: '1s¹',
    uses: ['Combustible', 'Industria química', 'Producción de amoníaco'],
    found: ['Agua', 'Estrellas', 'Compuestos orgánicos'],
    fact: 'Es el elemento más ligero y el más abundante del universo.',
    description: 'Gas incoloro, muy ligero y altamente inflamable.',
    x: 1,
    y: 1,
  },
  {
    number: 2,
    symbol: 'He',
    name: 'Helio',
    mass: '4.003',
    group: 18,
    period: 1,
    category: 'noble',
    state: 'Gas',
    discovered: '1868',
    discoverer: 'Pierre Janssen',
    config: '1s²',
    uses: ['Globos', 'Criogenia', 'Equipos científicos'],
    found: ['Gas natural', 'Estrellas'],
    fact: 'Es el segundo elemento más abundante del universo.',
    description: 'Gas noble extremadamente ligero y poco reactivo.',
    x: 18,
    y: 1,
  },

  {
    number: 3,
    symbol: 'Li',
    name: 'Litio',
    mass: '6.94',
    group: 1,
    period: 2,
    category: 'alkali',
    state: 'Sólido',
    discovered: '1817',
    discoverer: 'Johan August Arfwedson',
    config: '[He] 2s¹',
    uses: ['Baterías', 'Cerámica', 'Aleaciones'],
    found: ['Minerales', 'Salmueras'],
    fact: 'Es el metal sólido menos denso.',
    description: 'Metal alcalino blando y plateado.',
    x: 1,
    y: 2,
  },
  {
    number: 4,
    symbol: 'Be',
    name: 'Berilio',
    mass: '9.012',
    group: 2,
    period: 2,
    category: 'alkaline',
    state: 'Sólido',
    discovered: '1798',
    discoverer: 'Louis-Nicolas Vauquelin',
    config: '[He] 2s²',
    uses: ['Aeroespacial', 'Electrónica', 'Aleaciones'],
    found: ['Berilo', 'Esmeraldas'],
    fact: 'Es ligero y muy rígido.',
    description: 'Metal ligero, duro y de alta rigidez.',
    x: 2,
    y: 2,
  },
  {
    number: 5,
    symbol: 'B',
    name: 'Boro',
    mass: '10.81',
    group: 13,
    period: 2,
    category: 'metalloid',
    state: 'Sólido',
    discovered: '1808',
    discoverer: 'Gay-Lussac y Thénard',
    config: '[He] 2s² 2p¹',
    uses: ['Vidrio', 'Cerámica', 'Semiconductores'],
    found: ['Minerales', 'Bórax'],
    fact: 'El boro es importante para muchos materiales resistentes.',
    description: 'Metaloide duro y resistente.',
    x: 13,
    y: 2,
  },
  {
    number: 6,
    symbol: 'C',
    name: 'Carbono',
    mass: '12.011',
    group: 14,
    period: 2,
    category: 'nonmetal',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[He] 2s² 2p²',
    uses: ['Acero', 'Grafito', 'Materiales avanzados'],
    found: ['Seres vivos', 'Diamante', 'Grafito', 'CO₂'],
    fact: 'Es la base química de la vida conocida.',
    description: 'Elemento capaz de formar una enorme variedad de compuestos.',
    x: 14,
    y: 2,
  },
  {
    number: 7,
    symbol: 'N',
    name: 'Nitrógeno',
    mass: '14.007',
    group: 15,
    period: 2,
    category: 'nonmetal',
    state: 'Gas',
    discovered: '1772',
    discoverer: 'Daniel Rutherford',
    config: '[He] 2s² 2p³',
    uses: ['Fertilizantes', 'Industria química', 'Refrigeración'],
    found: ['Atmósfera', 'Seres vivos', 'Proteínas'],
    fact: 'Forma aproximadamente el 78% de la atmósfera terrestre.',
    description: 'Gas incoloro que constituye gran parte del aire.',
    x: 15,
    y: 2,
  },
  {
    number: 8,
    symbol: 'O',
    name: 'Oxígeno',
    mass: '15.999',
    group: 16,
    period: 2,
    category: 'nonmetal',
    state: 'Gas',
    discovered: '1774',
    discoverer: 'Joseph Priestley',
    config: '[He] 2s² 2p⁴',
    uses: ['Medicina', 'Soldadura', 'Industria'],
    found: ['Atmósfera', 'Agua', 'Óxidos'],
    fact: 'Es fundamental para la respiración aeróbica.',
    description: 'Gas reactivo esencial para muchos procesos biológicos.',
    x: 16,
    y: 2,
  },
  {
    number: 9,
    symbol: 'F',
    name: 'Flúor',
    mass: '18.998',
    group: 17,
    period: 2,
    category: 'halogen',
    state: 'Gas',
    discovered: '1886',
    discoverer: 'Henri Moissan',
    config: '[He] 2s² 2p⁵',
    uses: ['Fluoruros', 'Industria química', 'Materiales'],
    found: ['Minerales', 'Fluoruros'],
    fact: 'Es el elemento más electronegativo.',
    description: 'Halógeno extremadamente reactivo.',
    x: 17,
    y: 2,
  },
  {
    number: 10,
    symbol: 'Ne',
    name: 'Neón',
    mass: '20.180',
    group: 18,
    period: 2,
    category: 'noble',
    state: 'Gas',
    discovered: '1898',
    discoverer: 'William Ramsay y Morris Travers',
    config: '[He] 2s² 2p⁶',
    uses: ['Iluminación', 'Señalización', 'Láseres'],
    found: ['Atmósfera en pequeñas cantidades'],
    fact: 'Su nombre está relacionado con la palabra griega para nuevo.',
    description: 'Gas noble conocido por sus luces brillantes.',
    x: 18,
    y: 2,
  },

  {
    number: 11,
    symbol: 'Na',
    name: 'Sodio',
    mass: '22.990',
    group: 1,
    period: 3,
    category: 'alkali',
    state: 'Sólido',
    discovered: '1807',
    discoverer: 'Humphry Davy',
    config: '[Ne] 3s¹',
    uses: ['Sal', 'Industria química', 'Lámparas'],
    found: ['Agua de mar', 'Halita', 'Sales'],
    fact: 'Reacciona violentamente con el agua.',
    description: 'Metal alcalino blando y muy reactivo.',
    x: 1,
    y: 3,
  },
  {
    number: 12,
    symbol: 'Mg',
    name: 'Magnesio',
    mass: '24.305',
    group: 2,
    period: 3,
    category: 'alkaline',
    state: 'Sólido',
    discovered: '1755',
    discoverer: 'Joseph Black',
    config: '[Ne] 3s²',
    uses: ['Aleaciones', 'Pirotecnia', 'Industria'],
    found: ['Minerales', 'Agua de mar'],
    fact: 'Arde con una luz blanca muy intensa.',
    description: 'Metal ligero utilizado en numerosas aleaciones.',
    x: 2,
    y: 3,
  },
  {
    number: 13,
    symbol: 'Al',
    name: 'Aluminio',
    mass: '26.982',
    group: 13,
    period: 3,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '1825',
    discoverer: 'Hans Christian Ørsted',
    config: '[Ne] 3s² 3p¹',
    uses: ['Latas', 'Aviones', 'Construcción'],
    found: ['Bauxita', 'Minerales'],
    fact: 'Es el metal más abundante de la corteza terrestre.',
    description: 'Metal ligero, resistente a la corrosión y muy utilizado.',
    x: 13,
    y: 3,
  },
  {
    number: 14,
    symbol: 'Si',
    name: 'Silicio',
    mass: '28.085',
    group: 14,
    period: 3,
    category: 'metalloid',
    state: 'Sólido',
    discovered: '1824',
    discoverer: 'Jöns Jacob Berzelius',
    config: '[Ne] 3s² 3p²',
    uses: ['Chips', 'Paneles solares', 'Vidrio'],
    found: ['Arena', 'Cuarzo', 'Silicatos'],
    fact: 'Es fundamental para la industria de los semiconductores.',
    description: 'Metaloide abundante y esencial para la electrónica moderna.',
    x: 14,
    y: 3,
  },
  {
    number: 15,
    symbol: 'P',
    name: 'Fósforo',
    mass: '30.974',
    group: 15,
    period: 3,
    category: 'nonmetal',
    state: 'Sólido',
    discovered: '1669',
    discoverer: 'Hennig Brand',
    config: '[Ne] 3s² 3p³',
    uses: ['Fertilizantes', 'Cerillas', 'Biología'],
    found: ['Fosfatos', 'Huesos', 'ADN'],
    fact: 'Forma parte del ADN y del ATP.',
    description: 'No metal esencial para los organismos vivos.',
    x: 15,
    y: 3,
  },
  {
    number: 16,
    symbol: 'S',
    name: 'Azufre',
    mass: '32.06',
    group: 16,
    period: 3,
    category: 'nonmetal',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Ne] 3s² 3p⁴',
    uses: ['Ácido sulfúrico', 'Fertilizantes', 'Caucho'],
    found: ['Volcanes', 'Minerales', 'Petróleo'],
    fact: 'Puede encontrarse cerca de zonas volcánicas.',
    description: 'No metal amarillo conocido desde la antigüedad.',
    x: 16,
    y: 3,
  },
  {
    number: 17,
    symbol: 'Cl',
    name: 'Cloro',
    mass: '35.45',
    group: 17,
    period: 3,
    category: 'halogen',
    state: 'Gas',
    discovered: '1774',
    discoverer: 'Carl Wilhelm Scheele',
    config: '[Ne] 3s² 3p⁵',
    uses: ['Desinfección', 'PVC', 'Tratamiento de agua'],
    found: ['Agua de mar', 'Cloruros'],
    fact: 'El cloro se utiliza ampliamente para desinfectar agua.',
    description: 'Gas halógeno reactivo de color amarillo verdoso.',
    x: 17,
    y: 3,
  },
  {
    number: 18,
    symbol: 'Ar',
    name: 'Argón',
    mass: '39.948',
    group: 18,
    period: 3,
    category: 'noble',
    state: 'Gas',
    discovered: '1894',
    discoverer: 'Lord Rayleigh y William Ramsay',
    config: '[Ne] 3s² 3p⁶',
    uses: ['Soldadura', 'Bombillas', 'Industria'],
    found: ['Atmósfera'],
    fact: 'Es uno de los gases nobles presentes en el aire.',
    description: 'Gas noble incoloro y químicamente poco reactivo.',
    x: 18,
    y: 3,
  },

  {
    number: 19,
    symbol: 'K',
    name: 'Potasio',
    mass: '39.098',
    group: 1,
    period: 4,
    category: 'alkali',
    state: 'Sólido',
    discovered: '1807',
    discoverer: 'Humphry Davy',
    config: '[Ar] 4s¹',
    uses: ['Fertilizantes', 'Industria química', 'Biología'],
    found: ['Minerales', 'Sales'],
    fact: 'Es un nutriente esencial para las células.',
    description: 'Metal alcalino blando y muy reactivo.',
    x: 1,
    y: 4,
  },
  {
    number: 20,
    symbol: 'Ca',
    name: 'Calcio',
    mass: '40.078',
    group: 2,
    period: 4,
    category: 'alkaline',
    state: 'Sólido',
    discovered: '1808',
    discoverer: 'Humphry Davy',
    config: '[Ar] 4s²',
    uses: ['Construcción', 'Nutrición', 'Cemento'],
    found: ['Caliza', 'Huesos', 'Conchas'],
    fact: 'Es uno de los elementos más abundantes del cuerpo humano.',
    description: 'Metal alcalinotérreo esencial para organismos vivos.',
    x: 2,
    y: 4,
  },

  {
    number: 21,
    symbol: 'Sc',
    name: 'Escandio',
    mass: '44.956',
    group: 3,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1879',
    discoverer: 'Lars Fredrik Nilson',
    config: '[Ar] 3d¹ 4s²',
    uses: ['Aleaciones', 'Aeroespacial', 'Lámparas'],
    found: ['Minerales'],
    fact: 'Su existencia fue predicha por Mendeleev.',
    description: 'Metal de transición ligero y poco abundante.',
    x: 3,
    y: 4,
  },
  {
    number: 22,
    symbol: 'Ti',
    name: 'Titanio',
    mass: '47.867',
    group: 4,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1791',
    discoverer: 'William Gregor',
    config: '[Ar] 3d² 4s²',
    uses: ['Aviones', 'Implantes', 'Pinturas'],
    found: ['Minerales', 'Rutilo'],
    fact: 'Tiene una gran relación entre resistencia y peso.',
    description: 'Metal fuerte, ligero y resistente a la corrosión.',
    x: 4,
    y: 4,
  },
  {
    number: 23,
    symbol: 'V',
    name: 'Vanadio',
    mass: '50.942',
    group: 5,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1801',
    discoverer: 'Andrés Manuel del Río',
    config: '[Ar] 3d³ 4s²',
    uses: ['Acero', 'Aleaciones', 'Catalizadores'],
    found: ['Minerales'],
    fact: 'Se utiliza para fabricar aceros especialmente resistentes.',
    description: 'Metal de transición utilizado principalmente en aleaciones.',
    x: 5,
    y: 4,
  },
  {
    number: 24,
    symbol: 'Cr',
    name: 'Cromo',
    mass: '51.996',
    group: 6,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1797',
    discoverer: 'Louis-Nicolas Vauquelin',
    config: '[Ar] 3d⁵ 4s¹',
    uses: ['Acero inoxidable', 'Recubrimientos', 'Pigmentos'],
    found: ['Cromita'],
    fact: 'Su nombre procede de una palabra griega relacionada con color.',
    description: 'Metal brillante utilizado para proteger superficies.',
    x: 6,
    y: 4,
  },
  {
    number: 25,
    symbol: 'Mn',
    name: 'Manganeso',
    mass: '54.938',
    group: 7,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1774',
    discoverer: 'Johan Gottlieb Gahn',
    config: '[Ar] 3d⁵ 4s²',
    uses: ['Acero', 'Baterías', 'Industria'],
    found: ['Minerales'],
    fact: 'Es importante en la producción de algunos tipos de acero.',
    description: 'Metal de transición duro y quebradizo.',
    x: 7,
    y: 4,
  },
  {
    number: 26,
    symbol: 'Fe',
    name: 'Hierro',
    mass: '55.845',
    group: 8,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Ar] 3d⁶ 4s²',
    uses: ['Acero', 'Construcción', 'Maquinaria'],
    found: ['Minerales', 'Meteoritos', 'Núcleo terrestre'],
    fact: 'El hierro es uno de los elementos más importantes de la industria moderna.',
    description:
      'Metal de transición fuerte y fundamental para la fabricación de acero.',
    x: 8,
    y: 4,
  },
  {
    number: 27,
    symbol: 'Co',
    name: 'Cobalto',
    mass: '58.933',
    group: 9,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1735',
    discoverer: 'Georg Brandt',
    config: '[Ar] 3d⁷ 4s²',
    uses: ['Aleaciones', 'Pigmentos', 'Baterías'],
    found: ['Minerales'],
    fact: 'Sus compuestos han sido utilizados para producir pigmentos azules.',
    description: 'Metal de transición duro y magnético.',
    x: 9,
    y: 4,
  },
  {
    number: 28,
    symbol: 'Ni',
    name: 'Níquel',
    mass: '58.693',
    group: 10,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1751',
    discoverer: 'Axel Fredrik Cronstedt',
    config: '[Ar] 3d⁸ 4s²',
    uses: ['Acero inoxidable', 'Monedas', 'Baterías'],
    found: ['Minerales', 'Meteoritos'],
    fact: 'Se encuentra en numerosos meteoritos de hierro.',
    description: 'Metal resistente a la corrosión.',
    x: 10,
    y: 4,
  },
  {
    number: 29,
    symbol: 'Cu',
    name: 'Cobre',
    mass: '63.546',
    group: 11,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Ar] 3d¹⁰ 4s¹',
    uses: ['Cables eléctricos', 'Tuberías', 'Aleaciones'],
    found: ['Minerales', 'Rocas'],
    fact: 'Es uno de los mejores conductores eléctricos.',
    description: 'Metal rojizo con excelente conductividad eléctrica.',
    x: 11,
    y: 4,
  },
  {
    number: 30,
    symbol: 'Zn',
    name: 'Zinc',
    mass: '65.38',
    group: 12,
    period: 4,
    category: 'transition',
    state: 'Sólido',
    discovered: '1746',
    discoverer: 'Andreas Marggraf',
    config: '[Ar] 3d¹⁰ 4s²',
    uses: ['Galvanizado', 'Aleaciones', 'Baterías'],
    found: ['Esfalerita', 'Minerales'],
    fact: 'Se utiliza para proteger el acero contra la corrosión.',
    description: 'Metal utilizado ampliamente en recubrimientos protectores.',
    x: 12,
    y: 4,
  },
  {
    number: 31,
    symbol: 'Ga',
    name: 'Galio',
    mass: '69.723',
    group: 13,
    period: 4,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '1875',
    discoverer: 'Paul-Émile Lecoq de Boisbaudran',
    config: '[Ar] 3d¹⁰ 4s² 4p¹',
    uses: ['Semiconductores', 'LED', 'Electrónica'],
    found: ['Minerales de aluminio y zinc'],
    fact: 'Puede fundirse cerca de la temperatura corporal.',
    description: 'Metal blando con un punto de fusión relativamente bajo.',
    x: 13,
    y: 4,
  },
  {
    number: 32,
    symbol: 'Ge',
    name: 'Germanio',
    mass: '72.630',
    group: 14,
    period: 4,
    category: 'metalloid',
    state: 'Sólido',
    discovered: '1886',
    discoverer: 'Clemens Winkler',
    config: '[Ar] 3d¹⁰ 4s² 4p²',
    uses: ['Semiconductores', 'Fibra óptica', 'Óptica'],
    found: ['Minerales de zinc'],
    fact: 'Fue predicho por Mendeleev antes de ser descubierto.',
    description: 'Metaloide utilizado en electrónica y óptica.',
    x: 14,
    y: 4,
  },
  {
    number: 33,
    symbol: 'As',
    name: 'Arsénico',
    mass: '74.922',
    group: 15,
    period: 4,
    category: 'metalloid',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Ar] 3d¹⁰ 4s² 4p³',
    uses: ['Semiconductores', 'Metalurgia'],
    found: ['Minerales'],
    fact: 'Sus compuestos pueden ser tóxicos.',
    description: 'Metaloide que requiere especial cuidado por su toxicidad.',
    x: 15,
    y: 4,
  },
  {
    number: 34,
    symbol: 'Se',
    name: 'Selenio',
    mass: '78.971',
    group: 16,
    period: 4,
    category: 'nonmetal',
    state: 'Sólido',
    discovered: '1817',
    discoverer: 'Jöns Jacob Berzelius',
    config: '[Ar] 3d¹⁰ 4s² 4p⁴',
    uses: ['Electrónica', 'Vidrio', 'Fotocélulas'],
    found: ['Minerales'],
    fact: 'Es un micronutriente esencial en pequeñas cantidades.',
    description: 'No metal con propiedades semiconductoras.',
    x: 16,
    y: 4,
  },
  {
    number: 35,
    symbol: 'Br',
    name: 'Bromo',
    mass: '79.904',
    group: 17,
    period: 4,
    category: 'halogen',
    state: 'Líquido',
    discovered: '1826',
    discoverer: 'Antoine Balard',
    config: '[Ar] 3d¹⁰ 4s² 4p⁵',
    uses: ['Industria química', 'Materiales', 'Fotografía histórica'],
    found: ['Agua de mar', 'Salmueras'],
    fact: 'Es uno de los pocos elementos que es líquido a temperatura ambiente.',
    description: 'Líquido rojizo perteneciente a los halógenos.',
    x: 17,
    y: 4,
  },
  {
    number: 36,
    symbol: 'Kr',
    name: 'Kriptón',
    mass: '83.798',
    group: 18,
    period: 4,
    category: 'noble',
    state: 'Gas',
    discovered: '1898',
    discoverer: 'William Ramsay y Morris Travers',
    config: '[Ar] 3d¹⁰ 4s² 4p⁶',
    uses: ['Iluminación', 'Láseres'],
    found: ['Atmósfera'],
    fact: 'Es un gas noble poco abundante en la atmósfera.',
    description: 'Gas noble incoloro y poco reactivo.',
    x: 18,
    y: 4,
  },

  {
    number: 37,
    symbol: 'Rb',
    name: 'Rubidio',
    mass: '85.468',
    group: 1,
    period: 5,
    category: 'alkali',
    state: 'Sólido',
    discovered: '1861',
    discoverer: 'Robert Bunsen y Gustav Kirchhoff',
    config: '[Kr] 5s¹',
    uses: ['Investigación', 'Relojes atómicos', 'Electrónica'],
    found: ['Minerales'],
    fact: 'Es un metal alcalino muy reactivo.',
    description: 'Metal blando y altamente reactivo.',
    x: 1,
    y: 5,
  },
  {
    number: 38,
    symbol: 'Sr',
    name: 'Estroncio',
    mass: '87.62',
    group: 2,
    period: 5,
    category: 'alkaline',
    state: 'Sólido',
    discovered: '1790',
    discoverer: 'Adair Crawford',
    config: '[Kr] 5s²',
    uses: ['Pirotecnia', 'Cerámica', 'Investigación'],
    found: ['Celestina', 'Estroncianita'],
    fact: 'Sus sales pueden producir un color rojo en fuegos artificiales.',
    description: 'Metal alcalinotérreo reactivo.',
    x: 2,
    y: 5,
  },
  {
    number: 39,
    symbol: 'Y',
    name: 'Itrio',
    mass: '88.906',
    group: 3,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1794',
    discoverer: 'Johan Gadolin',
    config: '[Kr] 4d¹ 5s²',
    uses: ['Láseres', 'Cerámicas', 'Electrónica'],
    found: ['Minerales de tierras raras'],
    fact: 'Su nombre está relacionado con Ytterby, Suecia.',
    description: 'Metal de transición usado en materiales avanzados.',
    x: 3,
    y: 5,
  },

  {
    number: 40,
    symbol: 'Zr',
    name: 'Circonio',
    mass: '91.224',
    group: 4,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1789',
    discoverer: 'Martin Heinrich Klaproth',
    config: '[Kr] 4d² 5s²',
    uses: ['Reactores', 'Cerámica', 'Aleaciones'],
    found: ['Circón'],
    fact: 'Tiene gran resistencia a la corrosión.',
    description: 'Metal fuerte y resistente a ambientes corrosivos.',
    x: 4,
    y: 5,
  },
  {
    number: 41,
    symbol: 'Nb',
    name: 'Niobio',
    mass: '92.906',
    group: 5,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1801',
    discoverer: 'Charles Hatchett',
    config: '[Kr] 4d⁴ 5s¹',
    uses: ['Superconductores', 'Aleaciones', 'Aeroespacial'],
    found: ['Columbita'],
    fact: 'Puede formar materiales superconductores a bajas temperaturas.',
    description:
      'Metal de transición resistente y útil en aleaciones especiales.',
    x: 5,
    y: 5,
  },
  {
    number: 42,
    symbol: 'Mo',
    name: 'Molibdeno',
    mass: '95.95',
    group: 6,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1778',
    discoverer: 'Carl Wilhelm Scheele',
    config: '[Kr] 4d⁵ 5s¹',
    uses: ['Acero', 'Catalizadores', 'Industria'],
    found: ['Molibdenita'],
    fact: 'Mejora la resistencia de ciertos aceros a altas temperaturas.',
    description: 'Metal de alto punto de fusión.',
    x: 6,
    y: 5,
  },
  {
    number: 43,
    symbol: 'Tc',
    name: 'Tecnecio',
    mass: '[98]',
    group: 7,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1937',
    discoverer: 'Carlo Perrier y Emilio Segrè',
    config: '[Kr] 4d⁵ 5s²',
    uses: ['Medicina nuclear', 'Investigación'],
    found: ['Principalmente producido artificialmente'],
    fact: 'Fue el primer elemento producido artificialmente.',
    description: 'Metal radiactivo sin isótopos estables.',
    x: 7,
    y: 5,
  },
  {
    number: 44,
    symbol: 'Ru',
    name: 'Rutenio',
    mass: '101.07',
    group: 8,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1844',
    discoverer: 'Karl Ernst Claus',
    config: '[Kr] 4d⁷ 5s¹',
    uses: ['Electrónica', 'Catalizadores', 'Aleaciones'],
    found: ['Minerales de platino'],
    fact: 'Es un metal duro y resistente.',
    description: 'Metal de transición perteneciente al grupo del platino.',
    x: 8,
    y: 5,
  },
  {
    number: 45,
    symbol: 'Rh',
    name: 'Rodio',
    mass: '102.91',
    group: 9,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1803',
    discoverer: 'William Hyde Wollaston',
    config: '[Kr] 4d⁸ 5s¹',
    uses: ['Catalizadores', 'Recubrimientos', 'Automóviles'],
    found: ['Minerales de platino'],
    fact: 'Es uno de los metales más raros de la corteza terrestre.',
    description: 'Metal brillante y muy resistente a la corrosión.',
    x: 9,
    y: 5,
  },
  {
    number: 46,
    symbol: 'Pd',
    name: 'Paladio',
    mass: '106.42',
    group: 10,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1803',
    discoverer: 'William Hyde Wollaston',
    config: '[Kr] 4d¹⁰',
    uses: ['Catalizadores', 'Electrónica', 'Joyería'],
    found: ['Minerales de níquel y cobre'],
    fact: 'Puede absorber grandes cantidades de hidrógeno.',
    description: 'Metal del grupo del platino.',
    x: 10,
    y: 5,
  },
  {
    number: 47,
    symbol: 'Ag',
    name: 'Plata',
    mass: '107.868',
    group: 11,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocida desde la antigüedad',
    config: '[Kr] 4d¹⁰ 5s¹',
    uses: ['Joyería', 'Electrónica', 'Espejos'],
    found: ['Minerales', 'Menes'],
    fact: 'Es el elemento con mayor conductividad eléctrica entre los metales.',
    description: 'Metal precioso brillante con excelente conductividad.',
    x: 11,
    y: 5,
  },
  {
    number: 48,
    symbol: 'Cd',
    name: 'Cadmio',
    mass: '112.41',
    group: 12,
    period: 5,
    category: 'transition',
    state: 'Sólido',
    discovered: '1817',
    discoverer: 'Friedrich Stromeyer',
    config: '[Kr] 4d¹⁰ 5s²',
    uses: ['Pigmentos', 'Recubrimientos', 'Baterías históricas'],
    found: ['Minerales de zinc'],
    fact: 'Es un metal tóxico que requiere un manejo cuidadoso.',
    description: 'Metal blando asociado frecuentemente a minerales de zinc.',
    x: 12,
    y: 5,
  },
  {
    number: 49,
    symbol: 'In',
    name: 'Indio',
    mass: '114.818',
    group: 13,
    period: 5,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '1863',
    discoverer: 'Ferdinand Reich y Hieronymus Richter',
    config: '[Kr] 4d¹⁰ 5s² 5p¹',
    uses: ['Pantallas táctiles', 'Semiconductores', 'Soldaduras'],
    found: ['Minerales de zinc'],
    fact: 'El óxido de indio y estaño es importante en pantallas táctiles.',
    description: 'Metal blando utilizado en electrónica moderna.',
    x: 13,
    y: 5,
  },
  {
    number: 50,
    symbol: 'Sn',
    name: 'Estaño',
    mass: '118.710',
    group: 14,
    period: 5,
    category: 'post-transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Kr] 4d¹⁰ 5s² 5p²',
    uses: ['Soldaduras', 'Recubrimientos', 'Aleaciones'],
    found: ['Casiterita'],
    fact: 'El bronce es una aleación histórica de cobre y estaño.',
    description: 'Metal relativamente blando y resistente a la corrosión.',
    x: 14,
    y: 5,
  },
  {
    number: 51,
    symbol: 'Sb',
    name: 'Antimonio',
    mass: '121.760',
    group: 15,
    period: 5,
    category: 'metalloid',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Kr] 4d¹⁰ 5s² 5p³',
    uses: ['Aleaciones', 'Semiconductores', 'Retardantes'],
    found: ['Estibina'],
    fact: 'Puede mejorar ciertas propiedades de las aleaciones.',
    description: 'Metaloide quebradizo y brillante.',
    x: 15,
    y: 5,
  },
  {
    number: 52,
    symbol: 'Te',
    name: 'Telurio',
    mass: '127.60',
    group: 16,
    period: 5,
    category: 'metalloid',
    state: 'Sólido',
    discovered: '1782',
    discoverer: 'Franz-Joseph Müller von Reichenstein',
    config: '[Kr] 4d¹⁰ 5s² 5p⁴',
    uses: ['Paneles solares', 'Aleaciones', 'Electrónica'],
    found: ['Minerales'],
    fact: 'Su nombre procede del latín para Tierra.',
    description: 'Metaloide raro utilizado en tecnología.',
    x: 16,
    y: 5,
  },
  {
    number: 53,
    symbol: 'I',
    name: 'Yodo',
    mass: '126.904',
    group: 17,
    period: 5,
    category: 'halogen',
    state: 'Sólido',
    discovered: '1811',
    discoverer: 'Bernard Courtois',
    config: '[Kr] 4d¹⁰ 5s² 5p⁵',
    uses: ['Medicina', 'Desinfección', 'Nutrición'],
    found: ['Agua de mar', 'Algas', 'Sales'],
    fact: 'El yodo es un micronutriente necesario para la función tiroidea.',
    description: 'Halógeno sólido de color oscuro.',
    x: 17,
    y: 5,
  },
  {
    number: 54,
    symbol: 'Xe',
    name: 'Xenón',
    mass: '131.293',
    group: 18,
    period: 5,
    category: 'noble',
    state: 'Gas',
    discovered: '1898',
    discoverer: 'William Ramsay y Morris Travers',
    config: '[Kr] 4d¹⁰ 5s² 5p⁶',
    uses: ['Lámparas', 'Propulsión iónica', 'Medicina'],
    found: ['Atmósfera'],
    fact: 'Puede producir una luz intensa en ciertas lámparas.',
    description: 'Gas noble pesado y poco reactivo.',
    x: 18,
    y: 5,
  },

  {
    number: 55,
    symbol: 'Cs',
    name: 'Cesio',
    mass: '132.905',
    group: 1,
    period: 6,
    category: 'alkali',
    state: 'Sólido',
    discovered: '1860',
    discoverer: 'Robert Bunsen y Gustav Kirchhoff',
    config: '[Xe] 6s¹',
    uses: ['Relojes atómicos', 'Investigación', 'Electrónica'],
    found: ['Minerales'],
    fact: 'Tiene uno de los puntos de fusión más bajos entre los metales.',
    description: 'Metal alcalino extremadamente reactivo.',
    x: 1,
    y: 6,
  },
  {
    number: 56,
    symbol: 'Ba',
    name: 'Bario',
    mass: '137.327',
    group: 2,
    period: 6,
    category: 'alkaline',
    state: 'Sólido',
    discovered: '1808',
    discoverer: 'Humphry Davy',
    config: '[Xe] 6s²',
    uses: ['Medicina', 'Cerámica', 'Industria'],
    found: ['Barita'],
    fact: 'El sulfato de bario se utiliza como medio de contraste en medicina.',
    description: 'Metal alcalinotérreo relativamente pesado.',
    x: 2,
    y: 6,
  },

  {
    number: 57,
    symbol: 'La',
    name: 'Lantano',
    mass: '138.905',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1838',
    discoverer: 'Carl Gustaf Mosander',
    config: '[Xe] 5d¹ 6s²',
    uses: ['Lentes', 'Catalizadores', 'Baterías'],
    found: ['Monacita', 'Bastnasita'],
    fact: 'Da nombre a la serie de los lantánidos.',
    description: 'Metal de tierras raras blando y reactivo.',
    x: 4,
    y: 8,
  },
  {
    number: 58,
    symbol: 'Ce',
    name: 'Cerio',
    mass: '140.116',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1803',
    discoverer: 'Jöns Jacob Berzelius y Wilhelm Hisinger',
    config: '[Xe] 4f¹ 5d¹ 6s²',
    uses: ['Catalizadores', 'Pulido', 'Aleaciones'],
    found: ['Monacita', 'Bastnasita'],
    fact: 'Es el lantánido más abundante en la corteza terrestre.',
    description: 'Metal de tierras raras relativamente abundante.',
    x: 5,
    y: 8,
  },
  {
    number: 59,
    symbol: 'Pr',
    name: 'Praseodimio',
    mass: '140.908',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1885',
    discoverer: 'Carl Auer von Welsbach',
    config: '[Xe] 4f³ 6s²',
    uses: ['Imanes', 'Vidrio', 'Aleaciones'],
    found: ['Minerales de tierras raras'],
    fact: 'Sus compuestos pueden producir colores verdes en vidrios.',
    description: 'Metal de tierras raras utilizado en materiales especiales.',
    x: 6,
    y: 8,
  },
  {
    number: 60,
    symbol: 'Nd',
    name: 'Neodimio',
    mass: '144.242',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1885',
    discoverer: 'Carl Auer von Welsbach',
    config: '[Xe] 4f⁴ 6s²',
    uses: ['Imanes', 'Auriculares', 'Motores'],
    found: ['Monacita', 'Bastnasita'],
    fact: 'Los imanes de neodimio son algunos de los imanes permanentes más fuertes.',
    description: 'Metal de tierras raras importante para imanes potentes.',
    x: 7,
    y: 8,
  },
  {
    number: 61,
    symbol: 'Pm',
    name: 'Prometio',
    mass: '[145]',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1945',
    discoverer: 'Jacob Marinsky, Lawrence Glendenin y Charles Coryell',
    config: '[Xe] 4f⁵ 6s²',
    uses: ['Investigación', 'Fuentes radiactivas'],
    found: ['Principalmente producido artificialmente'],
    fact: 'No posee isótopos estables.',
    description: 'Lantánido radiactivo poco común.',
    x: 8,
    y: 8,
  },
  {
    number: 62,
    symbol: 'Sm',
    name: 'Samario',
    mass: '150.36',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1879',
    discoverer: 'Paul-Émile Lecoq de Boisbaudran',
    config: '[Xe] 4f⁶ 6s²',
    uses: ['Imanes', 'Reactores', 'Electrónica'],
    found: ['Minerales de tierras raras'],
    fact: 'Los imanes de samario-cobalto soportan temperaturas elevadas.',
    description: 'Metal de tierras raras utilizado en imanes especiales.',
    x: 9,
    y: 8,
  },
  {
    number: 63,
    symbol: 'Eu',
    name: 'Europio',
    mass: '151.964',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1901',
    discoverer: 'Eugène-Anatole Demarçay',
    config: '[Xe] 4f⁷ 6s²',
    uses: ['Pantallas', 'LED', 'Pigmentos'],
    found: ['Minerales de tierras raras'],
    fact: 'Sus compuestos son importantes para producir colores rojos en pantallas.',
    description: 'Lantánido utilizado en materiales luminiscentes.',
    x: 10,
    y: 8,
  },
  {
    number: 64,
    symbol: 'Gd',
    name: 'Gadolinio',
    mass: '157.25',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1880',
    discoverer: 'Jean Charles Galissard de Marignac',
    config: '[Xe] 4f⁷ 5d¹ 6s²',
    uses: ['Resonancia magnética', 'Materiales magnéticos'],
    found: ['Minerales de tierras raras'],
    fact: 'Algunos compuestos de gadolinio se utilizan como agentes de contraste en MRI.',
    description:
      'Metal de tierras raras con propiedades magnéticas especiales.',
    x: 11,
    y: 8,
  },
  {
    number: 65,
    symbol: 'Tb',
    name: 'Terbio',
    mass: '158.925',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1843',
    discoverer: 'Carl Gustaf Mosander',
    config: '[Xe] 4f⁹ 6s²',
    uses: ['Pantallas', 'Luminóforos', 'Electrónica'],
    found: ['Minerales de tierras raras'],
    fact: 'Puede utilizarse en materiales que producen luz verde.',
    description: 'Lantánido usado en materiales luminiscentes.',
    x: 12,
    y: 8,
  },
  {
    number: 66,
    symbol: 'Dy',
    name: 'Disprosio',
    mass: '162.500',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1886',
    discoverer: 'Paul-Émile Lecoq de Boisbaudran',
    config: '[Xe] 4f¹⁰ 6s²',
    uses: ['Imanes', 'Motores', 'Electrónica'],
    found: ['Minerales de tierras raras'],
    fact: 'Se utiliza en algunos imanes que necesitan mantener su rendimiento a altas temperaturas.',
    description: 'Metal de tierras raras con propiedades magnéticas útiles.',
    x: 13,
    y: 8,
  },
  {
    number: 67,
    symbol: 'Ho',
    name: 'Holmio',
    mass: '164.930',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1878',
    discoverer: 'Per Teodor Cleve',
    config: '[Xe] 4f¹¹ 6s²',
    uses: ['Láseres', 'Imanes', 'Investigación'],
    found: ['Minerales de tierras raras'],
    fact: 'Tiene propiedades magnéticas muy destacadas.',
    description: 'Lantánido utilizado en aplicaciones ópticas y magnéticas.',
    x: 14,
    y: 8,
  },
  {
    number: 68,
    symbol: 'Er',
    name: 'Erbio',
    mass: '167.259',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1843',
    discoverer: 'Carl Gustaf Mosander',
    config: '[Xe] 4f¹² 6s²',
    uses: ['Fibra óptica', 'Láseres', 'Vidrio'],
    found: ['Minerales de tierras raras'],
    fact: 'Es importante en amplificadores de fibra óptica.',
    description:
      'Lantánido utilizado especialmente en telecomunicaciones ópticas.',
    x: 15,
    y: 8,
  },
  {
    number: 69,
    symbol: 'Tm',
    name: 'Tulio',
    mass: '168.934',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1879',
    discoverer: 'Per Teodor Cleve',
    config: '[Xe] 4f¹³ 6s²',
    uses: ['Láseres', 'Investigación', 'Equipos portátiles de rayos X'],
    found: ['Minerales de tierras raras'],
    fact: 'Es uno de los lantánidos naturales más raros.',
    description: 'Metal de tierras raras poco abundante.',
    x: 16,
    y: 8,
  },
  {
    number: 70,
    symbol: 'Yb',
    name: 'Iterbio',
    mass: '173.045',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1878',
    discoverer: 'Jean Charles Galissard de Marignac',
    config: '[Xe] 4f¹⁴ 6s²',
    uses: ['Láseres', 'Investigación', 'Relojes atómicos'],
    found: ['Minerales de tierras raras'],
    fact: 'Algunos isótopos se utilizan en investigaciones sobre relojes atómicos.',
    description: 'Lantánido blando y relativamente poco reactivo.',
    x: 17,
    y: 8,
  },
  {
    number: 71,
    symbol: 'Lu',
    name: 'Lutecio',
    mass: '174.967',
    period: 8,
    category: 'lanthanide',
    state: 'Sólido',
    discovered: '1907',
    discoverer: 'Georges Urbain',
    config: '[Xe] 4f¹⁴ 5d¹ 6s²',
    uses: ['Medicina nuclear', 'Catalizadores', 'Investigación'],
    found: ['Minerales de tierras raras'],
    fact: 'Es uno de los lantánidos más densos.',
    description: 'Metal de tierras raras pesado y relativamente raro.',
    x: 18,
    y: 8,
  },

  {
    number: 72,
    symbol: 'Hf',
    name: 'Hafnio',
    mass: '178.49',
    group: 4,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: '1923',
    discoverer: 'Dirk Coster y George de Hevesy',
    config: '[Xe] 4f¹⁴ 5d² 6s²',
    uses: ['Reactores', 'Microchips', 'Aleaciones'],
    found: ['Circón'],
    fact: 'Sus propiedades químicas son muy parecidas a las del circonio.',
    description: 'Metal de transición resistente y estable.',
    x: 4,
    y: 6,
  },
  {
    number: 73,
    symbol: 'Ta',
    name: 'Tantalio',
    mass: '180.948',
    group: 5,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: '1802',
    discoverer: 'Anders Gustaf Ekeberg',
    config: '[Xe] 4f¹⁴ 5d³ 6s²',
    uses: ['Electrónica', 'Implantes', 'Aleaciones'],
    found: ['Tantalita'],
    fact: 'Es altamente resistente a la corrosión.',
    description: 'Metal duro y muy resistente químicamente.',
    x: 5,
    y: 6,
  },
  {
    number: 74,
    symbol: 'W',
    name: 'Wolframio',
    mass: '183.84',
    group: 6,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: '1783',
    discoverer: 'Hermanos Elhuyar',
    config: '[Xe] 4f¹⁴ 5d⁴ 6s²',
    uses: ['Herramientas', 'Aleaciones', 'Electrónica'],
    found: ['Wolframita', 'Scheelita'],
    fact: 'Tiene uno de los puntos de fusión más altos de todos los elementos.',
    description: 'Metal extremadamente resistente a altas temperaturas.',
    x: 6,
    y: 6,
  },
  {
    number: 75,
    symbol: 'Re',
    name: 'Renio',
    mass: '186.207',
    group: 7,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: '1925',
    discoverer: 'Walter Noddack, Ida Noddack y Otto Berg',
    config: '[Xe] 4f¹⁴ 5d⁵ 6s²',
    uses: ['Turbinas', 'Catalizadores', 'Aleaciones'],
    found: ['Minerales de molibdeno'],
    fact: 'Tiene un punto de fusión extremadamente elevado.',
    description: 'Metal raro utilizado en aplicaciones de alta temperatura.',
    x: 7,
    y: 6,
  },
  {
    number: 76,
    symbol: 'Os',
    name: 'Osmio',
    mass: '190.23',
    group: 8,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: '1803',
    discoverer: 'Smithson Tennant',
    config: '[Xe] 4f¹⁴ 5d⁶ 6s²',
    uses: ['Aleaciones', 'Instrumentos', 'Investigación'],
    found: ['Minerales de platino'],
    fact: 'Es uno de los elementos más densos conocidos.',
    description: 'Metal muy denso perteneciente al grupo del platino.',
    x: 8,
    y: 6,
  },
  {
    number: 77,
    symbol: 'Ir',
    name: 'Iridio',
    mass: '192.217',
    group: 9,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: '1803',
    discoverer: 'Smithson Tennant',
    config: '[Xe] 4f¹⁴ 5d⁷ 6s²',
    uses: ['Bujías', 'Aleaciones', 'Industria'],
    found: ['Minerales de platino'],
    fact: 'Es extremadamente resistente a la corrosión.',
    description: 'Metal muy duro y resistente químicamente.',
    x: 9,
    y: 6,
  },
  {
    number: 78,
    symbol: 'Pt',
    name: 'Platino',
    mass: '195.084',
    group: 10,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Culturas precolombinas',
    config: '[Xe] 4f¹⁴ 5d⁹ 6s¹',
    uses: ['Catalizadores', 'Joyería', 'Medicina'],
    found: ['Depósitos minerales'],
    fact: 'Es un metal precioso muy resistente a la corrosión.',
    description: 'Metal noble y brillante del grupo del platino.',
    x: 10,
    y: 6,
  },
  {
    number: 79,
    symbol: 'Au',
    name: 'Oro',
    mass: '196.967',
    group: 11,
    period: 6,
    category: 'transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    uses: ['Joyería', 'Electrónica', 'Finanzas'],
    found: ['Rocas', 'Ríos', 'Depósitos minerales'],
    fact: 'Es un metal muy poco reactivo y resistente a la corrosión.',
    description: 'Metal precioso amarillo y altamente maleable.',
    x: 11,
    y: 6,
  },
  {
    number: 80,
    symbol: 'Hg',
    name: 'Mercurio',
    mass: '200.592',
    group: 12,
    period: 6,
    category: 'transition',
    state: 'Líquido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    uses: ['Instrumentos históricos', 'Industria especializada'],
    found: ['Cinabrio'],
    fact: 'Es el único metal que permanece líquido en condiciones ambientales comunes.',
    description: 'Metal líquido de color plateado.',
    x: 12,
    y: 6,
  },
  {
    number: 81,
    symbol: 'Tl',
    name: 'Talio',
    mass: '204.38',
    group: 13,
    period: 6,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '1861',
    discoverer: 'William Crookes',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',
    uses: ['Electrónica', 'Investigación'],
    found: ['Minerales'],
    fact: 'Es un elemento tóxico que requiere manipulación especializada.',
    description: 'Metal blando y pesado.',
    x: 13,
    y: 6,
  },
  {
    number: 82,
    symbol: 'Pb',
    name: 'Plomo',
    mass: '207.2',
    group: 14,
    period: 6,
    category: 'post-transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',
    uses: ['Baterías', 'Protección radiológica', 'Construcción histórica'],
    found: ['Galena'],
    fact: 'Es un metal pesado y tóxico.',
    description: 'Metal blando y denso que requiere un manejo cuidadoso.',
    x: 14,
    y: 6,
  },
  {
    number: 83,
    symbol: 'Bi',
    name: 'Bismuto',
    mass: '208.980',
    group: 15,
    period: 6,
    category: 'post-transition',
    state: 'Sólido',
    discovered: 'Antigüedad',
    discoverer: 'Conocido desde la antigüedad',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',
    uses: ['Aleaciones', 'Medicina', 'Cosmética'],
    found: ['Minerales'],
    fact: 'Es uno de los elementos pesados estables o casi estables más conocidos.',
    description:
      'Metal pesado con baja toxicidad relativa frente a otros metales pesados.',
    x: 15,
    y: 6,
  },
  {
    number: 84,
    symbol: 'Po',
    name: 'Polonio',
    mass: '[209]',
    group: 16,
    period: 6,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '1898',
    discoverer: 'Marie Curie y Pierre Curie',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',
    uses: ['Investigación', 'Aplicaciones especializadas'],
    found: ['Trazas en minerales de uranio'],
    fact: 'Fue nombrado en honor a Polonia.',
    description: 'Elemento radiactivo extremadamente raro.',
    x: 16,
    y: 6,
  },
  {
    number: 85,
    symbol: 'At',
    name: 'Astato',
    mass: '[210]',
    group: 17,
    period: 6,
    category: 'halogen',
    state: 'Sólido',
    discovered: '1940',
    discoverer: 'Dale Corson, Kenneth MacKenzie y Emilio Segrè',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',
    uses: ['Investigación médica', 'Investigación nuclear'],
    found: ['Trazas en minerales radiactivos'],
    fact: 'Es uno de los elementos naturales más raros.',
    description: 'Halógeno radiactivo extremadamente escaso.',
    x: 17,
    y: 6,
  },
  {
    number: 86,
    symbol: 'Rn',
    name: 'Radón',
    mass: '[222]',
    group: 18,
    period: 6,
    category: 'noble',
    state: 'Gas',
    discovered: '1900',
    discoverer: 'Friedrich Ernst Dorn',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',
    uses: ['Investigación'],
    found: ['Rocas', 'Suelos'],
    fact: 'Es un gas noble radiactivo que puede acumularse en interiores.',
    description:
      'Gas noble radiactivo producido durante cadenas de desintegración.',
    x: 18,
    y: 6,
  },

  {
    number: 87,
    symbol: 'Fr',
    name: 'Francio',
    mass: '[223]',
    group: 1,
    period: 7,
    category: 'alkali',
    state: 'Sólido',
    discovered: '1939',
    discoverer: 'Marguerite Perey',
    config: '[Rn] 7s¹',
    uses: ['Investigación'],
    found: ['Trazas en minerales radiactivos'],
    fact: 'Es uno de los elementos naturales más raros.',
    description: 'Metal alcalino extremadamente radiactivo.',
    x: 1,
    y: 7,
  },
  {
    number: 88,
    symbol: 'Ra',
    name: 'Radio',
    mass: '[226]',
    group: 2,
    period: 7,
    category: 'alkaline',
    state: 'Sólido',
    discovered: '1898',
    discoverer: 'Marie Curie y Pierre Curie',
    config: '[Rn] 7s²',
    uses: ['Investigación histórica', 'Ciencia nuclear'],
    found: ['Minerales de uranio'],
    fact: 'Fue uno de los elementos estudiados por Marie Curie.',
    description: 'Metal alcalinotérreo altamente radiactivo.',
    x: 2,
    y: 7,
  },

  {
    number: 89,
    symbol: 'Ac',
    name: 'Actinio',
    mass: '[227]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1899',
    discoverer: 'André-Louis Debierne',
    config: '[Rn] 6d¹ 7s²',
    uses: ['Investigación', 'Medicina nuclear'],
    found: ['Minerales de uranio'],
    fact: 'Da nombre a la serie de los actínidos.',
    description: 'Metal radiactivo de la serie de los actínidos.',
    x: 4,
    y: 9,
  },
  {
    number: 90,
    symbol: 'Th',
    name: 'Torio',
    mass: '232.038',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1828',
    discoverer: 'Morten Thrane Esmark y Jöns Jacob Berzelius',
    config: '[Rn] 6d² 7s²',
    uses: ['Investigación nuclear', 'Aleaciones'],
    found: ['Monacita', 'Minerales'],
    fact: 'Es un elemento radiactivo natural.',
    description: 'Metal actínido presente en varios minerales.',
    x: 5,
    y: 9,
  },
  {
    number: 91,
    symbol: 'Pa',
    name: 'Protactinio',
    mass: '231.036',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1913',
    discoverer: 'Kasimir Fajans y Oswald Helmuth Göhring',
    config: '[Rn] 5f² 6d¹ 7s²',
    uses: ['Investigación'],
    found: ['Minerales de uranio'],
    fact: 'Es extremadamente raro y radiactivo.',
    description: 'Actínido poco abundante.',
    x: 6,
    y: 9,
  },
  {
    number: 92,
    symbol: 'U',
    name: 'Uranio',
    mass: '238.029',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1789',
    discoverer: 'Martin Heinrich Klaproth',
    config: '[Rn] 5f³ 6d¹ 7s²',
    uses: ['Energía nuclear', 'Investigación'],
    found: ['Minerales de uranio'],
    fact: 'Es el elemento natural más pesado que se encuentra en cantidades significativas.',
    description: 'Metal actínido pesado y radiactivo.',
    x: 7,
    y: 9,
  },
  {
    number: 93,
    symbol: 'Np',
    name: 'Neptunio',
    mass: '[237]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1940',
    discoverer: 'Edwin McMillan y Philip Abelson',
    config: '[Rn] 5f⁴ 6d¹ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue el primer elemento transuránico descubierto.',
    description:
      'Actínido radiactivo producido principalmente de forma artificial.',
    x: 8,
    y: 9,
  },
  {
    number: 94,
    symbol: 'Pu',
    name: 'Plutonio',
    mass: '[244]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1940',
    discoverer: 'Glenn Seaborg y colaboradores',
    config: '[Rn] 5f⁶ 7s²',
    uses: ['Energía nuclear', 'Investigación espacial'],
    found: ['Producido artificialmente'],
    fact: 'Es un elemento transuránico radiactivo.',
    description: 'Actínido pesado y radiactivo.',
    x: 9,
    y: 9,
  },
  {
    number: 95,
    symbol: 'Am',
    name: 'Americio',
    mass: '[243]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1944',
    discoverer: 'Glenn Seaborg y colaboradores',
    config: '[Rn] 5f⁷ 7s²',
    uses: ['Detectores de humo', 'Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Su nombre hace referencia a América.',
    description: 'Actínido radiactivo producido artificialmente.',
    x: 10,
    y: 9,
  },
  {
    number: 96,
    symbol: 'Cm',
    name: 'Curio',
    mass: '[247]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1944',
    discoverer: 'Glenn Seaborg y colaboradores',
    config: '[Rn] 5f⁷ 6d¹ 7s²',
    uses: ['Investigación', 'Ciencia espacial'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Marie y Pierre Curie.',
    description: 'Actínido sintético y radiactivo.',
    x: 11,
    y: 9,
  },
  {
    number: 97,
    symbol: 'Bk',
    name: 'Berkelio',
    mass: '[247]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1949',
    discoverer:
      'Stanley Thompson, Kenneth Street, Albert Ghiorso y Glenn Seaborg',
    config: '[Rn] 5f⁹ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado por Berkeley, California.',
    description: 'Actínido sintético y radiactivo.',
    x: 12,
    y: 9,
  },
  {
    number: 98,
    symbol: 'Cf',
    name: 'Californio',
    mass: '[251]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1950',
    discoverer: 'Stanley Thompson y colaboradores',
    config: '[Rn] 5f¹⁰ 7s²',
    uses: ['Investigación', 'Fuentes de neutrones'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor al estado de California.',
    description: 'Actínido sintético altamente radiactivo.',
    x: 13,
    y: 9,
  },
  {
    number: 99,
    symbol: 'Es',
    name: 'Einsteinio',
    mass: '[252]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1952',
    discoverer: 'Albert Ghiorso y colaboradores',
    config: '[Rn] 5f¹¹ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Albert Einstein.',
    description: 'Actínido sintético y radiactivo.',
    x: 14,
    y: 9,
  },
  {
    number: 100,
    symbol: 'Fm',
    name: 'Fermio',
    mass: '[257]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1952',
    discoverer: 'Albert Ghiorso y colaboradores',
    config: '[Rn] 5f¹² 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Enrico Fermi.',
    description: 'Actínido sintético.',
    x: 15,
    y: 9,
  },
  {
    number: 101,
    symbol: 'Md',
    name: 'Mendelevio',
    mass: '[258]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1955',
    discoverer: 'Albert Ghiorso y colaboradores',
    config: '[Rn] 5f¹³ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Dmitri Mendeleev.',
    description: 'Actínido sintético extremadamente raro.',
    x: 16,
    y: 9,
  },
  {
    number: 102,
    symbol: 'No',
    name: 'Nobelio',
    mass: '[259]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1958',
    discoverer: 'Albert Ghiorso y colaboradores',
    config: '[Rn] 5f¹⁴ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Alfred Nobel.',
    description: 'Actínido sintético y radiactivo.',
    x: 17,
    y: 9,
  },
  {
    number: 103,
    symbol: 'Lr',
    name: 'Lawrencio',
    mass: '[262]',
    period: 9,
    category: 'actinide',
    state: 'Sólido',
    discovered: '1961',
    discoverer: 'Albert Ghiorso y colaboradores',
    config: '[Rn] 5f¹⁴ 7s² 7p¹',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Ernest Lawrence.',
    description: 'Actínido sintético de vida muy corta.',
    x: 18,
    y: 9,
  },

  {
    number: 104,
    symbol: 'Rf',
    name: 'Rutherfordio',
    mass: '[267]',
    group: 4,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1964',
    discoverer: 'Equipo de Dubna',
    config: '[Rn] 5f¹⁴ 6d² 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Ernest Rutherford.',
    description: 'Elemento superpesado sintético.',
    x: 4,
    y: 7,
  },
  {
    number: 105,
    symbol: 'Db',
    name: 'Dubnio',
    mass: '[268]',
    group: 5,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1967',
    discoverer: 'Equipos de Dubna y Berkeley',
    config: '[Rn] 5f¹⁴ 6d³ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Su nombre hace referencia a Dubna, Rusia.',
    description: 'Elemento superpesado sintético.',
    x: 5,
    y: 7,
  },
  {
    number: 106,
    symbol: 'Sg',
    name: 'Seaborgio',
    mass: '[269]',
    group: 6,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1974',
    discoverer: 'Albert Ghiorso y colaboradores',
    config: '[Rn] 5f¹⁴ 6d⁴ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Glenn Seaborg.',
    description: 'Elemento superpesado producido artificialmente.',
    x: 6,
    y: 7,
  },
  {
    number: 107,
    symbol: 'Bh',
    name: 'Bohrio',
    mass: '[270]',
    group: 7,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1981',
    discoverer: 'Equipo de GSI',
    config: '[Rn] 5f¹⁴ 6d⁵ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Niels Bohr.',
    description: 'Elemento superpesado sintético.',
    x: 7,
    y: 7,
  },
  {
    number: 108,
    symbol: 'Hs',
    name: 'Hassio',
    mass: '[277]',
    group: 8,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1984',
    discoverer: 'Equipo de GSI',
    config: '[Rn] 5f¹⁴ 6d⁶ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Su nombre procede de Hesse, Alemania.',
    description: 'Elemento superpesado extremadamente inestable.',
    x: 8,
    y: 7,
  },
  {
    number: 109,
    symbol: 'Mt',
    name: 'Meitnerio',
    mass: '[278]',
    group: 9,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1982',
    discoverer: 'Equipo de GSI',
    config: '[Rn] 5f¹⁴ 6d⁷ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Lise Meitner.',
    description: 'Elemento superpesado sintético.',
    x: 9,
    y: 7,
  },
  {
    number: 110,
    symbol: 'Ds',
    name: 'Darmstadtio',
    mass: '[281]',
    group: 10,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1994',
    discoverer: 'Equipo de GSI',
    config: '[Rn] 5f¹⁴ 6d⁹ 7s¹',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado por Darmstadt, Alemania.',
    description: 'Elemento superpesado sintético.',
    x: 10,
    y: 7,
  },
  {
    number: 111,
    symbol: 'Rg',
    name: 'Roentgenio',
    mass: '[282]',
    group: 11,
    period: 7,
    category: 'transition',
    state: 'Sólido',
    discovered: '1994',
    discoverer: 'Equipo de GSI',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s¹',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Wilhelm Conrad Röntgen.',
    description: 'Elemento superpesado extremadamente inestable.',
    x: 11,
    y: 7,
  },
  {
    number: 112,
    symbol: 'Cn',
    name: 'Copernicio',
    mass: '[285]',
    group: 12,
    period: 7,
    category: 'transition',
    state: 'Gas',
    discovered: '1996',
    discoverer: 'Equipo de GSI',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor a Nicolás Copérnico.',
    description: 'Elemento superpesado producido artificialmente.',
    x: 12,
    y: 7,
  },
  {
    number: 113,
    symbol: 'Nh',
    name: 'Nihonio',
    mass: '[286]',
    group: 13,
    period: 7,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '2003',
    discoverer: 'Equipo de RIKEN',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Su nombre procede de Nihon, una palabra japonesa para Japón.',
    description: 'Elemento superpesado sintético.',
    x: 13,
    y: 7,
  },
  {
    number: 114,
    symbol: 'Fl',
    name: 'Flerovio',
    mass: '[289]',
    group: 14,
    period: 7,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '1998',
    discoverer: 'Equipo de Dubna',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor al Laboratorio Flerov.',
    description: 'Elemento superpesado sintético.',
    x: 14,
    y: 7,
  },
  {
    number: 115,
    symbol: 'Mc',
    name: 'Moscovio',
    mass: '[290]',
    group: 15,
    period: 7,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '2003',
    discoverer: 'Equipos de Dubna y Livermore',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Su nombre hace referencia a la región de Moscú.',
    description: 'Elemento superpesado sintético.',
    x: 15,
    y: 7,
  },
  {
    number: 116,
    symbol: 'Lv',
    name: 'Livermorio',
    mass: '[293]',
    group: 16,
    period: 7,
    category: 'post-transition',
    state: 'Sólido',
    discovered: '2000',
    discoverer: 'Equipos de Dubna y Livermore',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Fue nombrado en honor al Laboratorio Nacional Lawrence Livermore.',
    description: 'Elemento superpesado sintético.',
    x: 16,
    y: 7,
  },
  {
    number: 117,
    symbol: 'Ts',
    name: 'Tenesino',
    mass: '[294]',
    group: 17,
    period: 7,
    category: 'halogen',
    state: 'Sólido',
    discovered: '2010',
    discoverer: 'Colaboración internacional',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Su nombre hace referencia al estado de Tennessee.',
    description:
      'Elemento superpesado sintético de la familia de los halógenos.',
    x: 17,
    y: 7,
  },
  {
    number: 118,
    symbol: 'Og',
    name: 'Oganesón',
    mass: '[294]',
    group: 18,
    period: 7,
    category: 'noble',
    state: 'Sólido',
    discovered: '2002',
    discoverer: 'Colaboración internacional',
    config: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',
    uses: ['Investigación'],
    found: ['Producido artificialmente'],
    fact: 'Es el elemento con mayor número atómico reconocido actualmente.',
    description: 'Elemento superpesado extremadamente inestable.',
    x: 18,
    y: 7,
  },
]

const QUESTIONS = [
  {
    type: 'symbol',
    text: '¿Cuál es el símbolo de',
    getAnswer: (e: ElementData) => e.symbol,
    getQuestion: (e: ElementData) => e.name,
  },
  {
    type: 'number',
    text: '¿Cuál es el número atómico de',
    getAnswer: (e: ElementData) => String(e.number),
    getQuestion: (e: ElementData) => e.name,
  },
  {
    type: 'name',
    text: '¿Qué elemento corresponde al símbolo',
    getAnswer: (e: ElementData) => e.name,
    getQuestion: (e: ElementData) => e.symbol,
  },
]

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5)
}

function makeQuestion() {
  const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]
  const template = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]

  const others = shuffle(ELEMENTS.filter((e) => e.number !== element.number))
    .slice(0, 3)
    .map((e) => template.getAnswer(e))

  return {
    element,
    text: template.text,
    question: template.getQuestion(element),
    answer: template.getAnswer(element),
    options: shuffle([template.getAnswer(element), ...others]),
  }
}

function getElementsAtPosition(x: number, y: number) {
  return ELEMENTS.filter((element) => element.x === x && element.y === y)
}

export default function TablaPeriodicaPage() {
  const [view, setView] = useState<View>('explore')
  const [selected, setSelected] = useState<ElementData | null>(ELEMENTS[25])
  const [search, setSearch] = useState('')
  const [exploreMode, setExploreMode] = useState<'all' | ElementCategory>('all')

  const [gameQuestion, setGameQuestion] = useState(makeQuestion)
  const [gameScore, setGameScore] = useState(0)
  const [gameStreak, setGameStreak] = useState(0)
  const [gameTime, setGameTime] = useState(60)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameMessage, setGameMessage] = useState('')

  const [examSize, setExamSize] = useState(10)
  const [examDifficulty, setExamDifficulty] = useState<
    'fácil' | 'medio' | 'difícil'
  >('medio')
  const [examQuestions, setExamQuestions] = useState<
    ReturnType<typeof makeQuestion>[]
  >([])
  const [examIndex, setExamIndex] = useState(0)
  const [examScore, setExamScore] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [examAnswers, setExamAnswers] = useState<
    { question: string; correct: string; answer: string }[]
  >([])
  const [examTime, setExamTime] = useState(0)

  const filteredElements = useMemo(() => {
    const query = search.trim().toLowerCase()

    return ELEMENTS.filter((element) => {
      const matchesSearch =
        !query ||
        element.name.toLowerCase().includes(query) ||
        element.symbol.toLowerCase().includes(query) ||
        String(element.number).includes(query)

      const matchesCategory =
        exploreMode === 'all' || element.category === exploreMode

      return matchesSearch && matchesCategory
    })
  }, [search, exploreMode])

  useEffect(() => {
    if (!gameRunning) return

    const timer = window.setInterval(() => {
      setGameTime((current) => {
        if (current <= 1) {
          setGameRunning(false)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [gameRunning])

  useEffect(() => {
    if (!examStarted || examFinished) return

    const timer = window.setInterval(() => {
      setExamTime((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [examStarted, examFinished])

  function startGame() {
    setView('game')
    setGameQuestion(makeQuestion())
    setGameScore(0)
    setGameStreak(0)
    setGameTime(60)
    setGameMessage('')
    setGameRunning(true)
  }

  function answerGame(answer: string) {
    if (!gameRunning) return

    if (answer === gameQuestion.answer) {
      const newStreak = gameStreak + 1

      setGameStreak(newStreak)
      setGameScore((score) => score + 100 + newStreak * 20)
      setGameMessage('✓ ¡Correcto!')

      window.setTimeout(() => {
        setGameQuestion(makeQuestion())
        setGameMessage('')
      }, 350)
    } else {
      setGameStreak(0)
      setGameMessage(`✕ Era ${gameQuestion.answer}`)

      window.setTimeout(() => {
        setGameQuestion(makeQuestion())
        setGameMessage('')
      }, 800)
    }
  }

  function startExam() {
    const questions = Array.from({ length: examSize }, () => {
      const q = makeQuestion()

      if (examDifficulty === 'fácil') {
        return q
      }

      if (examDifficulty === 'difícil') {
        return {
          ...q,
          options: shuffle([
            q.answer,
            ...shuffle(
              ELEMENTS.filter(
                (element) =>
                  element.number !== q.element.number &&
                  Math.abs(element.number - q.element.number) < 25
              )
            )
              .slice(0, 3)
              .map((element) =>
                q.answer === element.name ? element.symbol : element.symbol
              ),
          ]),
        }
      }

      return q
    })

    setExamQuestions(questions)
    setExamIndex(0)
    setExamScore(0)
    setExamAnswers([])
    setExamTime(0)
    setExamStarted(true)
    setExamFinished(false)
    setView('exam')
  }

  function answerExam(answer: string) {
    const current = examQuestions[examIndex]

    if (!current) return

    const correct = answer === current.answer

    if (correct) {
      setExamScore((score) => score + 1)
    }

    setExamAnswers((answers) => [
      ...answers,
      {
        question: `${current.text} ${current.question}`,
        correct: current.answer,
        answer,
      },
    ])

    if (examIndex + 1 >= examQuestions.length) {
      setExamFinished(true)
      setExamStarted(false)
      return
    }

    setExamIndex((index) => index + 1)
  }

  function resetExam() {
    setExamQuestions([])
    setExamIndex(0)
    setExamScore(0)
    setExamAnswers([])
    setExamTime(0)
    setExamStarted(false)
    setExamFinished(false)
  }

  const selectedCategory = selected ? CATEGORY_INFO[selected.category] : null

  return (
    <main
      className="min-h-screen bg-[#1c242c] text-[#e9edf1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.055) 1.4px, transparent 1.4px)',
        backgroundSize: '26px 26px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@600;700&display=swap');

        .font-display {
          font-family: 'Oswald', 'Arial Narrow', sans-serif;
        }

        .font-label {
          font-family: 'IBM Plex Mono', monospace;
        }

        .font-hand {
          font-family: 'Caveat', cursive;
        }

        .periodic-grid {
          display: grid;
          grid-template-columns: repeat(18, minmax(42px, 1fr));
          grid-template-rows: repeat(9, 78px);
          gap: 5px;
          min-width: 880px;
        }

        .element-card {
          grid-column: var(--x);
          grid-row: var(--y);
        }

        .element-card:hover {
          transform: translateY(-3px) scale(1.025);
          z-index: 5;
        }

        @keyframes pulse-soft {
          0%, 100% { box-shadow: 0 0 0 0 rgba(242,169,59,.0); }
          50% { box-shadow: 0 0 0 5px rgba(242,169,59,.12); }
        }

        .game-target {
          animation: pulse-soft 1.6s infinite;
        }

        @media (max-width: 900px) {
          .periodic-grid {
            grid-template-rows: repeat(9, 64px);
          }
        }

        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* HEADER */}

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <div className="no-print">
          <Link
            href="/estudiantes"
            className="font-label text-[10px] uppercase tracking-widest text-[#7c8894] hover:text-[#f2a93b]"
          >
            ← Estudiantes
          </Link>

          <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="font-label inline-flex rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                ● Laboratorio ToolHub
              </span>

              <h1 className="font-display mt-5 text-5xl font-semibold uppercase tracking-tight sm:text-7xl">
                🧪 Tabla periódica
              </h1>

              <p className="mt-4 max-w-2xl text-[#a9b4bd]">
                Explora los 118 elementos, descubre sus propiedades, aprende
                jugando y pon a prueba tus conocimientos.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-[#3a4753] bg-[#232d36] px-5 py-4 text-center">
                <div className="font-display text-2xl font-bold">118</div>
                <div className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
                  elementos
                </div>
              </div>

              <div className="rounded-xl border border-[#3a4753] bg-[#232d36] px-5 py-4 text-center">
                <div className="font-display text-2xl font-bold">18</div>
                <div className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
                  grupos
                </div>
              </div>

              <div className="rounded-xl border border-[#3a4753] bg-[#232d36] px-5 py-4 text-center">
                <div className="font-display text-2xl font-bold">7</div>
                <div className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
                  períodos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN */}

        <div className="no-print mt-10 flex flex-wrap gap-2 border-y border-[#3a4753] py-4">
          {[
            ['explore', '🔬 Explorar'],
            ['game', '🎮 Element Hunt'],
            ['exam', '📝 Exámenes'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id as View)}
              className={`font-label rounded-full border px-5 py-2 text-[10px] uppercase tracking-widest transition ${
                view === id
                  ? 'border-[#f2a93b] bg-[#f2a93b]/15 text-[#f2a93b]'
                  : 'border-[#3a4753] text-[#8a97a3] hover:border-[#5a6774] hover:text-[#e9edf1]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* EXPLORAR */}

      {view === 'explore' && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              {/* BUSCADOR */}

              <div className="no-print rounded-2xl border border-[#3a4753] bg-[#232d36] p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <div className="flex flex-1 items-center rounded-lg border border-[#3a4753] bg-[#1c242c] px-4 py-3">
                    <span className="mr-3">🔎</span>

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar por nombre, símbolo o número..."
                      className="font-label w-full bg-transparent text-xs outline-none placeholder:text-[#5c6975]"
                    />
                  </div>

                  <select
                    value={exploreMode}
                    onChange={(event) =>
                      setExploreMode(
                        event.target.value as 'all' | ElementCategory
                      )
                    }
                    className="font-label rounded-lg border border-[#3a4753] bg-[#1c242c] px-4 py-3 text-xs outline-none"
                  >
                    <option value="all">Todos los elementos</option>

                    {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TABLA */}

              <div className="mt-5 overflow-x-auto rounded-2xl border border-[#3a4753] bg-[#20292f] p-4 shadow-[0_25px_50px_rgba(0,0,0,.3)]">
                <div className="periodic-grid">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div
                      key={`group-${i}`}
                      className="font-label flex items-center justify-center text-[8px] text-[#5c6975]"
                      style={{
                        gridColumn: i + 1,
                        gridRow: 1,
                        transform: 'translateY(-28px)',
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}

                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={`period-${i}`}
                      className="font-label flex items-center justify-center text-[8px] text-[#5c6975]"
                      style={{
                        gridColumn: 1,
                        gridRow: i + 1,
                        transform: 'translateX(-25px)',
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}

                  {ELEMENTS.map((element) => {
                    const visible = filteredElements.some(
                      (item) => item.number === element.number
                    )

                    const info = CATEGORY_INFO[element.category]

                    return (
                      <button
                        key={element.number}
                        type="button"
                        onClick={() => setSelected(element)}
                        className={`element-card group relative rounded-md border p-1 text-center transition ${
                          selected?.number === element.number
                            ? 'ring-2 ring-[#f2a93b] ring-offset-2 ring-offset-[#20292f]'
                            : ''
                        } ${
                          visible
                            ? 'opacity-100'
                            : 'pointer-events-none opacity-[0.08]'
                        }`}
                        style={
                          {
                            '--x': element.x,
                            '--y': element.y,
                            borderColor: `${info.color}88`,
                            background: `linear-gradient(145deg, ${info.color}20, #1c242c)`,
                          } as React.CSSProperties
                        }
                      >
                        <span
                          className="font-label absolute left-1 top-1 text-[7px] opacity-60"
                          style={{ color: info.color }}
                        >
                          {element.number}
                        </span>

                        <div className="mt-3 font-display text-xl font-bold">
                          {element.symbol}
                        </div>

                        <div className="mt-1 truncate text-[7px] text-[#a9b4bd]">
                          {element.name}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* LANTÁNIDOS / ACTÍNIDOS */}

                <div className="mt-8 border-t border-dashed border-[#3a4753] pt-5">
                  <div className="mb-3 flex gap-4">
                    <span className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
                      Lantánidos
                    </span>

                    <span className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
                      Actínidos
                    </span>
                  </div>

                  <div className="grid grid-cols-18 gap-1 overflow-x-auto">
                    {ELEMENTS.filter(
                      (element) =>
                        element.category === 'lanthanide' ||
                        element.category === 'actinide'
                    ).map((element) => {
                      const info = CATEGORY_INFO[element.category]

                      return (
                        <button
                          key={element.number}
                          type="button"
                          onClick={() => setSelected(element)}
                          className="min-w-[42px] rounded-md border p-1 text-center transition hover:-translate-y-1"
                          style={{
                            borderColor: `${info.color}88`,
                            background: `${info.color}18`,
                          }}
                        >
                          <div className="font-label text-[7px] opacity-60">
                            {element.number}
                          </div>

                          <div className="font-display text-lg font-bold">
                            {element.symbol}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* LEYENDA */}

              <div className="no-print mt-5 flex flex-wrap gap-2">
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setExploreMode(key as ElementCategory)}
                    className="font-label flex items-center gap-2 rounded-full border border-[#3a4753] px-3 py-2 text-[8px] uppercase tracking-widest text-[#8a97a3] hover:text-[#e9edf1]"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: info.color }}
                    />

                    {info.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PANEL */}

            <aside className="lg:sticky lg:top-6 lg:h-fit">
              {selected && selectedCategory && (
                <div className="overflow-hidden rounded-2xl border border-[#3a4753] bg-[#232d36] shadow-[0_25px_50px_rgba(0,0,0,.35)]">
                  <div
                    className="relative p-7"
                    style={{
                      background: `radial-gradient(circle at top right, ${selectedCategory.color}30, transparent 55%)`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className="font-label rounded-full border px-2 py-1 text-[8px] uppercase tracking-widest"
                          style={{
                            color: selectedCategory.color,
                            borderColor: `${selectedCategory.color}66`,
                          }}
                        >
                          {selectedCategory.label}
                        </span>

                        <h2 className="font-display mt-5 text-5xl font-bold">
                          {selected.symbol}
                        </h2>

                        <h3 className="font-display mt-1 text-2xl font-semibold uppercase">
                          {selected.name}
                        </h3>
                      </div>

                      <div className="text-right">
                        <div className="font-label text-3xl font-bold">
                          {selected.number}
                        </div>

                        <div className="font-label text-[8px] uppercase tracking-widest text-[#6c7a86]">
                          número atómico
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-2">
                      {[
                        ['Masa', selected.mass],
                        ['Estado', selected.state],
                        [
                          'Grupo',
                          selected.group ? String(selected.group) : '—',
                        ],
                        ['Período', String(selected.period)],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-[#3a4753] bg-[#1c242c]/70 p-3"
                        >
                          <div className="font-label text-[7px] uppercase tracking-widest text-[#6c7a86]">
                            {label}
                          </div>

                          <div className="mt-1 text-sm font-semibold">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5 border-t border-[#3a4753] p-6">
                    <div>
                      <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#f2a93b]">
                        🔬 Descripción
                      </span>

                      <p className="mt-2 text-sm leading-relaxed text-[#a9b4bd]">
                        {selected.description}
                      </p>
                    </div>

                    <div>
                      <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#f2a93b]">
                        🌎 ¿Dónde se encuentra?
                      </span>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {selected.found.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#3a4753] bg-[#1c242c] px-3 py-1.5 text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#f2a93b]">
                        🏭 Usos
                      </span>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {selected.uses.map((item) => (
                          <div
                            key={item}
                            className="rounded-lg border border-[#3a4753] bg-[#1c242c] p-3 text-xs text-[#c8d0d7]"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-[#f2a93b]/40 bg-[#f2a93b]/5 p-4">
                      <span className="font-label text-[8px] uppercase tracking-widest text-[#f2a93b]">
                        💡 Dato curioso
                      </span>

                      <p className="font-hand mt-2 text-xl leading-snug text-[#e9edf1]">
                        {selected.fact}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-[#1c242c] p-3">
                        <div className="font-label text-[7px] uppercase text-[#6c6975]">
                          Descubierto
                        </div>

                        <div className="mt-1">{selected.discovered}</div>
                      </div>

                      <div className="rounded-lg bg-[#1c242c] p-3">
                        <div className="font-label text-[7px] uppercase text-[#6c6975]">
                          Descubridor
                        </div>

                        <div className="mt-1">{selected.discoverer}</div>
                      </div>
                    </div>

                    <div>
                      <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#f2a93b]">
                        ⚛️ Configuración electrónica
                      </span>

                      <div className="mt-2 rounded-lg border border-[#3a4753] bg-[#1c242c] p-3 font-mono text-sm">
                        {selected.config}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* JUEGO */}

      {view === 'game' && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-label text-[9px] uppercase tracking-[0.3em] text-[#f2a93b]">
                    Juego de velocidad
                  </span>

                  <h2 className="font-display mt-1 text-3xl font-bold uppercase">
                    ⚡ Element Hunt
                  </h2>

                  <p className="mt-2 text-sm text-[#8a97a3]">
                    Encuentra la respuesta usando la tabla periódica.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] px-5 py-3 text-center">
                    <div className="font-display text-2xl font-bold">
                      {gameScore}
                    </div>
                    <div className="font-label text-[7px] uppercase tracking-widest text-[#6c6975]">
                      puntos
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] px-5 py-3 text-center">
                    <div className="font-display text-2xl font-bold">
                      🔥 {gameStreak}
                    </div>
                    <div className="font-label text-[7px] uppercase tracking-widest text-[#6c6975]">
                      racha
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-[#f2a93b]/30 bg-[#f2a93b]/5 p-8 text-center">
                <div className="font-label text-[9px] uppercase tracking-[0.3em] text-[#f2a93b]">
                  Encuentra
                </div>

                <div className="font-display mt-4 text-4xl font-bold uppercase">
                  {gameQuestion.question}
                </div>

                <div className="mt-2 text-sm text-[#8a97a3]">
                  {gameQuestion.text}
                </div>

                <div className="mt-5 font-display text-6xl font-bold text-[#f2a93b]">
                  {gameQuestion.question}
                </div>

                {gameMessage && (
                  <div className="font-display mt-5 text-xl font-bold">
                    {gameMessage}
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {gameQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={!gameRunning}
                    onClick={() => answerGame(option)}
                    className="font-display rounded-xl border border-[#3a4753] bg-[#232d36] px-5 py-5 text-lg font-semibold uppercase transition hover:-translate-y-1 hover:border-[#f2a93b] hover:bg-[#f2a93b]/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {option}
                  </button>
                ))}
              </div>

              {!gameRunning && (
                <button
                  type="button"
                  onClick={startGame}
                  className="font-label mt-6 w-full rounded-lg bg-[#f2a93b] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#1c242c] hover:bg-[#ffbc55]"
                >
                  {gameTime === 0 ? 'Jugar de nuevo' : 'Comenzar'}
                </button>
              )}
            </div>

            <aside className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-6">
              <div className="text-center">
                <div className="font-label text-[9px] uppercase tracking-widest text-[#6c6975]">
                  tiempo
                </div>

                <div className="font-display mt-1 text-6xl font-bold">
                  {gameTime}s
                </div>

                <div
                  className={`mx-auto mt-4 h-2 max-w-[180px] overflow-hidden rounded-full bg-[#1c242c] ${
                    gameRunning ? 'game-target' : ''
                  }`}
                >
                  <div
                    className="h-full bg-[#f2a93b] transition-all"
                    style={{ width: `${(gameTime / 60) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-4">
                  <div className="font-label text-[8px] uppercase tracking-widest text-[#f2a93b]">
                    Cómo jugar
                  </div>

                  <p className="mt-2 text-sm text-[#8a97a3]">
                    Lee la pista y selecciona la respuesta correcta lo más
                    rápido posible.
                  </p>
                </div>

                <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-4">
                  <div className="font-label text-[8px] uppercase tracking-widest text-[#f2a93b]">
                    Puntuación
                  </div>

                  <p className="mt-2 text-sm text-[#8a97a3]">
                    Cada respuesta correcta suma puntos. Mantén la racha para
                    conseguir multiplicadores.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* EXAMEN */}

      {view === 'exam' && (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          {!examStarted && !examFinished && (
            <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-8">
              <span className="font-label text-[9px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Modo evaluación
              </span>

              <h2 className="font-display mt-2 text-4xl font-bold uppercase">
                📝 Crear examen
              </h2>

              <p className="mt-3 max-w-2xl text-[#8a97a3]">
                Configura una prueba personalizada y comprueba cuánto sabes
                sobre los elementos.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="font-label text-[9px] uppercase tracking-widest text-[#6c6975]">
                    Número de preguntas
                  </label>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[5, 10, 20, 30].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setExamSize(size)}
                        className={`rounded-lg border py-3 font-semibold ${
                          examSize === size
                            ? 'border-[#f2a93b] bg-[#f2a93b]/15 text-[#f2a93b]'
                            : 'border-[#3a4753] bg-[#1c242c]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-label text-[9px] uppercase tracking-widest text-[#6c6975]">
                    Dificultad
                  </label>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(['fácil', 'medio', 'difícil'] as const).map(
                      (difficulty) => (
                        <button
                          key={difficulty}
                          type="button"
                          onClick={() => setExamDifficulty(difficulty)}
                          className={`rounded-lg border py-3 text-sm capitalize ${
                            examDifficulty === difficulty
                              ? 'border-[#f2a93b] bg-[#f2a93b]/15 text-[#f2a93b]'
                              : 'border-[#3a4753] bg-[#1c242c]'
                          }`}
                        >
                          {difficulty}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-5">
                  <div className="text-2xl">🔢</div>
                  <h3 className="font-display mt-3 font-semibold uppercase">
                    Números
                  </h3>
                  <p className="mt-1 text-xs text-[#8a97a3]">
                    Números atómicos y símbolos.
                  </p>
                </div>

                <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-5">
                  <div className="text-2xl">🧬</div>
                  <h3 className="font-display mt-3 font-semibold uppercase">
                    Elementos
                  </h3>
                  <p className="mt-1 text-xs text-[#8a97a3]">
                    Identifica nombres y propiedades.
                  </p>
                </div>

                <div className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-5">
                  <div className="text-2xl">🧠</div>
                  <h3 className="font-display mt-3 font-semibold uppercase">
                    Memoria
                  </h3>
                  <p className="mt-1 text-xs text-[#8a97a3]">
                    Pon a prueba lo que recuerdas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startExam}
                className="font-label mt-8 w-full rounded-lg bg-[#f2a93b] px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1c242c] hover:bg-[#ffbc55]"
              >
                Comenzar examen →
              </button>
            </div>
          )}

          {examStarted && examQuestions[examIndex] && (
            <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-label text-[9px] uppercase tracking-widest text-[#f2a93b]">
                    Pregunta {examIndex + 1} / {examQuestions.length}
                  </span>

                  <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-[#1c242c]">
                    <div
                      className="h-full bg-[#f2a93b]"
                      style={{
                        width: `${
                          ((examIndex + 1) / examQuestions.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="font-label text-xs text-[#8a97a3]">
                  ⏱ {Math.floor(examTime / 60)}:
                  {String(examTime % 60).padStart(2, '0')}
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#6c6975]">
                  {examQuestions[examIndex].text}
                </p>

                <h2 className="font-display mt-4 text-4xl font-bold uppercase sm:text-5xl">
                  {examQuestions[examIndex].question}
                </h2>
              </div>

              <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
                {examQuestions[examIndex].options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answerExam(option)}
                    className="rounded-xl border border-[#3a4753] bg-[#1c242c] p-5 text-left transition hover:-translate-y-1 hover:border-[#f2a93b] hover:bg-[#f2a93b]/10"
                  >
                    <span className="font-display text-lg font-semibold">
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {examFinished && (
            <div className="rounded-2xl border border-[#f2a93b]/40 bg-[#232d36] p-8 text-center">
              <div className="text-5xl">
                {examScore / examQuestions.length >= 0.9
                  ? '🏆'
                  : examScore / examQuestions.length >= 0.7
                    ? '🧪'
                    : '📚'}
              </div>

              <p className="font-label mt-5 text-[9px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Examen terminado
              </p>

              <h2 className="font-display mt-2 text-5xl font-bold">
                {Math.round((examScore / examQuestions.length) * 100)}%
              </h2>

              <p className="mt-2 text-[#8a97a3]">
                {examScore} correctas de {examQuestions.length}
              </p>

              <div className="mx-auto mt-7 h-3 max-w-md overflow-hidden rounded-full bg-[#1c242c]">
                <div
                  className="h-full bg-[#f2a93b]"
                  style={{
                    width: `${(examScore / examQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mx-auto mt-8 max-w-2xl text-left">
                <h3 className="font-display text-xl font-semibold uppercase">
                  Revisar respuestas
                </h3>

                <div className="mt-4 space-y-2">
                  {examAnswers.map((item, index) => (
                    <div
                      key={`${item.question}-${index}`}
                      className={`rounded-xl border p-4 ${
                        item.answer === item.correct
                          ? 'border-[#7cb87f]/30 bg-[#7cb87f]/5'
                          : 'border-[#e2637a]/30 bg-[#e2637a]/5'
                      }`}
                    >
                      <div className="flex gap-3">
                        <span>{item.answer === item.correct ? '✓' : '✕'}</span>

                        <div>
                          <p className="text-sm">{item.question}</p>

                          <p className="font-label mt-2 text-[9px] uppercase tracking-wider text-[#8a97a3]">
                            Tu respuesta: {item.answer}
                          </p>

                          {item.answer !== item.correct && (
                            <p className="font-label mt-1 text-[9px] uppercase tracking-wider text-[#f2a93b]">
                              Correcta: {item.correct}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={resetExam}
                className="font-label mt-8 rounded-lg bg-[#f2a93b] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#1c242c]"
              >
                Crear otro examen
              </button>
            </div>
          )}
        </section>
      )}

      {/* FOOTER */}

      <section className="no-print mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f] p-6 text-center">
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-[#f2a93b]">
            ToolHub / Laboratorio
          </span>

          <p className="mx-auto mt-2 max-w-xl text-sm text-[#7c8894]">
            Una herramienta educativa interactiva. Los datos se mantienen
            localmente por ahora; no necesitas una cuenta para utilizarla.
          </p>
        </div>
      </section>
    </main>
  )
}
