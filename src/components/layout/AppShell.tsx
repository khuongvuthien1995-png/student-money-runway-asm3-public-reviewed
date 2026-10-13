/**
 * @file src/components/layout/AppShell.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P4 — Router + Page Skeletons
 * @createdAt 2026-09-15T23:23:08+10:00
 * @updatedAt 2026-09-16T02:02:58+10:00
 * @summary Provides the repeated responsive application navigation structure.
 * @responsibility Owns shared application-shell navigation and content boundaries.
 * @integration ASM3 C2 (2026-10-13): real Auth/API state and strict cents boundaries.
 */

import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import SessionControls from './SessionControls'

interface AppShellProps {
  children: ReactNode
}

const navigationItems = [
  { label: 'Runway', to: '/runway', icon: 'runway' },
  { label: 'Check', to: '/purchase', icon: 'check' },
  { label: 'Edit plan', to: '/setup', icon: 'manage' },
]

function navigationClassName(isActive: boolean) {
  return [
    'inline-flex min-h-control flex-col items-center justify-center gap-0.5 border-t-2 border-transparent px-space-sm text-sm font-semibold lg:flex-row lg:gap-space-xs lg:border-t-0 lg:border-b-2 lg:text-body-lg',
    isActive ? 'border-primary text-primary' : 'text-muted hover:text-on-surface',
  ].join(' ')
}

function NavigationIcon({ icon }: { icon: (typeof navigationItems)[number]['icon'] }) {
  const commonProps = {
    'aria-hidden': true,
    className: 'h-5 w-5 lg:hidden',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24',
  }

  if (icon === 'check') {
    return (
      <svg {...commonProps}>
        <path d="M5 4h11l3 3v13H5V4Z" />
        <path d="M8 11h8M8 15h5" />
      </svg>
    )
  }

  if (icon === 'manage') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20.3H11.3v-.1a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 6.62 15a1.7 1.7 0 0 0-1.56-1.04H5v-3h.06a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.56v-.1h3.4v.1A1.7 1.7 0 0 0 15.78 5a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04H21v3h-.06A1.7 1.7 0 0 0 19.4 15Z" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <path d="m4 16 5-5 3 3 7-7" />
      <path d="M14 7h5v5" />
    </svg>
  )
}

function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="hidden border-b border-border bg-surface lg:block">
        <div className="mx-auto flex min-h-control max-w-content items-center justify-between px-space-md">
          <NavLink className="text-2xl font-semibold text-on-surface" to="/runway">
            Student Money Runway
          </NavLink>
          <nav aria-label="Primary navigation" className="flex items-center gap-space-xs">
            {navigationItems.map((item) => (
              <NavLink className={({ isActive }) => navigationClassName(isActive)} key={item.to} to={item.to}>
                <NavigationIcon icon={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <SessionControls />
      <main className="mx-auto min-h-screen w-full max-w-content min-w-0 px-space-md py-space-lg pb-24 lg:min-h-0 lg:pb-space-xl">
        {children}
      </main>

      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-10 grid min-h-control grid-cols-3 border-t border-border bg-surface lg:hidden"
      >
        {navigationItems.map((item) => (
          <NavLink className={({ isActive }) => navigationClassName(isActive)} key={item.to} to={item.to}>
            <NavigationIcon icon={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default AppShell
