import React from 'react'
import styles from './Keypad.module.css'

export type KeyVariant =
  | 'number'
  | 'operator'
  | 'action'
  | 'scientific'
  | 'destructive'
  | 'primary'

interface KeyButtonProps {
  label: React.ReactNode
  onClick: () => void
  variant?: KeyVariant
  ariaLabel?: string
  title?: string
  disabled?: boolean
  spanTwo?: boolean
  active?: boolean
  className?: string
}

export const KeyButton: React.FC<KeyButtonProps> = ({
  label,
  onClick,
  variant = 'number',
  ariaLabel,
  title,
  disabled = false,
  spanTwo = false,
  active = false,
  className = '',
}) => {
  const variantClass = {
    number: styles.variantNumber,
    operator: styles.variantOperator,
    action: styles.variantAction,
    scientific: styles.variantScientific,
    destructive: styles.variantDestructive,
    primary: styles.variantPrimary,
  }[variant]

  return (
    <button
      type="button"
      className={`${styles.keyBtn} ${variantClass} ${spanTwo ? styles.spanTwoCols : ''} ${
        active ? styles.sciActive : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
      title={title}
    >
      {label}
    </button>
  )
}
