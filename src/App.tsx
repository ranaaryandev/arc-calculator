import React, { useState, useEffect } from 'react'
import { Header } from './components/Header/Header'
import { Display } from './components/Display/Display'
import { Keypad } from './components/Keypad/Keypad'
import { HistoryPanel } from './components/History/HistoryPanel'
import { ShortcutsModal } from './components/Modals/ShortcutsModal'
import { AboutModal } from './components/Modals/AboutModal'
import { UnitConverterModal } from './components/Modals/UnitConverterModal'
import { ConstantsModal } from './components/Modals/ConstantsModal'
import { GraphModal } from './components/Modals/GraphModal'
import { Footer } from './components/Footer/Footer'

// Dedicated Mode Views & Selector
import { ModeSelectorModal, type CalculatorMode } from './components/Modes/ModeSelectorModal'
import { EquationSolverView } from './components/Modes/EquationSolverView'
import { MatrixCalculatorView } from './components/Modes/MatrixCalculatorView'
import { VectorCalculatorView } from './components/Modes/VectorCalculatorView'
import { ComplexCalculatorView } from './components/Modes/ComplexCalculatorView'
import { StatisticsView } from './components/Modes/StatisticsView'
import { ProbabilityView } from './components/Modes/ProbabilityView'
import { BaseNCalculatorView } from './components/Modes/BaseNCalculatorView'
import { TableGeneratorView } from './components/Modes/TableGeneratorView'
import { EngineeringToolkitView } from './components/Modes/EngineeringToolkitView'

import { useCalculator } from './hooks/useCalculator'
import { useTheme } from './hooks/useTheme'
import { useKeyboard } from './hooks/useKeyboard'
import { APP_CONFIG } from './config/appConfig'
import { ArrowLeft } from 'lucide-react'
import styles from './App.module.css'

