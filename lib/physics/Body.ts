import { Vector } from './Vector'

export class Body {
  position: Vector
  velocity: Vector
  acceleration: Vector

  constructor(
    public mass: number,
    public radius: number,
    position: Vector,
    velocity = new Vector()
  ) {
    this.position = position
    this.velocity = velocity
    this.acceleration = new Vector()
  }

  applyForce(force: Vector) {
    const acceleration = force.clone().divide(this.mass)

    this.acceleration.add(acceleration)
  }

  update(deltaTime: number) {
    this.velocity.add(this.acceleration.clone().multiply(deltaTime))

    this.position.add(this.velocity.clone().multiply(deltaTime))

    this.acceleration.multiply(0)
  }
}
