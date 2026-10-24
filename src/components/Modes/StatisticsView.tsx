import React, { useState } from 'react'
import { BarChart2, Check, Copy } from 'lucide-react'
import { calculate1VarStats, calculateLinearRegression, type Stats1VarResult, type LinearRegressionResult } from '../../solvers/statistics'
import styles from './Modes.module.css'

export const StatisticsView: React.FC = () => {
  const [tab, setTab] = useState<'1var' | '2var'>('1var')
  const [raw1Var, setRaw1Var] = useState('2, 4, 4, 4, 5, 5, 7, 9')
  const [raw2Var, setRaw2Var] = useState('1, 2\n2, 4\n3, 6\n4, 8\n5, 11')
  const [copied, setCopied] = useState(false)

  // Compute 1-Var
  let stats1: Stats1VarResult | null = null
  let err1 = ''
  try {
    const nums = raw1Var
      .split(/[\s,]+/)
      .map((s) => parseFloat(s))
      .filter((n) => Number.isFinite(n))
    if (nums.length > 0) {
      stats1 = calculate1VarStats(nums)
    }
  } catch (err: unknown) {
    err1 = err instanceof Error ? err.message : 'Error in dataset'
  }

  // Compute 2-Var Regression
  let reg: LinearRegressionResult | null = null
  let err2 = ''
  try {
    const lines = raw2Var.split('\n')
    const pts: { x: number; y: number }[] = []
    for (const line of lines) {
      const parts = line.split(/[\s,]+/).map((s) => parseFloat(s)).filter((n) => Number.isFinite(n))
      if (parts.length >= 2) {
        pts.push({ x: parts[0], y: parts[1] })
      }
    }
    if (pts.length >= 2) {
      reg = calculateLinearRegression(pts)
    }
  } catch (err: unknown) {
    err2 = err instanceof Error ? err.message : 'Error in regression points'
  }

  const copyStats = (txt: string) => {
    navigator.clipboard?.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Statistics Calculator">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <BarChart2 size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Statistics & Regression</h2>
            <span className={styles.modeSubtitle}>1-Variable summary statistics and 2-Variable linear regression</span>
          </div>
        </div>

        <div className={styles.subTabs} style={{ border: 'none', padding: 0 }}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === '1var' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('1var')}
          >
            1-Variable
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === '2var' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('2var')}
          >
            Linear Regression
          </button>
        </div>
      </div>

      {tab === '1var' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className={styles.cardSection}>
            <span className={styles.cardTitle}>Data Input (Comma or space separated)</span>
            <textarea
              className={styles.textInput}
              rows={3}
              value={raw1Var}
              onChange={(e) => setRaw1Var(e.target.value)}
              placeholder="e.g. 10, 15, 20, 25, 30"
              style={{ width: '100%', resize: 'vertical' }}
              aria-label="Dataset numbers"
            />
            <div className={styles.actionsBar}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setRaw1Var('12, 15, 18, 22, 22, 25, 28, 30, 35')}
              >
                Sample Data (Ages)
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setRaw1Var('98.2, 98.6, 98.4, 99.1, 98.5, 98.7')}
              >
                Sample Data (Temperatures)
              </button>
            </div>
          </div>

          {err1 && <div style={{ color: 'var(--text-error)', fontSize: '0.85rem' }}>{err1}</div>}

          {stats1 && (
            <div className={styles.resultBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.cardTitle}>Statistical Parameters (n = {stats1.n})</span>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() =>
                    copyStats(
                      `Mean: ${stats1?.mean}, StdDev: ${stats1?.sampleStdDev}, Min: ${stats1?.min}, Max: ${stats1?.max}`
                    )
                  }
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '8px' }}>
                <div><strong>Mean x̄:</strong> {stats1.mean.toFixed(4)}</div>
                <div><strong>Median:</strong> {stats1.median.toFixed(4)}</div>
                <div><strong>Mode:</strong> {stats1.mode.length > 0 ? stats1.mode.join(', ') : 'No mode'}</div>
                <div><strong>Sample Std Dev (s):</strong> {stats1.sampleStdDev.toFixed(4)}</div>
                <div><strong>Pop. Std Dev (σ):</strong> {stats1.populationStdDev.toFixed(4)}</div>
                <div><strong>Sample Variance:</strong> {stats1.sampleVariance.toFixed(4)}</div>
                <div><strong>Min / Max:</strong> {stats1.min} / {stats1.max}</div>
                <div><strong>Quartile Q1:</strong> {stats1.q1.toFixed(4)}</div>
                <div><strong>Quartile Q3:</strong> {stats1.q3.toFixed(4)}</div>
                <div><strong>IQR:</strong> {stats1.iqr.toFixed(4)}</div>
                <div><strong>Sum Σx:</strong> {stats1.sum.toFixed(4)}</div>
                <div><strong>Sum Σx²:</strong> {stats1.sumSq.toFixed(4)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === '2var' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className={styles.cardSection}>
            <span className={styles.cardTitle}>Points (x, y per line)</span>
            <textarea
              className={styles.textInput}
              rows={5}
              value={raw2Var}
              onChange={(e) => setRaw2Var(e.target.value)}
              placeholder="1, 2\n2, 4\n3, 6"
              style={{ width: '100%', resize: 'vertical' }}
              aria-label="Regression coordinate pairs"
            />
          </div>

          {err2 && <div style={{ color: 'var(--text-error)', fontSize: '0.85rem' }}>{err2}</div>}

          {reg && (
            <div className={styles.resultBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.cardTitle}>Linear Regression Model</span>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => copyStats(reg?.equation || '')}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className={styles.resultValue}>{reg.equation}</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '8px' }}>
                <div><strong>Slope (m):</strong> {reg.slope.toFixed(6)}</div>
                <div><strong>Intercept (c):</strong> {reg.intercept.toFixed(6)}</div>
                <div><strong>Correlation (r):</strong> {reg.r.toFixed(6)}</div>
                <div><strong>Determination (r²):</strong> {reg.r2.toFixed(6)} ({(reg.r2 * 100).toFixed(2)}%)</div>
                <div><strong>Mean x̄:</strong> {reg.meanX.toFixed(4)}</div>
                <div><strong>Mean ȳ:</strong> {reg.meanY.toFixed(4)}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
