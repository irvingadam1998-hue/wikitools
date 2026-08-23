'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const COLS = 20
const ROWS = 20
const CELL_SIZE = 24

type Point = {
  x: number
  y: number
}

type Direction = 'up' | 'down' | 'left' | 'right'

const DIRECTIONS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
]

function randomFood(snake: Point[]): Point {
  const available: Point[] = []

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!snake.some((part) => part.x === x && part.y === y)) {
        available.push({ x, y })
      }
    }
  }

  return available[Math.floor(Math.random() * available.length)]
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const snakeRef = useRef<Point[]>(INITIAL_SNAKE)
  const directionRef = useRef<Direction>('right')
  const nextDirectionRef = useRef<Direction>('right')
  const foodRef = useRef<Point>(randomFood(INITIAL_SNAKE))

  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const resetGame = useCallback(() => {
    const snake = [...INITIAL_SNAKE]

    snakeRef.current = snake
    directionRef.current = 'right'
    nextDirectionRef.current = 'right'
    foodRef.current = randomFood(snake)

    setScore(0)
    setGameOver(false)
    setStarted(true)
  }, [])

  const changeDirection = useCallback(
    (direction: Direction) => {
      if (!started || gameOver) return

      const current = directionRef.current

      const opposite =
        (current === 'up' && direction === 'down') ||
        (current === 'down' && direction === 'up') ||
        (current === 'left' && direction === 'right') ||
        (current === 'right' && direction === 'left')

      if (!opposite) {
        nextDirectionRef.current = direction
      }
    },
    [started, gameOver]
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const keys: Record<string, Direction | undefined> = {
        ArrowUp: 'up',
        w: 'up',
        W: 'up',
        ArrowDown: 'down',
        s: 'down',
        S: 'down',
        ArrowLeft: 'left',
        a: 'left',
        A: 'left',
        ArrowRight: 'right',
        d: 'right',
        D: 'right',
      }

      const direction = keys[event.key]

      if (direction) {
        event.preventDefault()
        changeDirection(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [changeDirection])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const width = COLS * CELL_SIZE
    const height = ROWS * CELL_SIZE

    function draw() {
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = '#111827'
      ctx.fillRect(0, 0, width, height)

      // Grid
      ctx.strokeStyle = '#1f2937'
      ctx.lineWidth = 1

      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath()
        ctx.moveTo(x * CELL_SIZE, 0)
        ctx.lineTo(x * CELL_SIZE, height)
        ctx.stroke()
      }

      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * CELL_SIZE)
        ctx.lineTo(width, y * CELL_SIZE)
        ctx.stroke()
      }

      // Food
      const food = foodRef.current

      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE * 0.34,
        0,
        Math.PI * 2
      )
      ctx.fill()

      // Snake
      snakeRef.current.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#22c55e' : '#16a34a'

        ctx.beginPath()
        ctx.roundRect(
          part.x * CELL_SIZE + 2,
          part.y * CELL_SIZE + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4,
          5
        )
        ctx.fill()
      })
    }

    draw()
  }, [score, started, gameOver])

  useEffect(() => {
    if (!started || gameOver) return

    const interval = window.setInterval(() => {
      const snake = snakeRef.current

      directionRef.current = nextDirectionRef.current

      const direction = DIRECTIONS[directionRef.current]

      const head = snake[0]

      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      }

      const hitWall =
        newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS

      const hitSelf = snake.some(
        (part) => part.x === newHead.x && part.y === newHead.y
      )

      if (hitWall || hitSelf) {
        setGameOver(true)
        return
      }

      const ateFood =
        newHead.x === foodRef.current.x && newHead.y === foodRef.current.y

      const newSnake = [newHead, ...snake]

      if (!ateFood) {
        newSnake.pop()
      }

      snakeRef.current = newSnake

      if (ateFood) {
        setScore((value) => value + 10)
        foodRef.current = randomFood(newSnake)
      }

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')

      if (!canvas || !ctx) return

      const width = COLS * CELL_SIZE
      const height = ROWS * CELL_SIZE

      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = '#111827'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = '#1f2937'

      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath()
        ctx.moveTo(x * CELL_SIZE, 0)
        ctx.lineTo(x * CELL_SIZE, height)
        ctx.stroke()
      }

      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * CELL_SIZE)
        ctx.lineTo(width, y * CELL_SIZE)
        ctx.stroke()
      }

      const food = foodRef.current

      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE * 0.34,
        0,
        Math.PI * 2
      )
      ctx.fill()

      newSnake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#22c55e' : '#16a34a'

        ctx.beginPath()
        ctx.roundRect(
          part.x * CELL_SIZE + 2,
          part.y * CELL_SIZE + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4,
          5
        )
        ctx.fill()
      })
    }, 120)

    return () => {
      window.clearInterval(interval)
    }
  }, [started, gameOver])

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Puntuación</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>

        <button
          onClick={resetGame}
          className="rounded-xl bg-black px-5 py-3 font-medium text-white"
        >
          {started ? 'Reiniciar' : 'Jugar'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border bg-gray-950 p-2 shadow-lg">
        <canvas
          ref={canvasRef}
          width={COLS * CELL_SIZE}
          height={ROWS * CELL_SIZE}
          className="mx-auto block h-auto w-full max-w-[480px] rounded-xl"
        />

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-white">
            <div>
              <p className="text-4xl font-bold">Game Over</p>

              <p className="mt-3 text-lg">Puntuación: {score}</p>

              <button
                onClick={resetGame}
                className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black"
              >
                Jugar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 justify-items-center gap-2 sm:hidden">
        <div />

        <button
          onClick={() => changeDirection('up')}
          className="h-14 w-14 rounded-xl border text-2xl"
        >
          ↑
        </button>

        <div />

        <button
          onClick={() => changeDirection('left')}
          className="h-14 w-14 rounded-xl border text-2xl"
        >
          ←
        </button>

        <button
          onClick={() => changeDirection('down')}
          className="h-14 w-14 rounded-xl border text-2xl"
        >
          ↓
        </button>

        <button
          onClick={() => changeDirection('right')}
          className="h-14 w-14 rounded-xl border text-2xl"
        >
          →
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Usa las flechas del teclado o WASD para moverte.
      </p>
    </div>
  )
}
