S — SITUATION

Continue Student Money Runway BUS4012 ASM2.

Before doing anything, read:

docs/prompts/00-master-project-context.md
docs/figma-reference/README.md

Then inspect the approved design-system references under:

docs/figma-reference/design-system/

Current phase:
P1 — Design System → Tailwind Tokens.

The React/Vite/Tailwind v3 foundation already exists.

C — CHALLENGE

Translate the approved ASM1 Figma design system into a centralised,
maintainable Tailwind CSS v3 implementation.

The goal is NOT to build application screens yet.

The goal is to establish one visual source of truth so later components and
pages do not hard-code arbitrary colours, spacing, radii or typography.

A — AUDIENCE

The interface serves international university students managing short-horizon
living expenses.

The visual style must remain:

- clear
- calm
- transparent
- practical
- readable
- non-judgmental

F — FORMAT

Use:

- Tailwind CSS v3
- existing tailwind.config.js
- src/index.css
- existing React + TypeScript project

Inspect before changing:

- tailwind.config.js
- src/index.css
- src/App.tsx
- docs/figma-reference/design-system/*

Implement semantic Tailwind tokens for the approved values.

Required known colours:

primary: #2563EB
background: #F7F9FB
on-surface: #191C1E
success: #16A34A
warning: #D97706
danger: #DC2626

Use supporting surface/border tokens only where clearly supported by the
approved Figma references.

Typography:

Inter

Money display:
40px / semibold

Hero:
48px / bold

H1:
32px / semibold

Body large:
16px / regular

Label caps:
12px / semibold / 0.05em letter spacing

Spacing authority:

8
16
24
32
48

Radius:

4
8
12
9999

Responsive contract:

md = 768px
lg = 1024px

Desktop content reference:
1280px maximum

F — FOUNDATIONS

Follow Week 5 UI-kit theory:

- centralise brand values
- avoid repeated hard-coded values
- prepare for reusable React components
- do not create page-specific styling yet

Accessibility:

- preserve visible focus
- minimum interactive target reference: 48px
- do not remove focus outlines globally

DO NOT:

- create final pages
- create assessed components
- implement state
- implement calculations
- install dependencies
- integrate 21st.dev
- redesign the product

Create:

docs/implementation/p1-design-system-mapping.md

Document Figma → Tailwind mappings.

VALIDATION

Run:

npm run lint
npm run build

If both pass, optionally use the temporary starter screen only to verify tokens
visually.

FINAL REPORT

Report:

- references inspected
- files modified
- tokens created
- ambiguities
- lint result
- build result

Do not proceed to P2.

Finish:

P1 DESIGN SYSTEM READY