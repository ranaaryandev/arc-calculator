import type { ASTNode, EvaluationOptions } from './types'

export class EvaluationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EvaluationError'
  }
}

const EPSILON = 1e-12

export function evaluateAST(node: ASTNode, options: EvaluationOptions = {}): number {
  switch (node.type) {
    case 'Number':
      return node.value

    case 'Constant':
      if (node.name === 'pi') return Math.PI
      if (node.name === 'e') return Math.E
      throw new EvaluationError(`Unknown constant: ${node.name}`)

    case 'UnaryOp': {
      const argVal = evaluateAST(node.argument, options)
      if (node.operator === '+') return argVal
      if (node.operator === '-') return -argVal
      throw new EvaluationError(`Unknown unary operator: ${node.operator}`)
    }

    case 'PostfixOp': {
      const argVal = evaluateAST(node.argument, options)
      if (node.operator === '!') {
        return calculateFactorial(argVal)
      }
      if (node.operator === '%') {
        return argVal / 100
      }
      throw new EvaluationError(`Unknown postfix operator: ${node.operator}`)
    }

    case 'BinaryOp': {
      // Check for contextual percentage: A + B% => A + A*(B/100), A - B% => A - A*(B/100)
      if (node.right.type === 'PostfixOp' && node.right.operator === '%') {
        const leftVal = evaluateAST(node.left, options)
        const percentVal = evaluateAST(node.right.argument, options) / 100
        if (node.operator === '+') {
          return leftVal + leftVal * percentVal
        }
        if (node.operator === '-') {
          return leftVal - leftVal * percentVal
        }
        if (node.operator === '*') {
          return leftVal * percentVal
        }
        if (node.operator === '/') {
          if (percentVal === 0) throw new EvaluationError('Cannot divide by zero')
          return leftVal / percentVal
        }
      }

      const left = evaluateAST(node.left, options)
      const right = evaluateAST(node.right, options)

      switch (node.operator) {
        case '+':
          return left + right
        case '-':
          return left - right
        case '*':
          return left * right
        case '/':
          if (Math.abs(right) === 0) {
            throw new EvaluationError('Cannot divide by zero')
          }
          return left / right
        case '%': // Standard modulo
          if (Math.abs(right) === 0) {
            throw new EvaluationError('Cannot divide by zero')
          }
          return left % right
        case '^': {
          if (left === 0 && right < 0) {
            throw new EvaluationError('Cannot divide by zero (0 raised to negative power)')
          }
          // Real-number power check for fractional powers of negative numbers
          if (left < 0 && !Number.isInteger(right)) {
            throw new EvaluationError('Domain error: negative base with fractional exponent produces complex result')
          }
          const val = Math.pow(left, right)
          if (!Number.isFinite(val)) {
            throw new EvaluationError('Overflow: calculation result exceeds finite limits')
          }
          return val
        }
        default:
          throw new EvaluationError('Unknown operator')
      }
    }

    case 'FunctionCall':
      return evaluateFunction(node.name, node.args, options)

    default:
      throw new EvaluationError('Unknown AST node')
  }
}

