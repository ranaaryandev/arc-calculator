import React, { useState } from 'react'
import { History as HistoryIcon, X, Trash2, Copy, Check, CornerDownLeft } from 'lucide-react'
import type { HistoryItem } from '../../calculator/types'
import { formatExpressionForDisplay } from '../../calculator/formatter'
import styles from './HistoryPanel.module.css'

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onReuseHistory: (item: HistoryItem, type: 'result' | 'expression') => void
  onClearHistory: () => void
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onReuseHistory,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!isOpen) return null

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.expression.toLowerCase().includes(q) ||
      item.formattedResult.toLowerCase().includes(q)
    )
  })

  const copyResult = async (item: HistoryItem) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(item.formattedResult)
      }
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // Ignore
    }
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.historyOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Calculation History">
      <div className={styles.historyDrawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <HistoryIcon size={18} aria-hidden="true" />
            <span>Calculation History</span>
            <span className={styles.itemCount}>{history.length}</span>
          </div>

          <div className={styles.headerActions}>
            {history.length > 0 && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={onClearHistory}
                aria-label="Clear all calculation history"
                title="Clear History"
              >
                <Trash2 size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Clear
              </button>
            )}

            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close history panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        {history.length > 3 && (
          <div className={styles.searchBar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search history expressions or results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search calculation history"
            />
          </div>
        )}

        {/* List */}
        {filteredHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <HistoryIcon className={styles.emptyIcon} aria-hidden="true" />
            <p style={{ fontWeight: 500 }}>No calculations yet</p>
            <p style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
              Completed calculations are saved here locally so you can reuse results and review past steps.
            </p>
          </div>
        ) : (
          <div className={styles.historyList}>
            {filteredHistory.map((item) => (
              <div key={item.id} className={styles.historyCard}>
                <div className={styles.cardTop}>
                  <div className={styles.metaInfo}>
                    <span className={styles.angleTag}>{item.angleMode}</span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => copyResult(item)}
                      title="Copy result"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={12} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => {
                        onReuseHistory(item, 'result')
                        onClose()
                      }}
                      title="Use this result in calculator"
                    >
                      <CornerDownLeft size={12} /> Use
                    </button>
                  </div>
                </div>

                <div
                  className={styles.cardExpression}
                  onClick={() => {
                    onReuseHistory(item, 'expression')
                    onClose()
                  }}
                  title="Click to restore this expression"
                >
                  {formatExpressionForDisplay(item.expression)}
                </div>

                <div
                  className={`${styles.cardResult} tabular-numbers`}
                  onClick={() => {
                    onReuseHistory(item, 'result')
                    onClose()
                  }}
                  title="Click to use this result"
                >
                  = {item.formattedResult}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
