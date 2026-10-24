import React, { useState } from 'react'
import { Grid, Check, Copy, ArrowRightLeft } from 'lucide-react'
import {
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  multiplyScalar,
  matrixDeterminant,
  matrixInverse,
  transposeMatrix,
  matrixTrace,
  type Matrix,
} from '../../solvers/matrices'
import styles from './Modes.module.css'

export const MatrixCalculatorView: React.FC = () => {
  const [dim, setDim] = useState<2 | 3>(2)
  const [copied, setCopied] = useState(false)
  const [scalar, setScalar] = useState('2')

  const [matA, setMatA] = useState<Matrix>([
    [1, 2],
    [3, 4],
  ])
  const [matB, setMatB] = useState<Matrix>([
    [5, 6],
    [7, 8],
  ])

  const [resultMat, setResultMat] = useState<Matrix | null>(null)
  const [scalarResult, setScalarResult] = useState<number | null>(null)
  const [statusMsg, setStatusMsg] = useState<string>('Select an operation below.')

  const handleDimChange = (newDim: 2 | 3) => {
    setDim(newDim)
    if (newDim === 2) {
      setMatA([[1, 2], [3, 4]])
      setMatB([[5, 6], [7, 8]])
    } else {
      setMatA([
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0],
      ])
      setMatB([
        [2, 0, -1],
        [1, 3, 2],
        [0, -2, 1],
      ])
    }
    setResultMat(null)
    setScalarResult(null)
    setStatusMsg('Dimension updated.')
  }

  const updateCell = (mat: 'A' | 'B', r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0
    if (mat === 'A') {
      const next = matA.map((row) => [...row])
      next[r][c] = num
      setMatA(next)
    } else {
      const next = matB.map((row) => [...row])
      next[r][c] = num
      setMatB(next)
    }
  }

  const handleOp = (op: 'add' | 'sub' | 'mul' | 'detA' | 'invA' | 'transA' | 'traceA' | 'scalarA') => {
    try {
      setScalarResult(null)
      switch (op) {
        case 'add':
          setResultMat(addMatrices(matA, matB))
          setStatusMsg('Result: Matrix A + Matrix B')
          break
        case 'sub':
          setResultMat(subtractMatrices(matA, matB))
          setStatusMsg('Result: Matrix A − Matrix B')
          break
        case 'mul':
          setResultMat(multiplyMatrices(matA, matB))
          setStatusMsg('Result: Matrix A × Matrix B')
          break
        case 'detA': {
          const d = matrixDeterminant(matA)
          setResultMat(null)
          setScalarResult(d)
          setStatusMsg(`Determinant det(A) = ${d}`)
          break
        }
        case 'invA':
          setResultMat(matrixInverse(matA))
          setStatusMsg('Result: Inverse Matrix A⁻¹')
          break
        case 'transA':
          setResultMat(transposeMatrix(matA))
          setStatusMsg('Result: Transpose Matrix Aᵀ')
          break
        case 'traceA': {
          const tr = matrixTrace(matA)
          setResultMat(null)
          setScalarResult(tr)
          setStatusMsg(`Trace Tr(A) = ${tr}`)
          break
        }
        case 'scalarA': {
          const s = parseFloat(scalar) || 1
          setResultMat(multiplyScalar(matA, s))
          setStatusMsg(`Result: ${s} · Matrix A`)
          break
        }
      }
    } catch (err: unknown) {
      setResultMat(null)
      setScalarResult(null)
      setStatusMsg(err instanceof Error ? err.message : 'Matrix calculation error.')
    }
  }

  const copyResult = () => {
    let str = ''
    if (scalarResult !== null) str = String(scalarResult)
    else if (resultMat) {
      str = resultMat.map((r) => r.join('\t')).join('\n')
    }
    if (str) {
      navigator.clipboard?.writeText(str)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const swapAB = () => {
    const temp = matA
    setMatA(matB)
    setMatB(temp)
    setStatusMsg('Swapped Matrix A and Matrix B.')
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Matrix Calculator">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <Grid size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Matrix Calculator</h2>
            <span className={styles.modeSubtitle}>Arithmetic, determinant, inversion, transpose, and scalar multiplication</span>
          </div>
        </div>

        <div className={styles.actionsBar}>
          <div className={styles.subTabs} style={{ border: 'none', padding: 0 }}>
            <button
              type="button"
              className={`${styles.tabBtn} ${dim === 2 ? styles.tabBtnActive : ''}`}
              onClick={() => handleDimChange(2)}
            >
              2×2
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${dim === 3 ? styles.tabBtnActive : ''}`}
              onClick={() => handleDimChange(3)}
            >
              3×3
            </button>
          </div>
        </div>
      </div>

      {/* Matrices Input Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Matrix A */}
        <div className={styles.cardSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.cardTitle}>Matrix A</span>
            <button type="button" className={styles.secondaryBtn} onClick={swapAB} title="Swap A and B">
              <ArrowRightLeft size={13} />
              <span>Swap</span>
            </button>
          </div>
          <div className={styles.matrixGrid}>
            {matA.map((row, r) => (
              <div key={r} style={{ display: 'flex', gap: '6px' }}>
                {row.map((val, c) => (
                  <input
                    key={c}
                    type="number"
                    className={styles.matrixCellInput}
                    value={val}
                    onChange={(e) => updateCell('A', r, c, e.target.value)}
                    aria-label={`Matrix A Row ${r + 1} Col ${c + 1}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Matrix B */}
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Matrix B</span>
          <div className={styles.matrixGrid}>
            {matB.map((row, r) => (
              <div key={r} style={{ display: 'flex', gap: '6px' }}>
                {row.map((val, c) => (
                  <input
                    key={c}
                    type="number"
                    className={styles.matrixCellInput}
                    value={val}
                    onChange={(e) => updateCell('B', r, c, e.target.value)}
                    aria-label={`Matrix B Row ${r + 1} Col ${c + 1}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operation Controls */}
      <div className={styles.actionsBar}>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('add')}>
          A + B
        </button>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('sub')}>
          A − B
        </button>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('mul')}>
          A × B
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('detA')}>
          det(A)
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('invA')}>
          A⁻¹
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('transA')}>
          Aᵀ
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('traceA')}>
          Tr(A)
        </button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <input
            type="number"
            className={styles.textInput}
            style={{ width: '60px', padding: '5px' }}
            value={scalar}
            onChange={(e) => setScalar(e.target.value)}
            aria-label="Scalar multiplier"
          />
          <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('scalarA')}>
            k · A
          </button>
        </div>
      </div>

      {/* Output Card */}
      <div className={styles.resultBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={styles.cardTitle}>{statusMsg}</span>
          {(resultMat || scalarResult !== null) && (
            <button type="button" className={styles.secondaryBtn} onClick={copyResult}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {scalarResult !== null && <div className={styles.resultValue}>{scalarResult}</div>}

        {resultMat && (
          <div className={styles.matrixGrid} style={{ marginTop: '8px' }}>
            {resultMat.map((row, r) => (
              <div key={r} style={{ display: 'flex', gap: '6px' }}>
                {row.map((val, c) => (
                  <div
                    key={c}
                    className={styles.matrixCellInput}
                    style={{ background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {val.toFixed(3).replace(/\.?0+$/, '')}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
