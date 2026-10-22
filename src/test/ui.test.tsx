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
    const historyBtn = screen.getByTitle('History (H)')
    fireEvent.click(historyBtn)

    expect(screen.getByRole('dialog', { name: 'Calculation History' })).toBeInTheDocument()
    expect(screen.getByText('No calculations yet')).toBeInTheDocument()
  })
})
