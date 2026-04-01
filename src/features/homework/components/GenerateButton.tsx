import React from 'react'

type Props = {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

export function GenerateButton({
  children,
  loading,
  disabled,
  onClick,
  type = 'button',
  className = '',
}: Props) {
  return (
    <button
      type={type}
      className={`primary-button homework-gen-btn text-lg px-6 py-3 ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? '…' : children}
    </button>
  )
}
