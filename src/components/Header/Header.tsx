import React from 'react'
import { Sun, Moon, History, Keyboard, Info, Calculator, ArrowRightLeft } from 'lucide-react'
import type { AngleMode } from '../../calculator/types'
import type { Theme } from '../../hooks/useTheme'
import { APP_CONFIG } from '../../config/appConfig'
import styles from './Header.module.css'

interface HeaderProps {
  angleMode: AngleMode
  onToggleAngleMode: () => void
  theme: Theme
  onToggleTheme: () => void
  historyCount: number
  isHistoryOpen: boolean
  onToggleHistory: () => void
  onOpenShortcuts: () => void
  onOpenAbout: () => void
  onOpenUnitConverter: () => void
}

export const Header: React.FC<HeaderProps> = ({
  angleMode,
  onToggleAngleMode,
  theme,
  onToggleTheme,
  historyCount,
  isHistoryOpen,
  onToggleHistory,
  onOpenShortcuts,
  onOpenAbout,
  onOpenUnitConverter,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Calculator className={styles.logoIcon} aria-hidden="true" />
        <span className={styles.title}>{APP_CONFIG.name}</span>
        <span className={styles.versionBadge} title="Version">v{APP_CONFIG.version}</span>
      </div>

      <div className={styles.controls}>
        {/* DEG / RAD segmented switch */}
        <div className={styles.modeSwitch} role="group" aria-label="Angle unit selection">
          <button
            type="button"
            className={`${styles.modeOption} ${angleMode === 'DEG' ? styles.modeOptionActive : ''}`}
            onClick={() => angleMode !== 'DEG' && onToggleAngleMode()}
            aria-pressed={angleMode === 'DEG'}
            title="Degrees mode (Shortcut: D)"
          >
            DEG
          </button>
          <button
            type="button"
            className={`${styles.modeOption} ${angleMode === 'RAD' ? styles.modeOptionActive : ''}`}
            onClick={() => angleMode !== 'RAD' && onToggleAngleMode()}
            aria-pressed={angleMode === 'RAD'}
            title="Radians mode (Shortcut: D)"
          >
            RAD
          </button>
        </div>

        {/* Unit Converter Trigger */}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onOpenUnitConverter}
          aria-label="Unit converter"
          title="Unit converter"
        >
          <ArrowRightLeft size={16} aria-hidden="true" />
        </button>

        {/* History Toggle */}
        <button
          type="button"
          className={`${styles.iconBtn} ${isHistoryOpen ? styles.activeIconBtn : ''}`}
          onClick={onToggleHistory}
          aria-label={`Calculation history, ${historyCount} items`}
          title="History (H)"
        >
          <History size={16} aria-hidden="true" />
          {historyCount > 0 && <span className={styles.historyBadge}>{historyCount}</span>}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onOpenShortcuts}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard size={16} aria-hidden="true" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        </button>

        {/* About / Info Trigger */}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onOpenAbout}
          aria-label="About Arc Calculator"
          title="About Arc Calculator"
        >
          <Info size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
