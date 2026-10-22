/**
 * Numerical formatting policy for Arc Calculator
 * - Supports Auto mode (up to 12 significant digits with floating-point cleanup)
 * - Supports fixed decimal places (0 to 12 decimals)
 * - Normalizes negative zero (-0) to 0
 * - Automatically selects scientific notation for numbers with absolute value >= 1e14 or (0 < abs < 1e-7)
 */

export interface FormatterOptions {
  decimals?: number // -1 for Auto, 0..12 for fixed decimal places
  showUnrounded?: boolean
}

export function formatResult(value: number, options: FormatterOptions = {}): string {
  const { decimals = -1, showUnrounded = false } = options

  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'Error: Not a number'
    return value > 0 ? 'Infinity' : '-Infinity'
  }

  // Normalize negative zero
  if (Object.is(value, -0) || Math.abs(value) < 1e-15) {
    return '0'
  }

  // If unrounded requested, return full precision string
  if (showUnrounded) {
    return value.toString()
  }

  const abs = Math.abs(value)

  // Use scientific notation for very large or very small values
  if (abs >= 1e14 || (abs > 0 && abs < 1e-7)) {
    const expStr = value.toExponential(8)
    return expStr.replace(/(\.[0-9]*[1-9])0+e/, '$1e').replace(/\.0+e/, 'e')
  }

  // If specific decimal places requested (0..12)
  if (decimals >= 0 && decimals <= 12) {
    return value.toFixed(decimals)
  }

  // Default: Auto rounding (cleans 0.1 + 0.2 => 0.3 without trailing artifacts)
  const precisionCleaned = parseFloat(value.toPrecision(12))

  if (Number.isInteger(precisionCleaned)) {
    return precisionCleaned.toString()
  }

  return precisionCleaned.toString()
}

/**
 * Formats an expression for display by replacing internal operators with elegant symbols:
 * '*' -> '×'
 * '/' -> '÷'
 * '-' -> '−'
 * 'pi' -> 'π'
 */
export function formatExpressionForDisplay(expression: string): string {
  return expression
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/(?<=[0-9a-zA-Z)])-(?=[0-9a-zA-Z(])/g, ' − ')
    .replace(/\bpi\b/g, 'π')
    .replace(/\s+/g, ' ')
    .trim()
}
