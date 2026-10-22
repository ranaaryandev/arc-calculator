/**
 * Numerical formatting policy for Arc Calculator
 * - Prevents standard IEEE-754 precision artifacts (e.g. 0.1 + 0.2 => 0.30000000000000004 formatted cleanly as 0.3)
 * - Normalizes negative zero (-0) to 0
 * - Automatically selects scientific notation for numbers with absolute value >= 1e15 or (0 < abs < 1e-9)
 * - Retains maximum relevant precision (up to 12 significant digits) without trailing zeros
 */

export function formatResult(value: number, maxSignificantDigits = 12): string {
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'Error: Not a number'
    return value > 0 ? 'Infinity' : '-Infinity'
  }

  // Normalize negative zero
  if (Object.is(value, -0) || Math.abs(value) < 1e-15) {
    return '0'
  }

  const abs = Math.abs(value)

  // Use scientific notation for very large or very small values
  if (abs >= 1e14 || (abs > 0 && abs < 1e-7)) {
    const expStr = value.toExponential(8)
    // Clean up trailing zeros in scientific notation e.g. 1.50000000e+20 -> 1.5e+20
    return expStr.replace(/(\.[0-9]*[1-9])0+e/, '$1e').replace(/\.0+e/, 'e')
  }

  // Round to significant digits to clean up floating point inaccuracies (e.g., 0.1 + 0.2)
  const precisionCleaned = parseFloat(value.toPrecision(maxSignificantDigits))

  // If integer
  if (Number.isInteger(precisionCleaned)) {
    return precisionCleaned.toString()
  }

  // Format decimal representation
  // Avoid scientific notation for standard numbers
  const str = precisionCleaned.toString()
  return str
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
