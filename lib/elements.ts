export type ElementCategory =
  | 'alcalinos'
  | 'alcalinoterreos'
  | 'metales-transicion'
  | 'metales-postransicion'
  | 'metaloides'
  | 'no-metales'
  | 'halogenos'
  | 'gases-nobles'
  | 'lantanidos'
  | 'actinidos'
  | 'otros'

export interface ElementData {
  number: number
  symbol: string
  name: string
  mass: string
  category: ElementCategory
}

const data: Array<
  [number, string, string, string, ElementCategory]
> = [
  [1, 'H', 'Hidrógeno', '1.008', 'no-metales'],
  [2, 'He', 'Helio', '4.003', 'gases-nobles'],
  [3, 'Li', 'Litio', '6.94', 'alcalinos'],
  [4, 'Be', 'Berilio', '9.012', 'alcalinoterreos'],
  [5, 'B', 'Boro', '10.81', 'metaloides'],
  [6, 'C', 'Carbono', '12.011', 'no-metales'],
  [7, 'N', 'Nitrógeno', '14.007', 'no-metales'],
  [8, 'O', 'Oxígeno', '15.999', 'no-metales'],
  [9, 'F', 'Flúor', '18.998', 'halogenos'],
  [10, 'Ne', 'Neón', '20.180', 'gases-nobles'],

  [11, 'Na', 'Sodio', '22.990', 'alcalinos'],
  [12, 'Mg', 'Magnesio', '24.305', 'alcalinoterreos'],
  [13, 'Al', 'Aluminio', '26.982', 'metales-postransicion'],
  [14, 'Si', 'Silicio', '28.085', 'metaloides'],
  [15, 'P', 'Fósforo', '30.974', 'no-metales'],
  [16, 'S', 'Azufre', '32.06', 'no-metales'],
  [17, 'Cl', 'Cloro', '35.45', 'halogenos'],
  [18, 'Ar', 'Argón', '39.948', 'gases-nobles'],

  [19, 'K', 'Potasio', '39.098', 'alcalinos'],
  [20, 'Ca', 'Calcio', '40.078', 'alcalinoterreos'],
  [21, 'Sc', 'Escandio', '44.956', 'metales-transicion'],
  [22, 'Ti', 'Titanio', '47.867', 'metales-transicion'],
  [23, 'V', 'Vanadio', '50.942', 'metales-transicion'],
  [24, 'Cr', 'Cromo', '51.996', 'metales-transicion'],
  [25, 'Mn', 'Manganeso', '54.938', 'metales-transicion'],
  [26, 'Fe', 'Hierro', '55.845', 'metales-transicion'],
  [27, 'Co', 'Cobalto', '58.933', 'metales-transicion'],
  [28, 'Ni', 'Níquel', '58.693', 'metales-transicion'],
  [29, 'Cu', 'Cobre', '63.546', 'metales-transicion'],
  [30, 'Zn', 'Zinc', '65.38', 'metales-transicion'],
  [31, 'Ga', 'Galio', '69.723', 'metales-postransicion'],
  [32, 'Ge', 'Germanio', '72.630', 'metaloides'],
  [33, 'As', 'Arsénico', '74.922', 'metaloides'],
  [34, 'Se', 'Selenio', '78.971', 'no-metales'],
  [35, 'Br', 'Bromo', '79.904', 'halogenos'],
  [36, 'Kr', 'Kriptón', '83.798', 'gases-nobles'],

  [37, 'Rb', 'Rubidio', '85.468', 'alcalinos'],
  [38, 'Sr', 'Estroncio', '87.62', 'alcalinoterreos'],
  [39, 'Y', 'Itrio', '88.906', 'metales-transicion'],
  [40, 'Zr', 'Circonio', '91.224', 'metales-transicion'],
  [41, 'Nb', 'Niobio', '92.906', 'metales-transicion'],
  [42, 'Mo', 'Molibdeno', '95.95', 'metales-transicion'],
  [43, 'Tc', 'Tecnecio', '[98]', 'metales-transicion'],
  [44, 'Ru', 'Rutenio', '101.07', 'metales-transicion'],
  [45, 'Rh', 'Rodio', '102.91', 'metales-transicion'],
  [46, 'Pd', 'Paladio', '106.42', 'metales-transicion'],
  [47, 'Ag', 'Plata', '107.87', 'metales-transicion'],
  [48, 'Cd', 'Cadmio', '112.41', 'metales-transicion'],
  [49, 'In', 'Indio', '114.82', 'metales-postransicion'],
  [50, 'Sn', 'Estaño', '118.71', 'metales-postransicion'],
  [51, 'Sb', 'Antimonio', '121.76', 'metaloides'],
  [52, 'Te', 'Telurio', '127.60', 'metaloides'],
  [53, 'I', 'Yodo', '126.90', 'halogenos'],
  [54, 'Xe', 'Xenón', '131.29', 'gases-nobles'],

  [55, 'Cs', 'Cesio', '132.91', 'alcalinos'],
  [56, 'Ba', 'Bario', '137.33', 'alcalinoterreos'],

  [57, 'La', 'Lantano', '138.91', 'lantanidos'],
  [58, 'Ce', 'Cerio', '140.12', 'lantanidos'],
  [59, 'Pr', 'Praseodimio', '140.91', 'lantanidos'],
  [60, 'Nd', 'Neodimio', '144.24', 'lantanidos'],
  [61, 'Pm', 'Prometio', '[145]', 'lantanidos'],
  [62, 'Sm', 'Samario', '150.36', 'lantanidos'],
  [63, 'Eu', 'Europio', '151.96', 'lantanidos'],
  [64, 'Gd', 'Gadolinio', '157.25', 'lantanidos'],
  [65, 'Tb', 'Terbio', '158.93', 'lantanidos'],
  [66, 'Dy', 'Disprosio', '162.50', 'lantanidos'],
  [67, 'Ho', 'Holmio', '164.93', 'lantanidos'],
  [68, 'Er', 'Erbio', '167.26', 'lantanidos'],
  [69, 'Tm', 'Tulio', '168.93', 'lantanidos'],
  [70, 'Yb', 'Iterbio', '173.05', 'lantanidos'],
  [71, 'Lu', 'Lutecio', '174.97', 'lantanidos'],

  [72, 'Hf', 'Hafnio', '178.49', 'metales-transicion'],
  [73, 'Ta', 'Tantalio', '180.95', 'metales-transicion'],
  [74, 'W', 'Wolframio', '183.84', 'metales-transicion'],
  [75, 'Re', 'Renio', '186.21', 'metales-transicion'],
  [76, 'Os', 'Osmio', '190.23', 'metales-transicion'],
  [77, 'Ir', 'Iridio', '192.22', 'metales-transicion'],
  [78, 'Pt', 'Platino', '195.08', 'metales-transicion'],
  [79, 'Au', 'Oro', '196.97', 'metales-transicion'],
  [80, 'Hg', 'Mercurio', '200.59', 'metales-transicion'],
  [81, 'Tl', 'Talio', '204.38', 'metales-postransicion'],
  [82, 'Pb', 'Plomo', '207.2', 'metales-postransicion'],
  [83, 'Bi', 'Bismuto', '208.98', 'metales-postransicion'],
  [84, 'Po', 'Polonio', '[209]', 'metaloides'],
  [85, 'At', 'Astato', '[210]', 'halogenos'],
  [86, 'Rn', 'Radón', '[222]', 'gases-nobles'],

  [87, 'Fr', 'Francio', '[223]', 'alcalinos'],
  [88, 'Ra', 'Radio', '[226]', 'alcalinoterreos'],

  [89, 'Ac', 'Actinio', '[227]', 'actinidos'],
  [90, 'Th', 'Torio', '232.04', 'actinidos'],
  [91, 'Pa', 'Protactinio', '231.04', 'actinidos'],
  [92, 'U', 'Uranio', '238.03', 'actinidos'],
  [93, 'Np', 'Neptunio', '[237]', 'actinidos'],
  [94, 'Pu', 'Plutonio', '[244]', 'actinidos'],
  [95, 'Am', 'Americio', '[243]', 'actinidos'],
  [96, 'Cm', 'Curio', '[247]', 'actinidos'],
  [97, 'Bk', 'Berkelio', '[247]', 'actinidos'],
  [98, 'Cf', 'Californio', '[251]', 'actinidos'],
  [99, 'Es', 'Einsteinio', '[252]', 'actinidos'],
  [100, 'Fm', 'Fermio', '[257]', 'actinidos'],
  [101, 'Md', 'Mendelevio', '[258]', 'actinidos'],
  [102, 'No', 'Nobelio', '[259]', 'actinidos'],
  [103, 'Lr', 'Lawrencio', '[266]', 'actinidos'],

  [104, 'Rf', 'Rutherfordio', '[267]', 'metales-transicion'],
  [105, 'Db', 'Dubnio', '[268]', 'metales-transicion'],
  [106, 'Sg', 'Seaborgio', '[269]', 'metales-transicion'],
  [107, 'Bh', 'Bohrio', '[270]', 'metales-transicion'],
  [108, 'Hs', 'Hassio', '[277]', 'metales-transicion'],
  [109, 'Mt', 'Meitnerio', '[278]', 'metales-transicion'],
  [110, 'Ds', 'Darmstadtio', '[281]', 'metales-transicion'],
  [111, 'Rg', 'Roentgenio', '[282]', 'metales-transicion'],
  [112, 'Cn', 'Copernicio', '[285]', 'metales-transicion'],
  [113, 'Nh', 'Nihonio', '[286]', 'metales-postransicion'],
  [114, 'Fl', 'Flerovio', '[289]', 'metales-postransicion'],
  [115, 'Mc', 'Moscovio', '[290]', 'metales-postransicion'],
  [116, 'Lv', 'Livermorio', '[293]', 'metales-postransicion'],
  [117, 'Ts', 'Teneso', '[294]', 'halogenos'],
  [118, 'Og', 'Oganesón', '[294]', 'gases-nobles'],
]

export const ELEMENTS: ElementData[] = data.map(
  ([number, symbol, name, mass, category]) => ({
    number,
    symbol,
    name,
    mass,
    category,
  })
)

export const ELEMENT_BY_NUMBER = new Map(
  ELEMENTS.map((element) => [element.number, element])
)