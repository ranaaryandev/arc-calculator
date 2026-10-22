import { describe, it, expect } from 'vitest'
import { formatResult, formatExpressionForDisplay } from '../calculator/formatter'

describe('Formatter Engine', () => {
  it('formats regular integers without decimal points', () => {
    expect(formatResult(42)).toBe('42')
    expect(formatResult(0)).toBe('0')
    expect(formatResult(-15)).toBe('-15')
  })

  it('normalizes negative zero to zero', () => {
    expect(formatResult(-0)).toBe('0')
  })

  it('cleans floating point arithmetic representation', () => {
    expect(formatResult(0.1 + 0.2)).toBe('0.3')
    expect(formatResult(0.3 - 0.2)).toBe('0.1')
  })

  it('formats scientific notation for very large numbers', () => {
    expect(formatResult(1e16)).toContain('e')
    expect(formatResult(2.5e15)).toBe('2.5e+15')
  })

  it('formats scientific notation for very small numbers', () => {
    expect(formatResult(1e-8)).toContain('e')
  })

  it('formats expression operators for high visual readability', () => {
    expect(formatExpressionForDisplay('2*3+4/2')).toBe('2 × 3 + 4 ÷ 2')
    expect(formatExpressionForDisplay('2*pi')).toBe('2 × π')
  })
})
