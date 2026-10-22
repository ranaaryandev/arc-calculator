import type { Token, ASTNode } from './types'
import { CalculatorException } from './types'
import { tokenize } from './tokenizer'
import { SUPPORTED_CONSTANTS, SUPPORTED_FUNCTIONS, LIMITS, PRECEDENCE } from './constants'

export class Parser {
  private tokens: Token[]
  private current = 0
  private depth = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  public parse(): ASTNode {
    if (this.isAtEnd() || this.peek().type === 'EOF') {
      throw new CalculatorException('EMPTY_EXPRESSION', 'Empty expression', 0)
    }
    const node = this.parseExpression(0)
    if (!this.isAtEnd() && this.peek().type !== 'EOF') {
      const unexpected = this.peek()
      throw new CalculatorException(
        'SYNTAX_ERROR',
        `Unexpected token "${unexpected.value}" at character ${unexpected.position + 1}`,
        unexpected.position
      )
    }
    return node
  }

  /**
   * Expression parsing with precedence climbing.
   * Binary precedence:
   *   Level 10: +, - (left-associative)
   *   Level 20: *, /, % (left-associative)
   *   Level 40: ^ (right-associative)
   */
  public parseExpression(minPrecedence = 0): ASTNode {
    this.depth++
    if (this.depth > LIMITS.MAX_PARSE_DEPTH) {
      this.depth--
      const pos = this.isAtEnd() ? 0 : this.peek().position
      throw new CalculatorException(
        'EXPRESSION_TOO_COMPLEX',
        `Expression exceeds maximum nested parenthesis depth of ${LIMITS.MAX_PARSE_DEPTH}`,
        pos
      )
    }

    try {
      let left = this.parseUnary()

      while (!this.isAtEnd()) {
        const token = this.peek()
        if (token.type !== 'OPERATOR') break

        const op = token.value
        const prec = this.getBinaryPrecedence(op)
        if (prec < minPrecedence) break

        this.advance() // consume operator

        // Power (^) is right-associative: 2^3^2 = 2^(3^2)
        const nextMinPrec = op === '^' ? prec : prec + 1
        const right = this.parseExpression(nextMinPrec)

        left = {
          type: 'BinaryOp',
          operator: op as '+' | '-' | '*' | '/' | '^' | '%',
          left,
          right,
          position: token.position,
        }
      }

      return left
    } finally {
      this.depth--
    }
  }

  /**
   * Unary operations (+, -)
   * Unary binds tighter than multiplication (20) but looser than power (40)
   * so that: -2^2 = -(2^2) = -4, (-2)^2 = 4, 2^-3 = 0.125
   */
  private parseUnary(): ASTNode {
    let chainCount = 0
    const ops: Token[] = []

    while (this.matchOperator('+') || this.matchOperator('-')) {
      chainCount++
      const opToken = this.previous()
      if (chainCount > LIMITS.MAX_UNARY_CHAIN) {
        throw new CalculatorException(
          'EXPRESSION_TOO_COMPLEX',
          `Exceeded maximum consecutive unary operators (${LIMITS.MAX_UNARY_CHAIN})`,
          opToken.position
        )
      }
      ops.push(opToken)
    }

    if (ops.length === 0) {
      return this.parsePostfix()
    }

    // Parse operand at UNARY precedence (30) so power (40) binds to operand
    let node = this.parseExpression(PRECEDENCE.UNARY)
    for (let i = ops.length - 1; i >= 0; i--) {
      node = {
        type: 'UnaryOp',
        operator: ops[i].value as '+' | '-',
        argument: node,
        position: ops[i].position,
      }
    }
    return node
  }

  /**
   * Postfix operations: x!, x%
   */
  private parsePostfix(): ASTNode {
    let expr = this.parsePrimary()

    while (this.matchPostfix('!') || this.matchPostfix('%')) {
      const opToken = this.previous()
      const op = opToken.value as '!' | '%'
      expr = {
        type: 'PostfixOp',
        operator: op,
        argument: expr,
        position: opToken.position,
      }
    }

    return expr
  }

