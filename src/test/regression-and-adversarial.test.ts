import { describe, it, expect } from 'vitest'
import { evaluateExpression, parse, formatResult } from '../calculator'

describe('Phase 1 & 2: Mathematical Correctness & Resilience', () => {
  describe('Operator Precedence & Associativity Table', () => {
    it('-2^2 evaluates to -4 (exponentiation has higher precedence than unary minus)', () => {
      const res = evaluateExpression('-2^2')
      expect(res.error).toBeNull()
      expect(res.value).toBe(-4)
      expect(res.formatted).toBe('-4')
    })

    it('(-2)^2 evaluates to 4 (parentheses override precedence)', () => {
      const res = evaluateExpression('(-2)^2')
      expect(res.error).toBeNull()
      expect(res.value).toBe(4)
      expect(res.formatted).toBe('4')
    })

    it('2^3^2 evaluates to 512 (right-associative power 2^(3^2))', () => {
      const res = evaluateExpression('2^3^2')
      expect(res.error).toBeNull()
      expect(res.value).toBe(512)
    })

    it('2^-3 evaluates to 0.125 (unary minus on power operand)', () => {
      const res = evaluateExpression('2^-3')
      expect(res.error).toBeNull()
      expect(res.value).toBe(0.125)
    })

    it('-2^-3 evaluates to -0.125', () => {
      const res = evaluateExpression('-2^-3')
      expect(res.error).toBeNull()
      expect(res.value).toBe(-0.125)
    })

    it('sqrt(81) evaluates to 9', () => {
      const res = evaluateExpression('sqrt(81)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(9)
    })

    it('root(3, -8) evaluates to -2 (odd integer root of negative radicand)', () => {
      const res = evaluateExpression('root(3, -8)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(-2)
    })

    it('root(2, -8) produces clear domain error (even root of negative radicand)', () => {
      const res = evaluateExpression('root(2, -8)')
      expect(res.error).not.toBeNull()
      expect(res.errorCode).toBe('DOMAIN_ERROR')
      expect(res.error).toContain('odd integer for negative radicand')
    })

    it('root(2.5, -32) produces clear domain error (non-integer root of negative radicand)', () => {
      const res = evaluateExpression('root(2.5, -32)')
      expect(res.error).not.toBeNull()
      expect(res.errorCode).toBe('DOMAIN_ERROR')
      expect(res.error).toContain('odd integer for negative radicand')
    })

    it('1 / 0 produces clear division-by-zero error', () => {
      const res = evaluateExpression('1 / 0')
      expect(res.error).not.toBeNull()
      expect(res.errorCode).toBe('DIVISION_BY_ZERO')
      expect(res.error).toBe('Cannot divide by zero')
    })

    it('sqrt(-1) produces clear domain error', () => {
      const res = evaluateExpression('sqrt(-1)')
      expect(res.error).not.toBeNull()
      expect(res.errorCode).toBe('DOMAIN_ERROR')
      expect(res.error).toContain('square root of negative number')
    })

    it('sin(30) in DEG mode evaluates to 0.5', () => {
      const res = evaluateExpression('sin(30)', { angleMode: 'DEG' })
      expect(res.error).toBeNull()
      expect(res.value).toBe(0.5)
      expect(res.formatted).toBe('0.5')
    })

    it('tan(90) in DEG mode produces clear singularity/undefined result', () => {
      const res = evaluateExpression('tan(90)', { angleMode: 'DEG' })
      expect(res.error).not.toBeNull()
      expect(res.errorCode).toBe('DOMAIN_ERROR')
      expect(res.error).toContain('tangent singularity')
    })

    it('0.1 + 0.2 displays 0.3 under normal display formatting', () => {
      const res = evaluateExpression('0.1 + 0.2')
      expect(res.error).toBeNull()
      expect(res.formatted).toBe('0.3')
    })
    it('evaluates algebraic expressions with variable x (e.g. for graphing)', async () => {
      const ast = parse('2x + 5')
      const { evaluateAST } = await import('../calculator')
      const val = evaluateAST(ast, { variables: { x: 3 } })
      expect(val).toBe(11)
    })
  })

  describe('Percentage vs Modulo Semantics', () => {
    it('10 % 3 evaluates to 1 (binary modulo)', () => {
      const res = evaluateExpression('10 % 3')
      expect(res.error).toBeNull()
      expect(res.value).toBe(1)
    })

    it('mod(10, 3) evaluates to 1 (functional modulo)', () => {
      const res = evaluateExpression('mod(10, 3)')
      expect(res.error).toBeNull()
      expect(res.value).toBe(1)
    })

    it('mod(10, 0) produces clear division-by-zero error', () => {
      const res = evaluateExpression('mod(10, 0)')
      expect(res.errorCode).toBe('DIVISION_BY_ZERO')
    })

    it('10 % 0 produces clear division-by-zero error', () => {
      const res = evaluateExpression('10 % 0')
      expect(res.errorCode).toBe('DIVISION_BY_ZERO')
    })

    it('50% evaluates to 0.5 (postfix percentage)', () => {
      const res = evaluateExpression('50%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(0.5)
    })

    it('100 + 10% evaluates to 110 (contextual markup percentage)', () => {
      const res = evaluateExpression('100 + 10%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(110)
    })

    it('100 - 10% evaluates to 90 (contextual discount percentage)', () => {
      const res = evaluateExpression('100 - 10%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(90)
    })

    it('50 * 20% evaluates to 10', () => {
      const res = evaluateExpression('50 * 20%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(10)
    })

    it('50 / 20% evaluates to 250', () => {
      const res = evaluateExpression('50 / 20%')
      expect(res.error).toBeNull()
      expect(res.value).toBe(250)
    })
  })

  describe('Parser Safety & Resilience Limits', () => {
    it('enforces maximum input length before tokenization (LIMITS.MAX_INPUT_LENGTH)', () => {
      const longInput = '1+'.repeat(600) + '1' // 1201 chars (> 1000)
      const res = evaluateExpression(longInput)
      expect(res.errorCode).toBe('INPUT_TOO_LONG')
      expect(res.error).toContain('maximum allowed length')
    })

    it('enforces maximum token count limit (LIMITS.MAX_TOKEN_COUNT)', () => {
      // 511 tokens (< 1000 characters limit, but > 500 tokens limit)
      const complexExpr = '1+'.repeat(255) + '1'
      const res = evaluateExpression(complexExpr)
      expect(res.errorCode).toBe('EXPRESSION_TOO_COMPLEX')
      expect(res.error).toContain('maximum allowed token count')
    })

    it('enforces bounds on consecutive unary chains to prevent call stack overflow', () => {
      const longUnary = '+'.repeat(30) + '5'
      const res = evaluateExpression(longUnary)
      expect(res.errorCode).toBe('EXPRESSION_TOO_COMPLEX')
      expect(res.error).toContain('maximum consecutive unary operators')
    })

    it('enforces bounds on deep expression nesting', () => {
      const deep = '('.repeat(45) + '1' + ')'.repeat(45)
      const res = evaluateExpression(deep)
      expect(res.errorCode).toBe('EXPRESSION_TOO_COMPLEX')
    })

    it('handles negative zero normalization: -0 => "0"', () => {
      expect(formatResult(-0)).toBe('0')
      expect(formatResult(0)).toBe('0')
      const res = evaluateExpression('0 * -1')
      expect(res.formatted).toBe('0')
    })

    it('handles overflow on extreme powers gracefully', () => {
      const res = evaluateExpression('10^400')
      expect(res.errorCode).toBe('OVERFLOW')
      expect(res.error).toContain('Overflow')
    })

    it('handles factorial boundary: 170! is finite, 171! overflows with OVERFLOW error', () => {
      const res170 = evaluateExpression('170!')
      expect(res170.error).toBeNull()
      expect(Number.isFinite(res170.value)).toBe(true)

      const res171 = evaluateExpression('171!')
      expect(res171.errorCode).toBe('OVERFLOW')
      expect(res171.error).toContain('factorial result exceeds finite limits')
    })
  })

  describe('Adversarial & Fuzz Tests', () => {
    it('handles 50 randomly mutated malformed expressions without crashing or throwing', () => {
      const invalidChars = ['@', '#', '$', '&', '~', '`', ';', ':', '?', '{', '}', '[', ']']
      const templates = [
        '2 + * 3',
        'sin()',
        'root(2)',
        '3..5 + 2',
        '5 ++ - -- + 2',
        '((((3)',
        '3))))',
        'exp(1, 2)',
        'log(-5)',
        'sqrt(-9)',
        'tan(90)',
        '10 / (5 - 5)',
        'pi()',
        'e(1)',
        'unknown_fn(4)',
        '!',
        '%',
        '+',
        '-',
        '*',
        '/',
        '^',
      ]

      for (let i = 0; i < 50; i++) {
        const randTemplate = templates[i % templates.length]
        const randChar = invalidChars[i % invalidChars.length]
        const testCase = randTemplate + randChar

        expect(() => {
          const res = evaluateExpression(testCase)
          // Must return an error or safe result, never throw unhandled
          expect(res).toBeDefined()
        }).not.toThrow()
      }
    })
  })

  describe('Property-Based Mathematical Identities', () => {
    it('addition commutativity: a + b ≈ b + a for diverse numbers', () => {
      const pairs = [
        [3.14159, 2.71828],
        [12345.67, 98765.43],
        [-42.5, 108.25],
        [0.000012, 0.000098],
      ]
      for (const [a, b] of pairs) {
        const r1 = evaluateExpression(`${a} + ${b}`).value
        const r2 = evaluateExpression(`${b} + ${a}`).value
        expect(r1).toBeCloseTo(r2, 10)
      }
    })

    it('sqrt(x)^2 ≈ x for valid non-negative numbers', () => {
      const values = [2, 3, 5, 9, 16, 25, 100, 2500, 0.25, 0.04]
      for (const v of values) {
        const res = evaluateExpression(`sqrt(${v})^2`)
        expect(res.error).toBeNull()
        expect(res.value).toBeCloseTo(v, 9)
      }
    })
  })
})
