/**
 * @file src/components/ui/FormSection.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P2A — Custom Reusable Component #1
 * @createdAt 2026-09-15T22:14:43+10:00
 * @updatedAt 2026-09-15T22:17:52+10:00
 * @summary Provides reusable titled form sections with optional explanatory text.
 * @responsibility Owns repeated form-section presentation structure.
 */

import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

function FormSection({ title, description, children, className }: FormSectionProps) {
  const sectionClassName = [
    'min-w-0 max-w-full space-y-space-sm lg:rounded-card lg:border lg:border-border lg:bg-surface lg:p-space-md lg:shadow-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClassName}>
      <header className="min-w-0 space-y-space-xs">
        <h2 className="text-2xl font-semibold leading-tight text-on-surface">{title}</h2>
        {description ? <p className="break-words text-body-lg text-muted">{description}</p> : null}
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default FormSection
