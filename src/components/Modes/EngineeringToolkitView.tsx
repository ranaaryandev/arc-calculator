import React, { useState } from 'react'
import { Wrench, Search, Check, Copy } from 'lucide-react'
import { ENGINEERING_TOOLS, type DisciplineCategory, type EngineeringTool } from '../../tools'
import styles from './Modes.module.css'

interface EngineeringToolkitViewProps {
  onInsertResult?: (val: string) => void
}

export const EngineeringToolkitView: React.FC<EngineeringToolkitViewProps> = ({ onInsertResult }) => {
  const [selectedCategory, setSelectedCategory] = useState<DisciplineCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedToolId, setSelectedToolId] = useState<string>(ENGINEERING_TOOLS[0].id)
  const [copied, setCopied] = useState(false)

  // Current selected tool
  const currentTool = ENGINEERING_TOOLS.find((t) => t.id === selectedToolId) || ENGINEERING_TOOLS[0]

  // Form input state initialized with default values
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    for (const v of currentTool.variables) {
      init[v.id] = v.defaultValue
    }
    return init
  })

  const handleSelectTool = (tool: EngineeringTool) => {
    setSelectedToolId(tool.id)
    const nextInputs: Record<string, number> = {}
    for (const v of tool.variables) {
      nextInputs[v.id] = v.defaultValue
    }
    setInputs(nextInputs)
  }

  // Filter tools
  const filteredTools = ENGINEERING_TOOLS.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.formula.toLowerCase().includes(q)
    return matchCat && matchQuery
  })

  // Calculate live output
  let outputResult = null
  let calcError = ''
  try {
    outputResult = currentTool.calculate(inputs)
  } catch (err: unknown) {
    calcError = err instanceof Error ? err.message : 'Calculation error'
  }

  const copyText = (txt: string) => {
    navigator.clipboard?.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.modeShell} role="region" aria-label="Engineering Toolkit">
      <div className={styles.modeHeader}>
        <div className={styles.modeTitleGroup}>
          <Wrench size={22} className={styles.modeIcon} />
          <div>
            <h2 className={styles.modeTitle}>Engineering Toolkit</h2>
            <span className={styles.modeSubtitle}>Verified university engineering calculators with formulas, worked steps & SI units</span>
          </div>
        </div>

        {outputResult && (
          <div className={styles.actionsBar}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => copyText(outputResult.value)}
              title="Copy calculation result"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            {onInsertResult && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => onInsertResult(outputResult.numericValue.toString())}
                title="Insert numeric answer into calculator"
              >
                Insert
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Discipline Filter Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input
            type="text"
            className={styles.textInput}
            style={{ width: '100%', paddingLeft: '32px' }}
            placeholder="Search engineering tools (e.g. Ohm, stress, torque, concrete, RC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search engineering tools"
          />
        </div>

        <div className={styles.filterPills} role="group" aria-label="Discipline filter">
          {(
            [
              { id: 'all', label: 'All Disciplines' },
              { id: 'electrical', label: '⚡ Electrical (EE)' },
              { id: 'mechanical', label: '⚙️ Mechanical (ME)' },
              { id: 'civil', label: '🏗️ Civil (CE)' },
              { id: 'computer', label: '💻 Computer (CS)' },
            ] as { id: DisciplineCategory; label: string }[]
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.filterPill} ${selectedCategory === cat.id ? styles.filterPillActive : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Selector List */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
        }}
        role="tablist"
        aria-label="Available engineering calculators"
      >
        {filteredTools.map((t) => {
          const isSelected = t.id === currentTool.id
          return (
            <button
              key={t.id}
              type="button"
              className={`${styles.tabBtn} ${isSelected ? styles.tabBtnActive : ''}`}
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => handleSelectTool(t)}
              role="tab"
              aria-selected={isSelected}
            >
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? 'var(--accent-primary-text)' : 'var(--text-muted)',
                }}
              >
                {t.badge}
              </span>
              <span>{t.name}</span>
            </button>
          )
        })}
      </div>

      {/* Active Tool Workspace */}
      <div className={styles.cardSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className={styles.cardTitle}>{currentTool.name}</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {currentTool.description}
            </p>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: 'var(--accent-primary)',
              background: 'var(--accent-subtle)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid var(--accent-border)',
            }}
          >
            {currentTool.formula}
          </span>
        </div>

        {/* Input fields */}
        <div className={styles.formGrid} style={{ marginTop: '6px' }}>
          {currentTool.variables.map((v) => (
            <div key={v.id} className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                {v.label} ({v.symbol}) [{v.unit}]
              </label>
              <input
                type="number"
                step={v.step || 'any'}
                min={v.min}
                max={v.max}
                className={styles.textInput}
                value={inputs[v.id] ?? v.defaultValue}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  setInputs((prev) => ({ ...prev, [v.id]: Number.isFinite(val) ? val : 0 }))
                }}
                aria-label={`${v.label} in ${v.unit}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Output & Step-by-Step Educational Explanation */}
      {calcError ? (
        <div style={{ color: 'var(--text-error)', fontSize: '0.85rem' }}>{calcError}</div>
      ) : outputResult ? (
        <div className={styles.resultBox}>
          <span className={styles.cardTitle}>{outputResult.resultLabel}</span>
          <div className={styles.resultValue}>{outputResult.value}</div>
          <ul className={styles.resultSteps}>
            <li><strong>Governing Formula:</strong> {outputResult.formula}</li>
            {outputResult.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
            {currentTool.assumptions.length > 0 && (
              <li style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                <strong>Assumptions:</strong> {currentTool.assumptions.join(' • ')}
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
