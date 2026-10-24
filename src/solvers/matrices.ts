/**
 * Arc Calculator 2.0 — Matrix Algebra Engine
 * Provides addition, subtraction, multiplication, determinant, transpose, inverse, and trace.
 */

export type Matrix = number[][]

const EPSILON = 1e-12

export function createZeroMatrix(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

export function createIdentityMatrix(n: number): Matrix {
  const I = createZeroMatrix(n, n)
  for (let i = 0; i < n; i++) I[i][i] = 1
  return I
}

export function addMatrices(A: Matrix, B: Matrix): Matrix {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error(`Dimension mismatch for addition: [${A.length}×${A[0].length}] + [${B.length}×${B[0].length}]`)
  }
  return A.map((row, r) => row.map((val, c) => val + B[r][c]))
}

export function subtractMatrices(A: Matrix, B: Matrix): Matrix {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error(`Dimension mismatch for subtraction: [${A.length}×${A[0].length}] - [${B.length}×${B[0].length}]`)
  }
  return A.map((row, r) => row.map((val, c) => val - B[r][c]))
}

export function multiplyScalar(A: Matrix, scalar: number): Matrix {
  return A.map((row) => row.map((val) => val * scalar))
}

export function multiplyMatrices(A: Matrix, B: Matrix): Matrix {
  const rA = A.length
  const cA = A[0].length
  const rB = B.length
  const cB = B[0].length

  if (cA !== rB) {
    throw new Error(`Cannot multiply: columns of A (${cA}) must match rows of B (${rB}).`)
  }

  const result = createZeroMatrix(rA, cB)
  for (let i = 0; i < rA; i++) {
    for (let j = 0; j < cB; j++) {
      let sum = 0
      for (let k = 0; k < cA; k++) {
        sum += A[i][k] * B[k][j]
      }
      result[i][j] = Math.abs(sum) < EPSILON ? 0 : sum
    }
  }
  return result
}

export function transposeMatrix(A: Matrix): Matrix {
  const r = A.length
  const c = A[0].length
  const result = createZeroMatrix(c, r)
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      result[j][i] = A[i][j]
    }
  }
  return result
}

export function matrixTrace(A: Matrix): number {
  if (A.length !== A[0].length) {
    throw new Error('Trace is only defined for square matrices.')
  }
  let sum = 0
  for (let i = 0; i < A.length; i++) sum += A[i][i]
  return sum
}

export function matrixDeterminant(A: Matrix): number {
  const n = A.length
  if (n !== A[0].length) {
    throw new Error('Determinant is only defined for square matrices.')
  }

  if (n === 1) return A[0][0]
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0]
  if (n === 3) {
    return (
      A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
      A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
      A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
    )
  }

  // Gaussian elimination with row swapping for n >= 4
  const M: Matrix = A.map((r) => [...r])
  let det = 1

  for (let i = 0; i < n; i++) {
    let pivot = i
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(M[j][i]) > Math.abs(M[pivot][i])) pivot = j
    }

    if (Math.abs(M[pivot][i]) < EPSILON) return 0

    if (pivot !== i) {
      const temp = M[i]
      M[i] = M[pivot]
      M[pivot] = temp
      det = -det
    }

    det *= M[i][i]
    for (let j = i + 1; j < n; j++) {
      const factor = M[j][i] / M[i][i]
      for (let k = i; k < n; k++) {
        M[j][k] -= factor * M[i][k]
      }
    }
  }

  return Math.abs(det) < EPSILON ? 0 : det
}

export function matrixInverse(A: Matrix): Matrix {
  const n = A.length
  if (n !== A[0].length) {
    throw new Error('Inverse is only defined for square matrices.')
  }

  const det = matrixDeterminant(A)
  if (Math.abs(det) < EPSILON) {
    throw new Error(`Matrix is singular (det ≈ 0). Inverse does not exist.`)
  }

  // Gauss-Jordan elimination on [A | I]
  const M: Matrix = A.map((row, i) => [...row, ...createIdentityMatrix(n)[i]])

  for (let i = 0; i < n; i++) {
    let pivot = i
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(M[j][i]) > Math.abs(M[pivot][i])) pivot = j
    }

    if (Math.abs(M[pivot][i]) < EPSILON) {
      throw new Error('Matrix is numerically singular.')
    }

    if (pivot !== i) {
      const temp = M[i]
      M[i] = M[pivot]
      M[pivot] = temp
    }

    const pivotVal = M[i][i]
    for (let j = 0; j < 2 * n; j++) {
      M[i][j] /= pivotVal
    }

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = M[j][i]
        for (let k = 0; k < 2 * n; k++) {
          M[j][k] -= factor * M[i][k]
        }
      }
    }
  }

  // Extract right half
  const inv = createZeroMatrix(n, n)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const val = M[i][j + n]
      inv[i][j] = Math.abs(val) < EPSILON ? 0 : val
    }
  }
  return inv
}
