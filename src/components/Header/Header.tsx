import React from 'react'
import { Sun, Moon, History, Keyboard, Info, Calculator, ArrowRightLeft, Atom, TrendingUp } from 'lucide-react'
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
  onOpenConstants: () => void
  onOpenGraph?: () => void
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
  onOpenConstants,
  onOpenGraph,
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
          className={styles.navBtn}
          onClick={onOpenUnitConverter}
          aria-label="Unit converter"
          title="Open unit converter catalog"
        >
          <ArrowRightLeft size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>Converter</span>
        </button>

        {/* Scientific Constants Trigger */}
        <button
          type="button"
          className={styles.navBtn}
          onClick={onOpenConstants}
          aria-label="Scientific constants catalog"
          title="Open math, physics, & chemistry constants"
        >
          <Atom size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>Constants</span>
        </button>

        {/* 2D Function Grapher Trigger */}
        <button
          type="button"
          className={styles.navBtn}
          onClick={onOpenGraph}
          aria-label="2D Function Grapher"
          title="Open 2D function grapher"
        >
          <TrendingUp size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>Graph</span>
        </button>

        {/* History Toggle */}
        <button
          type="button"
          className={`${styles.navBtn} ${isHistoryOpen ? styles.navBtnActive : ''}`}
          onClick={onToggleHistory}
          aria-label={`Calculation history, ${historyCount} items`}
          title="Calculation History (H)"
        >
          <History size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>History</span>
          {historyCount > 0 && <span className={styles.historyBadge}>{historyCount}</span>}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          className={styles.navBtn}
          onClick={onOpenShortcuts}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>Shortcuts</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className={styles.navBtn}
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          <span className={styles.btnLabel}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* About / Info Trigger */}
        <button
          type="button"
          className={styles.navBtn}
          onClick={onOpenAbout}
          aria-label="About Arc Calculator"
          title="About Arc Calculator"
        >
          <Info size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>About</span>
        </button>
      </div>
    </header>
  )
}
