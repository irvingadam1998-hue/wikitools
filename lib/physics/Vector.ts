export class Vector {
  constructor(
    public x = 0,
    public y = 0
  ) {}

  add(vector: Vector) {
    this.x += vector.x
    this.y += vector.y

    return this
  }

  subtract(vector: Vector) {
    this.x -= vector.x
    this.y -= vector.y

    return this
  }

  multiply(value: number) {
    this.x *= value
    this.y *= value

    return this
  }

  divide(value: number) {
    if (value !== 0) {
      this.x /= value
      this.y /= value
    }

    return this
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const magnitude = this.magnitude()

    if (magnitude === 0) {
      return this
    }

    return this.divide(magnitude)
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  static distance(a: Vector, b: Vector) {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
  }
}
