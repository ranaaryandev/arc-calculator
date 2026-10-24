/**
 * Arc Calculator 2.0 — Equation Solver Engine
 * Provides analytical solutions for Linear, Quadratic, 2x2 Systems, and 3x3 Systems.
 */

export interface LinearResult {
  type: 'linear'
  status: 'unique' | 'infinite' | 'none'
  solution?: number
  explanation: string
}

export interface QuadraticResult {
  type: 'quadratic'
  status: 'two_real' | 'one_real' | 'complex' | 'linear' | 'degenerate'
  discriminant: number
  roots: {
    realPart: number
    imagPart: number
    label: string
  }[]
  vertex: { x: number; y: number }
  explanation: string
}

export interface System2x2Result {
  type: 'system2x2'
  status: 'unique' | 'infinite' | 'none'
  solution?: { x: number; y: number }
  determinant: number
  explanation: string
}

export interface System3x3Result {
  type: 'system3x3'
  status: 'unique' | 'singular'
  solution?: { x: number; y: number; z: number }
  explanation: string
}

const EPSILON = 1e-12

export function solveLinear(a: number, b: number): LinearResult {
  if (Math.abs(a) < EPSILON) {
    if (Math.abs(b) < EPSILON) {
      return {
        type: 'linear',
        status: 'infinite',
        explanation: '0x + 0 = 0 is true for all real values of x (Infinite Solutions).',
      }
    }
    return {
      type: 'linear',
      status: 'none',
      explanation: `0x + (${b}) = 0 is a mathematical contradiction (No Solution).`,
    }
  }

  const solution = -b / a
  return {
    type: 'linear',
    status: 'unique',
    solution: Math.abs(solution) < EPSILON ? 0 : solution,
    explanation: `x = -(${b}) / (${a}) = ${solution}`,
  }
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (Math.abs(a) < EPSILON) {
    const lin = solveLinear(b, c)
    return {
      type: 'quadratic',
      status: 'linear',
      discriminant: 0,
      roots: lin.solution !== undefined ? [{ realPart: lin.solution, imagPart: 0, label: `x = ${lin.solution}` }] : [],
      vertex: { x: 0, y: 0 },
      explanation: `Degenerates to a linear equation since a = 0: ${lin.explanation}`,
    }
  }

  const discriminant = b * b - 4 * a * c
  const vx = -b / (2 * a)
  const vy = c - (b * b) / (4 * a)
  const vertex = {
    x: Math.abs(vx) < EPSILON ? 0 : vx,
    y: Math.abs(vy) < EPSILON ? 0 : vy,
  }

  if (discriminant > EPSILON) {
    const sqrtD = Math.sqrt(discriminant)
    const r1 = (-b + sqrtD) / (2 * a)
    const r2 = (-b - sqrtD) / (2 * a)
    return {
      type: 'quadratic',
      status: 'two_real',
      discriminant,
      roots: [
        { realPart: r1, imagPart: 0, label: `x₁ = ${r1.toFixed(6).replace(/\.?0+$/, '')}` },
        { realPart: r2, imagPart: 0, label: `x₂ = ${r2.toFixed(6).replace(/\.?0+$/, '')}` },
      ],
      vertex,
      explanation: `Discriminant Δ = ${discriminant} > 0. Two distinct real roots: x = (-b ± √Δ) / 2a.`,
    }
  }

  if (Math.abs(discriminant) <= EPSILON) {
    const r = -b / (2 * a)
    return {
      type: 'quadratic',
      status: 'one_real',
      discriminant: 0,
      roots: [{ realPart: r, imagPart: 0, label: `x = ${r.toFixed(6).replace(/\.?0+$/, '')}` }],
      vertex,
      explanation: `Discriminant Δ = 0. One repeated real root at x = -b / 2a = ${r}.`,
    }
  }

  // Complex roots
  const sqrtD = Math.sqrt(-discriminant)
  const realPart = -b / (2 * a)
  const imagPart = Math.abs(sqrtD / (2 * a))
  const cleanReal = Math.abs(realPart) < EPSILON ? 0 : realPart
  return {
    type: 'quadratic',
    status: 'complex',
    discriminant,
    roots: [
      {
        realPart: cleanReal,
        imagPart,
        label: `x₁ = ${cleanReal !== 0 ? cleanReal.toFixed(6).replace(/\.?0+$/, '') + ' + ' : ''}${imagPart.toFixed(6).replace(/\.?0+$/, '')}i`,
      },
      {
        realPart: cleanReal,
        imagPart: -imagPart,
        label: `x₂ = ${cleanReal !== 0 ? cleanReal.toFixed(6).replace(/\.?0+$/, '') + ' - ' : '-'}${imagPart.toFixed(6).replace(/\.?0+$/, '')}i`,
      },
    ],
    vertex,
    explanation: `Discriminant Δ = ${discriminant} < 0. Complex conjugate roots: x = (-b ± i√|Δ|) / 2a.`,
  }
}

