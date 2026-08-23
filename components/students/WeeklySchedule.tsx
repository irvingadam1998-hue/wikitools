'use client'

import { useEffect, useMemo, useState } from 'react'

type Day = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes'

type Theme = 'pegboard' | 'paper' | 'minimal' | 'notebook' | 'planner'

type BlockType = 'class' | 'break'

interface ScheduleBlock {
  id: number
  day: Day
  start: string
  end: string
  subject: string
  room: string
  teacher: string
  color: string
  type: BlockType
}

interface ScheduleInfo {
  student: string
  school: string
  grade: string
  period: string
}

const DAYS: Day[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']

const DAY_SHORT: Record<Day, string> = {
  lunes: 'Lun',
  martes: 'Mar',
  miércoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
}

const COLORS = [
  '#f2a93b',
  '#4fb0a5',
  '#5b8dd9',
  '#e2637a',
  '#7cb87f',
  '#a78bd9',
  '#d9c25b',
]

const DEFAULT_INFO: ScheduleInfo = {
  student: '',
  school: '',
  grade: '',
  period: '2026 — 2027',
}

const DEFAULT_BLOCKS: ScheduleBlock[] = [
  {
    id: 1,
    day: 'lunes',
    start: '07:00',
    end: '08:00',
    subject: 'Matemáticas',
    room: 'A-201',
    teacher: 'Prof. García',
    color: '#f2a93b',
    type: 'class',
  },
  {
    id: 2,
    day: 'lunes',
    start: '08:00',
    end: '09:00',
    subject: 'Historia',
    room: 'B-104',
    teacher: 'Prof. López',
    color: '#4fb0a5',
    type: 'class',
  },
  {
    id: 3,
    day: 'martes',
    start: '09:00',
    end: '10:30',
    subject: 'Ciencias',
    room: 'Lab. 2',
    teacher: 'Prof. Ruiz',
    color: '#5b8dd9',
    type: 'class',
  },
  {
    id: 4,
    day: 'miércoles',
    start: '10:00',
    end: '10:30',
    subject: 'DESCANSO',
    room: '',
    teacher: '',
    color: '#d9c25b',
    type: 'break',
  },
]

const HOURS = Array.from(
  { length: 12 },
  (_, index) => `${String(index + 7).padStart(2, '0')}:00`
)

const THEME_INFO: Record<
  Theme,
  {
    name: string
    description: string
    icon: string
  }
> = {
  pegboard: {
    name: 'Toolboard',
    description: 'El estilo oficial de ToolHub.',
    icon: '🧰',
  },
  paper: {
    name: 'Papel escolar',
    description: 'Como una hoja de horario tradicional.',
    icon: '📄',
  },
  minimal: {
    name: 'Minimal',
    description: 'Limpio, elegante y muy imprimible.',
    icon: '▦',
  },
  notebook: {
    name: 'Cuaderno',
    description: 'Inspirado en una libreta escolar.',
    icon: '📓',
  },
  planner: {
    name: 'Planner',
    description: 'Estilo agenda semanal moderna.',
    icon: '🗂️',
  },
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function colorForSubject(subject: string) {
  if (!subject.trim()) {
    return COLORS[0]
  }

  const sum = subject
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return COLORS[sum % COLORS.length]
}

function minutesBetween(start: string, end: string) {
  return timeToMinutes(end) - timeToMinutes(start)
}

function formatDuration(start: string, end: string) {
  const minutes = minutesBetween(start, end)

  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60

  if (!remaining) {
    return `${hours} h`
  }

  return `${hours} h ${remaining} min`
}

export default function WeeklySchedule() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(DEFAULT_BLOCKS)

  const [theme, setTheme] = useState<Theme>('pegboard')

  const [info, setInfo] = useState<ScheduleInfo>(DEFAULT_INFO)

  const [showForm, setShowForm] = useState(false)

  const [showInfo, setShowInfo] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)

  const [nextId, setNextId] = useState(5)

  const [form, setForm] = useState({
    day: 'lunes' as Day,
    start: '07:00',
    end: '08:00',
    subject: '',
    room: '',
    teacher: '',
    color: COLORS[0],
    type: 'class' as BlockType,
  })

  /* =========================
     CARGAR DATOS
  ========================= */

  useEffect(() => {
    try {
      const savedBlocks = localStorage.getItem('toolhub-weekly-schedule-v2')

      const savedTheme = localStorage.getItem(
        'toolhub-weekly-schedule-theme-v2'
      )

      const savedInfo = localStorage.getItem('toolhub-weekly-schedule-info-v2')

      if (savedBlocks) {
        setBlocks(JSON.parse(savedBlocks))
      }

      if (savedTheme && savedTheme in THEME_INFO) {
        setTheme(savedTheme as Theme)
      }

      if (savedInfo) {
        setInfo(JSON.parse(savedInfo))
      }
    } catch {
      // Usamos valores iniciales.
    }
  }, [])

  /* =========================
     GUARDAR AUTOMÁTICAMENTE
  ========================= */

  useEffect(() => {
    localStorage.setItem('toolhub-weekly-schedule-v2', JSON.stringify(blocks))
  }, [blocks])

  useEffect(() => {
    localStorage.setItem('toolhub-weekly-schedule-theme-v2', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(
      'toolhub-weekly-schedule-info-v2',
      JSON.stringify(info)
    )
  }, [info])

  /* =========================
     ESTADÍSTICAS
  ========================= */

  const subjects = useMemo(() => {
    return new Set(
      blocks
        .filter((item) => item.type === 'class')
        .map((item) => item.subject.trim())
        .filter(Boolean)
    ).size
  }, [blocks])

  const totalHours = useMemo(() => {
    const minutes = blocks
      .filter((item) => item.type === 'class')
      .reduce((total, item) => total + minutesBetween(item.start, item.end), 0)

    return Math.round((minutes / 60) * 10) / 10
  }, [blocks])

  /* =========================
     FORMULARIO
  ========================= */

  function resetForm() {
    setForm({
      day: 'lunes',
      start: '07:00',
      end: '08:00',
      subject: '',
      room: '',
      teacher: '',
      color: COLORS[0],
      type: 'class',
    })

    setEditingId(null)
  }

  function openNewBlock() {
    resetForm()
    setShowForm(true)
  }

  function editBlock(block: ScheduleBlock) {
    setForm({
      day: block.day,
      start: block.start,
      end: block.end,
      subject: block.subject,
      room: block.room,
      teacher: block.teacher,
      color: block.color,
      type: block.type,
    })

    setEditingId(block.id)
    setShowForm(true)
  }

  function deleteBlock(id: number) {
    setBlocks((current) => current.filter((item) => item.id !== id))
  }

  function saveBlock() {
    if (!form.subject.trim()) {
      return
    }

    if (timeToMinutes(form.end) <= timeToMinutes(form.start)) {
      return
    }

    const data = {
      ...form,
      subject: form.subject.trim(),
    }

    if (editingId !== null) {
      setBlocks((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...data,
              }
            : item
        )
      )
    } else {
      setBlocks((current) => [
        ...current,
        {
          id: nextId,
          ...data,
        },
      ])

      setNextId((current) => current + 1)
    }

    setShowForm(false)
    resetForm()
  }

  function clearSchedule() {
    if (!window.confirm('¿Seguro que quieres borrar todo el horario?')) {
      return
    }

    setBlocks([])
  }

  function printSchedule() {
    window.print()
  }

  /* =========================
     DATOS POR DÍA
  ========================= */

  function blocksForDay(day: Day) {
    return blocks
      .filter((item) => item.day === day)
      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))
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

        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-area {
            display: block !important;
          }

          @page {
            size: A4 landscape;
            margin: 7mm;
          }
        }
      `}</style>

      {/* =========================
          HERO
      ========================= */}

      <section className="no-print mx-auto max-w-5xl px-6 pb-10 pt-20 text-center">
        <span className="font-label inline-flex rounded-full border border-dashed border-[#f2a93b]/50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#f2a93b]">
          ● Herramienta de organización
        </span>

        <h1 className="font-display mt-6 text-5xl font-semibold uppercase tracking-tight sm:text-6xl">
          🗓️ Mi horario
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9b4bd]">
          Diseña tu semana, personalízala y llévala directamente a una hoja A4.
        </p>
      </section>

      {/* =========================
          INFO DEL ESTUDIANTE
      ========================= */}

      <section className="no-print mx-auto max-w-7xl px-6 pb-5">
        <div className="rounded-2xl border border-[#3a4753] bg-[#232d36] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                Identidad del horario
              </p>

              <h2 className="font-display mt-1 text-xl font-semibold uppercase">
                Datos del estudiante
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowInfo((current) => !current)}
              className="font-label rounded-md border border-[#3a4753] px-4 py-2 text-xs uppercase tracking-wider text-[#a9b4bd] transition hover:border-[#f2a93b] hover:text-[#f2a93b]"
            >
              {showInfo ? 'Ocultar' : 'Editar datos'}
            </button>
          </div>

          {showInfo && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['student', 'Nombre', 'Ej. Irving'],
                ['school', 'Institución', 'Ej. Colegio Central'],
                ['grade', 'Grado / Curso', 'Ej. 10° A'],
                ['period', 'Período', 'Ej. 2026 — 2027'],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                    {label}
                  </label>

                  <input
                    value={info[key as keyof ScheduleInfo]}
                    onChange={(event) =>
                      setInfo({
                        ...info,
                        [key]: event.target.value,
                      })
                    }
                    placeholder={placeholder}
                    className="mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none placeholder:text-[#5c6975] focus:border-[#f2a93b]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          CONTROLES
      ========================= */}

      <section className="no-print mx-auto max-w-7xl px-6 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#3a4753] bg-[#232d36] p-4">
          <div className="font-label flex flex-wrap gap-5 text-[10px] uppercase tracking-widest text-[#6c7a86]">
            <span>{blocks.length} bloques</span>
            <span>{subjects} materias</span>
            <span>{totalHours} h semanales</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openNewBlock}
              className="font-label rounded-md bg-[#f2a93b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1c242c] transition hover:bg-[#ffbc55]"
            >
              + Agregar bloque
            </button>

            <button
              type="button"
              onClick={printSchedule}
              className="font-label rounded-md border border-[#3a4753] bg-[#1c242c] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition hover:border-[#f2a93b] hover:text-[#f2a93b]"
            >
              🖨️ Imprimir / PDF
            </button>

            <button
              type="button"
              onClick={clearSchedule}
              className="font-label rounded-md border border-[#3a4753] px-4 py-2.5 text-xs text-[#8a97a3] transition hover:border-[#e2637a] hover:text-[#e2637a]"
            >
              Vaciar
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          DISEÑOS
      ========================= */}

      <section className="no-print mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-2xl border border-[#3a4753] bg-[#20292f] p-6">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
            Diseños
          </p>

          <h2 className="font-display mt-1 text-xl font-semibold uppercase">
            Elige tu estilo
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(
              Object.entries(THEME_INFO) as [
                Theme,
                (typeof THEME_INFO)[Theme],
              ][]
            ).map(([id, item]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                className={`rounded-xl border p-4 text-left transition ${
                  theme === id
                    ? 'border-[#f2a93b] bg-[#f2a93b]/10'
                    : 'border-[#3a4753] bg-[#1c242c] hover:border-[#5a6774]'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>

                <p className="font-display mt-3 text-base font-semibold uppercase">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-[#8a97a3]">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          FORMULARIO
      ========================= */}

      {showForm && (
        <section className="no-print mx-auto max-w-4xl px-6 pb-8">
          <div className="rounded-2xl border border-[#f2a93b]/40 bg-[#232d36] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between">
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#f2a93b]">
                  {editingId ? 'Editar bloque' : 'Nuevo bloque'}
                </p>

                <h2 className="font-display mt-1 text-2xl font-semibold uppercase">
                  Datos del bloque
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="text-2xl text-[#6c7a86] hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* TIPO */}

              <div>
                <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  Tipo
                </label>

                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      type: event.target.value as BlockType,
                      subject:
                        event.target.value === 'break'
                          ? 'DESCANSO'
                          : form.subject,
                    })
                  }
                  className="font-label mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none focus:border-[#f2a93b]"
                >
                  <option value="class">📚 Clase</option>
                  <option value="break">☕ Descanso</option>
                </select>
              </div>

              {/* DÍA */}

              <div>
                <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  Día
                </label>

                <select
                  value={form.day}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      day: event.target.value as Day,
                    })
                  }
                  className="font-label mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none focus:border-[#f2a93b]"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day[0].toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* MATERIA */}

              <div>
                <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  {form.type === 'break' ? 'Nombre' : 'Materia *'}
                </label>

                <input
                  value={form.subject}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      subject: event.target.value,
                      color:
                        form.type === 'class'
                          ? colorForSubject(event.target.value)
                          : '#d9c25b',
                    })
                  }
                  placeholder={
                    form.type === 'break' ? 'Ej. Recreo' : 'Ej. Matemáticas'
                  }
                  className="mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none placeholder:text-[#5c6975] focus:border-[#f2a93b]"
                />
              </div>

              {/* INICIO */}

              <div>
                <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  Inicio
                </label>

                <input
                  type="time"
                  value={form.start}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      start: event.target.value,
                    })
                  }
                  className="font-label mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none focus:border-[#f2a93b]"
                />
              </div>

              {/* FIN */}

              <div>
                <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  Fin
                </label>

                <input
                  type="time"
                  value={form.end}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      end: event.target.value,
                    })
                  }
                  className="font-label mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none focus:border-[#f2a93b]"
                />
              </div>

              {/* AULA */}

              {form.type === 'class' && (
                <>
                  <div>
                    <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                      Aula
                    </label>

                    <input
                      value={form.room}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          room: event.target.value,
                        })
                      }
                      placeholder="Ej. A-201"
                      className="mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none placeholder:text-[#5c6975] focus:border-[#f2a93b]"
                    />
                  </div>

                  <div>
                    <label className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                      Profesor
                    </label>

                    <input
                      value={form.teacher}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          teacher: event.target.value,
                        })
                      }
                      placeholder="Ej. Prof. García"
                      className="mt-2 w-full rounded-md border border-[#3a4753] bg-[#1c242c] px-3 py-3 text-sm outline-none placeholder:text-[#5c6975] focus:border-[#f2a93b]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* COLOR */}

            {form.type === 'class' && (
              <div className="mt-5">
                <p className="font-label text-[9px] uppercase tracking-widest text-[#6c7a86]">
                  Color de la materia
                </p>

                <div className="mt-3 flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          color,
                        })
                      }
                      className={`h-8 w-8 rounded-full ${
                        form.color === color
                          ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#232d36]'
                          : ''
                      }`}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between border-t border-[#3a4753] pt-5">
              <div>
                {editingId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteBlock(editingId)
                      setShowForm(false)
                      resetForm()
                    }}
                    className="font-label rounded-md px-4 py-2 text-xs uppercase tracking-wider text-[#e2637a] hover:bg-[#e2637a]/10"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="font-label rounded-md border border-[#3a4753] px-5 py-2.5 text-xs uppercase tracking-wider text-[#8a97a3]"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={saveBlock}
                  className="font-label rounded-md bg-[#f2a93b] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1c242c]"
                >
                  {editingId ? 'Guardar cambios' : 'Agregar bloque'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          HORARIO — ESTA ES LA PARTE QUE SE IMPRIME
      ===================================================== */}

      <section className="print-area mx-auto max-w-[1500px] px-6 pb-24">
        <div className={`schedule-paper schedule-${theme}`}>
          {/* HEADER */}

          <header className="schedule-header">
            <div>
              <p className="schedule-kicker font-label">
                TOOLHUB / ESTUDIANTES
              </p>

              <h2 className="font-display schedule-title">
                Mi horario semanal
              </h2>

              {info.student && (
                <p className="schedule-student">{info.student}</p>
              )}
            </div>

            <div className="schedule-details">
              {info.school && <span>{info.school}</span>}

              {info.grade && <span>{info.grade}</span>}

              {info.period && <span>{info.period}</span>}
            </div>
          </header>

          {/* TABLA */}

          <div className="schedule-table">
            <div className="schedule-grid schedule-grid-header">
              <div className="schedule-time-header">HORA</div>

              {DAYS.map((day) => (
                <div key={day} className="schedule-day-header">
                  <strong>{day}</strong>

                  <small>{DAY_SHORT[day]}</small>
                </div>
              ))}
            </div>

            {HOURS.map((hour) => {
              const hourStart = timeToMinutes(hour)
              const hourEnd = hourStart + 60

              return (
                <div key={hour} className="schedule-grid schedule-grid-row">
                  <div className="schedule-time">{hour}</div>

                  {DAYS.map((day) => {
                    const items = blocksForDay(day).filter((item) => {
                      const start = timeToMinutes(item.start)

                      const end = timeToMinutes(item.end)

                      /*
                       * Solo dibujamos el bloque en la
                       * primera hora donde comienza.
                       * Así evitamos duplicarlo.
                       */
                      return (
                        start >= hourStart && start < hourEnd && end > start
                      )
                    })

                    return (
                      <div key={`${day}-${hour}`} className="schedule-cell">
                        {items.map((item) => {
                          const duration = Math.max(
                            1,
                            Math.ceil(minutesBetween(item.start, item.end) / 60)
                          )

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => editBlock(item)}
                              className={`schedule-block ${
                                item.type === 'break' ? 'schedule-break' : ''
                              }`}
                              style={
                                {
                                  '--block-color': item.color,
                                  minHeight: `${duration * 54}px`,
                                } as React.CSSProperties
                              }
                            >
                              <div className="schedule-block-top">
                                <strong>{item.subject}</strong>

                                <span
                                  className="schedule-dot"
                                  style={{
                                    background: item.color,
                                  }}
                                />
                              </div>

                              <span className="schedule-block-time">
                                {item.start} — {item.end}
                                {' · '}
                                {formatDuration(item.start, item.end)}
                              </span>

                              {item.room && (
                                <span className="schedule-block-meta">
                                  📍 {item.room}
                                </span>
                              )}

                              {item.teacher && (
                                <span className="schedule-block-meta">
                                  👤 {item.teacher}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* FOOTER */}

          <footer className="schedule-footer">
            <div>
              <span className="schedule-footer-label">SEMANA</span>

              <strong>LUNES — VIERNES</strong>
            </div>

            <div className="schedule-stats">
              <span>{subjects} materias</span>

              <span>{totalHours} h / semana</span>

              <span>{blocks.length} bloques</span>
            </div>

            <div className="schedule-brand">TOOLHUB</div>
          </footer>
        </div>
      </section>

      {/* =========================
          INFORMACIÓN
      ========================= */}

      <section className="no-print mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-[#3a4753] bg-[#20292f] p-6">
            <span className="text-2xl">🎨</span>

            <h3 className="font-display mt-3 text-lg font-semibold uppercase">
              5 diseños
            </h3>

            <p className="mt-2 text-sm text-[#8a97a3]">
              Escoge el diseño que mejor represente tu estilo antes de imprimir.
            </p>
          </div>

          <div className="rounded-xl border border-[#3a4753] bg-[#20292f] p-6">
            <span className="text-2xl">💾</span>

            <h3 className="font-display mt-3 text-lg font-semibold uppercase">
              Se guarda solo
            </h3>

            <p className="mt-2 text-sm text-[#8a97a3]">
              Tu horario queda guardado localmente en el navegador.
            </p>
          </div>

          <div className="rounded-xl border border-[#3a4753] bg-[#20292f] p-6">
            <span className="text-2xl">📄</span>

            <h3 className="font-display mt-3 text-lg font-semibold uppercase">
              Una hoja
            </h3>

            <p className="mt-2 text-sm text-[#8a97a3]">
              La versión de impresión está preparada para A4 horizontal.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          DISEÑOS DE IMPRESIÓN
      ===================================================== */}

      <style jsx global>{`
        .schedule-paper {
          width: 100%;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid #3a4753;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          color: #e9edf1;
        }

        .schedule-header {
          min-height: 105px;
          padding: 22px 26px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          border-bottom: 1px solid #3a4753;
        }

        .schedule-kicker {
          color: #f2a93b;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .schedule-title {
          margin-top: 3px;
          font-size: 30px;
          text-transform: uppercase;
          line-height: 1;
        }

        .schedule-student {
          margin-top: 5px;
          font-size: 12px;
          opacity: 0.65;
        }

        .schedule-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          opacity: 0.65;
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: 64px repeat(5, minmax(0, 1fr));
        }

        .schedule-grid-header {
          min-height: 48px;
        }

        .schedule-time-header,
        .schedule-day-header,
        .schedule-time,
        .schedule-cell {
          border-right: 1px solid #3a4753;
          border-bottom: 1px solid #3a4753;
        }

        .schedule-time-header {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 7px;
          letter-spacing: 0.1em;
          opacity: 0.5;
        }

        .schedule-day-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          text-transform: uppercase;
        }

        .schedule-day-header strong {
          font-family: 'Oswald', sans-serif;
          font-size: 15px;
        }

        .schedule-day-header small {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 7px;
          opacity: 0.45;
        }

        .schedule-grid-row {
          min-height: 54px;
        }

        .schedule-time {
          display: flex;
          justify-content: center;
          padding-top: 7px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          opacity: 0.5;
        }

        .schedule-cell {
          position: relative;
          min-width: 0;
          padding: 3px;
        }

        .schedule-block {
          position: relative;
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: flex-start;
          gap: 2px;
          overflow: hidden;
          border-left: 3px solid var(--block-color);
          border-radius: 6px;
          padding: 7px 8px;
          background: #2b3741;
          color: inherit;
          text-align: left;
          transition:
            transform 0.15s ease,
            filter 0.15s ease;
        }

        .schedule-block:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }

        .schedule-block-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 5px;
        }

        .schedule-block-top strong {
          overflow: hidden;
          font-family: 'Oswald', sans-serif;
          font-size: 12px;
          line-height: 1;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .schedule-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 999px;
        }

        .schedule-block-time,
        .schedule-block-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 6.5px;
          line-height: 1.3;
          opacity: 0.65;
        }

        .schedule-break {
          justify-content: center;
          background: rgba(217, 194, 91, 0.14);
          border-left-color: #d9c25b !important;
        }

        .schedule-footer {
          min-height: 50px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 15px;
          padding: 10px 20px;
          border-top: 1px solid #3a4753;
        }

        .schedule-footer-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 6px;
          letter-spacing: 0.2em;
          opacity: 0.45;
        }

        .schedule-footer strong {
          font-family: 'Oswald', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
        }

        .schedule-stats {
          display: flex;
          gap: 15px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 7px;
          opacity: 0.55;
        }

        .schedule-brand {
          justify-self: end;
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #f2a93b;
        }

        /* ========================
           TOOLBOARD
        ======================== */

        .schedule-pegboard {
          background-color: #232d36;
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.045) 1px,
            transparent 1px
          );
          background-size: 18px 18px;
        }

        /* ========================
           PAPEL
        ======================== */

        .schedule-paper.schedule-paper {
          background: #f7f1df;
          color: #30281d;
          border-color: #d8c9a9;
        }

        .schedule-paper.schedule-paper .schedule-header,
        .schedule-paper.schedule-paper .schedule-footer,
        .schedule-paper.schedule-paper .schedule-time-header,
        .schedule-paper.schedule-paper .schedule-day-header,
        .schedule-paper.schedule-paper .schedule-time,
        .schedule-paper.schedule-paper .schedule-cell {
          border-color: #d8c9a9;
        }

        .schedule-paper.schedule-paper .schedule-kicker {
          color: #8a5a2e;
        }

        .schedule-paper.schedule-paper .schedule-block {
          background: #fffaf0;
          box-shadow: 0 2px 5px rgba(80, 60, 30, 0.12);
        }

        /* ========================
           MINIMAL
        ======================== */

        .schedule-paper.schedule-minimal {
          background: #fff;
          color: #20252a;
          border-color: #d8dde1;
        }

        .schedule-paper.schedule-minimal .schedule-header,
        .schedule-paper.schedule-minimal .schedule-footer,
        .schedule-paper.schedule-minimal .schedule-time-header,
        .schedule-paper.schedule-minimal .schedule-day-header,
        .schedule-paper.schedule-minimal .schedule-time,
        .schedule-paper.schedule-minimal .schedule-cell {
          border-color: #d8dde1;
        }

        .schedule-paper.schedule-minimal .schedule-kicker {
          color: #8a5a2e;
        }

        .schedule-paper.schedule-minimal .schedule-block {
          background: #f5f7f8;
          box-shadow: none;
        }

        /* ========================
           CUADERNO
        ======================== */

        .schedule-paper.schedule-notebook {
          background: #fffdf5;
          color: #26384a;
          border-color: #b9cde1;
          background-image: linear-gradient(
            rgba(93, 141, 194, 0.08) 1px,
            transparent 1px
          );
          background-size: 100% 26px;
        }

        .schedule-paper.schedule-notebook .schedule-header,
        .schedule-paper.schedule-notebook .schedule-footer,
        .schedule-paper.schedule-notebook .schedule-time-header,
        .schedule-paper.schedule-notebook .schedule-day-header,
        .schedule-paper.schedule-notebook .schedule-time,
        .schedule-paper.schedule-notebook .schedule-cell {
          border-color: #b9cde1;
        }

        .schedule-paper.schedule-notebook .schedule-kicker {
          color: #5b8dd9;
        }

        .schedule-paper.schedule-notebook .schedule-block {
          background: rgba(255, 255, 255, 0.82);
          box-shadow: none;
        }

        /* ========================
           PLANNER
        ======================== */

        .schedule-paper.schedule-planner {
          background: #20252b;
          color: #f1f2f3;
          border-color: #46515c;
        }

        .schedule-paper.schedule-planner .schedule-header {
          background: #171c21;
        }

        .schedule-paper.schedule-planner .schedule-kicker {
          color: #f2a93b;
        }

        .schedule-paper.schedule-planner .schedule-header,
        .schedule-paper.schedule-planner .schedule-footer,
        .schedule-paper.schedule-planner .schedule-time-header,
        .schedule-paper.schedule-planner .schedule-day-header,
        .schedule-paper.schedule-planner .schedule-time,
        .schedule-paper.schedule-planner .schedule-cell {
          border-color: #46515c;
        }

        .schedule-paper.schedule-planner .schedule-block {
          background: #2b3239;
          box-shadow: none;
        }

        /* ========================
           PRINT
        ======================== */

        @media print {
          .schedule-paper {
            width: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .schedule-header {
            min-height: 80px;
            padding: 12px 16px;
          }

          .schedule-title {
            font-size: 24px;
          }

          .schedule-grid-row {
            min-height: 43px;
          }

          .schedule-block {
            padding: 5px 6px;
          }

          .schedule-block-top strong {
            font-size: 9px;
          }

          .schedule-block-time,
          .schedule-block-meta {
            font-size: 5.5px;
          }

          .schedule-footer {
            min-height: 35px;
            padding: 6px 12px;
          }

          .schedule-class {
            break-inside: avoid;
          }

          .schedule-paper {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
