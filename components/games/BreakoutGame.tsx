'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const WIDTH = 480
const HEIGHT = 560

const PADDLE_WIDTH = 80
const PADDLE_HEIGHT = 12

const BALL_RADIUS = 7

const BRICK_ROWS = 5
const BRICK_COLUMNS = 8

const BRICK_WIDTH = 48
const BRICK_HEIGHT = 18
const BRICK_GAP = 8

type Brick = {
  x: number
  y: number
  width: number
  height: number
  alive: boolean
}

type GameState = {
  paddleX: number
  ballX: number
  ballY: number
  ballDX: number
  ballDY: number
  bricks: Brick[]
  score: number
  lives: number
  level: number
}

function createBricks(level: number): Brick[] {
  const totalWidth =
    BRICK_COLUMNS * BRICK_WIDTH + (BRICK_COLUMNS - 1) * BRICK_GAP

  const startX = (WIDTH - totalWidth) / 2

  const bricks: Brick[] = []

  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let column = 0; column < BRICK_COLUMNS; column++) {
      bricks.push({
        x: startX + column * (BRICK_WIDTH + BRICK_GAP),
        y: 55 + row * (BRICK_HEIGHT + BRICK_GAP),
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        alive: true,
      })
    }
  }

  return bricks
}

function createGame(level = 1): GameState {
  return {
    paddleX: WIDTH / 2 - PADDLE_WIDTH / 2,
    ballX: WIDTH / 2,
    ballY: HEIGHT - 90,
    ballDX: 3 + Math.min(level * 0.3, 2),
    ballDY: -(4 + Math.min(level * 0.4, 2)),
    bricks: createBricks(level),
    score: 0,
    lives: 3,
    level,
  }
}

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<GameState>(createGame())

  const keysRef = useRef({
    left: false,
    right: false,
  })

  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)

  const reset = useCallback(() => {
    const game = createGame()

    gameRef.current = game

    setScore(0)
    setLives(3)
    setLevel(1)
    setGameOver(false)
    setStarted(true)
  }, [])

  const movePaddle = useCallback((direction: 'left' | 'right') => {
    const game = gameRef.current

    const amount = 35

    if (direction === 'left') {
      game.paddleX = Math.max(0, game.paddleX - amount)
    } else {
      game.paddleX = Math.min(WIDTH - PADDLE_WIDTH, game.paddleX + amount)
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        keysRef.current.left = true
      }

      if (event.key === 'ArrowRight' || event.key === 'd') {
        keysRef.current.right = true
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        keysRef.current.left = false
      }

      if (event.key === 'ArrowRight' || event.key === 'd') {
        keysRef.current.right = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    let animationFrame = 0

    function draw() {
      const game = gameRef.current

      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      // Fondo
      ctx.strokeStyle = '#18181b'
      ctx.lineWidth = 1

      for (let x = 0; x <= WIDTH; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, HEIGHT)
        ctx.stroke()
      }

      for (let y = 0; y <= HEIGHT; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(WIDTH, y)
        ctx.stroke()
      }

      // Ladrillos
      game.bricks.forEach((brick) => {
        if (!brick.alive) return

        ctx.fillStyle = '#3b82f6'

        ctx.beginPath()
        ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 5)
        ctx.fill()
      })

      // Paddle
      ctx.fillStyle = '#f4f4f5'

      ctx.beginPath()
      ctx.roundRect(game.paddleX, HEIGHT - 35, PADDLE_WIDTH, PADDLE_HEIGHT, 6)
      ctx.fill()

      // Bola
      ctx.fillStyle = '#facc15'

      ctx.beginPath()
      ctx.arc(game.ballX, game.ballY, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fill()

      if (!started) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'

        ctx.font = 'bold 28px sans-serif'
        ctx.fillText('BREAKOUT', WIDTH / 2, HEIGHT / 2 - 15)

        ctx.font = '16px sans-serif'
        ctx.fillText('Pulsa Jugar para comenzar', WIDTH / 2, HEIGHT / 2 + 20)
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'

        ctx.font = 'bold 32px sans-serif'
        ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2)
      }
    }

    function update() {
      if (!started || gameOver) {
        draw()
        animationFrame = requestAnimationFrame(update)
        return
      }

      const game = gameRef.current

      if (keysRef.current.left) {
        game.paddleX = Math.max(0, game.paddleX - 6)
      }

      if (keysRef.current.right) {
        game.paddleX = Math.min(WIDTH - PADDLE_WIDTH, game.paddleX + 6)
      }

      game.ballX += game.ballDX
      game.ballY += game.ballDY

      // Paredes
      if (game.ballX - BALL_RADIUS <= 0 || game.ballX + BALL_RADIUS >= WIDTH) {
        game.ballDX *= -1
      }

      if (game.ballY - BALL_RADIUS <= 0) {
        game.ballDY *= -1
      }

      // Paddle
      const paddleY = HEIGHT - 35

      if (
        game.ballY + BALL_RADIUS >= paddleY &&
        game.ballY - BALL_RADIUS <= paddleY + PADDLE_HEIGHT &&
        game.ballX >= game.paddleX &&
        game.ballX <= game.paddleX + PADDLE_WIDTH &&
        game.ballDY > 0
      ) {
        const hitPosition = (game.ballX - game.paddleX) / PADDLE_WIDTH

        game.ballDX = (hitPosition - 0.5) * 9
        game.ballDY = -Math.abs(game.ballDY)
      }

      // Ladrillos
      for (const brick of game.bricks) {
        if (!brick.alive) continue

        const collision =
          game.ballX + BALL_RADIUS > brick.x &&
          game.ballX - BALL_RADIUS < brick.x + brick.width &&
          game.ballY + BALL_RADIUS > brick.y &&
          game.ballY - BALL_RADIUS < brick.y + brick.height

        if (collision) {
          brick.alive = false
          game.ballDY *= -1

          game.score += 10

          setScore(game.score)

          break
        }
      }

      // Nivel completado
      const remaining = game.bricks.some((brick) => brick.alive)

      if (!remaining) {
        game.level += 1

        game.bricks = createBricks(game.level)

        game.ballX = WIDTH / 2
        game.ballY = HEIGHT - 90

        game.ballDX = 3 + Math.min(game.level * 0.3, 2)

        game.ballDY = -(4 + Math.min(game.level * 0.4, 2))

        setLevel(game.level)
      }

      // Bola perdida
      if (game.ballY > HEIGHT + 20) {
        game.lives -= 1

        setLives(game.lives)

        if (game.lives <= 0) {
          setGameOver(true)
        } else {
          game.ballX = WIDTH / 2
          game.ballY = HEIGHT - 90
          game.ballDX = 4
          game.ballDY = -5
        }
      }

      draw()

      animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [started, gameOver])

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Puntuación</p>

          <p className="text-2xl font-bold">{score}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Nivel</p>

          <p className="text-2xl font-bold">{level}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Vidas</p>

          <p className="text-2xl font-bold">{'❤️'.repeat(lives)}</p>
        </div>

        <button
          onClick={reset}
          className="rounded-xl bg-black px-5 py-3 font-medium text-white"
        >
          {started ? 'Reiniciar' : 'Jugar'}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-black p-2 shadow-lg">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="mx-auto block h-auto w-full max-w-[480px] rounded-xl"
        />
      </div>

      <div className="mt-5 flex justify-center gap-4">
        <button
          onClick={() => movePaddle('left')}
          className="h-14 w-20 rounded-xl border text-2xl"
          aria-label="Mover izquierda"
        >
          ←
        </button>

        <button
          onClick={() => movePaddle('right')}
          className="h-14 w-20 rounded-xl border text-2xl"
          aria-label="Mover derecha"
        >
          →
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-gray-500">
        Usa ← → o A/D para mover la barra.
      </p>
    </div>
  )
}