export function solveSystem2x2(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
): System2x2Result {
  const det = a1 * b2 - a2 * b1
  const detX = c1 * b2 - c2 * b1
  const detY = a1 * c2 - a2 * c1

  if (Math.abs(det) < EPSILON) {
    if (Math.abs(detX) < EPSILON && Math.abs(detY) < EPSILON) {
      return {
        type: 'system2x2',
        status: 'infinite',
        determinant: 0,
        explanation: 'Determinant is 0 and lines are collinear (Infinite Solutions).',
      }
    }
    return {
      type: 'system2x2',
      status: 'none',
      determinant: 0,
      explanation: 'Determinant is 0 and lines are parallel with no intersection (No Solution).',
    }
  }

  const x = detX / det
  const y = detY / det

  return {
    type: 'system2x2',
    status: 'unique',
    solution: {
      x: Math.abs(x) < EPSILON ? 0 : x,
      y: Math.abs(y) < EPSILON ? 0 : y,
    },
    determinant: det,
    explanation: `Solved via Cramer's Rule: Det = ${det}, x = DetX/Det = ${x}, y = DetY/Det = ${y}`,
  }
}

export function solveSystem3x3(matrix: number[][], rhs: number[]): System3x3Result {
  // Gaussian elimination with partial pivoting
  const n = 3
  const A: number[][] = matrix.map((row) => [...row])
  const b = [...rhs]

  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col
    let maxVal = Math.abs(A[col][col])
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(A[r][col]) > maxVal) {
        maxVal = Math.abs(A[r][col])
        maxRow = r
      }
    }

    if (maxVal < EPSILON) {
      return {
        type: 'system3x3',
        status: 'singular',
        explanation: 'The system matrix is singular (determinant ≈ 0). No unique solution exists.',
      }
    }

    // Swap rows
    if (maxRow !== col) {
      const tempA = A[col]
      A[col] = A[maxRow]
      A[maxRow] = tempA

      const tempB = b[col]
      b[col] = b[maxRow]
      b[maxRow] = tempB
    }

    // Eliminate below
    for (let r = col + 1; r < n; r++) {
      const factor = A[r][col] / A[col][col]
      for (let c = col; c < n; c++) {
        A[r][c] -= factor * A[col][c]
      }
      b[r] -= factor * b[col]
    }
  }

  // Back substitution
  const sol = [0, 0, 0]
  for (let r = n - 1; r >= 0; r--) {
    let sum = b[r]
    for (let c = r + 1; c < n; c++) {
      sum -= A[r][c] * sol[c]
    }
    sol[r] = sum / A[r][r]
  }

  return {
    type: 'system3x3',
    status: 'unique',
    solution: {
      x: Math.abs(sol[0]) < EPSILON ? 0 : sol[0],
      y: Math.abs(sol[1]) < EPSILON ? 0 : sol[1],
      z: Math.abs(sol[2]) < EPSILON ? 0 : sol[2],
    },
    explanation: 'Solved via Gaussian elimination with partial pivoting.',
  }
}
