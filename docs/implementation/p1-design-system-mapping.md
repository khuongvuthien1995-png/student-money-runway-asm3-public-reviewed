# P1 — Figma to Tailwind Design-System Mapping

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P1 — Design System Foundation
> Created: 2026-09-15T21:59:29+10:00
> Updated: 2026-09-15T21:59:37+10:00

## Approved references inspected

- `DS-01 Foundations`
- `DS-02 Responsive Navigation`
- `DS-03 Forms & Core Controls`
- `DS-04 Financial Product Components`
- `DS-06 Feedback, States & Accessibility`
- `DS-07 Landing Website Components`
- `DS-08 Responsive Behavior & Figma Architecture`

## Semantic colour tokens

| Figma role                 | Value     | Tailwind utility example                     |
| -------------------------- | --------- | -------------------------------------------- |
| Primary blue               | `#2563EB` | `bg-primary`, `text-primary`, `ring-primary` |
| Primary pressed/focus blue | `#004AC6` | `bg-primary-pressed`                         |
| Page background            | `#F7F9FB` | `bg-background`                              |
| Surface/card               | `#FFFFFF` | `bg-surface`, `text-surface`                 |
| On-surface text            | `#191C1E` | `text-on-surface`                            |
| Muted/supporting text      | `#505F76` | `text-muted`                                 |
| Border                     | `#E2E8F0` | `border-border`                              |
| Success                    | `#16A34A` | `text-success`, `bg-success`                 |
| Warning                    | `#D97706` | `text-warning`, `bg-warning`                 |
| Danger                     | `#DC2626` | `text-danger`, `bg-danger`                   |

The neutral surface, border, and muted-text values are sampled from the approved DS-01 export; the remaining named semantic colours are specified in DS-01.

## Typography tokens

| Figma role    | Tailwind token              | Definition                             |
| ------------- | --------------------------- | -------------------------------------- |
| Money display | `text-money`                | Inter, 40px, semibold, 1.0 line height |
| Hero          | `text-hero`                 | Inter, 48px, bold, 1.1 line height     |
| H1            | `text-h1`                   | Inter, 32px, semibold, 1.2 line height |
| Body large    | `text-body-lg`              | Inter, 16px, regular, 1.5 line height  |
| Label caps    | `text-label-caps uppercase` | Inter, 12px, semibold, 0.05em tracking |

`font-sans` resolves to Inter with system fallbacks. The global stylesheet loads the required 400, 600, and 700 Inter weights.

## Spacing and radius tokens

| Figma value | Tailwind token    |
| ----------- | ----------------- |
| 8px         | `space-xs`        |
| 16px        | `space-sm`        |
| 24px        | `space-md`        |
| 32px        | `space-lg`        |
| 48px        | `space-xl`        |
| 4px radius  | `rounded-control` |
| 8px radius  | `rounded-button`  |
| 12px radius | `rounded-card`    |
| Pill radius | `rounded-pill`    |

Use the spacing tokens for margins, padding, and gaps (for example, `gap-space-md` and `px-space-sm`) instead of ad-hoc values.

## Layout and responsive tokens

| Figma contract                  | Tailwind implementation |
| ------------------------------- | ----------------------- |
| Mobile below 768px              | Base utilities          |
| Tablet from 768px               | `md:` breakpoint        |
| Desktop from 1024px             | `lg:` breakpoint        |
| Desktop content maximum 1280px  | `max-w-content`         |
| Minimum interactive target 48px | `min-h-control`         |

Later phases should use the 12-column desktop and 4-column mobile references from DS-08 without introducing further breakpoints unless a Figma reference requires one.

## Accessible foundations

- `:focus-visible` uses a 2px primary ring with a 2px offset.
- Focus remains visible for keyboard users; no global focus reset is used.
- Interactive controls should use `min-h-control` and maintain at least a 48px target.
- DS-06 status colours communicate state alongside descriptive text and icons; colour must not be the only indicator.

## Deliberate boundaries for P1

- No screens, assessed reusable components, application state, calculations, or routes are added in this phase.
- No alert-surface, badge, or hover-state neutral colours are introduced because their exact values are not explicitly specified by the approved references. They should be added only when a later Figma-matched component needs them.
