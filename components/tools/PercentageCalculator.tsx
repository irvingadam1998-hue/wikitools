'use client'

import { useMemo, useState } from 'react'

type CalculationType =
  | 'percentageOf'
  | 'whatPercentage'
  | 'increase'
  | 'decrease'
  | 'difference'

const calculations: Record<
  CalculationType,
  {
    title: string
    firstLabel: string
    secondLabel: string
    firstPlaceholder: string
    secondPlaceholder: string
  }
> = {
  percentageOf: {
    title: '¿Cuál es el X% de Y?',
    firstLabel: 'Porcentaje',
    secondLabel: 'Número',
    firstPlaceholder: 'Ej. 20',
    secondPlaceholder: 'Ej. 150',
  },
  whatPercentage: {
    title: '¿X es qué porcentaje de Y?',
    firstLabel: 'Número',
    secondLabel: 'Total',
    firstPlaceholder: 'Ej. 30',
    secondPlaceholder: 'Ej. 150',
  },
  increase: {
    title: 'Aumento porcentual',
    firstLabel: 'Valor inicial',
    secondLabel: 'Porcentaje de aumento',
    firstPlaceholder: 'Ej. 100',
    secondPlaceholder: 'Ej. 20',
  },
  decrease: {
    title: 'Disminución porcentual',
    firstLabel: 'Valor inicial',
    secondLabel: 'Porcentaje de disminución',
    firstPlaceholder: 'Ej. 100',
    secondPlaceholder: 'Ej. 20',
  },
  difference: {
    title: 'Diferencia porcentual',
    firstLabel: 'Valor inicial',
    secondLabel: 'Valor final',
    firstPlaceholder: 'Ej. 100',
    secondPlaceholder: 'Ej. 120',
  },
}

export default function PercentageCalculator() {
  const [type, setType] = useState<CalculationType>('percentageOf')

  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')

  const result = useMemo(() => {
    const a = Number(first)
    const b = Number(second)

    if (first === '' || second === '') {
      return null
    }

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return null
    }

    switch (type) {
      case 'percentageOf':
        return (a / 100) * b

      case 'whatPercentage':
        if (b === 0) return null
        return (a / b) * 100

      case 'increase':
        return a + (a * b) / 100

      case 'decrease':
        return a - (a * b) / 100

      case 'difference':
        if (a === 0) return null
        return ((b - a) / Math.abs(a)) * 100

      default:
        return null
    }
  }, [first, second, type])

  const formatResult = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 4,
    }).format(value)
  }

  const current = calculations[type]

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="calculation-type" className="text-sm font-medium">
          Tipo de cálculo
        </label>

        <select
          id="calculation-type"
          value={type}
          onChange={(event) => {
            setType(event.target.value as CalculationType)
            setFirst('')
            setSecond('')
          }}
          className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2"
        >
          <option value="percentageOf">¿Cuál es el X% de Y?</option>

          <option value="whatPercentage">¿X es qué porcentaje de Y?</option>

          <option value="increase">Aumento porcentual</option>

          <option value="decrease">Disminución porcentual</option>

          <option value="difference">Diferencia porcentual</option>
        </select>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">{current.title}</h2>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="first-value" className="text-sm font-medium">
            {current.firstLabel}
          </label>

          <input
            id="first-value"
            type="number"
            inputMode="decimal"
            value={first}
            onChange={(event) => setFirst(event.target.value)}
            placeholder={current.firstPlaceholder}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="second-value" className="text-sm font-medium">
            {current.secondLabel}
          </label>

          <input
            id="second-value"
            type="number"
            inputMode="decimal"
            value={second}
            onChange={(event) => setSecond(event.target.value)}
            placeholder={current.secondPlaceholder}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
          />
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-gray-50 p-6">
        <p className="text-sm text-gray-500">Resultado</p>

        {result !== null ? (
          <p className="mt-2 text-3xl font-bold">
            {formatResult(result)}
            {type === 'whatPercentage' || type === 'difference' ? '%' : ''}
          </p>
        ) : (
          <p className="mt-2 text-gray-500">
            Introduce los valores para calcular.
          </p>
        )}
      </div>
    </div>
  )
}
