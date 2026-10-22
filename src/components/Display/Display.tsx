import React, { useState, useEffect, useRef } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import type { AngleMode } from '../../calculator/types'
import styles from './Display.module.css'

interface DisplayProps {
  expression: string
  cursorPos: number
  onUpdateExpression: (expr: string, pos?: number) => void
  onCalculate: () => void
  result: string | null
  preview: string | null
  error: string | null
  angleMode: AngleMode
  memory: number | null
  onMemoryRecall: () => void
  onMemoryClear: () => void
  decimals: number
  onChangeDecimals: (d: number) => void
  showUnrounded: boolean
  onToggleUnrounded: () => void
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  cursorPos,
  onUpdateExpression,
  onCalculate,
  result,
  preview,
  error,
  angleMode,
  memory,
  onMemoryRecall,
  onMemoryClear,
  decimals,
  onChangeDecimals,
  showUnrounded,
  onToggleUnrounded,
}) => {
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep cursor position synced on input when expression or cursorPos updates
  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(cursorPos, cursorPos)
    }
  }, [cursorPos])

  const copyToClipboard = async () => {
    const textToCopy = error ? '' : result || preview || expression || '0'
    if (!textToCopy) return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = textToCopy
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Failed silently
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value
    const nextPos = e.target.selectionStart || nextVal.length
    onUpdateExpression(nextVal, nextPos)
  }

  const handleInputSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const pos = (e.target as HTMLInputElement).selectionStart
    if (pos !== null) {
      onUpdateExpression(expression, pos)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onCalculate()
    }
  }

  return (
    <section className={styles.displayContainer} aria-label="Calculator display">
      {/* Top Status & Controls Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusBadges}>
          <span className={styles.badge} title="Active angle mode">
            {angleMode}
          </span>

          {memory !== null && (
            <div className={styles.memoryPill} title={`Memory stored: ${memory}`}>
              <span>M: {memory}</span>
              <button
                type="button"
                className={styles.memoryActionBtn}
                onClick={onMemoryRecall}
                title="Recall memory value"
              >
                MR
              </button>
              <button
                type="button"
                className={styles.memoryActionBtn}
                onClick={onMemoryClear}
                title="Clear memory"
              >
                MC
              </button>
            </div>
          )}
        </div>

        <div className={styles.statusControls}>
          {/* Decimal Precision Selector */}
          <select
            className={styles.precisionSelect}
            value={showUnrounded ? 'raw' : decimals.toString()}
            onChange={(e) => {
              if (e.target.value === 'raw') {
                if (!showUnrounded) onToggleUnrounded()
              } else {
                if (showUnrounded) onToggleUnrounded()
                onChangeDecimals(parseInt(e.target.value, 10))
              }
            }}
            title="Configure numerical precision and rounding"
            aria-label="Decimal places"
          >
            <option value="-1">Auto (12 fig)</option>
            <option value="2">2 decimals</option>
            <option value="4">4 decimals</option>
            <option value="6">6 decimals</option>
            <option value="8">8 decimals</option>
            <option value="raw">Raw Unrounded</option>
          </select>

          {/* Copy Result Button */}
          <button
            type="button"
            className={`${styles.copyBtn} ${copied ? styles.copySuccess : ''}`}
            onClick={copyToClipboard}
            disabled={!!error || (!result && !preview && !expression)}
            aria-label={copied ? 'Copied value to clipboard' : 'Copy result to clipboard'}
            title="Copy result"
          >
            {copied ? (
              <>
                <Check size={13} aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Expression Editor */}
      <div className={styles.expressionWrapper}>
        <input
          ref={inputRef}
          type="text"
          className={styles.expressionInput}
          value={expression}
          onChange={handleInputChange}
          onSelect={handleInputSelect}
          onKeyDown={handleKeyDown}
          placeholder="0"
          aria-label="Expression editor"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Result / Preview Row */}
      <div className={`${styles.resultRow} tabular-numbers`} aria-live="polite">
        {error ? (
          <div className={styles.errorResult} role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : result !== null ? (
          <div className={styles.finalResult} aria-label={`Result: ${result}`}>
            {result}
          </div>
        ) : preview !== null ? (
          <div className={styles.previewContainer} aria-label={`Preview result: ${preview}`}>
            <span className={styles.previewBadge}>Preview</span>
            <span className={styles.previewResult}>= {preview}</span>
            <span className={styles.previewHint}>(Press = to save)</span>
          </div>
        ) : (
          <div className={styles.finalResult} aria-label="Result: 0">
            0
          </div>
        )}
      </div>
    </section>
  )
}
