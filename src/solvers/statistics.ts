/**
 * Arc Calculator 2.0 — Statistics Engine
 * Supports 1-Variable descriptive statistics and 2-Variable Linear Regression.
 */

export interface Stats1VarResult {
  n: number
  sum: number
  sumSq: number
  mean: number
  median: number
  mode: number[]
  min: number
  max: number
  range: number
  sampleVariance: number
  populationVariance: number
  sampleStdDev: number
  populationStdDev: number
  q1: number
  q3: number
  iqr: number
}

export interface LinearRegressionResult {
  n: number
  slope: number // m in y = mx + c
  intercept: number // c in y = mx + c
  r: number // Pearson correlation coefficient
  r2: number // Coefficient of determination
  meanX: number
  meanY: number
  equation: string
}

export function calculate1VarStats(data: number[]): Stats1VarResult {
  if (data.length === 0) {
    throw new Error('Statistical dataset must contain at least one value.')
  }

  const n = data.length
  const sorted = [...data].sort((a, b) => a - b)
  const sum = sorted.reduce((a, b) => a + b, 0)
  const sumSq = sorted.reduce((a, b) => a + b * b, 0)
  const mean = sum / n
  const min = sorted[0]
  const max = sorted[n - 1]
  const range = max - min

  // Median
  const median =
    n % 2 === 1
      ? sorted[Math.floor(n / 2)]
      : (sorted[n / 2 - 1] + sorted[n / 2]) / 2

  // Mode
  const freqMap = new Map<number, number>()
  let maxFreq = 0
  for (const x of sorted) {
    const f = (freqMap.get(x) || 0) + 1
    freqMap.set(x, f)
    if (f > maxFreq) maxFreq = f
  }

  const mode: number[] = []
  if (maxFreq > 1) {
    for (const [val, f] of freqMap.entries()) {
      if (f === maxFreq) mode.push(val)
    }
  }

  // Population variance & std dev (divided by n)
  const ss = sorted.reduce((acc, x) => acc + (x - mean) * (x - mean), 0)
  const populationVariance = ss / n
  const populationStdDev = Math.sqrt(populationVariance)

  // Sample variance & std dev (divided by n - 1, defined for n >= 2)
  const sampleVariance = n > 1 ? ss / (n - 1) : 0
  const sampleStdDev = Math.sqrt(sampleVariance)

  // Quartiles (Tukey's hinges)
  const lowerHalf = n % 2 === 0 ? sorted.slice(0, n / 2) : sorted.slice(0, Math.floor(n / 2))
  const upperHalf = n % 2 === 0 ? sorted.slice(n / 2) : sorted.slice(Math.ceil(n / 2))

  const q1 =
    lowerHalf.length > 0
      ? lowerHalf.length % 2 === 1
        ? lowerHalf[Math.floor(lowerHalf.length / 2)]
        : (lowerHalf[lowerHalf.length / 2 - 1] + lowerHalf[lowerHalf.length / 2]) / 2
      : median

  const q3 =
    upperHalf.length > 0
      ? upperHalf.length % 2 === 1
        ? upperHalf[Math.floor(upperHalf.length / 2)]
        : (upperHalf[upperHalf.length / 2 - 1] + upperHalf[upperHalf.length / 2]) / 2
      : median

  const iqr = q3 - q1

  return {
    n,
    sum,
    sumSq,
    mean,
    median,
    mode,
    min,
    max,
    range,
    sampleVariance,
    populationVariance,
    sampleStdDev,
    populationStdDev,
    q1,
    q3,
    iqr,
  }
}

export function calculateLinearRegression(points: { x: number; y: number }[]): LinearRegressionResult {
  if (points.length < 2) {
    throw new Error('Linear regression requires at least two data points.')
  }

  const n = points.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  let sumY2 = 0

  for (const pt of points) {
    sumX += pt.x
    sumY += pt.y
    sumXY += pt.x * pt.y
    sumX2 += pt.x * pt.x
    sumY2 += pt.y * pt.y
  }

  const meanX = sumX / n
  const meanY = sumY / n

  const denomM = n * sumX2 - sumX * sumX
  if (Math.abs(denomM) < 1e-12) {
    throw new Error('All x values are identical; vertical line regression is undefined.')
  }

  const slope = (n * sumXY - sumX * sumY) / denomM
  const intercept = (sumY - slope * sumX) / n

  const denomR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  const r = denomR !== 0 ? (n * sumXY - sumX * sumY) / denomR : 0
  const r2 = r * r

  const sign = intercept >= 0 ? '+' : '-'
  const equation = `y = ${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}`

  return {
    n,
    slope,
    intercept,
    r,
    r2,
    meanX,
    meanY,
    equation,
  }
}
