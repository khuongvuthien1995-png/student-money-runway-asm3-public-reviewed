/**
 * @file src/components/ui/MoneyInput.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P10 — Validation + Accessibility + Ethics + Source Hygiene
 * @createdAt 2026-09-15T22:23:57+10:00
 * @updatedAt 2026-09-16T02:20:10+10:00
 * @summary Provides a controlled AUD monetary input with accessible supporting states and optional blur reporting.
 * @responsibility Owns monetary input presentation, change forwarding, and interaction-event reporting.
 */

import type { ChangeEvent } from 'react'

export interface MoneyInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onBlur?: () => void
}

function MoneyInput({
  id,
  label,
  value,
  onChange,
  helperText,
  error,
  required = false,
  disabled = false,
  className,
  onBlur,
}: MoneyInputProps) {
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined
  const containerClassName = ['min-w-0 space-y-space-xs', className].filter(Boolean).join(' ')
  const controlClassName = error
    ? 'border-danger focus-within:ring-danger'
    : 'border-border focus-within:ring-primary'

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  return (
    <div className={containerClassName}>
      <label className="text-label-caps uppercase text-muted" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>

      <div
        className={`flex min-h-control rounded-control border bg-surface transition-shadow focus-within:ring-2 focus-within:ring-offset-2 ${controlClassName} ${disabled ? 'opacity-60' : ''}`}
      >
        <span
          aria-hidden="true"
          className="flex items-center border-r border-border bg-background px-space-sm text-label-caps text-muted"
        >
          AUD
        </span>
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 bg-transparent px-space-sm text-body-lg text-on-surface outline-none disabled:cursor-not-allowed"
          disabled={disabled}
          id={id}
          inputMode="decimal"
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          type="text"
          value={value}
        />
      </div>

      {helperText ? (
        <p className="text-body-lg text-muted" id={helperId}>
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className="text-body-lg text-danger" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default MoneyInput
