import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { APP_CONFIG } from '../../config/appConfig'
import styles from './Footer.module.css'

interface FooterProps {
  onOpenShortcuts: () => void
}

export const Footer: React.FC<FooterProps> = ({ onOpenShortcuts }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        <span className={styles.privacyBadge} title="Runs 100% in browser. Zero network tracking.">
          <ShieldCheck size={13} aria-hidden="true" />
          <span>Local-first • Private</span>
        </span>

        <button
          type="button"
          className={styles.shortcutHint}
          onClick={onOpenShortcuts}
          aria-label="Open keyboard shortcuts"
        >
          <span>Shortcuts</span>
          <span className={styles.shortcutKey}>?</span>
        </button>
      </div>

      <div>
        <a
          href={APP_CONFIG.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          {APP_CONFIG.name}
        </a>
      </div>
    </footer>
  )
}
