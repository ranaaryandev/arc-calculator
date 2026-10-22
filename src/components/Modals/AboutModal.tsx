import React, { useEffect } from 'react'
import { X, Info, ShieldCheck, HardDrive } from 'lucide-react'
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
    if (window.confirm('Clear all locally saved history, memory, and calculator settings?')) {
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
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              {APP_CONFIG.name} — Version {APP_CONFIG.version}
            </p>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
              A clean, mathematically reliable scientific and standard calculator designed with desktop utility restraint, full keyboard navigation, and zero analytics or trackers.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-surface-elevated)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span><strong>100% Local-First:</strong> Calculations and history stay in your browser.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
              <HardDrive size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span><strong>No Accounts:</strong> No signups, no tracking cookies, no server telemetry.</span>
            </div>
          </div>

          <div>
            <div className={styles.sectionTitle}>Application Storage</div>
            <p style={{ fontSize: '0.82rem', marginBottom: 10 }}>
              Your calculation history, memory, and theme preferences are saved locally on your device.
            </p>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={handleResetData}
            >
              Clear Local Storage Data
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>MIT License</span>
            <a
              href={APP_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
