import React, { useState } from 'react'
import { Binary, Check, Copy } from 'lucide-react'
import {
  parseBaseStringToBigInt,
  formatBaseN,
  bitwiseOperation,
  bitwiseNot,
  type NumberBase,
  type WordSize,
  type BaseNConversion,
} from '../../solvers/baseN'
import styles from './Modes.module.css'

export const BaseNCalculatorView: React.FC = () => {
  const [base, setBase] = useState<NumberBase>('DEC')
  const [wordSize, setWordSize] = useState<WordSize>(32)
  const [inputVal, setInputVal] = useState('255')
  const [operandB, setOperandB] = useState('15')
  const [copied, setCopied] = useState(false)

  let conversion: BaseNConversion | null = null
  let parseErr = ''

  try {
    const val = parseBaseStringToBigInt(inputVal, base)
    conversion = formatBaseN(val, wordSize)
  } catch (err: unknown) {
    parseErr = err instanceof Error ? err.message : 'Invalid number string for selected base.'
  }

  const handleBitwise = (op: 'AND' | 'OR' | 'XOR' | 'SHL' | 'SHR' | 'NOT') => {
    try {
      if (op === 'NOT') {
        const res = bitwiseNot(inputVal, base, wordSize)
        setInputVal(res[base.toLowerCase() as keyof BaseNConversion])
      } else {
        const res = bitwiseOperation(inputVal, operandB, op, base, wordSize)
        setInputVal(res[base.toLowerCase() as keyof BaseNConversion])
      }
    } catch {
      // Ignore
    }
  }

  const copyText = (txt: string) => {
    navigator.clipboard?.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Base-N Calculator">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <Binary size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Base-N Number Systems</h2>
            <span className={styles.modeSubtitle}>DEC, BIN, OCT, HEX conversions, bitwise logic, and two's complement</span>
          </div>
        </div>

        {/* Word Size Selector */}
        <div className={styles.subTabs} style={{ border: 'none', padding: 0 }}>
          <button
            type="button"
            className={`${styles.tabBtn} ${wordSize === 8 ? styles.tabBtnActive : ''}`}
            onClick={() => setWordSize(8)}
          >
            8-Bit
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${wordSize === 16 ? styles.tabBtnActive : ''}`}
            onClick={() => setWordSize(16)}
          >
            16-Bit
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${wordSize === 32 ? styles.tabBtnActive : ''}`}
            onClick={() => setWordSize(32)}
          >
            32-Bit
          </button>
        </div>
      </div>

      {/* Input Section with Base Toggle */}
      <div className={styles.cardSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={styles.cardTitle}>Input Number</span>
          <div className={styles.subTabs} style={{ border: 'none', padding: 0 }}>
            {(['DEC', 'HEX', 'BIN', 'OCT'] as NumberBase[]).map((b) => (
              <button
                key={b}
                type="button"
                className={`${styles.tabBtn} ${base === b ? styles.tabBtnActive : ''}`}
                onClick={() => setBase(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          className={styles.textInput}
          style={{ fontSize: '1.2rem', fontWeight: 600 }}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Enter ${base} value...`}
          aria-label={`Input in base ${base}`}
        />

        {parseErr && <div style={{ color: 'var(--text-error)', fontSize: '0.85rem' }}>{parseErr}</div>}
      </div>

      {/* Bitwise Controls */}
      <div className={styles.cardSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={styles.cardTitle} style={{ minWidth: '90px' }}>Bitwise Op</span>
          <input
            type="text"
            className={styles.textInput}
            style={{ width: '120px' }}
            value={operandB}
            onChange={(e) => setOperandB(e.target.value)}
            placeholder={`Operand 2 (${base})`}
            aria-label="Second operand for bitwise logic"
          />
          <div className={styles.actionsBar} style={{ margin: 0 }}>
            <button type="button" className={styles.secondaryBtn} onClick={() => handleBitwise('AND')}>
              AND
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => handleBitwise('OR')}>
              OR
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => handleBitwise('XOR')}>
              XOR
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => handleBitwise('NOT')}>
              NOT
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => handleBitwise('SHL')}>
              &lt;&lt;
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => handleBitwise('SHR')}>
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>

      {/* Conversion Table Output */}
      {conversion && (
        <div className={styles.resultBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.cardTitle}>Synchronous Base Conversions ({wordSize}-Bit)</span>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => copyText(`DEC: ${conversion?.dec}, BIN: ${conversion?.bin}, HEX: ${conversion?.hex}`)}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <table className={styles.baseTable}>
            <tbody>
              <tr>
                <td className={styles.baseLabel}>HEX</td>
                <td className={styles.baseVal}>0x{conversion.hex}</td>
              </tr>
              <tr>
                <td className={styles.baseLabel}>DEC</td>
                <td className={styles.baseVal}>{conversion.dec} (Signed: {conversion.signedDec})</td>
              </tr>
              <tr>
                <td className={styles.baseLabel}>OCT</td>
                <td className={styles.baseVal}>0o{conversion.oct}</td>
              </tr>
              <tr>
                <td className={styles.baseLabel}>BIN</td>
                <td className={styles.baseVal}>{conversion.bin.replace(/(.{4})/g, '$1 ').trim()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