function calculateFactorial(n: number): number {
  if (!Number.isFinite(n)) {
    throw new EvaluationError('Factorial requires a finite number')
  }
  if (!Number.isInteger(n)) {
    throw new EvaluationError('Factorial requires an integer')
  }
  if (n < 0) {
    throw new EvaluationError('Factorial requires a non-negative integer')
  }
  if (n > 170) {
    throw new EvaluationError('Overflow: factorial result exceeds finite limits (n > 170)')
  }
  if (n === 0 || n === 1) return 1

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

function evaluateFunction(name: string, args: ASTNode[], options: EvaluationOptions): number {
  const angleMode = options.angleMode || 'DEG'
  const evaluatedArgs = args.map((arg) => evaluateAST(arg, options))

  switch (name) {
    case 'sin': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (angleMode === 'DEG') {
        const norm = ((x % 360) + 360) % 360
        if (norm === 0 || norm === 180) return 0
        if (norm === 90) return 1
        if (norm === 270) return -1
        if (norm === 30 || norm === 150) return 0.5
        if (norm === 210 || norm === 330) return -0.5
        return Math.sin((x * Math.PI) / 180)
      } else {
        return Math.sin(x)
      }
    }

    case 'cos': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (angleMode === 'DEG') {
        const norm = ((x % 360) + 360) % 360
        if (norm === 90 || norm === 270) return 0
        if (norm === 0) return 1
        if (norm === 180) return -1
        if (norm === 60 || norm === 300) return 0.5
        if (norm === 120 || norm === 240) return -0.5
        return Math.cos((x * Math.PI) / 180)
      } else {
        return Math.cos(x)
      }
    }

    case 'tan': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (angleMode === 'DEG') {
        const norm = ((x % 180) + 180) % 180
        if (norm === 90) {
          throw new EvaluationError('Undefined (tangent singularity at 90°)')
        }
        if (norm === 0) return 0
        if (norm === 45) return 1
        if (norm === 135) return -1
        return Math.tan((x * Math.PI) / 180)
      } else {
        const cosVal = Math.cos(x)
        if (Math.abs(cosVal) < 1e-15) {
          throw new EvaluationError('Undefined (tangent singularity in radians)')
        }
        return Math.tan(x)
      }
    }

    case 'asin': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (x < -1 || x > 1) {
        throw new EvaluationError('Domain error: asin(x) requires -1 <= x <= 1')
      }
      const rad = Math.asin(x)
      return angleMode === 'DEG' ? (rad * 180) / Math.PI : rad
    }

    case 'acos': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (x < -1 || x > 1) {
        throw new EvaluationError('Domain error: acos(x) requires -1 <= x <= 1')
      }
      const rad = Math.acos(x)
      return angleMode === 'DEG' ? (rad * 180) / Math.PI : rad
    }

    case 'atan': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      const rad = Math.atan(x)
      return angleMode === 'DEG' ? (rad * 180) / Math.PI : rad
    }

    case 'sinh':
      assertArgCount(name, evaluatedArgs, 1)
      return Math.sinh(evaluatedArgs[0])

    case 'cosh':
      assertArgCount(name, evaluatedArgs, 1)
      return Math.cosh(evaluatedArgs[0])

    case 'tanh':
      assertArgCount(name, evaluatedArgs, 1)
      return Math.tanh(evaluatedArgs[0])

    case 'sqrt': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (x < 0) {
        throw new EvaluationError('Domain error: square root of negative number')
      }
      return Math.sqrt(x)
    }

    case 'cbrt':
      assertArgCount(name, evaluatedArgs, 1)
      return Math.cbrt(evaluatedArgs[0])

    case 'root': {
      // root(n, x): nth root of x
      assertArgCount(name, evaluatedArgs, 2)
      const n = evaluatedArgs[0]
      const x = evaluatedArgs[1]
      if (n === 0) {
        throw new EvaluationError('Domain error: root index cannot be zero')
      }
      if (x < 0 && Math.abs(n % 2) < EPSILON) {
        throw new EvaluationError('Domain error: even root of negative number')
      }
      if (x < 0) {
        return -Math.pow(-x, 1 / n)
      }
      return Math.pow(x, 1 / n)
    }

    case 'abs':
      assertArgCount(name, evaluatedArgs, 1)
      return Math.abs(evaluatedArgs[0])

    case 'exp':
      assertArgCount(name, evaluatedArgs, 1)
      return Math.exp(evaluatedArgs[0])

    case 'ln': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (x <= 0) {
        throw new EvaluationError('Domain error: ln(x) requires x > 0')
      }
      return Math.log(x)
    }

    case 'log':
    case 'log10': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (x <= 0) {
        throw new EvaluationError('Domain error: log10(x) requires x > 0')
      }
      return Math.log10(x)
    }

    case 'log2': {
      assertArgCount(name, evaluatedArgs, 1)
      const x = evaluatedArgs[0]
      if (x <= 0) {
        throw new EvaluationError('Domain error: log2(x) requires x > 0')
      }
      return Math.log2(x)
    }

    case 'fact':
      assertArgCount(name, evaluatedArgs, 1)
      return calculateFactorial(evaluatedArgs[0])

    default:
      throw new EvaluationError(`Unsupported function: "${name}"`)
  }
}

function assertArgCount(name: string, args: number[], expected: number) {
  if (args.length !== expected) {
    throw new EvaluationError(`Function "${name}" expects ${expected} argument(s), got ${args.length}`)
  }
}
