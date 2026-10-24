import React, { useState } from 'react'
import { EqualNot, Check, Copy, RotateCcw } from 'lucide-react'
import { solveLinear, solveQuadratic, solveSystem2x2, solveSystem3x3 } from '../../solvers/equations'
import styles from './Modes.module.css'

interface EquationSolverViewProps {
  onInsertResult?: (val: string) => void
}

type EqType = 'quadratic' | 'linear' | 'system2x2' | 'system3x3'

export const EquationSolverView: React.FC<EquationSolverViewProps> = ({ onInsertResult }) => {
  const [eqType, setEqType] = useState<EqType>('quadratic')
  const [copied, setCopied] = useState(false)

  // Linear: ax + b = 0
  const [linA, setLinA] = useState('2')
  const [linB, setLinB] = useState('-8')

  // Quadratic: ax^2 + bx + c = 0
  const [quadA, setQuadA] = useState('1')
  const [quadB, setQuadB] = useState('-5')
  const [quadC, setQuadC] = useState('6')

  // System 2x2: a1 x + b1 y = c1; a2 x + b2 y = c2
  const [s2a1, setS2a1] = useState('2')
  const [s2b1, setS2b1] = useState('1')
  const [s2c1, setS2c1] = useState('5')
  const [s2a2, setS2a2] = useState('1')
  const [s2b2, setS2b2] = useState('-1')
  const [s2c2, setS2c2] = useState('1')

  // System 3x3
  const [s3, setS3] = useState<number[][]>([
    [1, 1, 1],
    [0, 2, 5],
    [2, 5, -1],
  ])
  const [s3b, setS3b] = useState<number[]>([6, -4, 27])

  const copyText = (txt: string) => {
    navigator.clipboard?.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Calculate live results based on active equation sub-tab
  let resultJSX: React.ReactNode = null
  let copyVal = ''

  if (eqType === 'linear') {
    const a = parseFloat(linA) || 0
    const b = parseFloat(linB) || 0
    const res = solveLinear(a, b)
    copyVal = res.solution !== undefined ? String(res.solution) : res.explanation
    resultJSX = (
      <div className={styles.resultBox}>
        <span className={styles.cardTitle}>Linear Solution</span>
        <div className={styles.resultValue}>
          {res.status === 'unique' ? `x = ${res.solution}` : res.explanation}
        </div>
        <ul className={styles.resultSteps}>
          <li>Formula: ax + b = 0 ⟹ x = -b / a</li>
          <li>Substituted: ({a})x + ({b}) = 0</li>
          <li>{res.explanation}</li>
        </ul>
      </div>
    )
  } else if (eqType === 'quadratic') {
    const a = parseFloat(quadA) || 0
    const b = parseFloat(quadB) || 0
    const c = parseFloat(quadC) || 0
    const res = solveQuadratic(a, b, c)
    copyVal = res.roots.map((r) => r.label).join(', ')
    resultJSX = (
      <div className={styles.resultBox}>
        <span className={styles.cardTitle}>Quadratic Roots & Vertex</span>
        <div className={styles.resultValue}>
          {res.roots.map((r) => r.label).join('  |  ')}
        </div>
        <ul className={styles.resultSteps}>
          <li>Discriminant Δ = b² - 4ac = ({b})² - 4({a})({c}) = {res.discriminant}</li>
          <li>Vertex: ({res.vertex.x}, {res.vertex.y})</li>
          <li>{res.explanation}</li>
        </ul>
      </div>
    )
  } else if (eqType === 'system2x2') {
    const a1 = parseFloat(s2a1) || 0
    const b1 = parseFloat(s2b1) || 0
    const c1 = parseFloat(s2c1) || 0
    const a2 = parseFloat(s2a2) || 0
    const b2 = parseFloat(s2b2) || 0
    const c2 = parseFloat(s2c2) || 0
    const res = solveSystem2x2(a1, b1, c1, a2, b2, c2)
    copyVal = res.solution ? `x = ${res.solution.x}, y = ${res.solution.y}` : res.explanation
    resultJSX = (
      <div className={styles.resultBox}>
        <span className={styles.cardTitle}>2×2 Linear System Solution</span>
        <div className={styles.resultValue}>
          {res.solution ? `x = ${res.solution.x}, y = ${res.solution.y}` : res.explanation}
        </div>
        <ul className={styles.resultSteps}>
          <li>Determinant D = a₁b₂ - a₂b₁ = {res.determinant}</li>
          <li>{res.explanation}</li>
        </ul>
      </div>
    )
  } else if (eqType === 'system3x3') {
    const res = solveSystem3x3(s3, s3b)
    copyVal = res.solution ? `x = ${res.solution.x}, y = ${res.solution.y}, z = ${res.solution.z}` : res.explanation
    resultJSX = (
      <div className={styles.resultBox}>
        <span className={styles.cardTitle}>3×3 Linear System Solution</span>
        <div className={styles.resultValue}>
          {res.solution ? `x = ${res.solution.x}, y = ${res.solution.y}, z = ${res.solution.z}` : res.explanation}
        </div>
        <ul className={styles.resultSteps}>
          <li>Solved using Gaussian Elimination with partial pivoting</li>
          <li>{res.explanation}</li>
        </ul>
      </div>
    )
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Equation Solver">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <EqualNot size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Equation Solver</h2>
            <span className={styles.modeSubtitle}>Analytical real & complex solutions with worked steps</span>
          </div>
        </div>

        <div className={styles.actionsBar}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => copyText(copyVal)}
            title="Copy solution"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {onInsertResult && copyVal && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => onInsertResult(copyVal)}
              title="Insert into calculation"
            >
              Insert
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs */}
      <div className={styles.subTabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={eqType === 'quadratic'}
          className={`${styles.tabBtn} ${eqType === 'quadratic' ? styles.tabBtnActive : ''}`}
          onClick={() => setEqType('quadratic')}
        >
          Quadratic (ax² + bx + c = 0)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={eqType === 'linear'}
          className={`${styles.tabBtn} ${eqType === 'linear' ? styles.tabBtnActive : ''}`}
          onClick={() => setEqType('linear')}
        >
          Linear (ax + b = 0)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={eqType === 'system2x2'}
          className={`${styles.tabBtn} ${eqType === 'system2x2' ? styles.tabBtnActive : ''}`}
          onClick={() => setEqType('system2x2')}
        >
          2×2 System
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={eqType === 'system3x3'}
          className={`${styles.tabBtn} ${eqType === 'system3x3' ? styles.tabBtnActive : ''}`}
          onClick={() => setEqType('system3x3')}
        >
          3×3 System
        </button>
      </div>

      {/* Inputs Form */}
      {eqType === 'quadratic' && (
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Coefficients (ax² + bx + c = 0)</span>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Coefficient a</label>
              <input
                type="number"
                className={styles.textInput}
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
                aria-label="Coefficient a"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Coefficient b</label>
              <input
                type="number"
                className={styles.textInput}
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
                aria-label="Coefficient b"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Constant c</label>
              <input
                type="number"
                className={styles.textInput}
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
                aria-label="Constant c"
              />
            </div>
          </div>
          <div className={styles.actionsBar}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setQuadA('1')
                setQuadB('-5')
                setQuadC('6')
              }}
            >
              Preset: x² - 5x + 6
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setQuadA('1')
                setQuadB('0')
                setQuadC('1')
              }}
            >
              Preset: x² + 1 (Complex)
            </button>
          </div>
        </div>
      )}

      {eqType === 'linear' && (
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Coefficients (ax + b = 0)</span>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Coefficient a</label>
              <input
                type="number"
                className={styles.textInput}
                value={linA}
                onChange={(e) => setLinA(e.target.value)}
                aria-label="Linear coefficient a"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Constant b</label>
              <input
                type="number"
                className={styles.textInput}
                value={linB}
                onChange={(e) => setLinB(e.target.value)}
                aria-label="Linear constant b"
              />
            </div>
          </div>
        </div>
      )}

      {eqType === 'system2x2' && (
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>System 1: a₁x + b₁y = c₁  |  System 2: a₂x + b₂y = c₂</span>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>a₁</label>
              <input type="number" className={styles.textInput} value={s2a1} onChange={(e) => setS2a1(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>b₁</label>
              <input type="number" className={styles.textInput} value={s2b1} onChange={(e) => setS2b1(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>c₁ (RHS)</label>
              <input type="number" className={styles.textInput} value={s2c1} onChange={(e) => setS2c1(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>a₂</label>
              <input type="number" className={styles.textInput} value={s2a2} onChange={(e) => setS2a2(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>b₂</label>
              <input type="number" className={styles.textInput} value={s2b2} onChange={(e) => setS2b2(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>c₂ (RHS)</label>
              <input type="number" className={styles.textInput} value={s2c2} onChange={(e) => setS2c2(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {eqType === 'system3x3' && (
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>3×3 Matrix [A | b]</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {s3.map((row, r) => (
              <div key={r} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {row.map((val, c) => (
                  <input
                    key={c}
                    type="number"
                    className={styles.matrixCellInput}
                    value={val}
                    onChange={(e) => {
                      const next = s3.map((rArr) => [...rArr])
                      next[r][c] = parseFloat(e.target.value) || 0
                      setS3(next)
                    }}
                    aria-label={`Row ${r + 1} Col ${c + 1}`}
                  />
                ))}
                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>=</span>
                <input
                  type="number"
                  className={styles.matrixCellInput}
                  value={s3b[r]}
                  onChange={(e) => {
                    const nextB = [...s3b]
                    nextB[r] = parseFloat(e.target.value) || 0
                    setS3b(nextB)
                  }}
                  aria-label={`RHS Row ${r + 1}`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              setS3([
                [1, 1, 1],
                [0, 2, 5],
                [2, 5, -1],
              ])
              setS3b([6, -4, 27])
            }}
          >
            <RotateCcw size={13} />
            <span>Reset 3×3 Example</span>
          </button>
        </div>
      )}

      {/* Result Display */}
      {resultJSX}
    </div>
  )
}
