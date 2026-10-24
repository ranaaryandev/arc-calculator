import React, { useState } from 'react'
import { Navigation, Check, Copy } from 'lucide-react'
import {
  vectorMagnitude,
  vectorAdd,
  vectorSubtract,
  vectorDot,
  vectorCross3D,
  vectorAngle,
  vectorUnit,
  vectorProjection,
  type Vector,
} from '../../solvers/vectors'
import styles from './Modes.module.css'

export const VectorCalculatorView: React.FC = () => {
  const [is3D, setIs3D] = useState(true)
  const [copied, setCopied] = useState(false)

  const [ux, setUx] = useState('1')
  const [uy, setUy] = useState('2')
  const [uz, setUz] = useState('3')

  const [vx, setVx] = useState('4')
  const [vy, setVy] = useState('-5')
  const [vz, setVz] = useState('6')

  const [resultText, setResultText] = useState('')
  const [steps, setSteps] = useState<string[]>([])

  const getU = (): Vector => {
    const x = parseFloat(ux) || 0
    const y = parseFloat(uy) || 0
    if (!is3D) return [x, y]
    const z = parseFloat(uz) || 0
    return [x, y, z]
  }

  const getV = (): Vector => {
    const x = parseFloat(vx) || 0
    const y = parseFloat(vy) || 0
    if (!is3D) return [x, y]
    const z = parseFloat(vz) || 0
    return [x, y, z]
  }

  const formatVec = (v: Vector): string => {
    return `[${v.map((val) => Number(val.toFixed(4))).join(', ')}]`
  }

  const handleOp = (op: 'add' | 'sub' | 'dot' | 'cross' | 'magU' | 'angle' | 'unitU' | 'proj') => {
    try {
      const u = getU()
      const v = getV()

      switch (op) {
        case 'add': {
          const res = vectorAdd(u, v)
          setResultText(`u + v = ${formatVec(res)}`)
          setSteps([`Vector addition component by component`, `Result: ${formatVec(res)}`])
          break
        }
        case 'sub': {
          const res = vectorSubtract(u, v)
          setResultText(`u − v = ${formatVec(res)}`)
          setSteps([`Vector subtraction component by component`, `Result: ${formatVec(res)}`])
          break
        }
        case 'dot': {
          const dot = vectorDot(u, v)
          setResultText(`u · v = ${dot}`)
          setSteps([
            `Dot product: sum of products of corresponding components`,
            `Result scalar: ${dot}`,
          ])
          break
        }
        case 'cross': {
          if (!is3D) {
            setResultText('Cross product is defined for 3D vectors.')
            setSteps(['Switch to 3D mode above to calculate cross product.'])
            return
          }
          const cross = vectorCross3D(u as [number, number, number], v as [number, number, number])
          setResultText(`u × v = ${formatVec(cross)}`)
          setSteps([
            `3D Cross product: orthogonal vector perpendicular to both u and v`,
            `Result: ${formatVec(cross)}`,
          ])
          break
        }
        case 'magU': {
          const mU = vectorMagnitude(u)
          const mV = vectorMagnitude(v)
          setResultText(`||u|| = ${mU.toFixed(4)},  ||v|| = ${mV.toFixed(4)}`)
          setSteps([
            `Euclidean norm: √(x² + y²${is3D ? ' + z²' : ''})`,
            `||u|| = ${mU.toFixed(6)}`,
            `||v|| = ${mV.toFixed(6)}`,
          ])
          break
        }
        case 'angle': {
          const ang = vectorAngle(u, v)
          setResultText(`θ = ${ang.deg.toFixed(2)}° (${ang.rad.toFixed(4)} rad)`)
          setSteps([
            `Formula: cos(θ) = (u · v) / (||u|| · ||v||)`,
            `θ = ${ang.deg.toFixed(4)}°`,
          ])
          break
        }
        case 'unitU': {
          const unit = vectorUnit(u)
          setResultText(`û = ${formatVec(unit)}`)
          setSteps([`Normalized unit vector: u / ||u||`, `Result: ${formatVec(unit)}`])
          break
        }
        case 'proj': {
          const proj = vectorProjection(u, v)
          setResultText(`proj_v(u) = ${formatVec(proj)}`)
          setSteps([
            `Projection of u onto v: ((u · v) / ||v||²) · v`,
            `Result: ${formatVec(proj)}`,
          ])
          break
        }
      }
    } catch (err: unknown) {
      setResultText(err instanceof Error ? err.message : 'Vector calculation error.')
      setSteps([])
    }
  }

  const copyResult = () => {
    if (!resultText) return
    navigator.clipboard?.writeText(resultText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Vector Calculator">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <Navigation size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Vector Calculator</h2>
            <span className={styles.modeSubtitle}>2D & 3D vector algebra, dot product, cross product, and angles</span>
          </div>
        </div>

        <div className={styles.subTabs} style={{ border: 'none', padding: 0 }}>
          <button
            type="button"
            className={`${styles.tabBtn} ${!is3D ? styles.tabBtnActive : ''}`}
            onClick={() => setIs3D(false)}
          >
            2D Vectors
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${is3D ? styles.tabBtnActive : ''}`}
            onClick={() => setIs3D(true)}
          >
            3D Vectors
          </button>
        </div>
      </div>

      {/* Vectors Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Vector u */}
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Vector u</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>u_x</label>
              <input type="number" className={styles.textInput} value={ux} onChange={(e) => setUx(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>u_y</label>
              <input type="number" className={styles.textInput} value={uy} onChange={(e) => setUy(e.target.value)} />
            </div>
            {is3D && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>u_z</label>
                <input type="number" className={styles.textInput} value={uz} onChange={(e) => setUz(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* Vector v */}
        <div className={styles.cardSection}>
          <span className={styles.cardTitle}>Vector v</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>v_x</label>
              <input type="number" className={styles.textInput} value={vx} onChange={(e) => setVx(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>v_y</label>
              <input type="number" className={styles.textInput} value={vy} onChange={(e) => setVy(e.target.value)} />
            </div>
            {is3D && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>v_z</label>
                <input type="number" className={styles.textInput} value={vz} onChange={(e) => setVz(e.target.value)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionsBar}>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('add')}>
          u + v
        </button>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('sub')}>
          u − v
        </button>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('dot')}>
          u · v (Dot)
        </button>
        {is3D && (
          <button type="button" className={styles.primaryBtn} onClick={() => handleOp('cross')}>
            u × v (Cross)
          </button>
        )}
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('magU')}>
          ||u|| & ||v||
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('angle')}>
          Angle θ
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('unitU')}>
          Unit û
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('proj')}>
          proj_v(u)
        </button>
      </div>

      {/* Result */}
      <div className={styles.resultBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={styles.cardTitle}>Vector Result</span>
          {resultText && (
            <button type="button" className={styles.secondaryBtn} onClick={copyResult}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
        <div className={styles.resultValue}>{resultText || 'Select an operation above'}</div>
        {steps.length > 0 && (
          <ul className={styles.resultSteps}>
            {steps.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
