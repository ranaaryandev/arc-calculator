import React, { useState, useEffect } from 'react'
import { Header } from './components/Header/Header'
import { Display } from './components/Display/Display'
import { Keypad } from './components/Keypad/Keypad'
import { HistoryPanel } from './components/History/HistoryPanel'
import { ShortcutsModal } from './components/Modals/ShortcutsModal'
import { AboutModal } from './components/Modals/AboutModal'
import { UnitConverterModal } from './components/Modals/UnitConverterModal'
import { Footer } from './components/Footer/Footer'
import { useCalculator } from './hooks/useCalculator'
import { useTheme } from './hooks/useTheme'
import { useKeyboard } from './hooks/useKeyboard'
import { APP_CONFIG } from './config/appConfig'
import styles from './App.module.css'

export const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isConverterOpen, setIsConverterOpen] = useState(false)

  const calc = useCalculator()

  useEffect(() => {
    document.title = `${APP_CONFIG.name} — Precision Scientific & Standard Calculator`
  }, [])

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
    },
    !isShortcutsOpen && !isAboutOpen && !isConverterOpen
  )

  const handleClearAllData = () => {
    calc.clearAll()
    calc.clearHistory()
    calc.memoryClear()
    localStorage.clear()
  }

  return (
    <div className={styles.appWrapper}>
      <main className={styles.calcShell}>
        {/* Header with App Identity, Theme, Angle Mode, Shortcuts */}
        <Header
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
        />

        {/* Display with Expression, Live Preview, Result, Memory Badge */}
        <Display
          expression={calc.expression}
          result={calc.result}
          preview={calc.preview}
          error={calc.error}
          angleMode={calc.angleMode}
          hasMemory={calc.memory !== null}
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

        {/* Footer with Privacy guarantee and Shortcuts hint */}
        <Footer onOpenShortcuts={() => setIsShortcutsOpen(true)} />

        {/* History Slide-in Panel */}
        <HistoryPanel
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={calc.history}
          onReuseHistory={calc.reuseHistory}
          onClearHistory={calc.clearHistory}
        />
      </main>

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* About & Safety Dialog */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onClearAllData={handleClearAllData}
      />

      {/* Unit Converter Utility Dialog */}
      <UnitConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onInsertResult={calc.append}
      />
    </div>
  )
}

export default App
