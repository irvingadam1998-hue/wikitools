'use client'

interface HourglassProps {
  progress: number
  status: 'idle' | 'running' | 'warning' | 'finished'
}

export default function Hourglass({ progress, status }: HourglassProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress))

  const topSandHeight = 70 * clampedProgress
  const bottomSandHeight = 70 * (1 - clampedProgress)

  const sandColor =
    status === 'finished'
      ? '#ef4444'
      : status === 'warning'
        ? '#f59e0b'
        : '#eab308'

  return (
    <div className="relative mx-auto h-[320px] w-[220px]">
      <svg
        viewBox="0 0 220 320"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Reloj de arena"
      >
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="topSand">
            <path d="M65 50 L155 50 L115 145 L105 145 Z" />
          </clipPath>

          <clipPath id="bottomSand">
            <path d="M105 175 L115 175 L155 270 L65 270 Z" />
          </clipPath>
        </defs>

        {/* Cristal superior */}
        <path
          d="M65 50 L155 50 L115 145 L105 145 Z"
          fill="url(#glass)"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="3"
        />

        {/* Cristal inferior */}
        <path
          d="M105 175 L115 175 L155 270 L65 270 Z"
          fill="url(#glass)"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="3"
        />

        {/* Arena superior */}
        <path
          d={`M67 50 L153 50 L${115 - topSandHeight / 2} ${
            140 - topSandHeight
          } L${105 + topSandHeight / 2} ${140 - topSandHeight} Z`}
          fill={sandColor}
          opacity="0.95"
          clipPath="url(#topSand)"
        />

        {/* Arena inferior */}
        <path
          d={`M67 270 L153 270 L115 175 L105 175 Z`}
          fill={sandColor}
          opacity="0.95"
          clipPath="url(#bottomSand)"
        />

        {/* Arena acumulada inferior */}
        <path
          d={`M70 ${270 - bottomSandHeight} Q110 ${
            255 - bottomSandHeight
          } 150 ${270 - bottomSandHeight} L150 270 L70 270 Z`}
          fill={sandColor}
          opacity="0.95"
        />

        {/* Caída de arena */}
        {status === 'running' && (
          <line
            x1="110"
            y1="145"
            x2="110"
            y2="175"
            stroke={sandColor}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            className="animate-pulse"
          />
        )}

        {/* Marco superior */}
        <rect
          x="45"
          y="35"
          width="130"
          height="16"
          rx="8"
          fill="white"
          fillOpacity="0.9"
        />

        {/* Marco inferior */}
        <rect
          x="45"
          y="269"
          width="130"
          height="16"
          rx="8"
          fill="white"
          fillOpacity="0.9"
        />

        {/* Soportes */}
        <line
          x1="55"
          y1="45"
          x2="45"
          y2="275"
          stroke="white"
          strokeOpacity="0.8"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <line
          x1="165"
          y1="45"
          x2="175"
          y2="275"
          stroke="white"
          strokeOpacity="0.8"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
