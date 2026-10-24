/**
 * Arc Calculator 2.0 — Probability & Distributions Engine
 * Supports Permutations (nPr), Combinations (nCr), Binomial, and Normal Distributions.
 */

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Factorial requires a non-negative integer.')
  }
  if (n > 170) {
    throw new Error('Factorial exceeds floating-point limit (> 170).')
  }
  let res = 1
  for (let i = 2; i <= n; i++) res *= i
  return res
}

export function permutations(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) {
    throw new Error('Permutations require non-negative integers for n and r.')
  }
  if (r > n) return 0
  let res = 1
  for (let i = n; i > n - r; i--) res *= i
  return res
}

export function combinations(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) {
    throw new Error('Combinations require non-negative integers for n and r.')
  }
  if (r > n) return 0
  if (r === 0 || r === n) return 1
  const k = Math.min(r, n - r)
  let num = 1
  let den = 1
  for (let i = 1; i <= k; i++) {
    num *= n - i + 1
    den *= i
  }
  return num / den
}

export function binomialPMF(n: number, k: number, p: number): number {
  if (p < 0 || p > 1) {
    throw new Error('Probability p must be between 0 and 1.')
  }
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
    return 0
  }
  const comb = combinations(n, k)
  return comb * Math.pow(p, k) * Math.pow(1 - p, n - k)
}

export function binomialCDF(n: number, k: number, p: number): number {
  let sum = 0
  for (let i = 0; i <= k; i++) {
    sum += binomialPMF(n, i, p)
  }
  return Math.min(1, Math.max(0, sum))
}

/**
 * Approximation of error function erf(x) via Abramowitz and Stegun formula 7.1.26
 * Maximum error is less than 1.5e-7.
 */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1
  const absX = Math.abs(x)

  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)
  return sign * y
}

export function normalPDF(x: number, mean = 0, stdDev = 1): number {
  if (stdDev <= 0) {
    throw new Error('Standard deviation must be strictly positive.')
  }
  const z = (x - mean) / stdDev
  const coeff = 1 / (stdDev * Math.sqrt(2 * Math.PI))
  return coeff * Math.exp(-0.5 * z * z)
}

export function normalCDF(x: number, mean = 0, stdDev = 1): number {
  if (stdDev <= 0) {
    throw new Error('Standard deviation must be strictly positive.')
  }
  const z = (x - mean) / stdDev
  const prob = 0.5 * (1 + erf(z / Math.SQRT2))
  return Math.min(1, Math.max(0, prob))
}

export function normalInterval(a: number, b: number, mean = 0, stdDev = 1): number {
  return normalCDF(b, mean, stdDev) - normalCDF(a, mean, stdDev)
}
