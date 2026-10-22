import { useState, useMemo, useCallback, useRef } from 'react'
import type { AngleMode, HistoryItem } from '../calculator/types'
import { evaluateExpression, calculateLivePreview } from '../calculator'
import { useLocalStorage } from './useLocalStorage'
import { APP_CONFIG } from '../config/appConfig'

export function useCalculator() {
  const [expression, setExpression] = useState('')
  const [cursorPos, setCursorPosState] = useState(0)
  const cursorPosRef = useRef(0)

  const setCursorPos = useCallback((pos: number) => {
    cursorPosRef.current = pos
    setCursorPosState(pos)
  }, [])
  const [result, setResult] = useState<string | null>(null)
  const [lastRawValue, setLastRawValue] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isNewCalculation, setIsNewCalculation] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const pushUndo = useCallback((currentExpr: string) => {
    setUndoStack((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === currentExpr) return prev
      return [...prev.slice(-30), currentExpr]
    })
    setRedoStack([])
  }, [])

  const undo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo
      const target = prevUndo[prevUndo.length - 1]
      const nextUndo = prevUndo.slice(0, -1)
      setRedoStack((prevRedo) => [expression, ...prevRedo.slice(0, 30)])
      setExpression(target)
      setCursorPos(target.length)
      setError(null)
      return nextUndo
    })
  }, [expression, setCursorPos])

  const redo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo
      const target = prevRedo[0]
      const nextRedo = prevRedo.slice(1)
      setUndoStack((prevUndo) => [...prevUndo.slice(-30), expression])
      setExpression(target)
      setCursorPos(target.length)
      setError(null)
      return nextRedo
    })
  }, [expression, setCursorPos])

  // Persisted settings
  const [angleMode, setAngleMode] = useLocalStorage<AngleMode>('arc-calc-angle-mode', 'DEG')
  const [decimals, setDecimals] = useLocalStorage<number>('arc-calc-decimals', -1) // -1 is Auto
  const [showUnrounded, setShowUnrounded] = useLocalStorage<boolean>('arc-calc-unrounded', false)
  const [memory, setMemory, removeMemory] = useLocalStorage<number | null>('arc-calc-memory', null)
  const [history, setHistory, removeHistory] = useLocalStorage<HistoryItem[]>('arc-calc-history', [])

  // Synchronously derived live preview
  const preview = useMemo(() => {
    if (!expression.trim()) return null
    const { preview: p } = calculateLivePreview(expression, {
      angleMode,
      decimals,
      showUnrounded,
    })
    return p
  }, [expression, angleMode, decimals, showUnrounded])

  // Direct expression editing from text input
  const updateExpressionDirect = useCallback((newExpr: string, newPos?: number) => {
    pushUndo(expression)
    setError(null)
    setIsNewCalculation(false)
    setExpression(newExpr)
    setCursorPos(newPos !== undefined ? newPos : newExpr.length)
  }, [expression, pushUndo, setCursorPos])

  // Insert string at cursor position
  const append = useCallback(
    (val: string) => {
      pushUndo(expression)
      setError(null)

      if (isNewCalculation) {
        setIsNewCalculation(false)
        if (['+', '-', '*', '/', '^', '%'].includes(val)) {
          const base = lastRawValue !== null ? lastRawValue.toString() : result || '0'
          const updated = base + val
          setExpression(updated)
          setCursorPos(updated.length)
          return
        }
        setExpression(val)
        setCursorPos(val.length)
        return
      }

      setExpression((prev) => {
        if (prev.length >= APP_CONFIG.maxExpressionLength) return prev

        const pos = Math.min(Math.max(cursorPosRef.current, 0), prev.length)
        const left = prev.slice(0, pos)
        const right = prev.slice(pos)

        // Avoid double decimal in current number token
        if (val === '.') {
          const parts = left.split(/[+\-*/^()]/)
          const lastPart = parts[parts.length - 1]
          if (lastPart.includes('.')) {
            return prev
          }
        }

        const nextExpr = left + val + right
        setCursorPos(pos + val.length)
        return nextExpr
      })
    },
    [expression, pushUndo, isNewCalculation, lastRawValue, result, setCursorPos]
  )

  // Insert scientific function e.g. sin(, sqrt(, ln( at cursor position
  const insertFunction = useCallback(
    (fnName: string) => {
      pushUndo(expression)
      setError(null)
      if (isNewCalculation && lastRawValue !== null) {
        setIsNewCalculation(false)
        const nextExpr = `${fnName}(${lastRawValue})`
        setExpression(nextExpr)
        setCursorPos(nextExpr.length)
        return
      }

      setIsNewCalculation(false)
      const token = `${fnName}(`
      setExpression((prev) => {
        const pos = Math.min(Math.max(cursorPosRef.current, 0), prev.length)
        const left = prev.slice(0, pos)
        const right = prev.slice(pos)
        setCursorPos(pos + token.length)
        return left + token + right
      })
    },
    [expression, pushUndo, isNewCalculation, lastRawValue, setCursorPos]
  )

  // Insert constant e.g. pi, e
  const insertConstant = useCallback(
    (constName: string) => {
      pushUndo(expression)
      setError(null)
      if (isNewCalculation) {
        setIsNewCalculation(false)
        setExpression(constName)
        setCursorPos(constName.length)
        return
      }

      append(constName)
    },
    [expression, pushUndo, isNewCalculation, append, setCursorPos]
  )

  // Backspace at cursor position
  const backspace = useCallback(() => {
    pushUndo(expression)
    setError(null)
    setExpression((prev) => {
      const curPos = cursorPosRef.current
      if (!prev || curPos <= 0) return prev

      const pos = Math.min(curPos, prev.length)
      const left = prev.slice(0, pos)
      const right = prev.slice(pos)

      // Check if left ends with a function call like 'sin(', 'sqrt(', 'log10('
      const fnMatch = left.match(/([a-zA-Z0-9_]+\()$/)
      if (fnMatch) {
        const deleteCount = fnMatch[0].length
        setCursorPos(pos - deleteCount)
        return left.slice(0, -deleteCount) + right
      }

      // Check if left ends with 'pi'
      if (left.endsWith('pi')) {
        setCursorPos(pos - 2)
        return left.slice(0, -2) + right
      }

      setCursorPos(pos - 1)
      return left.slice(0, -1) + right
    })
  }, [expression, pushUndo, setCursorPos])

  // Clear entry / current expression
  const clearEntry = useCallback(() => {
    pushUndo(expression)
    setExpression('')
    setCursorPos(0)
    setError(null)
  }, [expression, pushUndo, setCursorPos])

  // Clear all
  const clearAll = useCallback(() => {
    pushUndo(expression)
    setExpression('')
    setCursorPos(0)
    setResult(null)
    setLastRawValue(null)
    setError(null)
    setIsNewCalculation(false)
  }, [expression, pushUndo, setCursorPos])

  // Sign toggle (+/-)
  const toggleSign = useCallback(() => {
    pushUndo(expression)
    setError(null)
    setExpression((prev) => {
      if (!prev) {
        setCursorPos(1)
        return '-'
      }

      const match = prev.match(/(-?\d+\.?\d*)$/)
      if (match) {
        const numStr = match[1]
        const startIdx = prev.length - numStr.length
        let next: string
        if (numStr.startsWith('-')) {
          next = prev.slice(0, startIdx) + numStr.slice(1)
        } else {
          if (startIdx === 0 || ['+', '*', '/', '(', '^'].includes(prev[startIdx - 1])) {
            next = prev.slice(0, startIdx) + '-' + numStr
          } else {
            next = prev.slice(0, startIdx) + '(-' + numStr + ')'
          }
        }
        setCursorPos(next.length)
        return next
      }

      const next = `-(${prev})`
      setCursorPos(next.length)
      return next
    })
  }, [expression, pushUndo, setCursorPos])

  // Execute Calculation
  const calculate = useCallback(() => {
    if (!expression.trim()) return

    const evalResult = evaluateExpression(expression, {
      angleMode,
      decimals,
      showUnrounded,
    })

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
  }, [expression, angleMode, decimals, showUnrounded, setHistory])

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
    const currentVal =
      lastRawValue !== null
        ? lastRawValue
        : evaluateExpression(expression, { angleMode }).value
    if (Number.isFinite(currentVal)) {
      setMemory(currentVal)
    }
  }, [lastRawValue, expression, angleMode, setMemory])

  const memoryAdd = useCallback(() => {
    const currentVal =
      lastRawValue !== null
        ? lastRawValue
        : evaluateExpression(expression, { angleMode }).value
    if (Number.isFinite(currentVal)) {
      setMemory((prev) => (prev !== null ? prev + currentVal : currentVal))
    }
  }, [lastRawValue, expression, angleMode, setMemory])

  const memorySubtract = useCallback(() => {
    const currentVal =
      lastRawValue !== null
        ? lastRawValue
        : evaluateExpression(expression, { angleMode }).value
    if (Number.isFinite(currentVal)) {
      setMemory((prev) => (prev !== null ? prev - currentVal : -currentVal))
    }
  }, [lastRawValue, expression, angleMode, setMemory])

  // History reuse
  const reuseHistory = useCallback((item: HistoryItem, type: 'result' | 'expression' = 'result') => {
    setError(null)
    if (type === 'result') {
      const valStr = item.result.toString()
      setExpression(valStr)
      setResult(item.formattedResult)
      setLastRawValue(item.result)
      setCursorPos(valStr.length)
    } else {
      setExpression(item.expression)
      setResult(null)
      setCursorPos(item.expression.length)
    }
    setIsNewCalculation(false)
  }, [setCursorPos])

  const clearHistory = useCallback(() => {
    removeHistory()
  }, [removeHistory])

  return {
    expression,
    cursorPos,
    setCursorPos,
    setExpression,
    updateExpressionDirect,
    result,
    lastRawValue,
    preview,
    error,
    angleMode,
    decimals,
    setDecimals,
    showUnrounded,
    setShowUnrounded,
    memory,
    history,
    append,
    insertFunction,
    insertConstant,
    backspace,
    clearEntry,
    clearAll,
    toggleSign,
    calculate,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
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
