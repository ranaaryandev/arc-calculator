import React, { useState } from 'react'
import { Delete, Sliders } from 'lucide-react'
import { KeyButton } from './KeyButton'
import styles from './Keypad.module.css'

interface KeypadProps {
  onAppend: (char: string) => void
  onInsertFunction: (fn: string) => void
  onInsertConstant: (c: string) => void
  onBackspace: () => void
  onClearEntry: () => void
  onClearAll: () => void
  onToggleSign: () => void
  onCalculate: () => void
  onMemoryClear: () => void
  onMemoryRecall: () => void
  onMemoryStore: () => void
  onMemoryAdd: () => void
  onMemorySubtract: () => void
  hasMemory: boolean
}

export const Keypad: React.FC<KeypadProps> = ({
  onAppend,
  onInsertFunction,
  onInsertConstant,
  onBackspace,
  onClearEntry,
  onClearAll,
  onToggleSign,
  onCalculate,
  onMemoryClear,
  onMemoryRecall,
  onMemoryStore,
  onMemoryAdd,
  onMemorySubtract,
  hasMemory,
}) => {
  // Persist or default scientific toggle: open on wider desktop, collapsible on mobile
  const [isScientificOpen, setIsScientificOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('arc-calc-show-scientific')
      if (saved !== null) return saved === 'true'
      return window.innerWidth > 768
    }
    return true
  })

  const [isSecondFunction, setIsSecondFunction] = useState(false)

  const toggleScientific = () => {
    setIsScientificOpen((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem('arc-calc-show-scientific', String(next))
      } catch {
        // Ignore
      }
      return next
    })
  }

  return (
    <div className={styles.keypadContainer}>
      {/* Top Utilities Bar: Memory Controls + Scientific Toggle */}
      <div className={styles.topBar}>
        <div className={styles.memoryBar} role="group" aria-label="Memory operations">
          <button
            type="button"
            className={styles.memoryBtn}
            onClick={onMemoryClear}
            disabled={!hasMemory}
            aria-label="Clear memory"
            title="Memory Clear (MC)"
          >
            MC
          </button>
          <button
            type="button"
            className={`${styles.memoryBtn} ${hasMemory ? styles.memoryBtnActive : ''}`}
            onClick={onMemoryRecall}
            disabled={!hasMemory}
            aria-label="Recall memory"
            title="Memory Recall (MR)"
          >
            MR
          </button>
          <button
            type="button"
            className={styles.memoryBtn}
            onClick={onMemoryAdd}
            aria-label="Add to memory"
            title="Memory Add (M+)"
          >
            M+
          </button>
          <button
            type="button"
            className={styles.memoryBtn}
            onClick={onMemorySubtract}
            aria-label="Subtract from memory"
            title="Memory Subtract (M−)"
          >
            M−
          </button>
          <button
            type="button"
            className={styles.memoryBtn}
            onClick={onMemoryStore}
            aria-label="Store into memory"
            title="Memory Store (MS)"
          >
            MS
          </button>
        </div>

        {/* Scientific Panel Toggle */}
        <button
          type="button"
          className={`${styles.scientificToggleBtn} ${
            isScientificOpen ? styles.scientificToggleActive : ''
          }`}
          onClick={toggleScientific}
          aria-expanded={isScientificOpen}
          aria-label="Toggle scientific functions section"
        >
          <Sliders size={14} aria-hidden="true" />
          <span>{isScientificOpen ? 'Hide Scientific' : 'Show Scientific'}</span>
        </button>
      </div>

      {/* Main Sections: Collapsible Scientific Panel + 4-Column Standard Keypad */}
      <div className={styles.keypadSections}>
        {/* SCIENTIFIC PANEL */}
        {isScientificOpen && (
          <section className={styles.scientificPanel} aria-label="Scientific functions">
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Scientific</span>
              <button
                type="button"
                className={`${styles.secondBtn} ${
                  isSecondFunction ? styles.secondBtnActive : ''
                }`}
                onClick={() => setIsSecondFunction(!isSecondFunction)}
                aria-pressed={isSecondFunction}
                title="Toggle 2nd function (inverse trig & powers)"
              >
                2nd
              </button>
            </div>

            <div className={styles.scientificGrid}>
              {/* Row 1 */}
              <KeyButton
                label={isSecondFunction ? 'sin⁻¹' : 'sin'}
                onClick={() => onInsertFunction(isSecondFunction ? 'asin' : 'sin')}
                variant="scientific"
                title={isSecondFunction ? 'Inverse sine (asin)' : 'Sine (Shortcut: S)'}
              />
              <KeyButton
                label={isSecondFunction ? 'cos⁻¹' : 'cos'}
                onClick={() => onInsertFunction(isSecondFunction ? 'acos' : 'cos')}
                variant="scientific"
                title={isSecondFunction ? 'Inverse cosine (acos)' : 'Cosine (Shortcut: C)'}
              />
              <KeyButton
                label={isSecondFunction ? 'tan⁻¹' : 'tan'}
                onClick={() => onInsertFunction(isSecondFunction ? 'atan' : 'tan')}
                variant="scientific"
                title={isSecondFunction ? 'Inverse tangent (atan)' : 'Tangent (Shortcut: T)'}
              />
              <KeyButton
                label="xʸ"
                onClick={() => onAppend('^')}
                variant="scientific"
                title="Power (x^y)"
              />

              {/* Row 2 */}
              <KeyButton
                label={isSecondFunction ? 'eˣ' : 'ln'}
                onClick={() =>
                  isSecondFunction ? onInsertFunction('exp') : onInsertFunction('ln')
                }
                variant="scientific"
                title={isSecondFunction ? 'Exponential (e^x)' : 'Natural log (Shortcut: L)'}
              />
              <KeyButton
                label={isSecondFunction ? '10ˣ' : 'log₁₀'}
                onClick={() =>
                  isSecondFunction ? onAppend('10^') : onInsertFunction('log10')
                }
                variant="scientific"
                title={isSecondFunction ? '10^x' : 'Log base 10'}
              />
              <KeyButton
                label="log₂"
                onClick={() => onInsertFunction('log2')}
                variant="scientific"
                title="Log base 2"
              />
              <KeyButton
                label="√x"
                onClick={() => onInsertFunction('sqrt')}
                variant="scientific"
                title="Square root (Shortcut: R)"
              />

              {/* Row 3 */}
              <KeyButton
                label="1/x"
                onClick={() => onAppend('1/')}
                variant="scientific"
                title="Reciprocal (1/x)"
              />
              <KeyButton
                label="n!"
                onClick={() => onAppend('!')}
                variant="scientific"
                title="Factorial (!)"
              />
              <KeyButton
                label="|x|"
                onClick={() => onInsertFunction('abs')}
                variant="scientific"
                title="Absolute value"
              />
              <KeyButton
                label="∛x"
                onClick={() => onInsertFunction('cbrt')}
                variant="scientific"
                title="Cube root"
              />

              {/* Row 4 */}
              <KeyButton
                label="π"
                onClick={() => onInsertConstant('pi')}
                variant="scientific"
                title="Pi constant (Shortcut: P)"
              />
              <KeyButton
                label="e"
                onClick={() => onInsertConstant('e')}
                variant="scientific"
                title="Euler constant e (Shortcut: E)"
              />
              <KeyButton
                label="sinh"
                onClick={() => onInsertFunction('sinh')}
                variant="scientific"
                title="Hyperbolic sine"
              />
              <KeyButton
                label="cosh"
                onClick={() => onInsertFunction('cosh')}
                variant="scientific"
                title="Hyperbolic cosine"
              />

              {/* Row 5 */}
              <KeyButton
                label="tanh"
                onClick={() => onInsertFunction('tanh')}
                variant="scientific"
                title="Hyperbolic tangent"
              />
              <KeyButton
                label="ʸ√x"
                onClick={() => onInsertFunction('root')}
                variant="scientific"
                title="Nth root (root(n, x))"
              />
              <KeyButton
                label="x²"
                onClick={() => onAppend('^2')}
                variant="scientific"
                title="Square (x²)"
              />
              <KeyButton
                label="x³"
                onClick={() => onAppend('^3')}
                variant="scientific"
                title="Cube (x³)"
              />
            </div>
          </section>
        )}

        {/* UNMISTAKABLE 4-COLUMN STANDARD KEYPAD */}
        <section
          className={`${styles.standardSection} ${
            !isScientificOpen ? styles.standardSectionFull : ''
          }`}
          aria-label="Standard keypad"
        >
          <div className={styles.standardHeader}>
            <span className={styles.standardTitle}>Keypad</span>
          </div>

          <div className={styles.standardGrid}>
            {/* Top Row: AC, C, Backspace, % */}
            <KeyButton
              label="AC"
              onClick={onClearAll}
              variant="destructive"
              title="All Clear (Delete)"
            />
            <KeyButton
              label="C"
              onClick={onClearEntry}
              variant="action"
              title="Clear entry (Escape)"
            />
            <KeyButton
              label={<Delete size={18} aria-hidden="true" />}
              onClick={onBackspace}
              variant="action"
              ariaLabel="Backspace"
              title="Backspace"
            />
            <KeyButton
              label="%"
              onClick={() => onAppend('%')}
              variant="operator"
              title="Percent (%)"
            />

            {/* Row 1: 7, 8, 9, ÷ */}
            <KeyButton
              label="7"
              onClick={() => onAppend('7')}
              variant="number"
            />
            <KeyButton
              label="8"
              onClick={() => onAppend('8')}
              variant="number"
            />
            <KeyButton
              label="9"
              onClick={() => onAppend('9')}
              variant="number"
            />
            <KeyButton
              label="÷"
              onClick={() => onAppend('/')}
              variant="operator"
              title="Divide (/)"
            />

            {/* Row 2: 4, 5, 6, × */}
            <KeyButton
              label="4"
              onClick={() => onAppend('4')}
              variant="number"
            />
            <KeyButton
              label="5"
              onClick={() => onAppend('5')}
              variant="number"
            />
            <KeyButton
              label="6"
              onClick={() => onAppend('6')}
              variant="number"
            />
            <KeyButton
              label="×"
              onClick={() => onAppend('*')}
              variant="operator"
              title="Multiply (*)"
            />

            {/* Row 3: 1, 2, 3, − */}
            <KeyButton
              label="1"
              onClick={() => onAppend('1')}
              variant="number"
            />
            <KeyButton
              label="2"
              onClick={() => onAppend('2')}
              variant="number"
            />
            <KeyButton
              label="3"
              onClick={() => onAppend('3')}
              variant="number"
            />
            <KeyButton
              label="−"
              onClick={() => onAppend('-')}
              variant="operator"
              title="Subtract (-)"
            />

            {/* Row 4: ±, 0, ., + */}
            <KeyButton
              label="±"
              onClick={onToggleSign}
              variant="operator"
              title="Toggle sign (+/-)"
            />
            <KeyButton
              label="0"
              onClick={() => onAppend('0')}
              variant="number"
            />
            <KeyButton
              label="."
              onClick={() => onAppend('.')}
              variant="number"
              title="Decimal point"
            />
            <KeyButton
              label="+"
              onClick={() => onAppend('+')}
              variant="operator"
              title="Add (+)"
            />

            {/* Row 5: Parentheses & Prominent Equals */}
            <KeyButton
              label="("
              onClick={() => onAppend('(')}
              variant="operator"
              title="Open parenthesis ("
            />
            <KeyButton
              label=")"
              onClick={() => onAppend(')')}
              variant="operator"
              title="Close parenthesis )"
            />
            <KeyButton
              label="="
              onClick={onCalculate}
              variant="primary"
              spanTwo
              title="Calculate (Enter or =)"
            />
          </div>
        </section>
      </div>
    </div>
  )
}
