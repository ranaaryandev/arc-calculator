import { describe, it, expect } from 'vitest'
import {
  solveLinear,
  solveQuadratic,
  solveSystem2x2,
  solveSystem3x3,
  addMatrices,
  multiplyMatrices,
  matrixDeterminant,
  matrixInverse,
  transposeMatrix,
  vectorMagnitude,
  vectorDot,
  vectorCross3D,
  vectorAngle,
  complex,
  complexAdd,
  complexMultiply,
  complexDivide,
  complexModulus,
  complexToPolar,
  calculate1VarStats,
  calculateLinearRegression,
  permutations,
  combinations,
  binomialPMF,
  normalCDF,
  parseBaseStringToBigInt,
  formatBaseN,
  bitwiseOperation,
  generateTableOfValues,
} from '../solvers'

describe('Equation Solver', () => {
  it('solves simple linear equation 2x + 4 = 0', () => {
    const res = solveLinear(2, 4)
    expect(res.status).toBe('unique')
    expect(res.solution).toBe(-2)
  })

  it('detects infinite solutions for 0x + 0 = 0', () => {
    const res = solveLinear(0, 0)
    expect(res.status).toBe('infinite')
  })

  it('detects contradiction for 0x + 5 = 0', () => {
    const res = solveLinear(0, 5)
    expect(res.status).toBe('none')
  })

  it('solves quadratic with two real roots: x^2 - 5x + 6 = 0', () => {
    const res = solveQuadratic(1, -5, 6)
    expect(res.status).toBe('two_real')
    expect(res.roots[0].realPart).toBe(3)
    expect(res.roots[1].realPart).toBe(2)
  })

  it('solves quadratic with repeated root: x^2 - 4x + 4 = 0', () => {
    const res = solveQuadratic(1, -4, 4)
    expect(res.status).toBe('one_real')
    expect(res.roots[0].realPart).toBe(2)
  })

  it('solves quadratic with complex conjugate roots: x^2 + 1 = 0', () => {
    const res = solveQuadratic(1, 0, 1)
    expect(res.status).toBe('complex')
    expect(res.roots[0].realPart).toBe(0)
    expect(res.roots[0].imagPart).toBe(1)
    expect(res.roots[1].imagPart).toBe(-1)
  })

  it('solves 2x2 linear system', () => {
    // 2x + y = 5, x - y = 1 => x = 2, y = 1
    const res = solveSystem2x2(2, 1, 5, 1, -1, 1)
    expect(res.status).toBe('unique')
    expect(res.solution?.x).toBeCloseTo(2)
    expect(res.solution?.y).toBeCloseTo(1)
  })

  it('solves 3x3 linear system via Gaussian elimination', () => {
    // x + y + z = 6
    // 2y + 5z = -4
    // 2x + 5y - z = 27
    // Known analytical solution: x = 5, y = 3, z = -2
    const A = [
      [1, 1, 1],
      [0, 2, 5],
      [2, 5, -1],
    ]
    const b = [6, -4, 27]
    const res = solveSystem3x3(A, b)
    expect(res.status).toBe('unique')
    expect(res.solution?.x).toBeCloseTo(5)
    expect(res.solution?.y).toBeCloseTo(3)
    expect(res.solution?.z).toBeCloseTo(-2)
  })
})

describe('Matrix Algebra Engine', () => {
  it('adds matrices correctly', () => {
    const A = [[1, 2], [3, 4]]
    const B = [[5, 6], [7, 8]]
    expect(addMatrices(A, B)).toEqual([[6, 8], [10, 12]])
  })

  it('multiplies matrices correctly', () => {
    const A = [[1, 2], [3, 4]]
    const B = [[2, 0], [1, 2]]
    // [[1*2+2*1, 1*0+2*2], [3*2+4*1, 3*0+4*2]] = [[4, 4], [10, 8]]
    expect(multiplyMatrices(A, B)).toEqual([[4, 4], [10, 8]])
  })

  it('computes determinant of 2x2 and 3x3 matrices', () => {
    expect(matrixDeterminant([[4, 6], [3, 8]])).toBe(14)
    const M3 = [
      [6, 1, 1],
      [4, -2, 5],
      [2, 8, 7],
    ]
    // 6*(-14-40) - 1*(28-10) + 1*(32 - (-4)) = 6*(-54) - 18 + 36 = -324 - 18 + 36 = -306
    expect(matrixDeterminant(M3)).toBeCloseTo(-306)
  })

  it('computes inverse of invertible matrix', () => {
    const A = [[4, 7], [2, 6]]
    const inv = matrixInverse(A)
    // A * inv should equal Identity
    const identity = multiplyMatrices(A, inv)
    expect(identity[0][0]).toBeCloseTo(1)
    expect(identity[0][1]).toBeCloseTo(0)
    expect(identity[1][0]).toBeCloseTo(0)
    expect(identity[1][1]).toBeCloseTo(1)
  })

  it('throws when attempting to invert singular matrix', () => {
    const singular = [[1, 2], [2, 4]]
    expect(() => matrixInverse(singular)).toThrow(/singular/i)
  })

  it('transposes matrix correctly', () => {
    const A = [[1, 2, 3], [4, 5, 6]]
    expect(transposeMatrix(A)).toEqual([[1, 4], [2, 5], [3, 6]])
  })
})

