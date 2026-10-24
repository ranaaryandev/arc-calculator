import React, { useState } from 'react'
import { Dice5, Check, Copy } from 'lucide-react'
import {
  permutations,
  combinations,
  factorial,
  binomialPMF,
  binomialCDF,
  normalCDF,
  normalPDF,
  normalInterval,
} from '../../solvers/probability'
import styles from './Modes.module.css'

export const ProbabilityView: React.FC = () => {
  const [tab, setTab] = useState<'combinatorics' | 'binomial' | 'normal'>('combinatorics')
  const [copied, setCopied] = useState(false)

  // Combinatorics
  const [combN, setCombN] = useState('10')
  const [combR, setCombR] = useState('3')

  // Binomial
  const [binomN, setBinomN] = useState('10')
  const [binomK, setBinomK] = useState('3')
  const [binomP, setBinomP] = useState('0.5')

  // Normal
  const [normX, setNormX] = useState('1.96')
  const [normMean, setNormMean] = useState('0')
  const [normStd, setNormStd] = useState('1')
  const [normA, setNormA] = useState('-1')
  const [normB, setNormB] = useState('1')

  const copyText = (txt: string) => {
    navigator.clipboard?.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Pure data computation
  let copyVal = ''
  let calcError = ''

  let combData: { n: number; r: number; npr: number; ncr: number; nFact: number } | null = null
  let binomData: { n: number; k: number; p: number; pmf: number; cdf: number } | null = null
  let normData: { x: number; mean: number; std: number; pdf: number; cdf: number; a: number; b: number; interval: number } | null = null

  if (tab === 'combinatorics') {
    const n = parseInt(combN, 10) || 0
    const r = parseInt(combR, 10) || 0
    try {
      const npr = permutations(n, r)
      const ncr = combinations(n, r)
      const nFact = n <= 170 ? factorial(n) : Infinity
      copyVal = `nPr = ${npr}, nCr = ${ncr}`
      combData = { n, r, npr, ncr, nFact }
    } catch (err: unknown) {
      calcError = err instanceof Error ? err.message : 'Combinatorics calculation error'
    }
  } else if (tab === 'binomial') {
    const n = parseInt(binomN, 10) || 0
    const k = parseInt(binomK, 10) || 0
    const p = parseFloat(binomP) || 0.5
    try {
      const pmf = binomialPMF(n, k, p)
      const cdf = binomialCDF(n, k, p)
      copyVal = `P(X=${k}) = ${pmf.toFixed(6)}, P(X<=${k}) = ${cdf.toFixed(6)}`
      binomData = { n, k, p, pmf, cdf }
    } catch (err: unknown) {
      calcError = err instanceof Error ? err.message : 'Binomial calculation error'
    }
  } else if (tab === 'normal') {
    const x = parseFloat(normX) || 0
    const mean = parseFloat(normMean) || 0
    const std = parseFloat(normStd) || 1
    const a = parseFloat(normA) || -1
    const b = parseFloat(normB) || 1

    try {
      const pdf = normalPDF(x, mean, std)
      const cdf = normalCDF(x, mean, std)
      const interval = normalInterval(a, b, mean, std)
      copyVal = `P(X <= ${x}) = ${cdf.toFixed(6)}`
      normData = { x, mean, std, pdf, cdf, a, b, interval }
    } catch (err: unknown) {
      calcError = err instanceof Error ? err.message : 'Normal distribution calculation error'
    }
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Probability Calculator">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <Dice5 size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Probability & Distributions</h2>
            <span className={styles.modeSubtitle}>Permutations, combinations, binomial, and normal distributions</span>
          </div>
        </div>

        <div className={styles.actionsBar}>
          <button type="button" className={styles.secondaryBtn} onClick={() => copyText(copyVal)}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className={styles.subTabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${tab === 'combinatorics' ? styles.tabBtnActive : ''}`}
          onClick={() => setTab('combinatorics')}
        >
          Combinatorics (nPr, nCr)
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${tab === 'binomial' ? styles.tabBtnActive : ''}`}
          onClick={() => setTab('binomial')}
        >
          Binomial Distribution
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${tab === 'normal' ? styles.tabBtnActive : ''}`}
          onClick={() => setTab('normal')}
        >
          Normal Distribution
        </button>
      </div>

      {tab === 'combinatorics' && (
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Items (n) and Choices (r)</span>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Total items n</label>
              <input type="number" className={styles.textInput} value={combN} onChange={(e) => setCombN(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Selected items r</label>
              <input type="number" className={styles.textInput} value={combR} onChange={(e) => setCombR(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {tab === 'binomial' && (
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Trials (n), Successes (k), Probability (p)</span>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Number of trials n</label>
              <input type="number" className={styles.textInput} value={binomN} onChange={(e) => setBinomN(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Successes k</label>
              <input type="number" className={styles.textInput} value={binomK} onChange={(e) => setBinomK(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Probability p (0 to 1)</label>
              <input type="number" step="0.05" className={styles.textInput} value={binomP} onChange={(e) => setBinomP(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {tab === 'normal' && (
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Normal Distribution Parameters</span>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Target value x</label>
              <input type="number" step="0.1" className={styles.textInput} value={normX} onChange={(e) => setNormX(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Mean μ</label>
              <input type="number" className={styles.textInput} value={normMean} onChange={(e) => setNormMean(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Std Dev σ</label>
              <input type="number" min="0.001" step="0.1" className={styles.textInput} value={normStd} onChange={(e) => setNormStd(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Interval a</label>
              <input type="number" className={styles.textInput} value={normA} onChange={(e) => setNormA(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Interval b</label>
              <input type="number" className={styles.textInput} value={normB} onChange={(e) => setNormB(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {calcError && <div style={{ color: 'var(--text-error)', fontSize: '0.85rem' }}>{calcError}</div>}

      {combData && (
        <div className={styles.resultBox}>
          <span className={styles.cardTitle}>Combinatorics Results</span>
          <div className={styles.resultValue}>
            C({combData.n}, {combData.r}) = {combData.ncr.toLocaleString()} | P({combData.n}, {combData.r}) = {combData.npr.toLocaleString()}
          </div>
          <ul className={styles.resultSteps}>
            <li>Combinations nCr = n! / (r! · (n - r)!) = {combData.ncr.toLocaleString()}</li>
            <li>Permutations nPr = n! / (n - r)! = {combData.npr.toLocaleString()}</li>
            {Number.isFinite(combData.nFact) && <li>Factorial {combData.n}! = {combData.nFact.toLocaleString()}</li>}
          </ul>
        </div>
      )}

      {binomData && (
        <div className={styles.resultBox}>
          <span className={styles.cardTitle}>Binomial Distribution B(n={binomData.n}, p={binomData.p})</span>
          <div className={styles.resultValue}>
            P(X = {binomData.k}) = {binomData.pmf.toFixed(6)} ({(binomData.pmf * 100).toFixed(2)}%)
          </div>
          <ul className={styles.resultSteps}>
            <li>Exact Probability P(X = {binomData.k}) = C({binomData.n},{binomData.k}) · {binomData.p}^{binomData.k} · (1-{binomData.p})^{binomData.n - binomData.k} = {binomData.pmf.toFixed(6)}</li>
            <li>Cumulative Probability P(X ≤ {binomData.k}) = {binomData.cdf.toFixed(6)} ({(binomData.cdf * 100).toFixed(2)}%)</li>
            <li>Mean μ = n · p = {(binomData.n * binomData.p).toFixed(4)}</li>
            <li>Variance σ² = n · p · (1 - p) = {(binomData.n * binomData.p * (1 - binomData.p)).toFixed(4)}</li>
          </ul>
        </div>
      )}

      {normData && (
        <div className={styles.resultBox}>
          <span className={styles.cardTitle}>Normal Distribution N(μ={normData.mean}, σ={normData.std})</span>
          <div className={styles.resultValue}>
            P(X ≤ {normData.x}) = {normData.cdf.toFixed(6)} ({(normData.cdf * 100).toFixed(2)}%)
          </div>
          <ul className={styles.resultSteps}>
            <li>Standard Score Z = (x - μ) / σ = {((normData.x - normData.mean) / normData.std).toFixed(4)}</li>
            <li>Probability Density PDF f({normData.x}) = {normData.pdf.toFixed(6)}</li>
            <li>Cumulative CDF P(X ≤ {normData.x}) = {normData.cdf.toFixed(6)}</li>
            <li>Interval Probability P({normData.a} ≤ X ≤ {normData.b}) = {normData.interval.toFixed(6)} ({(normData.interval * 100).toFixed(2)}%)</li>
          </ul>
        </div>
      )}
    </div>
  )
}
