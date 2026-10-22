import React, { useState, useEffect } from 'react'
import { X, ArrowRightLeft, CornerDownLeft } from 'lucide-react'
import styles from './Modals.module.css'

interface UnitConverterModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertResult: (val: string) => void
}

type Category = 'angle' | 'temp' | 'length' | 'area' | 'volume' | 'mass' | 'speed'

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
      const toRad: Record<string, number> = {
        rad: 1,
        deg: Math.PI / 180,
        grad: Math.PI / 200,
        arcmin: Math.PI / 10800,
        arcsec: Math.PI / 648000,
      }
      const radians = val * (toRad[unitFrom] || 1)
      const converted = radians / (toRad[unitTo] || 1)
      return converted.toFixed(8).replace(/\.?0+$/, '')
    }

    if (category === 'temp') {
      let celsius = val
      if (unitFrom === 'f') celsius = (val - 32) * (5 / 9)
      if (unitFrom === 'k') celsius = val - 273.15
      if (unitFrom === 'r') celsius = (val - 491.67) * (5 / 9)

      let target = celsius
      if (unitTo === 'f') target = (celsius * 9) / 5 + 32
      if (unitTo === 'k') target = celsius + 273.15
      if (unitTo === 'r') target = (celsius + 273.15) * (9 / 5)
      return target.toFixed(4).replace(/\.?0+$/, '')
    }

    if (category === 'length') {
      const toMeters: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        ft: 0.3048,
        in: 0.0254,
        yd: 0.9144,
        mi: 1609.344,
        nmi: 1852,
      }
      const meters = val * (toMeters[unitFrom] || 1)
      const converted = meters / (toMeters[unitTo] || 1)
      return converted.toFixed(6).replace(/\.?0+$/, '')
    }

    if (category === 'area') {
      const toSqMeters: Record<string, number> = {
        m2: 1,
        km2: 1e6,
        ha: 10000,
        acre: 4046.85642,
        ft2: 0.092903,
        in2: 0.00064516,
        mi2: 2589988.11,
      }
      const sqMeters = val * (toSqMeters[unitFrom] || 1)
      const converted = sqMeters / (toSqMeters[unitTo] || 1)
      return converted.toFixed(6).replace(/\.?0+$/, '')
    }

    if (category === 'volume') {
      const toLiters: Record<string, number> = {
        l: 1,
        ml: 0.001,
        m3: 1000,
        gal: 3.78541,
        qt: 0.946353,
        pt: 0.473176,
        cup: 0.236588,
        ft3: 28.3168,
      }
      const liters = val * (toLiters[unitFrom] || 1)
      const converted = liters / (toLiters[unitTo] || 1)
      return converted.toFixed(6).replace(/\.?0+$/, '')
    }

    if (category === 'mass') {
      const toKg: Record<string, number> = {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.45359237,
        oz: 0.02834952,
        ton: 1000,
      }
      const kg = val * (toKg[unitFrom] || 1)
      const converted = kg / (toKg[unitTo] || 1)
      return converted.toFixed(6).replace(/\.?0+$/, '')
    }

    if (category === 'speed') {
      const toMps: Record<string, number> = {
        mps: 1,
        kmh: 0.277778,
        mph: 0.44704,
        knot: 0.514444,
        fps: 0.3048,
      }
      const mps = val * (toMps[unitFrom] || 1)
      const converted = mps / (toMps[unitTo] || 1)
      return converted.toFixed(4).replace(/\.?0+$/, '')
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
    } else if (cat === 'area') {
      setUnitFrom('m2')
      setUnitTo('ft2')
      setValFrom('10')
    } else if (cat === 'volume') {
      setUnitFrom('l')
      setUnitTo('gal')
      setValFrom('1')
    } else if (cat === 'mass') {
      setUnitFrom('kg')
      setUnitTo('lb')
      setValFrom('1')
    } else if (cat === 'speed') {
      setUnitFrom('kmh')
      setUnitTo('mph')
      setValFrom('100')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Unit Converter">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <ArrowRightLeft size={18} aria-hidden="true" />
            <span>Unit Converter Catalog</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close converter">
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Category Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {(['angle', 'temp', 'length', 'area', 'volume', 'mass', 'speed'] as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                className={styles.kbd}
                style={{
                  padding: '5px 2px',
                  textTransform: 'capitalize',
                  fontSize: '0.74rem',
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
                      <option value="grad">Gradians (grad)</option>
                      <option value="arcmin">Arcminutes (′)</option>
                      <option value="arcsec">Arcseconds (″)</option>
                    </>
                  )}
                  {category === 'temp' && (
                    <>
                      <option value="c">Celsius (°C)</option>
                      <option value="f">Fahrenheit (°F)</option>
                      <option value="k">Kelvin (K)</option>
                      <option value="r">Rankine (°R)</option>
                    </>
                  )}
                  {category === 'length' && (
                    <>
                      <option value="m">Meters (m)</option>
                      <option value="km">Kilometers (km)</option>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="mm">Millimeters (mm)</option>
                      <option value="ft">Feet (ft)</option>
                      <option value="in">Inches (in)</option>
                      <option value="yd">Yards (yd)</option>
                      <option value="mi">Miles (mi)</option>
                      <option value="nmi">Nautical Miles (nmi)</option>
                    </>
                  )}
                  {category === 'area' && (
                    <>
                      <option value="m2">Square Meters (m²)</option>
                      <option value="km2">Square Kilometers (km²)</option>
                      <option value="ha">Hectares (ha)</option>
                      <option value="acre">Acres</option>
                      <option value="ft2">Square Feet (ft²)</option>
                      <option value="in2">Square Inches (in²)</option>
                      <option value="mi2">Square Miles (mi²)</option>
                    </>
                  )}
                  {category === 'volume' && (
                    <>
                      <option value="l">Liters (L)</option>
                      <option value="ml">Milliliters (mL)</option>
                      <option value="m3">Cubic Meters (m³)</option>
                      <option value="gal">Gallons (US)</option>
                      <option value="qt">Quarts (qt)</option>
                      <option value="pt">Pints (pt)</option>
                      <option value="cup">Cups</option>
                      <option value="ft3">Cubic Feet (ft³)</option>
                    </>
                  )}
                  {category === 'mass' && (
                    <>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="mg">Milligrams (mg)</option>
                      <option value="lb">Pounds (lb)</option>
                      <option value="oz">Ounces (oz)</option>
                      <option value="ton">Metric Tons (t)</option>
                    </>
                  )}
                  {category === 'speed' && (
                    <>
                      <option value="kmh">Kilometers / hour (km/h)</option>
                      <option value="mph">Miles / hour (mph)</option>
                      <option value="mps">Meters / second (m/s)</option>
                      <option value="knot">Knots (kn)</option>
                      <option value="fps">Feet / second (ft/s)</option>
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
                      <option value="grad">Gradians (grad)</option>
                      <option value="arcmin">Arcminutes (′)</option>
                      <option value="arcsec">Arcseconds (″)</option>
                    </>
                  )}
                  {category === 'temp' && (
                    <>
                      <option value="f">Fahrenheit (°F)</option>
                      <option value="c">Celsius (°C)</option>
                      <option value="k">Kelvin (K)</option>
                      <option value="r">Rankine (°R)</option>
                    </>
                  )}
                  {category === 'length' && (
                    <>
                      <option value="ft">Feet (ft)</option>
                      <option value="in">Inches (in)</option>
                      <option value="m">Meters (m)</option>
                      <option value="km">Kilometers (km)</option>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="mm">Millimeters (mm)</option>
                      <option value="yd">Yards (yd)</option>
                      <option value="mi">Miles (mi)</option>
                      <option value="nmi">Nautical Miles (nmi)</option>
                    </>
                  )}
                  {category === 'area' && (
                    <>
                      <option value="ft2">Square Feet (ft²)</option>
                      <option value="m2">Square Meters (m²)</option>
                      <option value="km2">Square Kilometers (km²)</option>
                      <option value="ha">Hectares (ha)</option>
                      <option value="acre">Acres</option>
                      <option value="in2">Square Inches (in²)</option>
                      <option value="mi2">Square Miles (mi²)</option>
                    </>
                  )}
                  {category === 'volume' && (
                    <>
                      <option value="gal">Gallons (US)</option>
                      <option value="l">Liters (L)</option>
                      <option value="ml">Milliliters (mL)</option>
                      <option value="m3">Cubic Meters (m³)</option>
                      <option value="qt">Quarts (qt)</option>
                      <option value="pt">Pints (pt)</option>
                      <option value="cup">Cups</option>
                      <option value="ft3">Cubic Feet (ft³)</option>
                    </>
                  )}
                  {category === 'mass' && (
                    <>
                      <option value="lb">Pounds (lb)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="mg">Milligrams (mg)</option>
                      <option value="oz">Ounces (oz)</option>
                      <option value="ton">Metric Tons (t)</option>
                    </>
                  )}
                  {category === 'speed' && (
                    <>
                      <option value="mph">Miles / hour (mph)</option>
                      <option value="kmh">Kilometers / hour (km/h)</option>
                      <option value="mps">Meters / second (m/s)</option>
                      <option value="knot">Knots (kn)</option>
                      <option value="fps">Feet / second (ft/s)</option>
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