describe('Vector Algebra Engine', () => {
  it('computes vector magnitude', () => {
    expect(vectorMagnitude([3, 4])).toBe(5)
    expect(vectorMagnitude([1, 2, 2])).toBe(3)
  })

  it('computes dot product', () => {
    expect(vectorDot([1, 2, 3], [4, -5, 6])).toBe(12)
  })

  it('computes 3D cross product', () => {
    // i x j = k => [1, 0, 0] x [0, 1, 0] = [0, 0, 1]
    expect(vectorCross3D([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
  })

  it('computes angle between orthogonal vectors as 90 degrees', () => {
    const angle = vectorAngle([1, 0], [0, 1])
    expect(angle.deg).toBeCloseTo(90)
    expect(angle.rad).toBeCloseTo(Math.PI / 2)
  })
})

describe('Complex Numbers Engine', () => {
  it('performs basic complex arithmetic', () => {
    const z1 = complex(2, 3)
    const z2 = complex(4, -1)
    expect(complexAdd(z1, z2)).toEqual({ re: 6, im: 2 })
    // (2 + 3i)(4 - i) = 8 - 2i + 12i - 3i^2 = 11 + 10i
    expect(complexMultiply(z1, z2)).toEqual({ re: 11, im: 10 })
  })

  it('divides complex numbers accurately', () => {
    const z1 = complex(1, 1)
    const z2 = complex(1, -1)
    // (1+i)/(1-i) = (1+i)^2 / 2 = 2i/2 = i
    const res = complexDivide(z1, z2)
    expect(res.re).toBeCloseTo(0)
    expect(res.im).toBeCloseTo(1)
  })

  it('calculates modulus and converts to polar', () => {
    const z = complex(3, 4)
    expect(complexModulus(z)).toBe(5)
    const polar = complexToPolar(z)
    expect(polar.r).toBe(5)
    expect(polar.thetaDeg).toBeCloseTo(53.13, 1)
  })
})

describe('Statistics & Probability Engines', () => {
  it('computes 1-variable descriptive statistics', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9]
    const stats = calculate1VarStats(data)
    expect(stats.mean).toBe(5)
    expect(stats.median).toBe(4.5)
    expect(stats.mode).toEqual([4])
    expect(stats.min).toBe(2)
    expect(stats.max).toBe(9)
    expect(stats.populationVariance).toBe(4)
    expect(stats.populationStdDev).toBe(2)
  })

  it('computes linear regression parameters', () => {
    const points = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ]
    const reg = calculateLinearRegression(points)
    expect(reg.slope).toBeCloseTo(2)
    expect(reg.intercept).toBeCloseTo(0)
    expect(reg.r).toBeCloseTo(1)
  })

  it('computes permutations and combinations', () => {
    expect(permutations(5, 2)).toBe(20)
    expect(combinations(5, 2)).toBe(10)
    expect(combinations(10, 0)).toBe(1)
    expect(combinations(10, 10)).toBe(1)
  })

  it('computes binomial PMF', () => {
    // 3 heads in 5 fair coin flips: C(5,3) * 0.5^5 = 10 / 32 = 0.3125
    expect(binomialPMF(5, 3, 0.5)).toBeCloseTo(0.3125)
  })

  it('computes standard normal CDF', () => {
    expect(normalCDF(0)).toBeCloseTo(0.5, 4)
    // P(Z <= 1.96) ~ 0.975
    expect(normalCDF(1.96)).toBeCloseTo(0.975, 3)
  })
})

describe('Base-N Number Systems', () => {
  it('parses and formats base representations', () => {
    const val = parseBaseStringToBigInt('255', 'DEC')
    const fmt = formatBaseN(val, 8)
    expect(fmt.bin).toBe('11111111')
    expect(fmt.hex).toBe('FF')
    expect(fmt.oct).toBe('377')
  })

  it('performs bitwise operations', () => {
    const res = bitwiseOperation('12', '10', 'AND', 'DEC', 8)
    // 12 (1100) & 10 (1010) = 8 (1000)
    expect(res.dec).toBe('8')
  })
})

describe('Table of Values Generator', () => {
  it('generates table for quadratic f(x) = x^2 over [-2, 2]', () => {
    const table = generateTableOfValues('x^2', -2, 2, 1)
    expect(table.rows.length).toBe(5)
    expect(table.rows[0]).toEqual({
      stepIndex: 0,
      x: -2,
      y: 4,
      displayY: '4',
      isError: false,
    })
    expect(table.rows[4].y).toBe(4)
  })

  it('rejects invalid or too large step sizes', () => {
    expect(() => generateTableOfValues('x', 0, 10, -1)).toThrow(/positive/i)
    expect(() => generateTableOfValues('x', 0, 1000, 0.1)).toThrow(/exceeding/i)
  })
})
