/**
 * Arc Calculator 2.0 — Vector Algebra Engine
 * Supports 2D and 3D vector addition, dot product, cross product, magnitude, unit vector, and angles.
 */

export type Vector = [number, number] | [number, number, number]

const EPSILON = 1e-12

export function vectorMagnitude(v: Vector): number {
  const sumSq = v.reduce((sum, val) => sum + val * val, 0)
  return Math.sqrt(sumSq)
}

export function vectorAdd(u: Vector, v: Vector): Vector {
  if (u.length !== v.length) {
    throw new Error(`Dimension mismatch: vector of dimension ${u.length} cannot be added to vector of dimension ${v.length}.`)
  }
  return u.map((val, i) => val + v[i]) as Vector
}

export function vectorSubtract(u: Vector, v: Vector): Vector {
  if (u.length !== v.length) {
    throw new Error(`Dimension mismatch: vector of dimension ${u.length} cannot be subtracted from vector of dimension ${v.length}.`)
  }
  return u.map((val, i) => val - v[i]) as Vector
}

export function vectorScale(v: Vector, scalar: number): Vector {
  return v.map((val) => val * scalar) as Vector
}

export function vectorDot(u: Vector, v: Vector): number {
  if (u.length !== v.length) {
    throw new Error(`Dimension mismatch for dot product: ${u.length}D vs ${v.length}D.`)
  }
  const sum = u.reduce((acc, val, i) => acc + val * v[i], 0)
  return Math.abs(sum) < EPSILON ? 0 : sum
}

export function vectorCross3D(u: [number, number, number], v: [number, number, number]): [number, number, number] {
  const x = u[1] * v[2] - u[2] * v[1]
  const y = u[2] * v[0] - u[0] * v[2]
  const z = u[0] * v[1] - u[1] * v[0]
  return [
    Math.abs(x) < EPSILON ? 0 : x,
    Math.abs(y) < EPSILON ? 0 : y,
    Math.abs(z) < EPSILON ? 0 : z,
  ]
}

export function vectorUnit(v: Vector): Vector {
  const mag = vectorMagnitude(v)
  if (mag < EPSILON) {
    throw new Error('Zero vector has no defined unit vector direction.')
  }
  return v.map((val) => val / mag) as Vector
}

export function vectorAngle(u: Vector, v: Vector): { rad: number; deg: number } {
  const magU = vectorMagnitude(u)
  const magV = vectorMagnitude(v)
  if (magU < EPSILON || magV < EPSILON) {
    throw new Error('Angle is undefined for a zero-length vector.')
  }
  const dot = vectorDot(u, v)
  const cosTheta = Math.max(-1, Math.min(1, dot / (magU * magV)))
  const rad = Math.acos(cosTheta)
  const deg = (rad * 180) / Math.PI
  return {
    rad: Math.abs(rad) < EPSILON ? 0 : rad,
    deg: Math.abs(deg) < EPSILON ? 0 : deg,
  }
}

export function vectorProjection(u: Vector, v: Vector): Vector {
  const magVSq = v.reduce((sum, val) => sum + val * val, 0)
  if (magVSq < EPSILON) {
    throw new Error('Cannot project onto a zero vector.')
  }
  const factor = vectorDot(u, v) / magVSq
  return vectorScale(v, factor)
}
