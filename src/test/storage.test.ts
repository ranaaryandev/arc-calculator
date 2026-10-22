import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('Phase 5: Storage Reliability & Failure Resilience', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('initializes with default value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-empty', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('recovers gracefully from corrupted JSON in localStorage', () => {
    localStorage.setItem('test-corrupt', '{invalid json: true}')
    const { result } = renderHook(() => useLocalStorage('test-corrupt', 'safe-fallback'))
    // Must not throw, returns default safe fallback
    expect(result.current[0]).toBe('safe-fallback')
  })

  it('handles localStorage QuotaExceededError when saving large items without crashing', () => {
    const { result } = renderHook(() => useLocalStorage('test-quota', 'initial'))

    // Mock setItem to throw QuotaExceededError
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const err = new Error('QuotaExceededError: DOM Exception 22')
      err.name = 'QuotaExceededError'
      throw err
    })

    // Should update in-memory state smoothly without throwing
    expect(() => {
      act(() => {
        result.current[1]('large-updated-value')
      })
    }).not.toThrow()

    expect(result.current[0]).toBe('large-updated-value')
  })

  it('handles disabled / restricted storage (e.g. strict private browsing SecurityError)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: Access is denied for this document')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError: Access is denied for this document')
    })

    const { result } = renderHook(() => useLocalStorage('test-security', 42))
    expect(result.current[0]).toBe(42)

    expect(() => {
      act(() => {
        result.current[1](100)
      })
    }).not.toThrow()

    expect(result.current[0]).toBe(100)
  })

  it('handles removeItem failure gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-remove', 'init'))

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Disk error')
    })

    expect(() => {
      act(() => {
        result.current[2]()
      })
    }).not.toThrow()

    expect(result.current[0]).toBe('init')
  })
})
