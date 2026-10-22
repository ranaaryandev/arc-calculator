import React, { useEffect } from 'react'
import { X, Keyboard } from 'lucide-react'
import styles from './Modals.module.css'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Keyboard Shortcuts">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Keyboard size={18} aria-hidden="true" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close shortcuts">
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div>
            <div className={styles.sectionTitle}>Standard Operations</div>
            <div className={styles.shortcutsGrid}>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Calculate / Evaluate</span>
                <span className={styles.kbd}>Enter / =</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Backspace / Delete char</span>
                <span className={styles.kbd}>Backspace</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Clear Current Entry</span>
                <span className={styles.kbd}>Esc</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>All Clear (AC)</span>
                <span className={styles.kbd}>Delete</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Parentheses</span>
                <span className={styles.kbd}>( )</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Modulo / Percent</span>
                <span className={styles.kbd}>%</span>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.sectionTitle}>Scientific Functions</div>
            <div className={styles.shortcutsGrid}>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Sine</span>
                <span className={styles.kbd}>S</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Cosine</span>
                <span className={styles.kbd}>C</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Tangent</span>
                <span className={styles.kbd}>T</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Square Root</span>
                <span className={styles.kbd}>R</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Natural Log (ln)</span>
                <span className={styles.kbd}>L</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Pi Constant (π)</span>
                <span className={styles.kbd}>P</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Euler Constant (e)</span>
                <span className={styles.kbd}>E</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Toggle DEG / RAD</span>
                <span className={styles.kbd}>D</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Power (xʸ)</span>
                <span className={styles.kbd}>^</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutLabel}>Show Shortcuts</span>
                <span className={styles.kbd}>?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
