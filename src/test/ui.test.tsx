import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('Arc Calculator UI & Accessibility', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders application brand title and header controls', () => {
    render(<App />)
    expect(screen.getAllByText('Arc Calculator').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByLabelText('Angle unit selection')).toBeInTheDocument()
    expect(screen.getByTitle(/Keyboard shortcuts/i)).toBeInTheDocument()
  })

  it('performs calculation on button click: 7 + 8 = 15', () => {
    render(<App />)

    // Click 7
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    // Click +
    fireEvent.click(screen.getByTitle('Add (+)'))
    // Click 8
    fireEvent.click(screen.getByRole('button', { name: '8' }))
    // Click =
    fireEvent.click(screen.getByTitle('Calculate (Enter or =)'))

    expect(screen.getByLabelText('Result: 15')).toBeInTheDocument()
  })

  it('toggles angle mode between DEG and RAD', () => {
    render(<App />)
    const degBtn = screen.getByTitle('Degrees mode (Shortcut: D)')
    const radBtn = screen.getByTitle('Radians mode (Shortcut: D)')

    expect(degBtn).toHaveAttribute('aria-pressed', 'true')
    expect(radBtn).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(radBtn)
    expect(radBtn).toHaveAttribute('aria-pressed', 'true')
    expect(degBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('opens and closes keyboard shortcuts dialog', () => {
    render(<App />)
    const shortcutsBtn = screen.getByLabelText('Keyboard shortcuts')
    fireEvent.click(shortcutsBtn)

    expect(screen.getByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeInTheDocument()

    const closeBtn = screen.getByLabelText('Close shortcuts')
    fireEvent.click(closeBtn)

    expect(screen.queryByRole('dialog', { name: 'Keyboard Shortcuts' })).not.toBeInTheDocument()
  })

  it('opens history drawer and shows empty state', () => {
    render(<App />)
    const historyBtn = screen.getByRole('button', { name: /calculation history/i })
    fireEvent.click(historyBtn)

    expect(screen.getByRole('dialog', { name: 'Calculation History' })).toBeInTheDocument()
    expect(screen.getByText('No calculations yet')).toBeInTheDocument()
  })

  it('opens scientific constants modal and displays categories', () => {
    render(<App />)
    const constBtn = screen.getByLabelText('Scientific constants catalog')
    fireEvent.click(constBtn)

    expect(screen.getByRole('dialog', { name: 'Scientific Constants' })).toBeInTheDocument()
    expect(screen.getByText('Speed of Light in Vacuum')).toBeInTheDocument()
  })

  it('opens unit converter catalog modal', () => {
    render(<App />)
    const convBtn = screen.getByLabelText('Unit converter')
    fireEvent.click(convBtn)

    expect(screen.getByRole('dialog', { name: 'Unit Converter' })).toBeInTheDocument()
    expect(screen.getByText('Unit Converter Catalog')).toBeInTheDocument()
  })

  it('supports undo and redo for expression editing', () => {
    render(<App />)
    const undoBtn = screen.getByLabelText('Undo expression edit')
    const redoBtn = screen.getByLabelText('Redo expression edit')

    expect(undoBtn).toBeDisabled()
    expect(redoBtn).toBeDisabled()

    // Type 7
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    expect(undoBtn).not.toBeDisabled()

    // Type 8
    fireEvent.click(screen.getByRole('button', { name: '8' }))
    const input = screen.getByLabelText('Expression editor') as HTMLInputElement
    expect(input.value).toBe('78')

    // Click Undo -> reverts back to '7'
    fireEvent.click(undoBtn)
    expect(input.value).toBe('7')
    expect(redoBtn).not.toBeDisabled()

    // Click Redo -> restores '78'
    fireEvent.click(redoBtn)
    expect(input.value).toBe('78')
  })

  it('opens and closes 2D function grapher modal', () => {
    render(<App />)
    const graphBtn = screen.getByLabelText('2D Function Grapher')
    fireEvent.click(graphBtn)

    expect(screen.getByRole('dialog', { name: '2D Function Grapher' })).toBeInTheDocument()
    expect(screen.getByText('f(x) =')).toBeInTheDocument()

    const closeBtn = screen.getByLabelText('Close grapher')
    fireEvent.click(closeBtn)

    expect(screen.queryByRole('dialog', { name: '2D Function Grapher' })).not.toBeInTheDocument()
  })
it('supports multi-function plotting in 2D grapher modal', () => {
    render(<App />)
    const graphBtn = screen.getByLabelText('2D Function Grapher')
    fireEvent.click(graphBtn)

    // Initially single function f(x)
    expect(screen.getByText('f(x) =')).toBeInTheDocument()
    expect(screen.queryByText('f₂(x) =')).not.toBeInTheDocument()

    // Click to add secondary function f2(x)
    const addFnBtn = screen.getByLabelText('Add f2(x)')
    fireEvent.click(addFnBtn)

    // Now both f1(x) and f2(x) are visible
    expect(screen.getByText('f₁(x) =')).toBeInTheDocument()
    expect(screen.getByText('f₂(x) =')).toBeInTheDocument()

    // Test preset 'sin & cos'
    const sinCosPreset = screen.getByRole('button', { name: 'sin & cos' })
    fireEvent.click(sinCosPreset)

    const f1Input = screen.getByLabelText('Formula for f1(x)') as HTMLInputElement
    const f2Input = screen.getByLabelText('Formula for f2(x)') as HTMLInputElement
    expect(f1Input.value).toBe('sin(x)')
    expect(f2Input.value).toBe('cos(x)')

    // Click to remove secondary function
    const removeFnBtn = screen.getByLabelText('Remove f2(x)')
    fireEvent.click(removeFnBtn)
    expect(screen.queryByText('f₂(x) =')).not.toBeInTheDocument()
  })
})
