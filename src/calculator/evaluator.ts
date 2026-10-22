import type { ASTNode, EvaluationOptions } from './types'
import { CalculatorException } from './types'
import { LIMITS } from './constants'

export function evaluateAST(
  node: ASTNode,
  options: EvaluationOptions = {},
  evalDepth = 0
): number {
  if (evalDepth > LIMITS.MAX_PARSE_DEPTH) {
    throw new CalculatorException(
      'EXPRESSION_TOO_COMPLEX',
      `Evaluation recursion depth exceeded limit of ${LIMITS.MAX_PARSE_DEPTH}`,
      node.position
    )
  }

  const nextDepth = evalDepth + 1

  switch (node.type) {
    case 'Number': {
      if (!Number.isFinite(node.value)) {
        throw new CalculatorException('OVERFLOW', 'Number is not finite', node.position)
      }
      return node.value
    }

    case 'Constant': {
      if (node.name === 'pi') return Math.PI
      if (node.name === 'e') return Math.E
      throw new CalculatorException('UNKNOWN_IDENTIFIER', `Unknown constant: ${node.name}`, node.position)
    }

    case 'Variable': {
      if (options.variables && node.name in options.variables) {
        return options.variables[node.name]
      }
      throw new CalculatorException('UNKNOWN_IDENTIFIER', `Variable "${node.name}" is not defined`, node.position)
    }

    case 'UnaryOp': {
      const argVal = evaluateAST(node.argument, options, nextDepth)
      if (node.operator === '+') return argVal
      if (node.operator === '-') return -argVal
      throw new CalculatorException('SYNTAX_ERROR', `Unknown unary operator: ${node.operator}`, node.position)
    }

    case 'PostfixOp': {
      const argVal = evaluateAST(node.argument, options, nextDepth)
      if (node.operator === '!') {
        return calculateFactorial(argVal, node.position)
      }
      if (node.operator === '%') {
        return argVal / 100
      }
      throw new CalculatorException('SYNTAX_ERROR', `Unknown postfix operator: ${node.operator}`, node.position)
    }

    case 'BinaryOp': {
      // Check for contextual percentage: A + B% => A + A*(B/100), A - B% => A - A*(B/100)
      if (node.right.type === 'PostfixOp' && node.right.operator === '%') {
        const leftVal = evaluateAST(node.left, options, nextDepth)
        const percentVal = evaluateAST(node.right.argument, options, nextDepth) / 100
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
          if (percentVal === 0) {
            throw new CalculatorException('DIVISION_BY_ZERO', 'Cannot divide by zero', node.position)
          }
          return leftVal / percentVal
        }
      }

      const left = evaluateAST(node.left, options, nextDepth)
      const right = evaluateAST(node.right, options, nextDepth)

      switch (node.operator) {
        case '+': {
          const res = left + right
          assertFinite(res, node.position)
          return res
        }
        case '-': {
          const res = left - right
          assertFinite(res, node.position)
          return res
        }
        case '*': {
          const res = left * right
          assertFinite(res, node.position)
          return res
        }
        case '/': {
          if (Math.abs(right) === 0) {
            throw new CalculatorException('DIVISION_BY_ZERO', 'Cannot divide by zero', node.position)
          }
          const res = left / right
          assertFinite(res, node.position)
          return res
        }
        case '%': {
          // Standard modulo operation
          if (Math.abs(right) === 0) {
            throw new CalculatorException('DIVISION_BY_ZERO', 'Cannot divide by zero', node.position)
          }
          const res = left % right
          assertFinite(res, node.position)
          return res
        }
        case '^': {
          if (left === 0 && right < 0) {
            throw new CalculatorException(
              'DIVISION_BY_ZERO',
              'Cannot divide by zero (0 raised to negative power)',
              node.position
            )
          }
          // Real-number domain check for fractional powers of negative numbers
          if (left < 0 && !Number.isInteger(right)) {
            throw new CalculatorException(
              'DOMAIN_ERROR',
              'Domain error: negative base with fractional exponent produces complex result',
              node.position
            )
          }
          const val = Math.pow(left, right)
          assertFinite(val, node.position)
          return val
        }
        default: {
          const unhandled = node as { position?: number }
          throw new CalculatorException('SYNTAX_ERROR', 'Unknown operator', unhandled.position)
        }
      }
    }

    case 'FunctionCall':
      return evaluateFunction(node.name, node.args, options, nextDepth, node.position)

    default:
      throw new CalculatorException('SYNTAX_ERROR', 'Unknown AST node')
  }
}

function assertFinite(val: number, pos?: number) {
  if (!Number.isFinite(val)) {
    throw new CalculatorException('OVERFLOW', 'Overflow: calculation result exceeds finite limits', pos)
  }
}

