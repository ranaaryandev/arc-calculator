import React, { useState } from 'react'
import { Compass, Check, Copy } from 'lucide-react'
import {
  complex,
  complexAdd,
  complexSubtract,
  complexMultiply,
  complexDivide,
  complexModulus,
  complexArgument,
  complexConjugate,
  complexPower,
  complexFromPolar,
  complexToPolar,
  formatComplex,
  type Complex,
} from '../../solvers/complex'
import styles from './Modes.module.css'

export const ComplexCalculatorView: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [powerN, setPowerN] = useState('2')

  // z1
  const [z1Re, setZ1Re] = useState('3')
  const [z1Im, setZ1Im] = useState('4')

  // z2
  const [z2Re, setZ2Re] = useState('1')
  const [z2Im, setZ2Im] = useState('-2')

  const [resComplex, setResComplex] = useState<Complex | null>(null)
  const [statusMsg, setStatusMsg] = useState('Select an operation below')

  const getZ1 = (): Complex => complex(parseFloat(z1Re) || 0, parseFloat(z1Im) || 0)
  const getZ2 = (): Complex => complex(parseFloat(z2Re) || 0, parseFloat(z2Im) || 0)

  const handleOp = (op: 'add' | 'sub' | 'mul' | 'div' | 'conj1' | 'mod1' | 'pow1') => {
    try {
      const z1 = getZ1()
      const z2 = getZ2()

      switch (op) {
        case 'add':
          setResComplex(complexAdd(z1, z2))
          setStatusMsg('Result: z₁ + z₂')
          break
        case 'sub':
          setResComplex(complexSubtract(z1, z2))
          setStatusMsg('Result: z₁ − z₂')
          break
        case 'mul':
          setResComplex(complexMultiply(z1, z2))
          setStatusMsg('Result: z₁ × z₂')
          break
        case 'div':
          setResComplex(complexDivide(z1, z2))
          setStatusMsg('Result: z₁ / z₂')
          break
        case 'conj1':
          setResComplex(complexConjugate(z1))
          setStatusMsg('Result: Conjugate z̄₁')
          break
        case 'mod1': {
          const mod = complexModulus(z1)
          const arg = complexArgument(z1)
          setResComplex(null)
          setStatusMsg(`|z₁| = ${mod.toFixed(4)},  arg(z₁) = ${arg.deg.toFixed(2)}° (${arg.rad.toFixed(4)} rad)`)
          break
        }
        case 'pow1': {
          const n = parseFloat(powerN) || 2
          setResComplex(complexPower(z1, n))
          setStatusMsg(`Result: z₁^${n}`)
          break
        }
      }
    } catch (err: unknown) {
      setResComplex(null)
      setStatusMsg(err instanceof Error ? err.message : 'Complex calculation error.')
    }
  }

  const loadPolarZ1 = (r: number, thetaDeg: number) => {
    const c = complexFromPolar(r, thetaDeg)
    setZ1Re(Number(c.re.toFixed(4)).toString())
    setZ1Im(Number(c.im.toFixed(4)).toString())
  }

  const copyResult = () => {
    let str = statusMsg
    if (resComplex) {
      const pol = complexToPolar(resComplex)
      str = `${formatComplex(resComplex)}  |  Polar: ${pol.r.toFixed(4)} ∠ ${pol.thetaDeg.toFixed(2)}°`
    }
    navigator.clipboard?.writeText(str)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const polarOut = resComplex ? complexToPolar(resComplex) : null

  return (
    <div className={styles.modeShell} role="region" aria-label="Complex Numbers Calculator">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <Compass size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Complex Numbers</h2>
            <span className={styles.modeSubtitle}>Rectangular (a + bi), Polar (r∠θ), powers, and conjugates</span>
          </div>
        </div>

        <button type="button" className={styles.secondaryBtn} onClick={copyResult}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Input Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* z1 */}
        <div className={styles.cardSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.cardTitle}>Complex Number z₁</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {complexToPolar(getZ1()).r.toFixed(2)} ∠ {complexToPolar(getZ1()).thetaDeg.toFixed(1)}°
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Real (a)</label>
              <input type="number" className={styles.textInput} value={z1Re} onChange={(e) => setZ1Re(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Imaginary (b)</label>
              <input type="number" className={styles.textInput} value={z1Im} onChange={(e) => setZ1Im(e.target.value)} />
            </div>
          </div>
          <div className={styles.actionsBar}>
            <button type="button" className={styles.secondaryBtn} onClick={() => loadPolarZ1(5, 53.13)}>
              Load Polar 5∠53.1°
            </button>
          </div>
        </div>

        {/* z2 */}
        <div className={styles.cardSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.cardTitle}>Complex Number z₂</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {complexToPolar(getZ2()).r.toFixed(2)} ∠ {complexToPolar(getZ2()).thetaDeg.toFixed(1)}°
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Real (c)</label>
              <input type="number" className={styles.textInput} value={z2Re} onChange={(e) => setZ2Re(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Imaginary (d)</label>
              <input type="number" className={styles.textInput} value={z2Im} onChange={(e) => setZ2Im(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Operation Actions */}
      <div className={styles.actionsBar}>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('add')}>
          z₁ + z₂
        </button>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('sub')}>
          z₁ − z₂
        </button>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('mul')}>
          z₁ × z₂
        </button>
        <button type="button" className={styles.primaryBtn} onClick={() => handleOp('div')}>
          z₁ / z₂
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('mod1')}>
          |z₁| & arg(z₁)
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('conj1')}>
          Conjugate z̄₁
        </button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <input
            type="number"
            className={styles.textInput}
            style={{ width: '55px', padding: '5px' }}
            value={powerN}
            onChange={(e) => setPowerN(e.target.value)}
            aria-label="Power exponent n"
          />
          <button type="button" className={styles.secondaryBtn} onClick={() => handleOp('pow1')}>
            z₁ⁿ
          </button>
        </div>
      </div>

      {/* Result Display */}
      <div className={styles.resultBox}>
        <span className={styles.cardTitle}>{statusMsg}</span>
        {resComplex && (
          <div>
            <div className={styles.resultValue}>{formatComplex(resComplex)}</div>
            {polarOut && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Polar: {polarOut.r.toFixed(4)} ∠ {polarOut.thetaDeg.toFixed(2)}° ({polarOut.thetaRad.toFixed(4)} rad)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
