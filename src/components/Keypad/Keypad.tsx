import React, { useState } from 'react'
import { Delete } from 'lucide-react'
import { KeyButton } from './KeyButton'
import styles from './Keypad.module.css'

interface KeypadProps {
  onAppend: (char: string) => void
  onInsertFunction: (fn: string) => void
  onInsertConstant: (c: string) => void
  onInsertParenthesis: () => void
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

type MobileTab = 'standard' | 'scientific'

export const Keypad: React.FC<KeypadProps> = ({
  onAppend,
  onInsertFunction,
  onInsertConstant,
  onInsertParenthesis,
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
  const [mobileTab, setMobileTab] = useState<MobileTab>('standard')
  const [isSecondFunction, setIsSecondFunction] = useState(false)

  return (
    <div className={styles.keypadContainer}>
      {/* Memory Bar */}
      <div className={styles.memoryBar} role="group" aria-label="Memory operations">
        <button
          type="button"
          className={styles.memoryBtn}
          onClick={onMemoryClear}
          disabled={!hasMemory}
          aria-label="Clear memory"
          title="Memory Clear"
        >
          MC
        </button>
        <button
          type="button"
          className={`${styles.memoryBtn} ${hasMemory ? styles.memoryBtnActive : ''}`}
          onClick={onMemoryRecall}
          disabled={!hasMemory}
          aria-label="Recall memory"
          title="Memory Recall"
        >
          MR
        </button>
        <button
          type="button"
          className={styles.memoryBtn}
          onClick={onMemoryAdd}
          aria-label="Add to memory"
          title="Memory Add"
        >
          M+
        </button>
        <button
          type="button"
          className={styles.memoryBtn}
          onClick={onMemorySubtract}
          aria-label="Subtract from memory"
          title="Memory Subtract"
        >
          M−
        </button>
        <button
          type="button"
          className={styles.memoryBtn}
          onClick={onMemoryStore}
          aria-label="Store into memory"
          title="Memory Store"
        >
          MS
        </button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className={styles.mobileTabs} role="tablist" aria-label="Keypad views">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'standard'}
          className={`${styles.mobileTab} ${mobileTab === 'standard' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobileTab('standard')}
        >
          Standard
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'scientific'}
          className={`${styles.mobileTab} ${mobileTab === 'scientific' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobileTab('scientific')}
        >
          Scientific
        </button>
      </div>

      {/* Keypad Grid */}
      <div
        className={`${styles.mainGrid} ${
          mobileTab === 'standard' ? styles.standardOnly : styles.scientificOnly
        }`}
      >
        {/* SCIENTIFIC KEYS (Desktop: 4 columns on left. Mobile: shown in scientific tab) */}
        {(window.innerWidth > 768 || mobileTab === 'scientific') && (
          <>
            {/* Row 1 Scientific */}
            <KeyButton
              label="2nd"
              onClick={() => setIsSecondFunction(!isSecondFunction)}
              variant="scientific"
              active={isSecondFunction}
              ariaLabel="Toggle inverse functions"
              title="Toggle inverse scientific functions"
            />
            <KeyButton
              label={isSecondFunction ? 'sin⁻¹' : 'sin'}
              onClick={() => onInsertFunction(isSecondFunction ? 'asin' : 'sin')}
              variant="scientific"
              title={isSecondFunction ? 'Inverse sine (Shortcut: S)' : 'Sine (Shortcut: S)'}
            />
            <KeyButton
              label={isSecondFunction ? 'cos⁻¹' : 'cos'}
              onClick={() => onInsertFunction(isSecondFunction ? 'acos' : 'cos')}
              variant="scientific"
              title={isSecondFunction ? 'Inverse cosine (Shortcut: C)' : 'Cosine (Shortcut: C)'}
            />
            <KeyButton
              label={isSecondFunction ? 'tan⁻¹' : 'tan'}
              onClick={() => onInsertFunction(isSecondFunction ? 'atan' : 'tan')}
              variant="scientific"
              title={isSecondFunction ? 'Inverse tangent (Shortcut: T)' : 'Tangent (Shortcut: T)'}
            />

            {/* Row 2 Scientific */}
            <KeyButton
              label="xʸ"
              onClick={() => onAppend('^')}
              variant="scientific"
              title="Power (x^y)"
            />
            <KeyButton
              label="x²"
              onClick={() => onAppend('^2')}
              variant="scientific"
              title="Square (x²)"
            />
            <KeyButton
              label="√x"
              onClick={() => onInsertFunction('sqrt')}
              variant="scientific"
              title="Square root (Shortcut: R)"
            />
            <KeyButton
              label="∛x"
              onClick={() => onInsertFunction('cbrt')}
              variant="scientific"
              title="Cube root"
            />

            {/* Row 3 Scientific */}
            <KeyButton
              label={isSecondFunction ? 'eˣ' : 'ln'}
              onClick={() =>
                isSecondFunction ? onInsertFunction('exp') : onInsertFunction('ln')
              }
              variant="scientific"
              title={isSecondFunction ? 'Exponential e^x' : 'Natural logarithm (Shortcut: L)'}
            />
            <KeyButton
              label={isSecondFunction ? '10ˣ' : 'log₁₀'}
              onClick={() =>
                isSecondFunction ? onAppend('10^') : onInsertFunction('log10')
              }
              variant="scientific"
              title={isSecondFunction ? 'Base 10 power (10^x)' : 'Logarithm base 10'}
            />
            <KeyButton
              label="log₂"
              onClick={() => onInsertFunction('log2')}
              variant="scientific"
              title="Logarithm base 2"
            />
            <KeyButton
              label="1/x"
              onClick={() => onAppend('1/')}
              variant="scientific"
              title="Reciprocal (1/x)"
            />

            {/* Row 4 Scientific */}
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

            {/* Row 5 Scientific */}
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
          </>
        )}

        {/* STANDARD KEYS (Desktop: 5 columns on right. Mobile: shown in standard tab) */}
        {(window.innerWidth > 768 || mobileTab === 'standard') && (
          <>
            {/* Standard Row 1 */}
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
              title="Clear current entry (Escape)"
            />
            <KeyButton
              label={<Delete size={18} aria-hidden="true" />}
              onClick={onBackspace}
              variant="action"
              ariaLabel="Backspace"
              title="Backspace"
            />
            <KeyButton
              label="("
              onClick={onInsertParenthesis}
              variant="operator"
              title="Parenthesis"
            />
            <KeyButton
              label="÷"
              onClick={() => onAppend('/')}
              variant="operator"
              title="Divide (/)"
            />

            {/* Standard Row 2 */}
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
              label="%"
              onClick={() => onAppend('%')}
              variant="operator"
              title="Percent (%)"
            />
            <KeyButton
              label="×"
              onClick={() => onAppend('*')}
              variant="operator"
              title="Multiply (*)"
            />

            {/* Standard Row 3 */}
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
              label="±"
              onClick={onToggleSign}
              variant="operator"
              title="Toggle sign (+/-)"
            />
            <KeyButton
              label="−"
              onClick={() => onAppend('-')}
              variant="operator"
              title="Subtract (-)"
            />

            {/* Standard Row 4 */}
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
              label=")"
              onClick={() => onAppend(')')}
              variant="operator"
              title="Close parenthesis"
            />
            <KeyButton
              label="+"
              onClick={() => onAppend('+')}
              variant="operator"
              title="Add (+)"
            />

            {/* Standard Row 5 */}
            <KeyButton
              label="0"
              onClick={() => onAppend('0')}
              variant="number"
              spanTwo
            />
            <KeyButton
              label="."
              onClick={() => onAppend('.')}
              variant="number"
              title="Decimal point"
            />
            <KeyButton
              label="="
              onClick={onCalculate}
              variant="primary"
              spanTwo
              title="Calculate (Enter or =)"
            />
          </>
        )}
      </div>
    </div>
  )
}
