import React, { useState, useEffect } from 'react'
import { X, Atom, CornerDownLeft, Search } from 'lucide-react'
import styles from './Modals.module.css'

interface ConstantItem {
  symbol: string
  name: string
  value: string
  numValue: number
  unit: string
  category: 'Math' | 'Physics' | 'Chemistry'
  source: string
}

const CONSTANTS_LIST: ConstantItem[] = [
  // Math
  { symbol: 'π', name: 'Pi (Archimedes Constant)', value: '3.141592653589793', numValue: Math.PI, unit: 'dimensionless', category: 'Math', source: 'Standard' },
  { symbol: 'e', name: "Euler's Number", value: '2.718281828459045', numValue: Math.E, unit: 'dimensionless', category: 'Math', source: 'Standard' },
  { symbol: 'φ', name: 'Golden Ratio', value: '1.618033988749895', numValue: 1.618033988749895, unit: 'dimensionless', category: 'Math', source: 'Algebraic' },
  { symbol: '√2', name: 'Pythagoras Constant', value: '1.414213562373095', numValue: Math.SQRT2, unit: 'dimensionless', category: 'Math', source: 'Algebraic' },

  // Physics
  { symbol: 'c', name: 'Speed of Light in Vacuum', value: '299792458', numValue: 299792458, unit: 'm / s', category: 'Physics', source: 'CODATA / SI' },
  { symbol: 'h', name: 'Planck Constant', value: '6.62607015e-34', numValue: 6.62607015e-34, unit: 'J · s', category: 'Physics', source: 'CODATA 2018' },
  { symbol: 'ℏ', name: 'Reduced Planck Constant', value: '1.054571817e-34', numValue: 1.054571817e-34, unit: 'J · s', category: 'Physics', source: 'CODATA 2018' },
  { symbol: 'G', name: 'Newtonian Constant of Gravitation', value: '6.67430e-11', numValue: 6.6743e-11, unit: 'm³ / (kg · s²)', category: 'Physics', source: 'CODATA 2018' },
  { symbol: 'g', name: 'Standard Acceleration of Gravity', value: '9.80665', numValue: 9.80665, unit: 'm / s²', category: 'Physics', source: 'CGPM' },
  { symbol: 'k_B', name: 'Boltzmann Constant', value: '1.380649e-23', numValue: 1.380649e-23, unit: 'J / K', category: 'Physics', source: 'CODATA 2018' },
  { symbol: 'e_c', name: 'Elementary Charge', value: '1.602176634e-19', numValue: 1.602176634e-19, unit: 'C', category: 'Physics', source: 'CODATA 2018' },

  // Chemistry
  { symbol: 'N_A', name: 'Avogadro Constant', value: '6.02214076e23', numValue: 6.02214076e23, unit: 'mol⁻¹', category: 'Chemistry', source: 'CODATA 2018' },
  { symbol: 'R', name: 'Molar Gas Constant', value: '8.314462618', numValue: 8.314462618, unit: 'J / (mol · K)', category: 'Chemistry', source: 'CODATA 2018' },
  { symbol: 'F', name: 'Faraday Constant', value: '96485.33212', numValue: 96485.33212, unit: 'C / mol', category: 'Chemistry', source: 'CODATA 2018' },
  { symbol: 'm_e', name: 'Electron Mass', value: '9.1093837e-31', numValue: 9.1093837e-31, unit: 'kg', category: 'Chemistry', source: 'CODATA 2018' },
  { symbol: 'm_p', name: 'Proton Mass', value: '1.67262192e-27', numValue: 1.67262192e-27, unit: 'kg', category: 'Chemistry', source: 'CODATA 2018' },
]

interface ConstantsModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertConstant: (val: string) => void
}

export const ConstantsModal: React.FC<ConstantsModalProps> = ({
  isOpen,
  onClose,
  onInsertConstant,
}) => {
  const [selectedCat, setSelectedCat] = useState<'All' | 'Math' | 'Physics' | 'Chemistry'>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filtered = CONSTANTS_LIST.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat
    const matchesSearch =
      !search.trim() ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Scientific Constants">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Atom size={18} aria-hidden="true" />
            <span>Scientific Constants</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close constants">
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Controls: Search + Categories */}
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                className={styles.converterInput}
                style={{ paddingLeft: 30, fontSize: '0.85rem' }}
                placeholder="Search constants (e.g. Planck, c, gravity, gas)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search constants"
              />
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {(['All', 'Math', 'Physics', 'Chemistry'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={styles.kbd}
                  style={{
                    padding: '4px 10px',
                    background: selectedCat === cat ? 'var(--accent-subtle)' : 'var(--bg-surface-elevated)',
                    color: selectedCat === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderColor: selectedCat === cat ? 'var(--accent-border)' : 'var(--border-subtle)',
                  }}
                  onClick={() => setSelectedCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Constants Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '380px', overflowY: 'auto' }}>
            {filtered.map((item) => (
              <div
                key={item.symbol + item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1rem' }}>
                      {item.symbol}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{item.value} {item.unit}</span>
                    <span>• {item.source}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.kbd}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '5px 8px',
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-subtle)',
                    borderColor: 'var(--accent-border)',
                    flexShrink: 0,
                  }}
                  onClick={() => {
                    onInsertConstant(item.value)
                    onClose()
                  }}
                  title={`Insert ${item.value} into calculator`}
                >
                  <CornerDownLeft size={12} />
                  <span>Insert</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
