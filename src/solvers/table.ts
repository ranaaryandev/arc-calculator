/**
 * Arc Calculator 2.0 — Table of Values Generator Engine
 * Evaluates f(x) over [start, end] with step size, safe bounds, and discontinuity handling.
 */

import { parse } from '../calculator/parser'
import { evaluateAST } from '../calculator/evaluator'
import type { AngleMode } from '../calculator/types'

export interface TableRow {
  stepIndex: number
  x: number
  y: number | null
  displayY: string
  isError: boolean
}

export interface TableResult {
  expression: string
  start: number
  end: number
  step: number
  rows: TableRow[]
  warning?: string
}

const MAX_TABLE_ROWS = 500

export function generateTableOfValues(
  expression: string,
  start: number,
  end: number,
  step: number,
  angleMode: AngleMode = 'RAD'
): TableResult {
  const trimmed = expression.trim()
  if (!trimmed) {
    throw new Error('Expression formula for f(x) cannot be empty.')
  }

  if (step <= 0) {
    throw new Error('Step size must be strictly positive (> 0).')
  }

  if (start > end) {
    throw new Error('Start value must be less than or equal to End value.')
  }

  const expectedCount = Math.floor((end - start) / step) + 1
  if (expectedCount > MAX_TABLE_ROWS) {
    throw new Error(`Requested range produces ${expectedCount} rows, exceeding safe maximum limit of ${MAX_TABLE_ROWS}. Increase step size.`)
  }

  const ast = parse(trimmed)
  const rows: TableRow[] = []

  let currentIndex = 0
  for (let x = start; x <= end + step * 0.0001; x += step) {
    const cleanX = Number(x.toFixed(8))
    let yVal: number | null = null
    let displayY = ''
    let isError = false

    try {
      const res = evaluateAST(ast, { variables: { x: cleanX }, angleMode })
      if (Number.isFinite(res)) {
        yVal = res
        displayY = Number(res.toFixed(6)).toString()
      } else {
        displayY = 'Undefined'
        isError = true
      }
    } catch {
      displayY = 'Error'
      isError = true
    }

    rows.push({
      stepIndex: currentIndex++,
      x: cleanX,
      y: yVal,
      displayY,
      isError,
    })
  }

  return {
    expression: trimmed,
    start,
    end,
    step,
    rows,
  }
}
