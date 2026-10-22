import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue
      const item = window.localStorage.getItem(key)
      if (item === null) return initialValue
      return JSON.parse(item) as T
    } catch {
      // Storage unavailable or JSON corrupt
      return initialValue
    }
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
      }
    } catch {
      // Storage full or restricted; silently fall back to in-memory state
    }
  }, [key, storedValue])

  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
      setStoredValue(initialValue)
    } catch {
      setStoredValue(initialValue)
    }
  }

  return [storedValue, setStoredValue, removeValue]
}
