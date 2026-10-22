import type { Token, ASTNode } from './types'
import { tokenize } from './tokenizer'
import { SUPPORTED_CONSTANTS, SUPPORTED_FUNCTIONS } from './constants'

export class Parser {
  private tokens: Token[]
  private current = 0
  private depth = 0
  private maxDepth = 30

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  public parse(): ASTNode {
    if (this.isAtEnd() || this.peek().type === 'EOF') {
      throw new Error('Empty expression')
    }
    const node = this.parseExpression()
    if (!this.isAtEnd() && this.peek().type !== 'EOF') {
      const unexpected = this.peek()
      throw new Error(`Unexpected token "${unexpected.value}" at character ${unexpected.position + 1}`)
    }
    return node
  }

  /**
   * Expression: Binary operations with precedence climbing
   */
  private parseExpression(minPrecedence = 0): ASTNode {
    let left = this.parseUnary()

    while (!this.isAtEnd()) {
      const token = this.peek()
      if (token.type !== 'OPERATOR') break

      const op = token.value
      const prec = this.getPrecedence(op)
      if (prec < minPrecedence) break

      this.advance() // consume operator

      // Power is right-associative: 2^3^2 = 2^(3^2)
      const nextMinPrec = op === '^' ? prec : prec + 1
      const right = this.parseExpression(nextMinPrec)

      left = {
        type: 'BinaryOp',
        operator: op as '+' | '-' | '*' | '/' | '^' | '%',
        left,
        right,
      }
    }

    return left
  }

  /**
   * Unary operations: +x, -x
   */
  private parseUnary(): ASTNode {
    if (this.matchOperator('+') || this.matchOperator('-')) {
      const op = this.previous().value as '+' | '-'
      const argument = this.parseUnary()
      return {
        type: 'UnaryOp',
        operator: op,
        argument,
      }
    }

    return this.parsePostfix()
  }

  /**
   * Postfix operations: x!, x%
   */
  private parsePostfix(): ASTNode {
    let expr = this.parsePrimary()

    while (this.matchPostfix('!') || this.matchPostfix('%')) {
      const op = this.previous().value as '!' | '%'
      expr = {
        type: 'PostfixOp',
        operator: op,
        argument: expr,
      }
    }

    return expr
  }

  /**
   * Primary nodes: Number, Constant, FunctionCall, Parenthesized expression
   */
  private parsePrimary(): ASTNode {
    if (this.isAtEnd()) {
      throw new Error('Incomplete expression: expected a number or expression')
    }

    const token = this.peek()

    // 1. Number
    if (token.type === 'NUMBER') {
      this.advance()
      const val = parseFloat(token.value)
      if (Number.isNaN(val)) {
        throw new Error(`Invalid number format: "${token.value}" at character ${token.position + 1}`)
      }
      return {
        type: 'Number',
        value: val,
        raw: token.value,
      }
    }

    // 2. Constants or Functions
    if (token.type === 'IDENTIFIER') {
      const name = token.value.toLowerCase()
      this.advance()

      if (SUPPORTED_CONSTANTS.has(name)) {
        return {
          type: 'Constant',
          name: name as 'pi' | 'e',
        }
      }

      if (SUPPORTED_FUNCTIONS.has(name)) {
        if (!this.match('LPAREN')) {
          throw new Error(`Expected "(" after function "${name}" at character ${token.position + name.length + 1}`)
        }

        const args: ASTNode[] = []
        if (!this.check('RPAREN')) {
          do {
            args.push(this.parseExpression())
          } while (this.match('COMMA'))
        }

        this.consume('RPAREN', `Expected ")" after arguments for function "${name}"`)
        return {
          type: 'FunctionCall',
          name,
          args,
        }
      }

      throw new Error(`Unknown identifier "${name}" at character ${token.position + 1}`)
    }

    // 3. Parentheses
    if (this.match('LPAREN')) {
      this.depth++
      if (this.depth > this.maxDepth) {
        throw new Error(`Expression exceeds maximum nested parenthesis depth of ${this.maxDepth}`)
      }

      if (this.check('RPAREN')) {
        throw new Error(`Empty parentheses at character ${token.position + 1}`)
      }

      const expr = this.parseExpression()
      this.consume('RPAREN', 'Unmatched opening parenthesis "("')
      this.depth--
      return expr
    }

    throw new Error(`Unexpected token "${token.value}" at character ${token.position + 1}`)
  }

  private getPrecedence(op: string): number {
    switch (op) {
      case '+':
      case '-':
        return 1
      case '*':
      case '/':
      case '%':
        return 2
      case '^':
        return 3
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
    const pos = this.isAtEnd() ? 'end of expression' : `character ${this.peek().position + 1}`
    throw new Error(`${message} near ${pos}`)
  }
}

export function parse(rawInput: string): ASTNode {
  const tokens = tokenize(rawInput)
  const parser = new Parser(tokens)
  return parser.parse()
}
