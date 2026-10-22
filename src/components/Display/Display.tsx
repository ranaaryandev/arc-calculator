import React, { useState, useEffect, useRef } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import type { AngleMode } from '../../calculator/types'
import { formatExpressionForDisplay } from '../../calculator/formatter'
import styles from './Display.module.css'

interface DisplayProps {
  expression: string
  result: string | null
  preview: string | null
  error: string | null
  angleMode: AngleMode
  hasMemory: boolean
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  preview,
  error,
  angleMode,
  hasMemory,
}) => {
  const [copied, setCopied] = useState(false)
  const expressionRef = useRef<HTMLDivElement>(null)

  // Scroll expression to the right on update
  useEffect(() => {
    if (expressionRef.current) {
      expressionRef.current.scrollLeft = expressionRef.current.scrollWidth
    }
  }, [expression])

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

  const formattedDisplayExpr = formatExpressionForDisplay(expression)

  return (
    <section className={styles.displayContainer} aria-label="Calculator display">
      {/* Top Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusBadges}>
          <span className={styles.badge} title="Active angle mode">
            {angleMode}
          </span>
          {hasMemory && (
            <span className={`${styles.badge} ${styles.memoryBadge}`} title="Value stored in memory">
              M
            </span>
          )}
        </div>

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

      {/* Expression Row */}
      <div
        ref={expressionRef}
        className={`${styles.expressionRow} tabular-numbers`}
        title={expression || 'Empty expression'}
        aria-label={`Expression: ${expression || '0'}`}
      >
        {formattedDisplayExpr || '0'}
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
