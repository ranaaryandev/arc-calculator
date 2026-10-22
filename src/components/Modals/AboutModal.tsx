import React, { useEffect } from 'react'
import { X, Info, ShieldCheck, Cpu, HardDrive } from 'lucide-react'
import { APP_CONFIG } from '../../config/appConfig'
import styles from './Modals.module.css'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
  onClearAllData: () => void
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onClearAllData,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all locally saved history, memory, and settings?')) {
      onClearAllData()
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="About Arc Calculator">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Info size={18} aria-hidden="true" />
            <span>About {APP_CONFIG.name}</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close about dialog">
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              {APP_CONFIG.name} — Version {APP_CONFIG.version}
            </p>
            <p>{APP_CONFIG.description}</p>
          </div>

          <div>
            <div className={styles.sectionTitle}>Engine & Safety Architecture</div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <Cpu size={16} className={styles.featureIcon} aria-hidden="true" />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>AST Parser:</strong> Expressions are tokenized and parsed into a syntax tree with zero reliance on JavaScript <code>eval()</code> or dynamic code execution.
                </div>
              </li>
              <li className={styles.featureItem}>
                <ShieldCheck size={16} className={styles.featureIcon} aria-hidden="true" />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Precision Policy:</strong> Employs significant-figure normalization to eliminate IEEE-754 binary floating-point artifacts (such as 0.1 + 0.2) and guards against singularities like tan(90°).
                </div>
              </li>
              <li className={styles.featureItem}>
                <HardDrive size={16} className={styles.featureIcon} aria-hidden="true" />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>100% Local-First:</strong> Calculations, history, and preferences remain strictly within your browser's local storage. No analytics, tracking, or network requests are ever dispatched.
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div className={styles.sectionTitle}>Application Data Management</div>
            <p style={{ fontSize: '0.82rem', marginBottom: 12 }}>
              Your calculation history and memory are stored in your browser's <code>localStorage</code>.
            </p>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={handleResetData}
            >
              Clear All Local Storage Data
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Open Source under MIT License</span>
            <a
              href={APP_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