function calculateFactorial(n: number, pos?: number): number {
  if (!Number.isFinite(n)) {
    throw new CalculatorException('DOMAIN_ERROR', 'Factorial requires a finite number', pos)
  }
  if (!Number.isInteger(n)) {
    throw new CalculatorException('DOMAIN_ERROR', 'Factorial requires an integer', pos)
  }
  if (n < 0) {
    throw new CalculatorException('DOMAIN_ERROR', 'Factorial requires a non-negative integer', pos)
  }
  if (n > LIMITS.MAX_FACTORIAL_INPUT) {
    throw new CalculatorException(
      'OVERFLOW',
      `Overflow: factorial result exceeds finite limits (n > ${LIMITS.MAX_FACTORIAL_INPUT})`,
      pos
    )
  }
  if (n === 0 || n === 1) return 1

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

function evaluateFunction(
  name: string,
  args: ASTNode[],
  options: EvaluationOptions,
  depth: number,
  pos?: number
): number {
  const angleMode = options.angleMode || 'DEG'
  const evaluatedArgs = args.map((arg) => evaluateAST(arg, options, depth))

  switch (name) {
    case 'sin': {
      assertArgCount(name, evaluatedArgs, 1, pos)
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
      assertArgCount(name, evaluatedArgs, 1, pos)
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
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      if (angleMode === 'DEG') {
        const norm = ((x % 180) + 180) % 180
        if (Math.abs(norm - 90) < 1e-10) {
          throw new CalculatorException('DOMAIN_ERROR', 'Undefined (tangent singularity at 90°)', pos)
        }
        if (norm === 0) return 0
        if (norm === 45) return 1
        if (norm === 135) return -1
        return Math.tan((x * Math.PI) / 180)
      } else {
        const cosVal = Math.cos(x)
        if (Math.abs(cosVal) < 1e-15) {
          throw new CalculatorException('DOMAIN_ERROR', 'Undefined (tangent singularity in radians)', pos)
        }
        return Math.tan(x)
      }
    }

    case 'asin': {
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      if (x < -1 || x > 1) {
        throw new CalculatorException('DOMAIN_ERROR', 'Domain error: asin(x) requires -1 <= x <= 1', pos)
      }
      const rad = Math.asin(x)
      return angleMode === 'DEG' ? (rad * 180) / Math.PI : rad
    }

    case 'acos': {
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      if (x < -1 || x > 1) {
        throw new CalculatorException('DOMAIN_ERROR', 'Domain error: acos(x) requires -1 <= x <= 1', pos)
      }
      const rad = Math.acos(x)
      return angleMode === 'DEG' ? (rad * 180) / Math.PI : rad
    }

    case 'atan': {
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      const rad = Math.atan(x)
      return angleMode === 'DEG' ? (rad * 180) / Math.PI : rad
    }

    case 'sinh':
      assertArgCount(name, evaluatedArgs, 1, pos)
      return Math.sinh(evaluatedArgs[0])

    case 'cosh':
      assertArgCount(name, evaluatedArgs, 1, pos)
      return Math.cosh(evaluatedArgs[0])

    case 'tanh':
      assertArgCount(name, evaluatedArgs, 1, pos)
      return Math.tanh(evaluatedArgs[0])

    case 'sqrt': {
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      if (x < 0) {
        throw new CalculatorException('DOMAIN_ERROR', 'Domain error: square root of negative number', pos)
      }
      return Math.sqrt(x)
    }

    case 'cbrt':
      assertArgCount(name, evaluatedArgs, 1, pos)
      return Math.cbrt(evaluatedArgs[0])

    case 'root': {
      // root(n, x): nth root of x
      assertArgCount(name, evaluatedArgs, 2, pos)
      const n = evaluatedArgs[0]
      const x = evaluatedArgs[1]
      if (n === 0) {
        throw new CalculatorException('DOMAIN_ERROR', 'Domain error: root index cannot be zero', pos)
      }
      if (x === 0 && n < 0) {
        throw new CalculatorException(
          'DIVISION_BY_ZERO',
          'Cannot divide by zero (0 raised to negative power)',
          pos
        )
      }
      if (x < 0) {
        // In real arithmetic, nth root of negative number is only real if n is an odd integer
        const isOddInt = Number.isInteger(n) && Math.abs(n % 2) === 1
        if (!isOddInt) {
          throw new CalculatorException(
            'DOMAIN_ERROR',
            'Domain error: root index must be an odd integer for negative radicand',
            pos
          )
        }
        return -Math.pow(-x, 1 / n)
      }
      return Math.pow(x, 1 / n)
    }

    case 'abs':
      assertArgCount(name, evaluatedArgs, 1, pos)
      return Math.abs(evaluatedArgs[0])

    case 'exp':
      assertArgCount(name, evaluatedArgs, 1, pos)
      return Math.exp(evaluatedArgs[0])

    case 'ln': {
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      if (x <= 0) {
        throw new CalculatorException('DOMAIN_ERROR', 'Domain error: ln(x) requires x > 0', pos)
      }
      return Math.log(x)
    }

    case 'log':
    case 'log10': {
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      if (x <= 0) {
        throw new CalculatorException('DOMAIN_ERROR', 'Domain error: log10(x) requires x > 0', pos)
      }
      return Math.log10(x)
    }

    case 'log2': {
      assertArgCount(name, evaluatedArgs, 1, pos)
      const x = evaluatedArgs[0]
      if (x <= 0) {
        throw new CalculatorException('DOMAIN_ERROR', 'Domain error: log2(x) requires x > 0', pos)
      }
      return Math.log2(x)
    }

    case 'fact':
      assertArgCount(name, evaluatedArgs, 1, pos)
      return calculateFactorial(evaluatedArgs[0], pos)

    case 'mod': {
      assertArgCount(name, evaluatedArgs, 2, pos)
      const a = evaluatedArgs[0]
      const b = evaluatedArgs[1]
      if (Math.abs(b) === 0) {
        throw new CalculatorException('DIVISION_BY_ZERO', 'Cannot divide by zero', pos)
      }
      return a % b
    }

    default:
      throw new CalculatorException('UNKNOWN_IDENTIFIER', `Unsupported function: "${name}"`, pos)
  }
}

function assertArgCount(name: string, args: number[], expected: number, pos?: number) {
  if (args.length !== expected) {
    throw new CalculatorException(
      'SYNTAX_ERROR',
      `Function "${name}" expects ${expected} argument(s), got ${args.length}`,
      pos
    )
  }
}
