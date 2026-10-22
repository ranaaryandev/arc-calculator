import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { X, TrendingUp, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { parse, evaluateAST } from '../../calculator'
import styles from './Modals.module.css'

interface GraphModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESETS = [
  { label: 'sin(x)', expr: 'sin(x)' },
  { label: 'cos(x)', expr: 'cos(x)' },
  { label: 'x² − 4', expr: 'x^2 - 4' },
  { label: '1/x', expr: '1/x' },
  { label: '√x', expr: 'sqrt(x)' },
  { label: 'x³ − 3x', expr: 'x^3 - 3*x' },
]

export const GraphModal: React.FC<GraphModalProps> = ({ isOpen, onClose }) => {
  const [expression, setExpression] = useState('sin(x)')
  const [xRange, setXRange] = useState<[number, number]>([-10, 10])
  const [yRange, setYRange] = useState<[number, number]>([-5, 5])
  const [traceCoord, setTraceCoord] = useState<{ x: number; y: number } | null>(null)

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

  // Parse AST once per expression change
  const { ast, parseError } = useMemo(() => {
    if (!expression.trim()) return { ast: null, parseError: null }
    try {
      return { ast: parse(expression.trim()), parseError: null }
    } catch (err: unknown) {
      return { ast: null, parseError: err instanceof Error ? err.message : 'Invalid formula' }
    }
  }, [expression])

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

    // Grid step calculation
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

    // Plot Function Curve
    if (ast) {
      ctx.strokeStyle = '#2dd4bf' // Teal primary accent
      ctx.lineWidth = 2.5
      ctx.beginPath()

      const numSamples = Math.min(width * 2, 400)
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

          // Discontinuity detection: asymptotic jumps (e.g. 1/x or tan(x))
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

    // Trace marker if active
    if (traceCoord) {
      const sx = toScreenX(traceCoord.x)
      const sy = toScreenY(traceCoord.y)

      if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])

        // Vertical guide
        ctx.beginPath()
        ctx.moveTo(sx, 0)
        ctx.lineTo(sx, height)
        ctx.stroke()

        // Horizontal guide
        ctx.beginPath()
        ctx.moveTo(0, sy)
        ctx.lineTo(width, sy)
        ctx.stroke()
        ctx.setLineDash([])

        // Point dot
        ctx.fillStyle = '#2dd4bf'
        ctx.beginPath()
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }, [xRange, yRange, ast, traceCoord])

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

    if (ast) {
      try {
        const val = evaluateAST(ast, { variables: { x: currentX }, angleMode: 'RAD' })
        if (Number.isFinite(val)) {
          setTraceCoord({ x: currentX, y: val })
        } else {
          setTraceCoord(null)
        }
      } catch {
        setTraceCoord(null)
      }
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
            {/* Function input */}
            <div className={styles.graphInputRow}>
              <span className={styles.graphFnLabel}>f(x) =</span>
              <input
                type="text"
                className={styles.graphInput}
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g. sin(x), x^2 - 4"
                aria-label="Formula for f(x)"
                spellCheck={false}
              />
            </div>

            {/* Formula presets */}
            <div className={styles.graphPresets} role="group" aria-label="Preset functions">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presets:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.expr}
                  type="button"
                  className={`${styles.presetBtn} ${expression === p.expr ? styles.presetBtnActive : ''}`}
                  onClick={() => setExpression(p.expr)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {parseError && (
              <div style={{ color: 'var(--text-error)', fontSize: '0.8rem' }} role="alert">
                Syntax: {parseError}
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
                aria-label={`Graph of f(x) = ${expression}`}
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
                  x: {traceCoord.x.toFixed(3)}, y: {traceCoord.y.toFixed(3)}
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
