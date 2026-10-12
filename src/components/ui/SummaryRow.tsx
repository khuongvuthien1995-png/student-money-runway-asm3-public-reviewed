/**
 * @file src/components/ui/SummaryRow.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P2C — Custom Reusable Component #3
 * @createdAt 2026-09-15T22:24:52+10:00
 * @updatedAt 2026-09-16T02:02:58+10:00
 * @summary Provides reusable financial label and value summary rows.
 * @responsibility Owns financial summary-row presentation.
 */

import type { ReactNode } from 'react'

type SummaryRowEmphasis = 'default' | 'strong' | 'positive' | 'warning' | 'danger'

export interface SummaryRowProps {
  label: string
  value: ReactNode
  supportingText?: string
  emphasis?: SummaryRowEmphasis
  className?: string
}

const emphasisClasses: Record<SummaryRowEmphasis, string> = {
  default: 'text-on-surface',
  strong: 'text-primary',
  positive: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

function SummaryRow({
  label,
  value,
  supportingText,
  emphasis = 'default',
  className,
}: SummaryRowProps) {
  const rowClassName = ['min-w-0 space-y-space-xs', className].filter(Boolean).join(' ')

  return (
    <div className={rowClassName}>
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-space-sm gap-y-space-xs sm:flex-nowrap">
        <span className="min-w-0 flex-1 text-body-lg text-muted">{label}</span>
        <span
          className={`min-w-0 max-w-full break-words text-right text-body-lg font-semibold ${emphasisClasses[emphasis]}`}
        >
          {value}
        </span>
      </div>
      {supportingText ? <p className="break-words text-body-lg text-muted">{supportingText}</p> : null}
    </div>
  )
}

export default SummaryRow
