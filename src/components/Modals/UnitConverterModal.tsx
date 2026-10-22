import React, { useState, useEffect } from 'react'
import { X, ArrowRightLeft, CornerDownLeft } from 'lucide-react'
import styles from './Modals.module.css'

interface UnitConverterModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertResult: (val: string) => void
}

type Category = 'angle' | 'temp' | 'length' | 'mass'

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
  onInsertResult,
}) => {
  const [category, setCategory] = useState<Category>('angle')
  const [valFrom, setValFrom] = useState('180')
  const [unitFrom, setUnitFrom] = useState('deg')
  const [unitTo, setUnitTo] = useState('rad')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const calculateConversion = (): string => {
    const val = parseFloat(valFrom)
    if (Number.isNaN(val)) return '0'

    if (category === 'angle') {
      if (unitFrom === 'deg' && unitTo === 'rad') {
        return ((val * Math.PI) / 180).toFixed(6).replace(/\.?0+$/, '')
      }
      if (unitFrom === 'rad' && unitTo === 'deg') {
        return ((val * 180) / Math.PI).toFixed(6).replace(/\.?0+$/, '')
      }
      return val.toString()
    }

    if (category === 'temp') {
      let celsius = val
      if (unitFrom === 'f') celsius = (val - 32) * (5 / 9)
      if (unitFrom === 'k') celsius = val - 273.15

      let target = celsius
      if (unitTo === 'f') target = (celsius * 9) / 5 + 32
      if (unitTo === 'k') target = celsius + 273.15
      return target.toFixed(4).replace(/\.?0+$/, '')
    }

    if (category === 'length') {
      // Base: meters
      const toMeters: Record<string, number> = {
        m: 1,
        cm: 0.01,
        ft: 0.3048,
        in: 0.0254,
      }
      const meters = val * (toMeters[unitFrom] || 1)
      const converted = meters / (toMeters[unitTo] || 1)
      return converted.toFixed(6).replace(/\.?0+$/, '')
    }

    if (category === 'mass') {
      // Base: kg
      const toKg: Record<string, number> = {
        kg: 1,
        g: 0.001,
        lb: 0.45359237,
        oz: 0.02834952,
      }
      const kg = val * (toKg[unitFrom] || 1)
      const converted = kg / (toKg[unitTo] || 1)
      return converted.toFixed(6).replace(/\.?0+$/, '')
    }

    return '0'
  }

  const convertedResult = calculateConversion()

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat)
    if (cat === 'angle') {
      setUnitFrom('deg')
      setUnitTo('rad')
      setValFrom('180')
    } else if (cat === 'temp') {
      setUnitFrom('c')
      setUnitTo('f')
      setValFrom('100')
    } else if (cat === 'length') {
      setUnitFrom('m')
      setUnitTo('ft')
      setValFrom('1')
    } else if (cat === 'mass') {
      setUnitFrom('kg')
      setUnitTo('lb')
      setValFrom('1')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Unit Converter">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <ArrowRightLeft size={18} aria-hidden="true" />
            <span>Unit Converter</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close converter">
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Category Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {(['angle', 'temp', 'length', 'mass'] as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.kbd} ${category === cat ? 'active' : ''}`}
                style={{
                  padding: '6px 4px',
                  textTransform: 'capitalize',
                  background: category === cat ? 'var(--accent-subtle)' : 'var(--bg-surface-elevated)',
                  color: category === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderColor: category === cat ? 'var(--accent-border)' : 'var(--border-subtle)',
                }}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Input & Output */}
          <div className={styles.converterGroup}>
            <div className={styles.converterInputs}>
              <div>
                <input
                  type="number"
                  className={styles.converterInput}
                  value={valFrom}
                  onChange={(e) => setValFrom(e.target.value)}
                  aria-label="Input value"
                />
                <select
                  className={styles.converterSelect}
                  value={unitFrom}
                  onChange={(e) => setUnitFrom(e.target.value)}
                  aria-label="From unit"
                >
                  {category === 'angle' && (
                    <>
                      <option value="deg">Degrees (°)</option>
                      <option value="rad">Radians (rad)</option>
                    </>
                  )}
                  {category === 'temp' && (
                    <>
                      <option value="c">Celsius (°C)</option>
                      <option value="f">Fahrenheit (°F)</option>
                      <option value="k">Kelvin (K)</option>
                    </>
                  )}
                  {category === 'length' && (
                    <>
                      <option value="m">Meters (m)</option>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="ft">Feet (ft)</option>
                      <option value="in">Inches (in)</option>
                    </>
                  )}
                  {category === 'mass' && (
                    <>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="lb">Pounds (lb)</option>
                      <option value="oz">Ounces (oz)</option>
                    </>
                  )}
                </select>
              </div>

              <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>=</span>

              <div>
                <input
                  type="text"
                  readOnly
                  className={styles.converterInput}
                  value={convertedResult}
                  aria-label="Converted output value"
                />
                <select
                  className={styles.converterSelect}
                  value={unitTo}
                  onChange={(e) => setUnitTo(e.target.value)}
                  aria-label="To unit"
                >
                  {category === 'angle' && (
                    <>
                      <option value="rad">Radians (rad)</option>
                      <option value="deg">Degrees (°)</option>
                    </>
                  )}
                  {category === 'temp' && (
                    <>
                      <option value="f">Fahrenheit (°F)</option>
                      <option value="c">Celsius (°C)</option>
                      <option value="k">Kelvin (K)</option>
                    </>
                  )}
                  {category === 'length' && (
                    <>
                      <option value="ft">Feet (ft)</option>
                      <option value="in">Inches (in)</option>
                      <option value="m">Meters (m)</option>
                      <option value="cm">Centimeters (cm)</option>
                    </>
                  )}
                  {category === 'mass' && (
                    <>
                      <option value="lb">Pounds (lb)</option>
                      <option value="oz">Ounces (oz)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button
                type="button"
                className={styles.kbd}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  borderColor: 'var(--accent-border)',
                }}
                onClick={() => {
                  onInsertResult(convertedResult)
                  onClose()
                }}
              >
                <CornerDownLeft size={13} /> Insert Value into Calculator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
