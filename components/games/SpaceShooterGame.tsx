'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const WIDTH = 480
const HEIGHT = 640

type Player = {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

type Enemy = {
  x: number
  y: number
  width: number
  height: number
  speed: number
  health: number
}

type Bullet = {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

type Star = {
  x: number
  y: number
  size: number
  speed: number
}

type GameState = {
  player: Player
  enemies: Enemy[]
  bullets: Bullet[]
  stars: Star[]
  score: number
  lives: number
  wave: number
  spawnTimer: number
}

function createStars(): Star[] {
  return Array.from({ length: 70 }, () => ({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 1.5 + 0.5,
  }))
}

function createGame(): GameState {
  return {
    player: {
      x: WIDTH / 2 - 20,
      y: HEIGHT - 70,
      width: 40,
      height: 32,
      speed: 6,
    },
    enemies: [],
    bullets: [],
    stars: createStars(),
    score: 0,
    lives: 3,
    wave: 1,
    spawnTimer: 0,
  }
}

function spawnEnemy(wave: number): Enemy {
  const size = 30

  return {
    x: Math.random() * (WIDTH - size),
    y: -size,
    width: size,
    height: size,
    speed: 1.2 + Math.min(wave * 0.15, 2),
    health: wave >= 5 ? 2 : 1,
  }
}

export default function SpaceShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<GameState>(createGame())

  const keysRef = useRef({
    left: false,
    right: false,
    shooting: false,
  })

  const lastShotRef = useRef(0)

  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [wave, setWave] = useState(1)

  const resetGame = useCallback(() => {
    gameRef.current = createGame()

    setScore(0)
    setLives(3)
    setWave(1)
    setGameOver(false)
    setStarted(true)
  }, [])

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    const player = gameRef.current.player

    if (direction === 'left') {
      player.x = Math.max(0, player.x - player.speed * 3)
    } else {
      player.x = Math.min(WIDTH - player.width, player.x + player.speed * 3)
    }
  }, [])

  const shoot = useCallback(() => {
    if (!started || gameOver) return

    const now = performance.now()

    if (now - lastShotRef.current < 180) {
      return
    }

    lastShotRef.current = now

    const player = gameRef.current.player

    gameRef.current.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y - 8,
      width: 4,
      height: 12,
      speed: 9,
    })
  }, [started, gameOver])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        keysRef.current.left = true
      }

      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        keysRef.current.right = true
      }

      if (event.code === 'Space' || event.key.toLowerCase() === 'w') {
        event.preventDefault()
        keysRef.current.shooting = true
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        keysRef.current.left = false
      }

      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        keysRef.current.right = false
      }

      if (event.code === 'Space' || event.key.toLowerCase() === 'w') {
        keysRef.current.shooting = false
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

    function rectangleCollision(
      a: {
        x: number
        y: number
        width: number
        height: number
      },
      b: {
        x: number
        y: number
        width: number
        height: number
      }
    ) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      )
    }

    function drawPlayer(player: Player) {
      ctx.save()

      ctx.translate(player.x + player.width / 2, player.y + player.height / 2)

      // Cuerpo
      ctx.fillStyle = '#60a5fa'

      ctx.beginPath()
      ctx.moveTo(0, -18)
      ctx.lineTo(18, 15)
      ctx.lineTo(0, 8)
      ctx.lineTo(-18, 15)
      ctx.closePath()
      ctx.fill()

      // Cabina
      ctx.fillStyle = '#bfdbfe'

      ctx.beginPath()
      ctx.arc(0, -4, 6, 0, Math.PI * 2)
      ctx.fill()

      // Motor
      ctx.fillStyle = '#f97316'

      ctx.beginPath()
      ctx.moveTo(-7, 12)
      ctx.lineTo(0, 23)
      ctx.lineTo(7, 12)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    function drawEnemy(enemy: Enemy) {
      ctx.save()

      ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2)

      ctx.fillStyle = enemy.health > 1 ? '#f59e0b' : '#ef4444'

      ctx.beginPath()
      ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#111827'

      ctx.beginPath()
      ctx.arc(-6, -3, 3, 0, Math.PI * 2)
      ctx.arc(6, -3, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    function draw() {
      const game = gameRef.current

      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      // Espacio
      ctx.fillStyle = '#030712'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      // Estrellas
      game.stars.forEach((star) => {
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = 0.3 + star.size / 3

        ctx.fillRect(star.x, star.y, star.size, star.size)
      })

      ctx.globalAlpha = 1

      // Jugador
      drawPlayer(game.player)

      // Enemigos
      game.enemies.forEach(drawEnemy)

      // Disparos
      ctx.fillStyle = '#fef08a'

      game.bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
      })

      if (!started) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'

        ctx.font = 'bold 32px sans-serif'
        ctx.fillText('SPACE SHOOTER', WIDTH / 2, HEIGHT / 2 - 20)

        ctx.font = '16px sans-serif'
        ctx.fillText('Pulsa Jugar para comenzar', WIDTH / 2, HEIGHT / 2 + 20)
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'

        ctx.font = 'bold 34px sans-serif'
        ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 15)

        ctx.font = '18px sans-serif'
        ctx.fillText(`Puntuación: ${game.score}`, WIDTH / 2, HEIGHT / 2 + 25)
      }
    }

    function update() {
      const game = gameRef.current

      // Movimiento del fondo
      game.stars.forEach((star) => {
        star.y += star.speed

        if (star.y > HEIGHT) {
          star.y = 0
          star.x = Math.random() * WIDTH
        }
      })

      if (started && !gameOver) {
        const player = game.player

        if (keysRef.current.left) {
          player.x = Math.max(0, player.x - player.speed)
        }

        if (keysRef.current.right) {
          player.x = Math.min(WIDTH - player.width, player.x + player.speed)
        }

        if (keysRef.current.shooting) {
          shoot()
        }

        // Crear enemigos
        game.spawnTimer--

        if (game.spawnTimer <= 0) {
          game.enemies.push(spawnEnemy(game.wave))

          game.spawnTimer = Math.max(20, 55 - game.wave * 3)
        }

        // Actualizar disparos
        game.bullets.forEach((bullet) => {
          bullet.y -= bullet.speed
        })

        game.bullets = game.bullets.filter((bullet) => bullet.y > -20)

        // Actualizar enemigos
        game.enemies.forEach((enemy) => {
          enemy.y += enemy.speed
        })

        // Colisiones disparos/enemigos
        for (const bullet of game.bullets) {
          for (const enemy of game.enemies) {
            if (enemy.health > 0 && rectangleCollision(bullet, enemy)) {
              enemy.health -= 1

              bullet.y = -100

              if (enemy.health <= 0) {
                game.score += 10
                setScore(game.score)
              }

              break
            }
          }
        }

        game.enemies = game.enemies.filter((enemy) => enemy.health > 0)

        game.bullets = game.bullets.filter((bullet) => bullet.y > -50)

        // Enemigos que llegan abajo
        const reachedBottom = game.enemies.some((enemy) => enemy.y > HEIGHT)

        if (reachedBottom) {
          game.lives -= 1

          setLives(game.lives)

          game.enemies = game.enemies.filter((enemy) => enemy.y <= HEIGHT)

          if (game.lives <= 0) {
            setGameOver(true)
          }
        }

        // Colisión jugador/enemigo
        for (const enemy of game.enemies) {
          if (rectangleCollision(player, enemy)) {
            game.lives -= 1

            setLives(game.lives)

            enemy.y = HEIGHT + 100

            if (game.lives <= 0) {
              setGameOver(true)
            }

            break
          }
        }

        // Aumentar oleada
        const newWave = Math.floor(game.score / 100) + 1

        if (newWave !== game.wave) {
          game.wave = newWave
          setWave(newWave)
        }
      }

      draw()

      animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [started, gameOver, shoot])

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Puntuación</p>

          <p className="text-2xl font-bold">{score}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Oleada</p>

          <p className="text-2xl font-bold">{wave}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Vidas</p>

          <p className="text-2xl font-bold">{'❤️'.repeat(lives)}</p>
        </div>

        <button
          onClick={resetGame}
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

      <div className="mt-5 grid grid-cols-3 gap-3">
        <button
          onPointerDown={() => {
            keysRef.current.left = true
          }}
          onPointerUp={() => {
            keysRef.current.left = false
          }}
          onPointerLeave={() => {
            keysRef.current.left = false
          }}
          className="h-14 rounded-xl border text-2xl"
        >
          ←
        </button>

        <button
          onPointerDown={() => {
            keysRef.current.shooting = true
          }}
          onPointerUp={() => {
            keysRef.current.shooting = false
          }}
          onPointerLeave={() => {
            keysRef.current.shooting = false
          }}
          className="h-14 rounded-xl border font-semibold"
        >
          🔥 Disparar
        </button>

        <button
          onPointerDown={() => {
            keysRef.current.right = true
          }}
          onPointerUp={() => {
            keysRef.current.right = false
          }}
          onPointerLeave={() => {
            keysRef.current.right = false
          }}
          className="h-14 rounded-xl border text-2xl"
        >
          →
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-gray-500">
        Muévete con ← → o A/D. Dispara con espacio o W.
      </p>
    </div>
  )
}
