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
])

export const SUPPORTED_CONSTANTS = new Set(['pi', 'e'])

export const OPERATOR_PRECEDENCE: Record<string, { precedence: number; rightAssociative?: boolean }> = {
  '+': { precedence: 1 },
  '-': { precedence: 1 },
  '*': { precedence: 2 },
  '/': { precedence: 2 },
  '%': { precedence: 2 },
  '^': { precedence: 3, rightAssociative: true },
}
