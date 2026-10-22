import { useEffect } from 'react'

interface KeyboardHandlers {
  onAppend: (char: string) => void
  onCalculate: () => void
  onBackspace: () => void
  onClearEntry: () => void
  onClearAll: () => void
  onInsertFunction: (fn: string) => void
  onInsertConstant: (c: string) => void
  onToggleAngleMode: () => void
  onToggleShortcutsModal: () => void
  onUndo?: () => void
  onRedo?: () => void
}

export function useKeyboard(handlers: KeyboardHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle global undo/redo shortcuts even if input has focus
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          handlers.onRedo?.()
        } else {
          handlers.onUndo?.()
        }
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        handlers.onRedo?.()
        return
      }

      // Do not intercept standard keypad typing if focus is inside an input, textarea or contenteditable element
      const activeEl = document.activeElement
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return
      }

      // Ignore when meta/cmd keys are held (allow system shortcuts like Cmd+C, Cmd+R, Cmd+V)
      if (e.metaKey || (e.ctrlKey && e.key.toLowerCase() !== 'backspace' && e.key.toLowerCase() !== 'delete')) {
        return
      }

      const key = e.key

      // Digits & basic operators
      if (/^[0-9]$/.test(key)) {
        e.preventDefault()
        handlers.onAppend(key)
        return
      }

      if (['+', '-', '*', '/', '^', '%', '!', '.'].includes(key)) {
        e.preventDefault()
        handlers.onAppend(key)
        return
      }

      if (key === '(' || key === ')') {
        e.preventDefault()
        handlers.onAppend(key)
        return
      }

      // Enter or equals
      if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handlers.onCalculate()
        return
      }

      // Backspace
      if (key === 'Backspace') {
        e.preventDefault()
        handlers.onBackspace()
        return
      }

      // Escape -> Clear Entry
      if (key === 'Escape') {
        e.preventDefault()
        handlers.onClearEntry()
        return
      }

      // Delete -> Clear All
      if (key === 'Delete') {
        e.preventDefault()
        handlers.onClearAll()
        return
      }

      // Shortcut help modal (?)
      if (key === '?') {
        e.preventDefault()
        handlers.onToggleShortcutsModal()
        return
      }

      // Quick letter functions (case-insensitive)
      const lower = key.toLowerCase()
      if (lower === 's' && !e.shiftKey) {
        e.preventDefault()
        handlers.onInsertFunction('sin')
      } else if (lower === 'c' && !e.shiftKey) {
        e.preventDefault()
        handlers.onInsertFunction('cos')
      } else if (lower === 't' && !e.shiftKey) {
        e.preventDefault()
        handlers.onInsertFunction('tan')
      } else if (lower === 'r' && !e.shiftKey) {
        e.preventDefault()
        handlers.onInsertFunction('sqrt')
      } else if (lower === 'l' && !e.shiftKey) {
        e.preventDefault()
        handlers.onInsertFunction('ln')
      } else if (lower === 'p' && !e.shiftKey) {
        e.preventDefault()
        handlers.onInsertConstant('pi')
      } else if (lower === 'e' && !e.shiftKey) {
        e.preventDefault()
        handlers.onInsertConstant('e')
      } else if (lower === 'd' && !e.shiftKey) {
        e.preventDefault()
        handlers.onToggleAngleMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers, enabled])
}
