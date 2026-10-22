import { describe, it, expect } from 'vitest'
import { evaluateExpression, calculateLivePreview } from '../calculator'

describe('Arc Calculator - Mathematical Engine', () => {
  describe('Essential Mathematical Operations', () => {
    it('evaluates basic addition: 2 + 2 = 4', () => {
      const res = evaluateExpression('2 + 2')
      expect(res.error).toBeNull()
      expect(res.value).toBe(4)
      expect(res.formatted).toBe('4')
    })

    it('evaluates subtraction: 12 − 5 = 7 (using both - and unicode −)', () => {
      const res1 = evaluateExpression('12 - 5')
      expect(res1.error).toBeNull()
      expect(res1.value).toBe(7)

      const res2 = evaluateExpression('12 \u2212 5')
      expect(res2.error).toBeNull()
      expect(res2.value).toBe(7)
    })

    it('evaluates multiplication: 6 × 7 = 42 (using * and ×)', () => {
      const res1 = evaluateExpression('6 * 7')
      expect(res1.error).toBeNull()
      expect(res1.value).toBe(42)

      const res2 = evaluateExpression('6 \u00D7 7')
      expect(res2.error).toBeNull()
      expect(res2.value).toBe(42)
    })

    it('evaluates division: 15 ÷ 3 = 5 (using / and ÷)', () => {
      const res1 = evaluateExpression('15 / 3')
      expect(res1.error).toBeNull()
      expect(res1.value).toBe(5)

      const res2 = evaluateExpression('15 \u00F7 3')
      expect(res2.error).toBeNull()
      expect(res2.value).toBe(5)
    })

    it('enforces operator precedence: 2 + 3 × 4 = 14', () => {
      const res = evaluateExpression('2 + 3 * 4')
      expect(res.error).toBeNull()
      expect(res.value).toBe(14)
    })

    it('respects parentheses override: (2 + 3) × 4 = 20', () => {
      const res = evaluateExpression('(2 + 3) * 4')
      expect(res.error).toBeNull()
      expect(res.value).toBe(20)
    })

    it('evaluates unary minus: −5 + 2 = −3', () => {
      const res = evaluateExpression('-5 + 2')
      expect(res.error).toBeNull()
      expect(res.value).toBe(-3)
    })

    it('evaluates exponents: 2^10 = 1024', () => {
      const res = evaluateExpression('2^10')
      expect(res.error).toBeNull()
      expect(res.value).toBe(1024)
    })

    it('evaluates right-associative power: 2^3^2 = 2^(3^2) = 512', () => {
      const res = evaluateExpression('2^3^2')
      expect(res.error).toBeNull()
      expect(res.value).toBe(512)
    })

    it('evaluates square root: sqrt(81) = 9', () => {
      const res = evaluateExpression('sqrt(81)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(9)
    })

    it('evaluates factorial: 5! = 120 and 0! = 1', () => {
      const res1 = evaluateExpression('5!')
      expect(res1.error).toBeNull()
      expect(res1.value).toBe(120)

      const res2 = evaluateExpression('0!')
      expect(res2.error).toBeNull()
      expect(res2.value).toBe(1)
    })
  })

  describe('Trigonometry and Angular Modes', () => {
    it('evaluates sin(30°) = 0.5 in DEG mode', () => {
      const res = evaluateExpression('sin(30)', { angleMode: 'DEG' })
      expect(res.error).toBeNull()
      expect(res.value).toBe(0.5)
      expect(res.formatted).toBe('0.5')
    })

    it('evaluates cos(60°) = 0.5 in DEG mode', () => {
      const res = evaluateExpression('cos(60)', { angleMode: 'DEG' })
      expect(res.error).toBeNull()
      expect(res.value).toBe(0.5)
      expect(res.formatted).toBe('0.5')
    })

    it('evaluates tan(45°) = 1 within tolerance in DEG mode', () => {
      const res = evaluateExpression('tan(45)', { angleMode: 'DEG' })
      expect(res.error).toBeNull()
      expect(res.value).toBeCloseTo(1, 10)
    })

    it('evaluates cos(90°) = 0 in DEG mode without floating point leak', () => {
      const res = evaluateExpression('cos(90)', { angleMode: 'DEG' })
      expect(res.error).toBeNull()
      expect(res.value).toBe(0)
    })

    it('rejects tan(90°) singularity with clear error', () => {
      const res = evaluateExpression('tan(90)', { angleMode: 'DEG' })
      expect(res.error).toContain('tangent singularity')
    })

    it('supports RAD mode: sin(pi / 6) = 0.5', () => {
      const res = evaluateExpression('sin(pi / 6)', { angleMode: 'RAD' })
      expect(res.error).toBeNull()
      expect(res.value).toBeCloseTo(0.5, 10)
    })

    it('supports inverse trig in DEG mode: asin(0.5) = 30', () => {
      const res = evaluateExpression('asin(0.5)', { angleMode: 'DEG' })
      expect(res.error).toBeNull()
      expect(res.value).toBeCloseTo(30, 8)
    })
  })

  describe('Logarithms and Constants', () => {
    it('evaluates ln(e) = 1', () => {
      const res = evaluateExpression('ln(e)')
      expect(res.error).toBeNull()
      expect(res.value).toBeCloseTo(1, 10)
    })

    it('evaluates log10(1000) = 3', () => {
      const res = evaluateExpression('log10(1000)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(3)
    })

    it('evaluates pi constant accurately', () => {
      const res = evaluateExpression('pi')
      expect(res.error).toBeNull()
      expect(res.value).toBeCloseTo(Math.PI, 10)
    })
  })

  describe('Implicit Multiplication', () => {
    it('handles 2(3) = 6', () => {
      const res = evaluateExpression('2(3)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(6)
    })

    it('handles (2)(3) = 6', () => {
      const res = evaluateExpression('(2)(3)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(6)
    })

    it('handles 2pi = 2 * pi', () => {
      const res = evaluateExpression('2pi')
      expect(res.error).toBeNull()
      expect(res.value).toBeCloseTo(2 * Math.PI, 10)
    })

    it('handles 2sqrt(9) = 6', () => {
      const res = evaluateExpression('2sqrt(9)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(6)
    })
  })

  describe('Percentage Semantics', () => {
    it('evaluates 50% as 0.5', () => {
      const res = evaluateExpression('50%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(0.5)
    })

    it('evaluates 100 + 10% = 110', () => {
      const res = evaluateExpression('100 + 10%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(110)
    })

    it('evaluates 100 - 10% = 90', () => {
      const res = evaluateExpression('100 - 10%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(90)
    })

    it('evaluates 50 * 20% = 10', () => {
      const res = evaluateExpression('50 * 20%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(10)
    })
  })

  describe('Domain and Error Handling', () => {
    it('handles division by zero: 1 / 0', () => {
      const res = evaluateExpression('1 / 0')
      expect(res.error).toBe('Cannot divide by zero')
    })

    it('follows real-number policy: sqrt(-1) produces domain error', () => {
      const res = evaluateExpression('sqrt(-1)')
      expect(res.error).toContain('square root of negative number')
    })

    it('rejects log(0) and ln(0) with domain error', () => {
      const res1 = evaluateExpression('log(0)')
      expect(res1.error).toContain('Domain error')

      const res2 = evaluateExpression('ln(0)')
      expect(res2.error).toContain('Domain error')
    })

    it('rejects negative and non-integer factorial', () => {
      const res1 = evaluateExpression('(-3)!')
      expect(res1.error).toContain('non-negative integer')

      const res2 = evaluateExpression('(3.5)!')
      expect(res2.error).toContain('integer')
    })

    it('safely handles empty expression', () => {
      const res = evaluateExpression('')
      expect(res.error).toBeNull()
      expect(res.value).toBe(0)
      expect(res.formatted).toBe('0')
    })

    it('protects against deeply nested parentheses', () => {
      const deep = '('.repeat(50) + '1' + ')'.repeat(50)
      const res = evaluateExpression(deep)
      expect(res.error).toContain('maximum nested parenthesis depth')
    })

    it('never executes arbitrary javascript or malicious code', () => {
      const malicious = 'alert(1); console.log("hack")'
      const res = evaluateExpression(malicious)
      expect(res.error).not.toBeNull()
    })
  })

  describe('Live Preview Engine', () => {
    it('previews complete expression', () => {
      const prev = calculateLivePreview('2 + 3')
      expect(prev.preview).toBe('5')
      expect(prev.error).toBeNull()
    })

    it('handles incomplete expressions with trailing operator gracefully', () => {
      const prev = calculateLivePreview('2 + 3 +')
      expect(prev.preview).toBe('5')
      expect(prev.error).toBeNull()
    })

    it('handles unclosed parentheses in preview gracefully', () => {
      const prev = calculateLivePreview('(2 + 3')
      expect(prev.preview).toBe('5')
      expect(prev.error).toBeNull()
    })

    it('returns null preview for completely invalid input without alarming error', () => {
      const prev = calculateLivePreview('+')
      expect(prev.preview).toBeNull()
    })
  })
})
