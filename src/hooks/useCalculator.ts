import { useState, useMemo, useCallback } from 'react'
import type { AngleMode, HistoryItem } from '../calculator/types'
import { evaluateExpression, calculateLivePreview } from '../calculator'
import { useLocalStorage } from './useLocalStorage'
import { APP_CONFIG } from '../config/appConfig'

export function useCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [lastRawValue, setLastRawValue] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isNewCalculation, setIsNewCalculation] = useState(false)

  // Persisted state
  const [angleMode, setAngleMode] = useLocalStorage<AngleMode>('arc-calc-angle-mode', 'DEG')
  const [memory, setMemory, removeMemory] = useLocalStorage<number | null>('arc-calc-memory', null)
  const [history, setHistory, removeHistory] = useLocalStorage<HistoryItem[]>('arc-calc-history', [])

  // Synchronously derived live preview without extra render cascade
  const preview = useMemo(() => {
    if (!expression.trim()) return null
    const { preview: p } = calculateLivePreview(expression, { angleMode })
    return p
  }, [expression, angleMode])

  // Append character or operator to expression
  const append = useCallback(
    (val: string) => {
      setError(null)

      setExpression((prev) => {
        // If starting fresh after a completed calculation
        if (isNewCalculation) {
          setIsNewCalculation(false)
          // If entering an operator (+, -, *, /, ^, %), continue from previous result
          if (['+', '-', '*', '/', '^', '%'].includes(val)) {
            const base = lastRawValue !== null ? lastRawValue.toString() : result || '0'
            return base + val
          }
          // If entering a digit or open paren, start clean
          return val
        }

        // Limit expression length
        if (prev.length >= APP_CONFIG.maxExpressionLength) {
          return prev
        }

        // Avoid double decimal points in current number token
        if (val === '.') {
          const parts = prev.split(/[+\-*/^()]/)
          const lastPart = parts[parts.length - 1]
          if (lastPart.includes('.')) {
            return prev
          }
          if (!lastPart || lastPart === '') {
            return prev + '0.'
          }
        }

        return prev + val
      })
    },
    [isNewCalculation, lastRawValue, result]
  )

  // Insert scientific function e.g. sin(, sqrt(, ln(
  const insertFunction = useCallback(
    (fnName: string) => {
      setError(null)
      setIsNewCalculation(false)
      setExpression((prev) => {
        if (isNewCalculation && lastRawValue !== null) {
          return `${fnName}(${lastRawValue})`
        }
        return prev + `${fnName}(`
      })
    },
    [isNewCalculation, lastRawValue]
  )

  // Insert constant e.g. pi, e
  const insertConstant = useCallback(
    (constName: string) => {
      setError(null)
      if (isNewCalculation) {
        setIsNewCalculation(false)
        setExpression(constName)
      } else {
        setExpression((prev) => prev + constName)
      }
    },
    [isNewCalculation]
  )

  // Smart Parentheses: toggles between '(' and ')' based on context
  const insertParenthesis = useCallback(() => {
    setError(null)
    setIsNewCalculation(false)
    setExpression((prev) => {
      const openCount = (prev.match(/\(/g) || []).length
      const closeCount = (prev.match(/\)/g) || []).length
      const lastChar = prev.slice(-1)

      // If we have open parens to close and last char can end an expression
      if (openCount > closeCount && /[0-9)!%a-zA-Z]/.test(lastChar)) {
        return prev + ')'
      }
      return prev + '('
    })
  }, [])

  // Backspace: removes last token or character cleanly
  const backspace = useCallback(() => {
    setError(null)
    setExpression((prev) => {
      if (!prev) return ''

      // Check if ending with a function like 'sin(', 'sqrt(', 'log10('
      const fnMatch = prev.match(/([a-zA-Z0-9_]+\()$/)
      if (fnMatch) {
        return prev.slice(0, -fnMatch[0].length)
      }

      // Check if ending with 'pi'
      if (prev.endsWith('pi')) {
        return prev.slice(0, -2)
      }

      return prev.slice(0, -1)
    })
  }, [])

  // Clear entry / current expression
  const clearEntry = useCallback(() => {
    setExpression('')
    setError(null)
  }, [])

  // Clear all
  const clearAll = useCallback(() => {
    setExpression('')
    setResult(null)
    setLastRawValue(null)
    setError(null)
    setIsNewCalculation(false)
  }, [])

  // Sign toggle (+/-)
  const toggleSign = useCallback(() => {
    setError(null)
    setExpression((prev) => {
      if (!prev) return '-'

      // Match last number in the expression
      const match = prev.match(/(-?\d+\.?\d*)$/)
      if (match) {
        const numStr = match[1]
        const startIdx = prev.length - numStr.length
        if (numStr.startsWith('-')) {
          // Change negative to positive
          return prev.slice(0, startIdx) + numStr.slice(1)
        } else {
          // If preceded by an operator, just attach -
          if (startIdx === 0 || ['+', '*', '/', '(', '^'].includes(prev[startIdx - 1])) {
            return prev.slice(0, startIdx) + '-' + numStr
          }
          return prev.slice(0, startIdx) + '(-' + numStr + ')'
        }
      }

      return `-(${prev})`
    })
  }, [])

  // Execute Calculation
  const calculate = useCallback(() => {
    if (!expression.trim()) return

    const evalResult = evaluateExpression(expression, { angleMode })

    if (evalResult.error) {
      setError(evalResult.error)
      setResult(null)
      return
    }

    setResult(evalResult.formatted)
    setLastRawValue(evalResult.value)
    setError(null)
    setIsNewCalculation(true)

    // Save to history
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      expression,
      result: evalResult.value,
      formattedResult: evalResult.formatted,
      angleMode,
      timestamp: Date.now(),
    }

    setHistory((prev) => [newItem, ...prev.slice(0, APP_CONFIG.maxHistoryItems - 1)])
  }, [expression, angleMode, setHistory])

  // Toggle angle mode
  const toggleAngleMode = useCallback(() => {
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'))
  }, [setAngleMode])

  // Memory operations
  const memoryClear = useCallback(() => {
    removeMemory()
  }, [removeMemory])

  const memoryRecall = useCallback(() => {
    if (memory !== null) {
      append(memory.toString())
    }
  }, [memory, append])

  const memoryStore = useCallback(() => {
    const currentVal = lastRawValue !== null ? lastRawValue : evaluateExpression(expression, { angleMode }).value
    if (Number.isFinite(currentVal)) {
      setMemory(currentVal)
    }
  }, [lastRawValue, expression, angleMode, setMemory])

  const memoryAdd = useCallback(() => {
    const currentVal = lastRawValue !== null ? lastRawValue : evaluateExpression(expression, { angleMode }).value
    if (Number.isFinite(currentVal)) {
      setMemory((prev) => (prev !== null ? prev + currentVal : currentVal))
    }
  }, [lastRawValue, expression, angleMode, setMemory])

  const memorySubtract = useCallback(() => {
    const currentVal = lastRawValue !== null ? lastRawValue : evaluateExpression(expression, { angleMode }).value
    if (Number.isFinite(currentVal)) {
      setMemory((prev) => (prev !== null ? prev - currentVal : -currentVal))
    }
  }, [lastRawValue, expression, angleMode, setMemory])

  // History reuse
  const reuseHistory = useCallback((item: HistoryItem, type: 'result' | 'expression' = 'result') => {
    setError(null)
    if (type === 'result') {
      setExpression(item.result.toString())
      setResult(item.formattedResult)
      setLastRawValue(item.result)
    } else {
      setExpression(item.expression)
      setResult(null)
    }
    setIsNewCalculation(false)
  }, [])

  const clearHistory = useCallback(() => {
    removeHistory()
  }, [removeHistory])

  return {
    expression,
    setExpression,
    result,
    lastRawValue,
    preview,
    error,
    angleMode,
    memory,
    history,
    append,
    insertFunction,
    insertConstant,
    insertParenthesis,
    backspace,
    clearEntry,
    clearAll,
    toggleSign,
    calculate,
    toggleAngleMode,
    memoryClear,
    memoryRecall,
    memoryStore,
    memoryAdd,
    memorySubtract,
    reuseHistory,
    clearHistory,
  }
}
