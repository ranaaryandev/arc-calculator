import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from '../hooks/useCalculator'

describe('useCalculator Hook Integration', () => {
  it('initializes with clean state', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.expression).toBe('')
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.angleMode).toBe('DEG')
  })

  it('appends digits and performs calculation', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.append('1')
      result.current.append('2')
      result.current.append('+')
      result.current.append('8')
    })

    expect(result.current.expression).toBe('12+8')
    expect(result.current.preview).toBe('20')

    act(() => {
      result.current.calculate()
    })

    expect(result.current.result).toBe('20')
    expect(result.current.history.length).toBeGreaterThanOrEqual(1)
  })

  it('continues calculation when operator is typed after result', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.append('5')
    })
    act(() => {
      result.current.append('*')
    })
    act(() => {
      result.current.append('4')
    })
    act(() => {
      result.current.calculate()
    })

    expect(result.current.result).toBe('20')

    // Now type '+' -> should continue with '20+'
    act(() => {
      result.current.append('+')
    })
    act(() => {
      result.current.append('3')
    })
    act(() => {
      result.current.calculate()
    })

    expect(result.current.result).toBe('23')
  })

  it('handles memory store, add, recall, and clear', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.append('50')
    })
    act(() => {
      result.current.calculate()
    })
    act(() => {
      result.current.memoryStore()
    })

    expect(result.current.memory).toBe(50)

    act(() => {
      result.current.clearAll()
    })
    act(() => {
      result.current.memoryRecall()
    })

    expect(result.current.expression).toBe('50')

    act(() => {
      result.current.memoryClear()
    })

    expect(result.current.memory).toBeNull()
  })

  it('toggles angle mode between DEG and RAD', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.angleMode).toBe('DEG')

    act(() => {
      result.current.toggleAngleMode()
    })
    expect(result.current.angleMode).toBe('RAD')

    act(() => {
      result.current.toggleAngleMode()
    })
    expect(result.current.angleMode).toBe('DEG')
  })

  it('handles backspace correctly for functions and constants', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.insertFunction('sin')
    })
    expect(result.current.expression).toBe('sin(')

    act(() => {
      result.current.backspace()
    })
    expect(result.current.expression).toBe('')
  })

  it('supports cursor navigation and middle insertion', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.append('1')
    })
    act(() => {
      result.current.append('3')
    })
    expect(result.current.expression).toBe('13')

    // Move cursor to between 1 and 3
    act(() => {
      result.current.setCursorPos(1)
    })
    act(() => {
      result.current.append('+')
      result.current.append('2')
    })

    expect(result.current.expression).toBe('1+23')
  })

  it('formats calculation according to configured decimal places', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.setDecimals(2)
    })
    act(() => {
      result.current.append('1')
    })
    act(() => {
      result.current.append('/')
    })
    act(() => {
      result.current.append('3')
    })
    act(() => {
      result.current.calculate()
    })

    expect(result.current.result).toBe('0.33')
  })
})