  /**
   * Primary nodes: Number, Constant, FunctionCall, Parenthesized expression
   */
  private parsePrimary(): ASTNode {
    if (this.isAtEnd()) {
      throw new CalculatorException(
        'SYNTAX_ERROR',
        'Incomplete expression: expected a number or expression',
        this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].position : 0
      )
    }

    const token = this.peek()

    // 1. Number
    if (token.type === 'NUMBER') {
      this.advance()
      const val = parseFloat(token.value)
      if (Number.isNaN(val)) {
        throw new CalculatorException(
          'SYNTAX_ERROR',
          `Invalid number format "${token.value}" at character ${token.position + 1}`,
          token.position
        )
      }
      return {
        type: 'Number',
        value: val,
        raw: token.value,
        position: token.position,
      }
    }

    // 2. Constants or Functions
    if (token.type === 'IDENTIFIER') {
      const name = token.value.toLowerCase()
      this.advance()

      if (name === 'x') {
        return {
          type: 'Variable',
          name: 'x',
          position: token.position,
        }
      }

      if (SUPPORTED_CONSTANTS.has(name)) {
        return {
          type: 'Constant',
          name: name as 'pi' | 'e',
          position: token.position,
        }
      }

      if (SUPPORTED_FUNCTIONS.has(name)) {
        if (!this.match('LPAREN')) {
          throw new CalculatorException(
            'SYNTAX_ERROR',
            `Expected "(" after function "${name}" at character ${token.position + name.length + 1}`,
            token.position + name.length
          )
        }

        const args: ASTNode[] = []
        if (!this.check('RPAREN')) {
          do {
            args.push(this.parseExpression(0))
          } while (this.match('COMMA'))
        }

        this.consume('RPAREN', `Expected ")" after arguments for function "${name}"`)
        return {
          type: 'FunctionCall',
          name,
          args,
          position: token.position,
        }
      }

      throw new CalculatorException(
        'UNKNOWN_IDENTIFIER',
        `Unknown identifier "${name}" at character ${token.position + 1}`,
        token.position
      )
    }

    // 3. Parentheses
    if (this.match('LPAREN')) {
      const parenPos = token.position
      if (this.check('RPAREN')) {
        throw new CalculatorException(
          'SYNTAX_ERROR',
          `Empty parentheses at character ${parenPos + 1}`,
          parenPos
        )
      }

      const expr = this.parseExpression(0)
      this.consume('RPAREN', 'Unmatched opening parenthesis "("')
      return expr
    }

    throw new CalculatorException(
      'SYNTAX_ERROR',
      `Unexpected token "${token.value}" at character ${token.position + 1}`,
      token.position
    )
  }

  private getBinaryPrecedence(op: string): number {
    switch (op) {
      case '+':
      case '-':
        return PRECEDENCE.ADD_SUB // 10
      case '*':
      case '/':
      case '%':
        return PRECEDENCE.MUL_DIV_MOD // 20
      case '^':
        return PRECEDENCE.POWER // 40
      default:
        return 0
    }
  }

  private match(type: string): boolean {
    if (this.check(type)) {
      this.advance()
      return true
    }
    return false
  }

  private matchOperator(val: string): boolean {
    if (this.check('OPERATOR') && this.peek().value === val) {
      this.advance()
      return true
    }
    return false
  }

  private matchPostfix(val: string): boolean {
    if (this.check('POSTFIX') && this.peek().value === val) {
      this.advance()
      return true
    }
    return false
  }

  private check(type: string): boolean {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length || this.tokens[this.current].type === 'EOF'
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  private consume(type: string, message: string): Token {
    if (this.check(type)) return this.advance()
    const pos = this.isAtEnd()
      ? this.tokens.length > 0
        ? this.tokens[this.tokens.length - 1].position
        : 0
      : this.peek().position
    throw new CalculatorException('SYNTAX_ERROR', `${message} near character ${pos + 1}`, pos)
  }
}

export function parse(rawInput: string): ASTNode {
  const tokens = tokenize(rawInput)
  const parser = new Parser(tokens)
  return parser.parse()
}
