import type { Token } from './types'
import { CalculatorException } from './types'
import { SUPPORTED_CONSTANTS, SUPPORTED_FUNCTIONS, LIMITS } from './constants'

export function normalizeInput(input: string): string {
  return input
    .replace(/\u00D7/g, '*') // multiplication sign ×
    .replace(/\u00F7/g, '/') // division sign ÷
    .replace(/\u2212/g, '-') // minus sign −
    .replace(/\u03C0/g, 'pi') // greek pi π
}

export function tokenize(rawInput: string): Token[] {
  if (rawInput.length > LIMITS.MAX_INPUT_LENGTH) {
    throw new CalculatorException(
      'INPUT_TOO_LONG',
      `Expression exceeds maximum allowed length of ${LIMITS.MAX_INPUT_LENGTH} characters`,
      LIMITS.MAX_INPUT_LENGTH
    )
  }

  const input = normalizeInput(rawInput).trim()
  const tokens: Token[] = []
  let i = 0

  while (i < input.length) {
    if (tokens.length >= LIMITS.MAX_TOKEN_COUNT) {
      throw new CalculatorException(
        'EXPRESSION_TOO_COMPLEX',
        `Expression exceeds maximum allowed token count of ${LIMITS.MAX_TOKEN_COUNT}`,
        i
      )
    }

    const char = input[i]

    // Skip whitespace
    if (/\s/.test(char)) {
      i++
      continue
    }

    // Number matching (including floating point and scientific notation like 1.5e-3 or 2e10)
    if (/[0-9]/.test(char) || (char === '.' && i + 1 < input.length && /[0-9]/.test(input[i + 1]))) {
      const start = i
      let hasDecimal = char === '.'
      i++

      while (i < input.length) {
        const c = input[i]
        if (/[0-9]/.test(c)) {
          i++
        } else if (c === '.' && !hasDecimal) {
          hasDecimal = true
          i++
        } else if ((c === 'e' || c === 'E') && i + 1 < input.length) {
          const next = input[i + 1]
          if (/[0-9]/.test(next)) {
            i += 2
            while (i < input.length && /[0-9]/.test(input[i])) i++
            break
          } else if ((next === '+' || next === '-') && i + 2 < input.length && /[0-9]/.test(input[i + 2])) {
            i += 3
            while (i < input.length && /[0-9]/.test(input[i])) i++
            break
          } else {
            break // Standalone 'e' or not scientific notation
          }
        } else {
          break
        }
      }

      tokens.push({
        type: 'NUMBER',
        value: input.slice(start, i),
        position: start,
      })
      continue
    }

    // Identifiers (function names, constants)
    if (/[a-zA-Z]/.test(char)) {
      const start = i
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        i++
      }
      const rawIdent = input.slice(start, i).toLowerCase()

      if (rawIdent === 'pi' || rawIdent === 'e' || rawIdent === 'x') {
        tokens.push({
          type: 'IDENTIFIER',
          value: rawIdent,
          position: start,
        })
      } else if (SUPPORTED_FUNCTIONS.has(rawIdent)) {
        tokens.push({
          type: 'IDENTIFIER',
          value: rawIdent,
          position: start,
        })
      } else {
        throw new CalculatorException(
          'UNKNOWN_IDENTIFIER',
          `Unknown function or constant "${rawIdent}" at character ${start + 1}`,
          start
        )
      }
      continue
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(', position: i })
      i++
      continue
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')', position: i })
      i++
      continue
    }

    // Comma (for multi-argument functions e.g. root(3, 27) or mod(10, 3))
    if (char === ',') {
      tokens.push({ type: 'COMMA', value: ',', position: i })
      i++
      continue
    }

    // Postfix factorial
    if (char === '!') {
      tokens.push({ type: 'POSTFIX', value: '!', position: i })
      i++
      continue
    }

    // Percentage sign vs Binary Modulo:
    // If % is followed by an operand start (digit, letter, '('), it functions as binary modulo (e.g. 10 % 3 = 1).
    // Otherwise, it functions as postfix percentage (e.g. 50%, 100 + 10%, (50%)).
    if (char === '%') {
      let nextIdx = i + 1
      while (nextIdx < input.length && /\s/.test(input[nextIdx])) nextIdx++
      const nextChar = nextIdx < input.length ? input[nextIdx] : ''
      const isBinaryModulo =
        /[0-9]/.test(nextChar) ||
        /[a-zA-Z]/.test(nextChar) ||
        nextChar === '(' ||
        ((nextChar === '+' || nextChar === '-') &&
          nextIdx + 1 < input.length &&
          /[0-9a-zA-Z(]/.test(input[nextIdx + 1]))

      if (isBinaryModulo) {
        tokens.push({ type: 'OPERATOR', value: '%', position: i })
      } else {
        tokens.push({ type: 'POSTFIX', value: '%', position: i })
      }
      i++
      continue
    }

    // Standard binary / unary operators: +, -, *, /, ^
    if (['+', '-', '*', '/', '^'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char, position: i })
      i++
      continue
    }

    throw new CalculatorException(
      'SYNTAX_ERROR',
      `Unexpected character "${char}" at character ${i + 1}`,
      i
    )
  }

  // Insert implicit multiplication tokens
  const processedTokens = insertImplicitMultiplication(tokens)
  processedTokens.push({ type: 'EOF', value: '', position: input.length })
  return processedTokens
}

/**
 * Inserts implicit '*' tokens where appropriate:
 * - NUMBER followed by LPAREN (e.g. 2(3) -> 2 * (3))
 * - NUMBER followed by IDENTIFIER (e.g. 2pi -> 2 * pi, 2sqrt(4) -> 2 * sqrt(4))
 * - RPAREN followed by LPAREN (e.g. (2)(3) -> (2) * (3))
 * - RPAREN followed by NUMBER (e.g. (2)3 -> (2) * 3)
 * - RPAREN followed by IDENTIFIER (e.g. (2)pi -> (2) * pi)
 * - CONSTANT followed by LPAREN, NUMBER, or IDENTIFIER (e.g. pi(2) -> pi * (2))
 * - POSTFIX (!) followed by NUMBER, LPAREN, or IDENTIFIER (e.g. 5!(2) -> 5! * (2))
 */
function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const result: Token[] = []

  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i]
    result.push(curr)

    if (i === tokens.length - 1) break
    const next = tokens[i + 1]

    const currIsConstant =
      curr.type === 'IDENTIFIER' && (SUPPORTED_CONSTANTS.has(curr.value) || curr.value === 'x')
    const nextIsFunctionOrConstant = next.type === 'IDENTIFIER'

    const shouldInsertMultiply =
      (curr.type === 'NUMBER' && (next.type === 'LPAREN' || nextIsFunctionOrConstant)) ||
      (curr.type === 'RPAREN' && (next.type === 'LPAREN' || next.type === 'NUMBER' || nextIsFunctionOrConstant)) ||
      (currIsConstant && (next.type === 'LPAREN' || next.type === 'NUMBER' || nextIsFunctionOrConstant)) ||
      (curr.type === 'POSTFIX' && (next.type === 'NUMBER' || next.type === 'LPAREN' || nextIsFunctionOrConstant))

    if (shouldInsertMultiply) {
      result.push({
        type: 'OPERATOR',
        value: '*',
        position: curr.position + curr.value.length,
      })
    }
  }

  return result
}
