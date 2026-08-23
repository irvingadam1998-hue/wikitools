import { Body } from './Body'
import { Vector } from './Vector'

export class PhysicsEngine {
  bodies: Body[] = []

  gravity = 500

  addBody(body: Body) {
    this.bodies.push(body)
  }

  clear() {
    this.bodies = []
  }

  update(deltaTime: number) {
    const bodies = this.bodies

    for (let i = 0; i < bodies.length; i++) {
      const bodyA = bodies[i]

      for (let j = i + 1; j < bodies.length; j++) {
        const bodyB = bodies[j]

        this.applyGravity(bodyA, bodyB)
      }
    }

    for (const body of bodies) {
      body.update(deltaTime)
    }
  }

  private applyGravity(a: Body, b: Body) {
    const direction = b.position.clone().subtract(a.position)

    let distance = direction.magnitude()

    /*
     * Evitamos que una distancia
     * demasiado pequeña provoque
     * fuerzas enormes.
     */
    distance = Math.max(distance, 20)

    const forceMagnitude =
      (this.gravity * a.mass * b.mass) / (distance * distance)

    const force = direction.normalize().multiply(forceMagnitude)

    a.applyForce(force)

    b.applyForce(force.clone().multiply(-1))
  }
}
