import React, { useEffect } from 'react'
import {
  X,
  Calculator,
  EqualNot,
  Grid,
  Navigation,
  Compass,
  BarChart2,
  Dice5,
  Binary,
  Table,
  ArrowRightLeft,
  Wrench,
} from 'lucide-react'
import styles from './Modes.module.css'
import modalStyles from '../Modals/Modals.module.css'

export type CalculatorMode =
  | 'calculate'
  | 'equations'
  | 'matrices'
  | 'vectors'
  | 'complex'
  | 'statistics'
  | 'probability'
  | 'baseN'
  | 'table'
  | 'converter'
  | 'engineering'

interface ModeItem {
  id: CalculatorMode
  num: string
  name: string
  desc: string
  icon: React.ReactNode
}

const MODES_LIST: ModeItem[] = [
  {
    id: 'calculate',
    num: '1',
    name: 'Calculate',
    desc: 'General scientific & arithmetic expression evaluation',
    icon: <Calculator size={18} />,
  },
  {
    id: 'equations',
    num: '2',
    name: 'Equations',
    desc: 'Linear, quadratic, and 2x2/3x3 linear system solvers',
    icon: <EqualNot size={18} />,
  },
  {
    id: 'matrices',
    num: '3',
    name: 'Matrices',
    desc: 'Matrix arithmetic, determinant, inverse, and transpose up to 4x4',
    icon: <Grid size={18} />,
  },
  {
    id: 'vectors',
    num: '4',
    name: 'Vectors',
    desc: '2D & 3D vector algebra, dot product, cross product, and angles',
    icon: <Navigation size={18} />,
  },
  {
    id: 'complex',
    num: '5',
    name: 'Complex',
    desc: 'Rectangular and polar complex numbers, arithmetic, and conjugates',
    icon: <Compass size={18} />,
  },
  {
    id: 'statistics',
    num: '6',
    name: 'Statistics',
    desc: '1-Variable descriptive statistics and 2-Variable linear regression',
    icon: <BarChart2 size={18} />,
  },
  {
    id: 'probability',
    num: '7',
    name: 'Probability',
    desc: 'Permutations, combinations, binomial, and normal distributions',
    icon: <Dice5 size={18} />,
  },
  {
    id: 'baseN',
    num: '8',
    name: 'Base-N',
    desc: 'DEC, BIN, OCT, HEX conversions, bitwise logic, and 2s complement',
    icon: <Binary size={18} />,
  },
  {
    id: 'table',
    num: '9',
    name: 'Table',
    desc: 'Function table generator for f(x) over a range with step intervals',
    icon: <Table size={18} />,
  },
  {
    id: 'converter',
    num: '10',
    name: 'Converter',
    desc: 'Multi-domain scientific and engineering unit conversion',
    icon: <ArrowRightLeft size={18} />,
  },
  {
    id: 'engineering',
    num: '11',
    name: 'Engineering Tools',
    desc: 'Electrical, mechanical, civil, and computing calculators with formulas',
    icon: <Wrench size={18} />,
  },
]

interface ModeSelectorModalProps {
  isOpen: boolean
  activeMode: CalculatorMode
  onSelectMode: (mode: CalculatorMode) => void
  onClose: () => void
}

export const ModeSelectorModal: React.FC<ModeSelectorModalProps> = ({
  isOpen,
  activeMode,
  onSelectMode,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      // Number key shortcuts
      const matched = MODES_LIST.find((m) => m.num === e.key)
      if (matched) {
        onSelectMode(matched.id)
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onSelectMode, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Calculator Mode Selector"
    >
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.modalTitle}>
            <Calculator size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Select Calculator Mode</span>
          </div>
          <button
            type="button"
            className={modalStyles.closeBtn}
            onClick={onClose}
            aria-label="Close mode selector"
          >
            <X size={16} />
          </button>
        </div>

        <div className={modalStyles.modalBody}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Inspired by physical scientific calculators (fx-991CW). Press a number key (1–9) or click any mode:
          </p>

          <div className={styles.modeGrid} role="menu" aria-label="Available Modes">
            {MODES_LIST.map((m) => {
              const isActive = activeMode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`${styles.modeCard} ${isActive ? styles.modeCardActive : ''}`}
                  onClick={() => {
                    onSelectMode(m.id)
                    onClose()
                  }}
                  role="menuitem"
                  aria-current={isActive ? 'true' : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span className={styles.modeCardNum}>#{m.num}</span>
                    <span style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {m.icon}
                    </span>
                  </div>
                  <span className={styles.modeCardName}>{m.name}</span>
                  <span className={styles.modeCardDesc}>{m.desc}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
