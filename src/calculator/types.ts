export type AngleMode = 'DEG' | 'RAD'

export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'OPERATOR'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'POSTFIX' // e.g. ! or % (percentage)
  | 'EOF'

export interface Token {
  type: TokenType
  value: string
  position: number
}

export type CalculatorErrorCode =
  | 'SYNTAX_ERROR'
  | 'DOMAIN_ERROR'
  | 'DIVISION_BY_ZERO'
  | 'INPUT_TOO_LONG'
  | 'EXPRESSION_TOO_COMPLEX'
  | 'OVERFLOW'
  | 'UNKNOWN_IDENTIFIER'
  | 'EMPTY_EXPRESSION'

export class CalculatorException extends Error {
  public readonly code: CalculatorErrorCode
  public readonly position?: number

  constructor(code: CalculatorErrorCode, message: string, position?: number) {
    super(message)
    this.name = 'CalculatorException'
    this.code = code
    this.position = position
  }
}

export type ASTNode =
  | NumberNode
  | ConstantNode
  | VariableNode
  | UnaryOpNode
  | BinaryOpNode
  | FunctionCallNode
  | PostfixOpNode

export interface NumberNode {
  type: 'Number'
  value: number
  raw: string
  position?: number
}

export interface ConstantNode {
  type: 'Constant'
  name: 'pi' | 'e'
  position?: number
}

export interface VariableNode {
  type: 'Variable'
  name: string
  position?: number
}

export interface UnaryOpNode {
  type: 'UnaryOp'
  operator: '+' | '-'
  argument: ASTNode
  position?: number
}

export interface BinaryOpNode {
  type: 'BinaryOp'
  operator: '+' | '-' | '*' | '/' | '^' | '%'
  left: ASTNode
  right: ASTNode
  position?: number
}

export interface PostfixOpNode {
  type: 'PostfixOp'
  operator: '!' | '%'
  argument: ASTNode
  position?: number
}

export interface FunctionCallNode {
  type: 'FunctionCall'
  name: string
  args: ASTNode[]
  position?: number
}

export interface EvaluationOptions {
  angleMode?: AngleMode
  decimals?: number // -1 for Auto, 0..12 for fixed decimals
  showUnrounded?: boolean
  variables?: Record<string, number>
}

export interface EvaluationResult {
  value: number
  formatted: string
  error: string | null
  errorCode?: CalculatorErrorCode | null
  errorPosition?: number | null
  isPartial: boolean
}

export interface HistoryItem {
  id: string
  expression: string
  result: number
  formattedResult: string
  angleMode: AngleMode
  timestamp: number
}
