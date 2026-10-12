/**
 * @file src/components/ui/StatusActionButton.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P3 — 21st.dev Integration
 * @source 21st.dev — Ruixen UI / Dynamic Status Button
 * @createdAt 2026-09-15T23:10:04+10:00
 * @updatedAt 2026-09-16T02:02:58+10:00
 * @summary Provides an animated, accessible status-aware purchase action.
 * @responsibility Owns the presentational states of an explicit status action.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export type StatusActionButtonState = 'idle' | 'processing' | 'success'

export interface StatusActionButtonProps {
  state: StatusActionButtonState
  onClick: () => void
  disabled?: boolean
  className?: string
}

const stateContent: Record<StatusActionButtonState, { label: string; liveMessage: string }> = {
  idle: { label: 'Mark as spent', liveMessage: '' },
  processing: { label: 'Confirming...', liveMessage: 'Confirmation is processing.' },
  success: { label: 'Marked as spent', liveMessage: 'Purchase marked as spent.' },
}

function StatusIcon({ state }: { state: StatusActionButtonState }) {
  if (state === 'processing') {
    return (
      <svg aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24">
        <path
          className="fill-current opacity-30"
          d="M12 2a10 10 0 1 0 10 10h-3a7 7 0 1 1-7-7V2Z"
        />
        <path className="fill-current" d="M12 2v3a7 7 0 0 1 7 7h3A10 10 0 0 0 12 2Z" />
      </svg>
    )
  }

  if (state === 'success') {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 3h9l3 3v15H6V3Z" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  )
}

function StatusActionButton({ state, onClick, disabled = false, className }: StatusActionButtonProps) {
  const reduceMotion = useReducedMotion()
  const { label, liveMessage } = stateContent[state]
  const isBusy = state === 'processing'
  const isDisabled = disabled || isBusy
  const buttonClassName = [
    'inline-flex min-h-control w-full items-center justify-center gap-space-xs rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface shadow-sm transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted motion-reduce:transition-none md:w-auto',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      aria-busy={isBusy || undefined}
      className={buttonClassName}
      disabled={isDisabled}
      onClick={onClick}
      type="button"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={state}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-space-xs"
          exit={{ opacity: 0, y: reduceMotion ? 0 : -2 }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 2 }}
          transition={{ duration: reduceMotion ? 0 : 0.16 }}
        >
          <StatusIcon state={state} />
          <span>{label}</span>
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite" className="sr-only">
        {liveMessage}
      </span>
    </button>
  )
}

export default StatusActionButton
