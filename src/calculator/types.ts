export type AngleMode = 'DEG' | 'RAD'

export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'OPERATOR'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'POSTFIX' // e.g. ! or %
  | 'EOF'

export interface Token {
  type: TokenType
  value: string
  position: number
}

export type ASTNode =
  | NumberNode
  | ConstantNode
  | UnaryOpNode
  | BinaryOpNode
  | FunctionCallNode
  | PostfixOpNode

export interface NumberNode {
  type: 'Number'
  value: number
  raw: string
}

export interface ConstantNode {
  type: 'Constant'
  name: 'pi' | 'e'
}

export interface UnaryOpNode {
  type: 'UnaryOp'
  operator: '+' | '-'
  argument: ASTNode
}

export interface BinaryOpNode {
  type: 'BinaryOp'
  operator: '+' | '-' | '*' | '/' | '^' | '%'
  left: ASTNode
  right: ASTNode
}

export interface PostfixOpNode {
  type: 'PostfixOp'
  operator: '!' | '%'
  argument: ASTNode
}

export interface FunctionCallNode {
  type: 'FunctionCall'
  name: string
  args: ASTNode[]
}

export interface EvaluationOptions {
  angleMode?: AngleMode
  precision?: number
}

export interface EvaluationResult {
  value: number
  formatted: string
  error: string | null
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
