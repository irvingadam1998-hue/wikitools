'use client'

interface TimePresetsProps {
  selectedTime: number
  disabled?: boolean
  onSelect: (seconds: number) => void
}

const presets = [
  { label: '1:00', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2:00', seconds: 120 },
]

export default function TimePresets({
  selectedTime,
  disabled = false,
  onSelect,
}: TimePresetsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {presets.map((preset) => {
        const selected = selectedTime === preset.seconds

        return (
          <button
            key={preset.seconds}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(preset.seconds)}
            className={`rounded-xl border px-6 py-3 font-semibold transition ${
              selected
                ? 'border-black bg-black text-white'
                : 'bg-white hover:bg-gray-100'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
