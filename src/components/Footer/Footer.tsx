import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { APP_CONFIG } from '../../config/appConfig'
import styles from './Footer.module.css'

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        <span className={styles.privacyBadge} title="Runs 100% in browser. Zero network tracking.">
          <ShieldCheck size={13} aria-hidden="true" />
          <span>Local-first • Private</span>
        </span>
      </div>

      <div>
        <a
          href={APP_CONFIG.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </a>
      </div>
    </footer>
  )
}
