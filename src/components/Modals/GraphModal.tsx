import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { X, TrendingUp, ZoomIn, ZoomOut, RotateCcw, Plus, Minus } from 'lucide-react'
import { parse, evaluateAST } from '../../calculator'
import styles from './Modals.module.css'

interface GraphModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PresetItem {
  label: string
  f1: string
  f2?: string
}

const PRESETS: PresetItem[] = [
  { label: 'sin(x)', f1: 'sin(x)' },
  { label: 'cos(x)', f1: 'cos(x)' },
  { label: 'sin & cos', f1: 'sin(x)', f2: 'cos(x)' },
  { label: 'x² − 4', f1: 'x^2 - 4' },
  { label: '1/x', f1: '1/x' },
  { label: '√x', f1: 'sqrt(x)' },
  { label: 'x³ − 3x', f1: 'x^3 - 3*x' },
]

export const GraphModal: React.FC<GraphModalProps> = ({ isOpen, onClose }) => {
  const [expr1, setExpr1] = useState('sin(x)')
  const [showSecondFn, setShowSecondFn] = useState(false)
  const [expr2, setExpr2] = useState('cos(x)')

  const [xRange, setXRange] = useState<[number, number]>([-10, 10])
  const [yRange, setYRange] = useState<[number, number]>([-5, 5])
  const [traceCoord, setTraceCoord] = useState<{ x: number; y1: number | null; y2: number | null } | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef<{ x: number; y: number; xRange: [number, number]; yRange: [number, number] }>({
    x: 0,
    y: 0,
    xRange: [-10, 10],
    yRange: [-5, 5],
  })

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Parse AST for expr1
  const { ast1, parseError1 } = useMemo(() => {
    if (!expr1.trim()) return { ast1: null, parseError1: null }
    try {
      return { ast1: parse(expr1.trim()), parseError1: null }
    } catch (err: unknown) {
      return { ast1: null, parseError1: err instanceof Error ? err.message : 'Invalid formula' }
    }
  }, [expr1])

  // Parse AST for expr2
  const { ast2, parseError2 } = useMemo(() => {
    if (!showSecondFn || !expr2.trim()) return { ast2: null, parseError2: null }
    try {
      return { ast2: parse(expr2.trim()), parseError2: null }
    } catch (err: unknown) {
      return { ast2: null, parseError2: err instanceof Error ? err.message : 'Invalid formula' }
    }
  }, [showSecondFn, expr2])

  // Draw plot on canvas
  const drawPlot = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr
      canvas.height = height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const [xMin, xMax] = xRange
    const [yMin, yMax] = yRange
    const xSpan = xMax - xMin
    const ySpan = yMax - yMin

    const toScreenX = (x: number) => ((x - xMin) / xSpan) * width
    const toScreenY = (y: number) => height - ((y - yMin) / ySpan) * height

    // Draw grid
    ctx.lineWidth = 1
    ctx.strokeStyle = '#1d1e26'
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px ui-monospace, monospace'

    const roughGridSteps = 8
    const rawStepX = xSpan / roughGridSteps
    const stepPowX = Math.pow(10, Math.floor(Math.log10(rawStepX)))
    const stepX = (rawStepX / stepPowX > 5 ? 5 : rawStepX / stepPowX > 2 ? 2 : 1) * stepPowX

    const firstGridX = Math.ceil(xMin / stepX) * stepX
    for (let gx = firstGridX; gx <= xMax; gx += stepX) {
      const sx = toScreenX(gx)
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, height)
      ctx.stroke()

      if (Math.abs(gx) > 1e-9) {
        ctx.fillText(Number(gx.toFixed(4)).toString(), sx + 2, height - 4)
      }
    }

    const rawStepY = ySpan / roughGridSteps
    const stepPowY = Math.pow(10, Math.floor(Math.log10(rawStepY)))
    const stepY = (rawStepY / stepPowY > 5 ? 5 : rawStepY / stepPowY > 2 ? 2 : 1) * stepPowY

    const firstGridY = Math.ceil(yMin / stepY) * stepY
    for (let gy = firstGridY; gy <= yMax; gy += stepY) {
      const sy = toScreenY(gy)
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(width, sy)
      ctx.stroke()

      if (Math.abs(gy) > 1e-9) {
        ctx.fillText(Number(gy.toFixed(4)).toString(), 4, sy - 3)
      }
    }

    // Axes
    const originX = toScreenX(0)
    const originY = toScreenY(0)

    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1.5

    // X Axis
    if (originY >= 0 && originY <= height) {
      ctx.beginPath()
      ctx.moveTo(0, originY)
      ctx.lineTo(width, originY)
      ctx.stroke()
    }

    // Y Axis
    if (originX >= 0 && originX <= width) {
      ctx.beginPath()
      ctx.moveTo(originX, 0)
      ctx.lineTo(originX, height)
      ctx.stroke()
    }

    const numSamples = Math.min(width * 2, 400)

    // Helper to render a curve
    const plotCurve = (ast: ReturnType<typeof parse> | null, strokeColor: string) => {
      if (!ast) return
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 2.5
      ctx.beginPath()

      let prevValid = false
      let prevScreenY = 0

      for (let i = 0; i <= numSamples; i++) {
        const x = xMin + (i / numSamples) * xSpan
        let y: number | null = null

        try {
          const evaluated = evaluateAST(ast, { variables: { x }, angleMode: 'RAD' })
          if (Number.isFinite(evaluated)) {
            y = evaluated
          }
        } catch {
          y = null
        }

        if (y !== null) {
          const sx = toScreenX(x)
          const sy = toScreenY(y)

          const isDiscontinuous = prevValid && Math.abs(sy - prevScreenY) > height * 0.75

          if (!prevValid || isDiscontinuous) {
            ctx.moveTo(sx, sy)
          } else {
            ctx.lineTo(sx, sy)
          }

          prevValid = true
          prevScreenY = sy
        } else {
          prevValid = false
        }
      }
      ctx.stroke()
    }

    // Plot Function 1 (Teal)
    plotCurve(ast1, '#2dd4bf')

    // Plot Function 2 (Amber)
    if (showSecondFn) {
      plotCurve(ast2, '#f59e0b')
    }

    // Trace marker if active
    if (traceCoord) {
      const sx = toScreenX(traceCoord.x)

      if (sx >= 0 && sx <= width) {
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])

        // Vertical guide
        ctx.beginPath()
        ctx.moveTo(sx, 0)
        ctx.lineTo(sx, height)
        ctx.stroke()
        ctx.setLineDash([])

        // f1 marker
        if (traceCoord.y1 !== null) {
          const sy1 = toScreenY(traceCoord.y1)
          if (sy1 >= 0 && sy1 <= height) {
            ctx.fillStyle = '#2dd4bf'
            ctx.beginPath()
            ctx.arc(sx, sy1, 4.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // f2 marker
        if (showSecondFn && traceCoord.y2 !== null) {
          const sy2 = toScreenY(traceCoord.y2)
          if (sy2 >= 0 && sy2 <= height) {
            ctx.fillStyle = '#f59e0b'
            ctx.beginPath()
            ctx.arc(sx, sy2, 4.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    ctx.restore()
  }, [xRange, yRange, ast1, ast2, showSecondFn, traceCoord])

  useEffect(() => {
    if (isOpen) {
      drawPlot()
    }
  }, [isOpen, drawPlot])

  // Mouse & Touch Pan / Zoom handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      xRange: [...xRange],
      yRange: [...yRange],
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const screenX = e.clientX - rect.left
    const screenRatioX = Math.min(Math.max(screenX / rect.width, 0), 1)
    const [xMin, xMax] = xRange
    const currentX = xMin + screenRatioX * (xMax - xMin)

    let y1Val: number | null = null
    let y2Val: number | null = null

    if (ast1) {
      try {
        const val = evaluateAST(ast1, { variables: { x: currentX }, angleMode: 'RAD' })
        if (Number.isFinite(val)) y1Val = val
      } catch {
        y1Val = null
      }
    }

    if (showSecondFn && ast2) {
      try {
        const val = evaluateAST(ast2, { variables: { x: currentX }, angleMode: 'RAD' })
        if (Number.isFinite(val)) y2Val = val
      } catch {
        y2Val = null
      }
    }

    if (y1Val !== null || y2Val !== null) {
      setTraceCoord({ x: currentX, y1: y1Val, y2: y2Val })
    } else {
      setTraceCoord(null)
    }

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      const xDelta = (dx / rect.width) * (dragStartRef.current.xRange[1] - dragStartRef.current.xRange[0])
      const yDelta = (dy / rect.height) * (dragStartRef.current.yRange[1] - dragStartRef.current.yRange[0])

      setXRange([dragStartRef.current.xRange[0] - xDelta, dragStartRef.current.xRange[1] - xDelta])
      setYRange([dragStartRef.current.yRange[0] + yDelta, dragStartRef.current.yRange[1] + yDelta])
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 0.85 : 1.15
    zoom(factor)
  }

  const zoom = (factor: number) => {
    setXRange(([min, max]) => {
      const mid = (min + max) / 2
      const half = ((max - min) * factor) / 2
      return [mid - half, mid + half]
    })
    setYRange(([min, max]) => {
      const mid = (min + max) / 2
      const half = ((max - min) * factor) / 2
      return [mid - half, mid + half]
    })
  }

  const resetView = () => {
    setXRange([-10, 10])
    setYRange([-5, 5])
    setTraceCoord(null)
  }

  const applyPreset = (p: PresetItem) => {
    setExpr1(p.f1)
    if (p.f2) {
      setExpr2(p.f2)
      setShowSecondFn(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="2D Function Grapher">
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <TrendingUp size={18} aria-hidden="true" style={{ color: 'var(--accent-primary)' }} />
            <span>2D Function Grapher</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close grapher">
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.graphContainer}>
            {/* Function 1 input */}
            <div className={styles.graphInputRow}>
              <span className={styles.graphFnLabel}>{showSecondFn ? 'f₁(x) =' : 'f(x) ='}</span>
              <input
                type="text"
                className={styles.graphInput}
                value={expr1}
                onChange={(e) => setExpr1(e.target.value)}
                placeholder="e.g. sin(x), x^2 - 4"
                aria-label="Formula for f1(x)"
                spellCheck={false}
              />
              <button
                type="button"
                className={styles.addFnBtn}
                onClick={() => setShowSecondFn(!showSecondFn)}
                title={showSecondFn ? 'Hide f2(x)' : 'Add secondary function f2(x)'}
                aria-label={showSecondFn ? 'Remove f2(x)' : 'Add f2(x)'}
              >
                {showSecondFn ? <Minus size={13} aria-hidden="true" /> : <Plus size={13} aria-hidden="true" />}
                <span>f₂(x)</span>
              </button>
            </div>

            {/* Function 2 input (if active) */}
            {showSecondFn && (
              <div className={styles.graphInputRow}>
                <span className={styles.graphFnLabel2}>f₂(x) =</span>
                <input
                  type="text"
                  className={styles.graphInput}
                  value={expr2}
                  onChange={(e) => setExpr2(e.target.value)}
                  placeholder="e.g. cos(x), 2*x + 1"
                  aria-label="Formula for f2(x)"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Formula presets */}
            <div className={styles.graphPresets} role="group" aria-label="Preset functions">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presets:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={`${styles.presetBtn} ${expr1 === p.f1 && (!p.f2 || (showSecondFn && expr2 === p.f2)) ? styles.presetBtnActive : ''}`}
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Syntax errors */}
            {parseError1 && (
              <div style={{ color: 'var(--text-error)', fontSize: '0.8rem' }} role="alert">
                f₁(x) Syntax: {parseError1}
              </div>
            )}
            {showSecondFn && parseError2 && (
              <div style={{ color: 'var(--text-error)', fontSize: '0.8rem' }} role="alert">
                f₂(x) Syntax: {parseError2}
              </div>
            )}

            {/* Interactive Canvas */}
            <div className={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                className={styles.graphCanvas}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  handleMouseUp()
                  setTraceCoord(null)
                }}
                onWheel={handleWheel}
                aria-label={`Graph of f1(x) = ${expr1}${showSecondFn ? `, f2(x) = ${expr2}` : ''}`}
              />
            </div>

            {/* Toolbar & Coordinate Trace Indicator */}
            <div className={styles.graphToolbar}>
              <div className={styles.graphControls}>
                <button type="button" className={styles.toolBtn} onClick={() => zoom(0.75)} title="Zoom In">
                  <ZoomIn size={14} aria-hidden="true" />
                  <span>In</span>
                </button>
                <button type="button" className={styles.toolBtn} onClick={() => zoom(1.25)} title="Zoom Out">
                  <ZoomOut size={14} aria-hidden="true" />
                  <span>Out</span>
                </button>
                <button type="button" className={styles.toolBtn} onClick={resetView} title="Reset Origin">
                  <RotateCcw size={14} aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              {traceCoord ? (
                <div className={styles.traceBadge} aria-live="polite">
                  x: {traceCoord.x.toFixed(3)}
                  {traceCoord.y1 !== null && ` | f₁: ${traceCoord.y1.toFixed(3)}`}
                  {showSecondFn && traceCoord.y2 !== null && ` | f₂: ${traceCoord.y2.toFixed(3)}`}
                </div>
              ) : (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Drag to pan • Wheel to zoom • Hover to trace
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