export const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme()
  const [activeMode, setActiveMode] = useState<CalculatorMode>('calculate')
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false)

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isConverterOpen, setIsConverterOpen] = useState(false)
  const [isConstantsOpen, setIsConstantsOpen] = useState(false)
  const [isGraphOpen, setIsGraphOpen] = useState(false)

  const calc = useCalculator()

  useEffect(() => {
    document.title = `${APP_CONFIG.name} — Precision Scientific & Engineering Calculator`
  }, [])

  const handleSelectMode = (mode: CalculatorMode) => {
    if (mode === 'converter') {
      setIsConverterOpen(true)
    } else {
      setActiveMode(mode)
    }
  }

  // Connect physical keyboard
  useKeyboard(
    {
      onAppend: calc.append,
      onCalculate: calc.calculate,
      onBackspace: calc.backspace,
      onClearEntry: calc.clearEntry,
      onClearAll: calc.clearAll,
      onInsertFunction: calc.insertFunction,
      onInsertConstant: calc.insertConstant,
      onToggleAngleMode: calc.toggleAngleMode,
      onToggleShortcutsModal: () => setIsShortcutsOpen((prev) => !prev),
      onToggleModeSelector: () => setIsModeSelectorOpen((prev) => !prev),
      onUndo: calc.undo,
      onRedo: calc.redo,
    },
    !isShortcutsOpen &&
      !isAboutOpen &&
      !isConverterOpen &&
      !isConstantsOpen &&
      !isGraphOpen &&
      !isModeSelectorOpen &&
      activeMode === 'calculate'
  )

  const handleClearAllData = () => {
    calc.clearAll()
    calc.clearHistory()
    calc.memoryClear()
    localStorage.clear()
    setActiveMode('calculate')
  }

  return (
    <div className={styles.appWrapper}>
      <main className={styles.calcShell}>
        {/* Header with Physical [MODE] Selector, Brand, DEG/RAD, History */}
        <Header
          activeMode={activeMode}
          onOpenModeSelector={() => setIsModeSelectorOpen(true)}
          angleMode={calc.angleMode}
          onToggleAngleMode={calc.toggleAngleMode}
          theme={theme}
          onToggleTheme={toggleTheme}
          historyCount={calc.history.length}
          isHistoryOpen={isHistoryOpen}
          onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenUnitConverter={() => setIsConverterOpen(true)}
          onOpenConstants={() => setIsConstantsOpen(true)}
          onOpenGraph={() => setIsGraphOpen(true)}
          onOpenEngineering={() => setActiveMode('engineering')}
        />

        {/* Non-Calculate Mode Return Navigation Pill */}
        {activeMode !== 'calculate' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              background: 'var(--bg-surface-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              Active Mode: {activeMode.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => setActiveMode('calculate')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}
              aria-label="Return to Calculate mode"
            >
              <ArrowLeft size={13} />
              <span>Back to Calculator</span>
            </button>
          </div>
        )}

        {/* ACTIVE MAIN VIEW */}
        {activeMode === 'calculate' && (
          <>
            {/* Display with Expression, Live Preview, Result, Memory Badge */}
            <Display
              expression={calc.expression}
              cursorPos={calc.cursorPos}
              onUpdateExpression={calc.updateExpressionDirect}
              onCalculate={calc.calculate}
              onUndo={calc.undo}
              onRedo={calc.redo}
              canUndo={calc.canUndo}
              canRedo={calc.canRedo}
              result={calc.result}
              preview={calc.preview}
              error={calc.error}
              angleMode={calc.angleMode}
              memory={calc.memory}
              onMemoryRecall={calc.memoryRecall}
              onMemoryClear={calc.memoryClear}
              decimals={calc.decimals}
              onChangeDecimals={calc.setDecimals}
              showUnrounded={calc.showUnrounded}
              onToggleUnrounded={() => calc.setShowUnrounded((prev) => !prev)}
            />

            {/* Keypad Grid (Standard + Scientific + Memory) */}
            <Keypad
              onAppend={calc.append}
              onInsertFunction={calc.insertFunction}
              onInsertConstant={calc.insertConstant}
              onBackspace={calc.backspace}
              onClearEntry={calc.clearEntry}
              onClearAll={calc.clearAll}
              onToggleSign={calc.toggleSign}
              onCalculate={calc.calculate}
              onMemoryClear={calc.memoryClear}
              onMemoryRecall={calc.memoryRecall}
              onMemoryStore={calc.memoryStore}
              onMemoryAdd={calc.memoryAdd}
              onMemorySubtract={calc.memorySubtract}
              hasMemory={calc.memory !== null}
            />
          </>
        )}

        {activeMode === 'equations' && (
          <EquationSolverView onInsertResult={(val) => { calc.append(val); setActiveMode('calculate') }} />
        )}

        {activeMode === 'matrices' && <MatrixCalculatorView />}

        {activeMode === 'vectors' && <VectorCalculatorView />}

        {activeMode === 'complex' && <ComplexCalculatorView />}

        {activeMode === 'statistics' && <StatisticsView />}

        {activeMode === 'probability' && <ProbabilityView />}

        {activeMode === 'baseN' && <BaseNCalculatorView />}

        {activeMode === 'table' && <TableGeneratorView />}

        {activeMode === 'engineering' && (
          <EngineeringToolkitView onInsertResult={(val) => { calc.append(val); setActiveMode('calculate') }} />
        )}

        {/* Footer with Privacy guarantee */}
        <Footer />

        {/* History Slide-in Panel */}
        <HistoryPanel
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={calc.history}
          onReuseHistory={(item) => {
            calc.reuseHistory(item)
            if (activeMode !== 'calculate') setActiveMode('calculate')
          }}
          onClearHistory={calc.clearHistory}
        />
      </main>

      {/* Mode Selector Dialog (Casio fx-991CW inspired) */}
      <ModeSelectorModal
        isOpen={isModeSelectorOpen}
        activeMode={activeMode}
        onSelectMode={handleSelectMode}
        onClose={() => setIsModeSelectorOpen(false)}
      />

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

      {/* About & Safety Dialog */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} onClearAllData={handleClearAllData} />

      {/* Unit Converter Utility Dialog */}
      <UnitConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onInsertResult={calc.append}
      />

      {/* Scientific Constants Catalog Dialog */}
      <ConstantsModal
        isOpen={isConstantsOpen}
        onClose={() => setIsConstantsOpen(false)}
        onInsertConstant={calc.append}
      />

      {/* 2D Function Grapher Dialog */}
      <GraphModal isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} />
    </div>
  )
}

export default App
