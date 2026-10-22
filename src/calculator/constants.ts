export const SUPPORTED_FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'sqrt',
  'cbrt',
  'root',
  'abs',
  'exp',
  'ln',
  'log',
  'log10',
  'log2',
  'fact',
  'mod',
])

export const SUPPORTED_CONSTANTS = new Set(['pi', 'e'])

/**
 * Architectural Resource & Safety Limits
 */
export const LIMITS = {
  MAX_INPUT_LENGTH: 1000,
  MAX_TOKEN_COUNT: 500,
  MAX_PARSE_DEPTH: 40,
  MAX_UNARY_CHAIN: 20,
  MAX_FACTORIAL_INPUT: 170,
} as const

/**
 * Operator Precedence Hierarchy:
 * - Postfix (!, %) has highest precedence (50)
 * - Exponentiation (^) is right-associative (40)
 * - Unary (+, -) binds tighter than multiplication but looser than power (30)
 *   so: -2^2 = -(2^2) = -4, (-2)^2 = 4, 2^-3 = 0.125
 * - Multiplication, Division, Modulo (*, /, %) (20)
 * - Addition, Subtraction (+, -) (10)
 */
export const PRECEDENCE = {
  ADD_SUB: 10,
  MUL_DIV_MOD: 20,
  UNARY: 30,
  POWER: 40,
  POSTFIX: 50,
} as const
