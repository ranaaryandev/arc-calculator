/**
 * Arc Calculator 2.0 — Complex Numbers Engine
 * Supports Rectangular (a + bi), Polar (r∠θ), arithmetic, powers, and conjugates.
 */

export interface Complex {
  re: number
  im: number
}

const EPSILON = 1e-12

export function complex(re: number, im = 0): Complex {
  return {
    re: Math.abs(re) < EPSILON ? 0 : re,
    im: Math.abs(im) < EPSILON ? 0 : im,
  }
}

export function complexAdd(z1: Complex, z2: Complex): Complex {
  return complex(z1.re + z2.re, z1.im + z2.im)
}

export function complexSubtract(z1: Complex, z2: Complex): Complex {
  return complex(z1.re - z2.re, z1.im - z2.im)
}

export function complexMultiply(z1: Complex, z2: Complex): Complex {
  const re = z1.re * z2.re - z1.im * z2.im
  const im = z1.re * z2.im + z1.im * z2.re
  return complex(re, im)
}

export function complexDivide(z1: Complex, z2: Complex): Complex {
  const denom = z2.re * z2.re + z2.im * z2.im
  if (denom < EPSILON) {
    throw new Error('Division by zero complex number (0 + 0i).')
  }
  const re = (z1.re * z2.re + z1.im * z2.im) / denom
  const im = (z1.im * z2.re - z1.re * z2.im) / denom
  return complex(re, im)
}

export function complexModulus(z: Complex): number {
  return Math.sqrt(z.re * z.re + z.im * z.im)
}

export function complexArgument(z: Complex): { rad: number; deg: number } {
  const rad = Math.atan2(z.im, z.re)
  const deg = (rad * 180) / Math.PI
  return {
    rad: Math.abs(rad) < EPSILON ? 0 : rad,
    deg: Math.abs(deg) < EPSILON ? 0 : deg,
  }
}

export function complexConjugate(z: Complex): Complex {
  return complex(z.re, -z.im)
}

export function complexFromPolar(r: number, thetaDeg: number): Complex {
  const rad = (thetaDeg * Math.PI) / 180
  return complex(r * Math.cos(rad), r * Math.sin(rad))
}

export function complexToPolar(z: Complex): { r: number; thetaDeg: number; thetaRad: number } {
  const r = complexModulus(z)
  const arg = complexArgument(z)
  return {
    r,
    thetaDeg: arg.deg,
    thetaRad: arg.rad,
  }
}

export function complexPower(z: Complex, n: number): Complex {
  const polar = complexToPolar(z)
  const rN = Math.pow(polar.r, n)
  const thetaN = polar.thetaRad * n
  return complex(rN * Math.cos(thetaN), rN * Math.sin(thetaN))
}

export function formatComplex(z: Complex): string {
  const cleanRe = Math.abs(z.re) < EPSILON ? 0 : z.re
  const cleanIm = Math.abs(z.im) < EPSILON ? 0 : z.im

  if (cleanIm === 0) return `${cleanRe}`
  if (cleanRe === 0) {
    if (cleanIm === 1) return 'i'
    if (cleanIm === -1) return '-i'
    return `${cleanIm}i`
  }

  const sign = cleanIm > 0 ? '+' : '-'
  const absIm = Math.abs(cleanIm)
  const imStr = absIm === 1 ? 'i' : `${absIm}i`
  return `${cleanRe} ${sign} ${imStr}`
}
