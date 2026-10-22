import type { EvaluationOptions, EvaluationResult } from './types'
import { parse } from './parser'
import { evaluateAST } from './evaluator'
import { formatResult } from './formatter'

export * from './types'
export * from './constants'
export * from './tokenizer'
export * from './parser'
export * from './evaluator'
export * from './formatter'

/**
 * Safely evaluates an expression string using the AST engine.
 * Never uses eval() or new Function().
 */
export function evaluateExpression(
  expression: string,
  options: EvaluationOptions = { angleMode: 'DEG' }
): EvaluationResult {
  const trimmed = expression.trim()
  if (!trimmed) {
    return {
      value: 0,
      formatted: '0',
      error: null,
      isPartial: false,
    }
  }

  try {
    const ast = parse(trimmed)
    const value = evaluateAST(ast, options)
    return {
      value,
      formatted: formatResult(value),
      error: null,
      isPartial: false,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Evaluation error'
    return {
      value: 0,
      formatted: '',
      error: message,
      isPartial: false,
    }
  }
}

/**
 * Attempt to compute a non-intrusive live preview for an in-progress expression.
 * If expression is incomplete (e.g. ends with operator or unclosed parenthesis),
 * it tries to temporarily auto-complete or returns null without showing a scary error.
 */
export function calculateLivePreview(
  expression: string,
  options: EvaluationOptions = { angleMode: 'DEG' }
): { preview: string | null; error: string | null } {
  const trimmed = expression.trim()
  if (!trimmed) {
    return { preview: null, error: null }
  }

  // First try direct evaluation
  try {
    const ast = parse(trimmed)
    const value = evaluateAST(ast, options)
    return { preview: formatResult(value), error: null }
  } catch {
    // If direct parse fails, check if it's just incomplete
  }

  // Attempt auto-closing unclosed parentheses
  const openParens = (trimmed.match(/\(/g) || []).length
  const closeParens = (trimmed.match(/\)/g) || []).length
  if (openParens > closeParens) {
    const autoClosed = trimmed + ')'.repeat(openParens - closeParens)
    try {
      const ast = parse(autoClosed)
      const value = evaluateAST(ast, options)
      return { preview: formatResult(value), error: null }
    } catch {
      // Still invalid
    }
  }

  // If ends with binary operator (+, -, *, /, ^), ignore trailing operator for preview
  const stripped = trimmed.replace(/[+\-*/^]\s*$/, '')
  if (stripped && stripped !== trimmed) {
    try {
      const ast = parse(stripped)
      const value = evaluateAST(ast, options)
      return { preview: formatResult(value), error: null }
    } catch {
      // Incomplete
    }
  }

  return { preview: null, error: null }
}
