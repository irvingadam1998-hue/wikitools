'use client'

import { useMemo, useState } from 'react'

type Scale = 100 | 10 | 5 | 4

interface Subject {
  id: number
  name: string
  grade: string
  credits: string
}

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'Matemáticas',
    grade: '90',
    credits: '3',
  },
  {
    id: 2,
    name: 'Historia',
    grade: '85',
    credits: '2',
  },
  {
    id: 3,
    name: 'Ciencias',
    grade: '95',
    credits: '4',
  },
]

const SCALE_CONFIG: Record<
  Scale,
  {
    label: string
    max: number
  }
> = {
  100: {
    label: '0 — 100',
    max: 100,
  },
  10: {
    label: '0 — 10',
    max: 10,
  },
  5: {
    label: '0 — 5',
    max: 5,
  },
  4: {
    label: '0 — 4',
    max: 4,
  },
}

export default function GradeCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS)

  const [scale, setScale] = useState<Scale>(100)

  const [weighted, setWeighted] = useState(true)

  const [nextId, setNextId] = useState(4)

  const config = SCALE_CONFIG[scale]

  function updateSubject(id: number, field: keyof Subject, value: string) {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === id
          ? {
              ...subject,
              [field]: value,
            }
          : subject
      )
    )
  }

  function addSubject() {
    setSubjects((current) => [
      ...current,
      {
        id: nextId,
        name: '',
        grade: '',
        credits: '1',
      },
    ])

    setNextId((current) => current + 1)
  }

  function removeSubject(id: number) {
    setSubjects((current) => current.filter((subject) => subject.id !== id))
  }

  function resetCalculator() {
    setSubjects(INITIAL_SUBJECTS)
    setScale(100)
    setWeighted(true)
    setNextId(4)
  }

  const statistics = useMemo(() => {
    const validSubjects = subjects.filter((subject) => {
      const grade = Number(subject.grade)

      return (
        subject.grade !== '' &&
        Number.isFinite(grade) &&
        grade >= 0 &&
        grade <= config.max
      )
    })

    if (validSubjects.length === 0) {
      return {
        average: 0,
        totalCredits: 0,
        bestGrade: 0,
        completed: 0,
      }
    }

    const totalCredits = validSubjects.reduce((total, subject) => {
      const credits = Math.max(Number(subject.credits) || 1, 0)

      return total + credits
    }, 0)

    const weightedTotal = validSubjects.reduce((total, subject) => {
      const grade = Number(subject.grade)

      const credits = Math.max(Number(subject.credits) || 1, 0)

      return total + grade * credits
    }, 0)

    const simpleTotal = validSubjects.reduce((total, subject) => {
      return total + Number(subject.grade)
    }, 0)

    const average = weighted
      ? totalCredits > 0
        ? weightedTotal / totalCredits
        : 0
      : simpleTotal / validSubjects.length

    const bestGrade = Math.max(
      ...validSubjects.map((subject) => Number(subject.grade))
    )

    return {
      average,
      totalCredits,
      bestGrade,
      completed: validSubjects.length,
    }
  }, [subjects, config.max, weighted])

  const progress =
    config.max > 0 ? Math.min((statistics.average / config.max) * 100, 100) : 0

  function getGradeStatus() {
    const percentage = (statistics.average / config.max) * 100

    if (percentage >= 90) return 'Excelente'
    if (percentage >= 80) return 'Muy bien'
    if (percentage >= 70) return 'Bien'
    if (percentage >= 60) return 'En camino'

    return 'Necesita mejorar'
  }

  return (
    <div
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
      `}</style>

      {/* HERO */}

      <section className="mx-auto max-w-5xl px-6 pb-10 pt-20 text-center">
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● Herramienta de matemáticas
        </span>

        <h1 className="font-display mt-6 text-5xl font-semibold uppercase tracking-tight sm:text-6xl">
          📊 Promedio
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9b4bd]">
          Calcula tu promedio simple o ponderado por créditos y materias.
        </p>
      </section>

      {/* CONTENIDO */}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* CALCULADORA */}

          <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] sm:p-8">
            {/* CONFIGURACIÓN */}

            <div className="grid gap-4 border-b border-[#3a4753] pb-6 sm:grid-cols-2">
              {/* ESCALA */}

              <div>
                <label className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                  Escala de notas
                </label>

                <select
                  value={scale}
                  onChange={(event) =>
                    setScale(Number(event.target.value) as Scale)
                  }
                  className="font-label mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-4 py-3 text-sm text-[#e9edf1] outline-none transition focus:border-[#f2a93b]"
                >
                  <option value={100}>0 — 100</option>

                  <option value={10}>0 — 10</option>

                  <option value={5}>0 — 5</option>

                  <option value={4}>0 — 4</option>
                </select>
              </div>

              {/* TIPO */}

              <div>
                <label className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                  Tipo de promedio
                </label>

                <div className="mt-2 flex rounded-md border border-[#3a4753] bg-[#1c242c] p-1">
                  <button
                    type="button"
                    onClick={() => setWeighted(false)}
                    className={`font-label flex-1 rounded px-3 py-2 text-[11px] uppercase tracking-wider transition ${
                      !weighted
                        ? 'bg-[#f2a93b] font-bold text-[#1c242c]'
                        : 'text-[#8a97a3] hover:text-[#e9edf1]'
                    }`}
                  >
                    Simple
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeighted(true)}
                    className={`font-label flex-1 rounded px-3 py-2 text-[11px] uppercase tracking-wider transition ${
                      weighted
                        ? 'bg-[#f2a93b] font-bold text-[#1c242c]'
                        : 'text-[#8a97a3] hover:text-[#e9edf1]'
                    }`}
                  >
                    Ponderado
                  </button>
                </div>
              </div>
            </div>

            {/* CABECERA */}

            <div className="mt-6 hidden grid-cols-[1fr_130px_120px_42px] gap-3 px-3 sm:grid">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-[#6c7a86]">
                Materia
              </span>

              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-[#6c7a86]">
                Nota
              </span>

              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-[#6c7a86]">
                Créditos
              </span>
            </div>

            {/* MATERIAS */}

            <div className="mt-3 space-y-3">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="grid gap-3 rounded-xl border border-[#3a4753] bg-[#1c242c] p-4 sm:grid-cols-[1fr_130px_120px_42px] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
                >
                  {/* NOMBRE */}

                  <div>
                    <label className="font-label mb-1 block text-[9px] uppercase tracking-widest text-[#6c7a86] sm:hidden">
                      Materia
                    </label>

                    <input
                      type="text"
                      value={subject.name}
                      onChange={(event) =>
                        updateSubject(subject.id, 'name', event.target.value)
                      }
                      placeholder={`Materia ${index + 1}`}
                      className="w-full rounded-md border border-[#3a4753] bg-[#232d36] px-3 py-3 text-sm text-[#e9edf1] outline-none placeholder:text-[#5c6975] transition focus:border-[#f2a93b]"
                    />
                  </div>

                  {/* NOTA */}

                  <div>
                    <label className="font-label mb-1 block text-[9px] uppercase tracking-widest text-[#6c7a86] sm:hidden">
                      Nota
                    </label>

                    <input
                      type="number"
                      min="0"
                      max={config.max}
                      step="0.01"
                      value={subject.grade}
                      onChange={(event) =>
                        updateSubject(subject.id, 'grade', event.target.value)
                      }
                      placeholder={`0-${config.max}`}
                      className="font-label w-full rounded-md border border-[#3a4753] bg-[#232d36] px-3 py-3 text-sm text-[#e9edf1] outline-none placeholder:text-[#5c6975] transition focus:border-[#f2a93b]"
                    />
                  </div>

                  {/* CREDITOS */}

                  <div>
                    <label className="font-label mb-1 block text-[9px] uppercase tracking-widest text-[#6c7a86] sm:hidden">
                      Créditos
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={subject.credits}
                      onChange={(event) =>
                        updateSubject(subject.id, 'credits', event.target.value)
                      }
                      className="font-label w-full rounded-md border border-[#3a4753] bg-[#232d36] px-3 py-3 text-sm text-[#e9edf1] outline-none transition focus:border-[#f2a93b]"
                    />
                  </div>

                  {/* ELIMINAR */}

                  <button
                    type="button"
                    onClick={() => removeSubject(subject.id)}
                    disabled={subjects.length === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-[#3a4753] text-[#6c7a86] transition hover:border-[#e2637a] hover:text-[#e2637a] disabled:cursor-not-allowed disabled:opacity-30"
                    title="Eliminar materia"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* AGREGAR */}

            <button
              type="button"
              onClick={addSubject}
              className="font-label mt-5 w-full rounded-md border border-dashed border-[#3a4753] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#a9b4bd] transition hover:border-[#f2a93b]/60 hover:bg-[#f2a93b]/5 hover:text-[#f2a93b]"
            >
              + Agregar materia
            </button>

            {/* ACCIONES */}

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#3a4753] pt-5">
              <button
                type="button"
                onClick={resetCalculator}
                className="font-label rounded-md border border-[#3a4753] bg-[#1c242c] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#8a97a3] transition hover:border-[#f2a93b]/50 hover:text-[#e9edf1]"
              >
                Reiniciar
              </button>
            </div>
          </div>

          {/* RESULTADO */}

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#f2a93b]/40 bg-gradient-to-br from-[#2a2118] to-[#232d36] p-6 shadow-[0_20px_35px_rgba(0,0,0,0.3)]">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Tu promedio
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-6xl font-semibold leading-none">
                  {statistics.average.toFixed(2)}
                </span>

                <span className="font-label mb-1 text-sm text-[#6c7a86]">
                  / {config.max}
                </span>
              </div>

              <p className="font-display mt-3 text-lg font-semibold uppercase text-[#f2a93b]">
                {getGradeStatus()}
              </p>

              {/* BARRA */}

              <div className="mt-6">
                <div className="h-3 overflow-hidden rounded-full bg-[#1c242c]">
                  <div
                    className="h-full rounded-full bg-[#f2a93b] transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="font-label mt-2 flex justify-between text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  <span>0</span>
                  <span>{config.max}</span>
                </div>
              </div>
            </div>

            {/* ESTADÍSTICAS */}

            <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-6">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Resumen
              </p>

              <div className="mt-5 divide-y divide-[#3a4753]">
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-[#8a97a3]">Materias</span>

                  <span className="font-label font-semibold">
                    {statistics.completed}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-[#8a97a3]">Créditos</span>

                  <span className="font-label font-semibold">
                    {statistics.totalCredits}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-[#8a97a3]">Mejor nota</span>

                  <span className="font-label font-semibold text-[#f2a93b]">
                    {statistics.bestGrade.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* NOTA */}

            <div
              className="relative rounded-lg border border-[#c9a876]/30 bg-[#f4e9c8] p-5 text-[#3a2c1a] shadow-[0_12px_20px_rgba(0,0,0,0.3)]"
              style={{
                transform: 'rotate(-1deg)',
              }}
            >
              <p className="font-label text-[9px] uppercase tracking-[0.3em] text-[#8a6a4a]">
                Nota rápida
              </p>

              <p className="font-hand mt-2 text-xl leading-snug">
                Las materias con más créditos tienen mayor peso en tu promedio.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* EXPLICACIÓN */}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="border-y border-[#3a4753] py-10">
          <div className="text-center">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
              Cómo funciona
            </p>

            <h2 className="font-display mt-2 text-2xl font-semibold uppercase sm:text-3xl">
              Tu promedio, sin complicaciones
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#3a4753] bg-[#232d36] p-5">
              <span className="text-2xl">📚</span>

              <h3 className="font-display mt-3 text-base font-semibold uppercase">
                01 — Agrega
              </h3>

              <p className="mt-2 text-sm text-[#8a97a3]">
                Añade todas las materias que quieras calcular.
              </p>
            </div>

            <div className="rounded-xl border border-[#3a4753] bg-[#232d36] p-5">
              <span className="text-2xl">⚖️</span>

              <h3 className="font-display mt-3 text-base font-semibold uppercase">
                02 — Pondera
              </h3>

              <p className="mt-2 text-sm text-[#8a97a3]">
                Introduce los créditos para dar más peso a las materias
                importantes.
              </p>
            </div>

            <div className="rounded-xl border border-[#3a4753] bg-[#232d36] p-5">
              <span className="text-2xl">📊</span>

              <h3 className="font-display mt-3 text-base font-semibold uppercase">
                03 — Resultado
              </h3>

              <p className="mt-2 text-sm text-[#8a97a3]">
                Obtén tu promedio inmediatamente mientras modificas tus notas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-dashed border-[#3a4753] bg-[#20292f] p-8 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
            ToolHub / Estudiantes
          </p>

          <h2 className="font-display mt-3 text-2xl font-semibold uppercase">
            Tus notas, bajo control.
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#8a97a3]">
            Calcula, compara y descubre qué necesitas para alcanzar tu próximo
            objetivo.
          </p>
        </div>
      </section>
    </div>
  )
}
