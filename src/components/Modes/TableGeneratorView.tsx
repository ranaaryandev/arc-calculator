import React, { useState } from 'react'
import { Table as TableIcon, Check, Copy } from 'lucide-react'
import { generateTableOfValues, type TableResult } from '../../solvers/table'
import type { AngleMode } from '../../calculator/types'
import styles from './Modes.module.css'

export const TableGeneratorView: React.FC = () => {
  const [formula, setFormula] = useState('x^2 - 4')
  const [start, setStart] = useState('-3')
  const [end, setEnd] = useState('3')
  const [step, setStep] = useState('1')
  const [angleMode, setAngleMode] = useState<AngleMode>('RAD')
  const [copied, setCopied] = useState(false)

  let table: TableResult | null = null
  let tableErr = ''

  try {
    const s = parseFloat(start) || 0
    const e = parseFloat(end) || 0
    const st = parseFloat(step) || 1
    table = generateTableOfValues(formula, s, e, st, angleMode)
  } catch (err: unknown) {
    tableErr = err instanceof Error ? err.message : 'Error generating table.'
  }

  const copyTable = () => {
    if (!table) return
    const tsv = ['x\tf(x)', ...table.rows.map((r) => `${r.x}\t${r.displayY}`)].join('\n')
    navigator.clipboard?.writeText(tsv)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Table of Values Generator">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <TableIcon size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Table of Values</h2>
            <span className={styles.modeSubtitle}>Tabular function evaluations for f(x) over a defined range and step</span>
          </div>
        </div>

        <div className={styles.actionsBar}>
          <div className={styles.subTabs} style={{ border: 'none', padding: 0 }}>
            <button
              type="button"
              className={`${styles.tabBtn} ${angleMode === 'DEG' ? styles.tabBtnActive : ''}`}
              onClick={() => setAngleMode('DEG')}
            >
              DEG
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${angleMode === 'RAD' ? styles.tabBtnActive : ''}`}
              onClick={() => setAngleMode('RAD')}
            >
              RAD
            </button>
          </div>
          <button type="button" className={styles.secondaryBtn} onClick={copyTable}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied TSV' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.cardSection}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Function f(x)</label>
            <input
              type="text"
              className={styles.textInput}
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g. sin(x), x^2 - 4"
              aria-label="Formula for f(x)"
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Start (x_min)</label>
              <input type="number" className={styles.textInput} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>End (x_max)</label>
              <input type="number" className={styles.textInput} value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Step (Δx)</label>
              <input type="number" min="0.001" step="0.5" className={styles.textInput} value={step} onChange={(e) => setStep(e.target.value)} />
            </div>
          </div>

          <div className={styles.actionsBar}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presets:</span>
            {['sin(x)', 'cos(x)', 'x^2 - 4', '1/x', 'x^3 - 3*x', 'sqrt(x)'].map((p) => (
              <button key={p} type="button" className={styles.secondaryBtn} onClick={() => setFormula(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {tableErr && <div style={{ color: 'var(--text-error)', fontSize: '0.85rem' }}>{tableErr}</div>}
      </div>

      {/* Table Readout */}
      {table && (
        <div className={styles.resultBox} style={{ maxHeight: '380px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.cardTitle}>Function Table: f(x) = {table.expression} ({table.rows.length} rows)</span>
          </div>

          <table className={styles.baseTable} style={{ marginTop: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '6px 12px', width: '40px', color: 'var(--text-muted)' }}>#</th>
                <th style={{ padding: '6px 12px', color: 'var(--text-primary)' }}>x</th>
                <th style={{ padding: '6px 12px', color: 'var(--accent-primary)' }}>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.stepIndex}>
                  <td style={{ color: 'var(--text-muted)' }}>{row.stepIndex + 1}</td>
                  <td style={{ fontWeight: 600 }}>{row.x}</td>
                  <td style={{ color: row.isError ? 'var(--text-error)' : 'var(--accent-primary)' }}>
                    {row.displayY}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
