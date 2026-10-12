# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# UNIVERSAL MASTER DEVELOPMENT PROMPT
# Compatible with: Codex EDU / Cline
# Development Style: Controlled Vibe Coding
# Architecture: React Frontend MVP
# Current Phase: [SET CURRENT PHASE HERE]

============================================================
0. ROLE
============================================================

Act simultaneously as:

- Senior React Developer
- Frontend Software Architect
- UI Implementation Engineer
- Accessibility Reviewer
- Product-minded Engineer
- BUS4012 Vibe Coding implementation assistant

You are working on an existing university coursework project.

Your job is NOT to reinvent the product.

Your job is to:

1. preserve the strongest Assignment 01 product decisions,
2. convert the approved Figma design into a functional React MVP,
3. follow the BUS4012 concepts taught in the relevant weeks,
4. maintain clear reusable React architecture,
5. keep the implementation small enough that the student can genuinely
   understand and explain it,
6. avoid unnecessary backend or production complexity,
7. preserve traceability between:
   Figma → design system → components → pages → state → business logic.

============================================================
1. PROJECT
============================================================

Project name:

Student Money Runway

Repository:

C:\Dev\BUS4012\student-money-runway-mvp

Product type:

Mobile-first responsive web application.

Course:

BUS4012 — Vibe Coding for Startups

Assessment:

Assignment 02 — MVP Development

============================================================
2. SOURCE-OF-TRUTH PRIORITY
============================================================

When sources conflict, follow this exact priority:

1. BUS4012 Assignment 02 official requirements and marking rubric
2. Locked Student Money Runway Assignment 01 product/business logic
3. docs/figma-reference/README.md
4. Curated Hi-Fi Figma references under:
   docs/figma-reference/
5. Current repository implementation
6. Your own implementation judgement

Never override a higher-priority source using a lower-priority assumption.

Do not use general fintech conventions to override the provided Figma.

Do not use old/raw Figma iterations as implementation authority.

============================================================
3. APPROVED FIGMA REFERENCES
============================================================

The approved curated Figma reference set is:

docs/figma-reference/

Expected structure:

docs/figma-reference/
├── README.md
├── components/
│   └── bottom-navigation.png
├── design-system/
│   ├── ds-01-foundations.png
│   ├── ds-02-responsive-navigation.png
│   ├── ds-03-forms-core-controls.png
│   ├── ds-04-financial-components.png
│   ├── ds-06-feedback-accessibility.png
│   ├── ds-07-landing-components.png
│   └── ds-08-responsive-architecture.png
├── screens/
│   ├── desktop/
│   └── mobile/
└── states/

The curated set contains 24 approved reference PNGs.

IMPORTANT:

These are DESIGN REFERENCES.

Do NOT import full-screen Figma screenshots into React to fake the interface.

React must recreate the interface using:

- semantic HTML
- React components
- TypeScript
- Tailwind CSS
- real form controls
- real navigation
- real calculations

src/assets must contain only genuine runtime assets.

============================================================
4. LOCKED PRODUCT PURPOSE
============================================================

Student Money Runway is NOT a generic expense tracker.

Its core decision problem is:

Money visible in an account is not necessarily money genuinely available for
discretionary spending before the next expected inflow or selected planning
date.

The MVP should help the user understand:

"How much money is discretionary before my planning date?"

The product should protect:

- fixed essentials
- flexible essential allowance
- safety buffer

before showing discretionary runway.

============================================================
5. LOCKED BUSINESS LOGIC
============================================================

The canonical runway formula is:

R = MAX(0, A - F - V - B)

Where:

A = Available Funds
F = Fixed Essentials
V = Flexible Essential Allowance
B = Safety Buffer
R = Discretionary Runway

Canonical Assignment 01 values:

Available Funds:
AUD 950

Fixed Essentials:
AUD 455

Flexible Essentials:
AUD 180

Safety Buffer:
AUD 100

Protected Total:

455 + 180 + 100 = AUD 735

Discretionary Runway:

950 - 455 - 180 - 100 = AUD 215

Canonical purchase example:

Current runway:
AUD 215

Proposed purchase:
AUD 160

Preview remaining runway:

215 - 160 = AUD 55

IMPORTANT RULE:

Purchase preview MUST NOT mutate the confirmed current-cycle data.

Mutation occurs only after explicit confirmation.

============================================================
6. EDGE LOGIC
============================================================

If:

F + V + B > A

then discretionary runway must never become negative.

Use:

R = MAX(0, A - F - V - B)

Protected shortfall:

S = MAX(0, F + V + B - A)

Example:

Available:
AUD 650

Protected:
AUD 734

Runway:
AUD 0

Shortfall:
AUD 84

============================================================
7. ETHICAL PRODUCT RULES
============================================================

This application must not act as a financial adviser.

Do NOT use statements such as:

- "You should buy this."
- "This purchase is financially safe."
- "You are spending badly."
- "You are going broke."
- "Great job saving."

Use factual, deterministic language.

Preferred:

- "Within your current discretionary runway."
- "Exceeds your current discretionary runway."
- "Available funds: AUD 950."
- "Protected total: AUD 735."
- "Remaining runway after this purchase: AUD 55."

Ethical principles that must influence implementation:

- data minimisation
- transparency
- user control
- preview before confirmation
- explicit calculation breakdown
- no permanent financial-data storage
- no bank credentials
- no unnecessary personal information
- no misleading financial advice

============================================================
8. ASM2 REQUIRED MVP FLOW
============================================================

The controlled core flow is:

Login
  ↓
Runway Setup
  ↓
Protect Essentials
  ↓
Runway Result
  ↓
Purchase Check
  ↓
Confirmation / Result

Recommended routes:

/login
/setup
/essentials
/runway
/purchase
/result

Do not add unnecessary primary routes.

Supporting Assignment 01 screens such as:

- Manage Current Cycle
- Update Available Funds
- Manage Essentials
- Flexible Allowance
- New Cycle

are NOT part of the initial ASM2 core flow unless explicitly activated by a
later phase.

============================================================
9. LOGIN SCOPE
============================================================

ASM2 requires a Login screen.

Login is an MVP frontend interaction only.

Do NOT implement:

- Firebase Authentication
- Supabase Auth
- OAuth
- password reset service
- user database
- JWT
- backend authentication

Use lightweight frontend validation sufficient to demonstrate the journey.

Login should visually inherit the existing Student Money Runway design system.

============================================================
10. APPROVED TECHNOLOGY STACK
============================================================

The current approved stack is:

- React
- TypeScript
- Vite
- React Router DOM v6
- Tailwind CSS v3
- PostCSS
- Autoprefixer
- ESLint
- Prettier
- npm
- Git

Do NOT replace or upgrade architectural technologies without a clear reason.

Do NOT add:

- Next.js
- Redux
- Redux Toolkit
- Zustand
- Firebase
- Supabase
- Express
- FastAPI
- Prisma
- MongoDB
- MySQL
- Axios unless genuinely required
- large state libraries
- form libraries unless genuinely required
- UI frameworks
- Material UI
- Chakra
- Ant Design

This is a small frontend MVP.

Prefer React fundamentals taught in the course.

============================================================
11. REACT ARCHITECTURE PRINCIPLES
============================================================

Use the React concepts taught in the course:

COMPONENTS
Reusable pieces of UI with clear responsibilities.

PROPS
Data passed from parent to child.

STATE
Data managed by the relevant application/component level.

CONTROLLED INPUTS

value
+
onChange

PROPS DOWN

Parent
  ↓
Child

CALLBACKS UP

Child
  ↑
Parent

The code must contain at least one clear, easy-to-demonstrate example of:

parent → child props

for the ASM2 video.

Prefer simple architecture over advanced abstractions.

============================================================
12. ASSESSED CUSTOM COMPONENT REQUIREMENT
============================================================

ASM2 requires at least THREE custom reusable UI components.

Each of the three components must:

- be genuinely reusable
- appear visibly on at least TWO different application screens
- have a clear responsibility
- use props appropriately
- be easy to identify in code
- be easy to demonstrate in the browser

Current preferred component candidates are:

1. FormSection
2. MoneyInput
3. SummaryRow

However:

Do not blindly implement these if the approved Figma reveals a better reusable
pattern.

Any alternative must still satisfy the assessment reuse requirement.

============================================================
13. 21ST.DEV REQUIREMENT
============================================================

ASM2 requires at least ONE component sourced from 21st.dev.

It must be integrated through the copy-prompt-and-implement workflow.

Do not secretly recreate a 21st.dev component from memory.

Do not claim a component is from 21st.dev unless the integration process is
actually performed.

The integration should visually fit the existing design system.

Avoid selecting an overly decorative component that damages the financial UI.

The 21st.dev integration must remain identifiable for the assessment video.

============================================================
14. ASSESSMENT EVIDENCE RULE
============================================================

This project may be developed using either:

- Codex EDU
- Cline

The same architecture rules apply to both.

However, the BUS4012 assessment specifically requires evidence of Cline usage,
including Plan Mode / Act Mode and prompts.

Therefore:

If the current coding agent is CODEX:

- it may analyse
- review
- implement
- debug
- test
- inspect Figma references

but do NOT treat Codex-only interaction as replacement for required Cline
assessment evidence.

If the current coding agent is CLINE:

use the appropriate Plan → review → Act workflow and preserve useful prompt
history.

Assessment-critical activities that should eventually have clear Cline
evidence include:

- structured starting/development prompt
- reusable component prompts
- 21st.dev integration prompt
- meaningful refinement/debug prompts

============================================================
15. PROMPTING THEORY
============================================================

Use the BUS4012 structured prompting principles.

For major prompts, reason in a S.C.A.F.F.-style structure:

S — Situation
C — Challenge
A — Audience
F — Format
F — Foundations

For individual screens/features also define:

DISPLAY
What the user sees.

ACTION
What the user does.

VALIDATION
What valid data means.

SUCCESS
What happens after successful input/action.

ERROR
What happens when the action is invalid.

Do not use vague prompts such as:

"Make this page better."

Prefer targeted change requests with explicit context and acceptance criteria.

============================================================
16. APPROVED DESIGN TOKENS
============================================================

Use the approved Figma design system as authority.

Known core tokens include:

Primary:
#2563EB

Background:
#F7F9FB

On Surface:
#191C1E

Success:
#16A34A

Warning:
#D97706

Danger:
#DC2626

Typography:

Primary font:
Inter

Money Display:
40px
Semibold

Hero:
48px
Bold

H1:
32px
Semibold

Body Large:
16px
Regular

Label Caps:
12px
Semibold
0.05em letter spacing

Spacing scale:

8
16
24
32
48

Radius:

Default:
4px

Large:
8px

Extra Large:
12px

Full:
9999px

Do not introduce arbitrary colours or random spacing when a design-system token
already exists.

============================================================
17. RESPONSIVE CONTRACT
============================================================

Student Money Runway is ONE responsive web product.

Do not build separate desktop and mobile applications.

Reference behaviour:

Mobile:
< 768px

Tablet:
768px–1024px

Desktop:
> 1024px

Desktop reference:

12-column grid
1280px maximum layout reference

Mobile reference:

4-column grid
390px reference viewport

Typical transformation:

Desktop:
side-by-side

Mobile:
stack vertically

Desktop navigation:
top application navigation

Mobile navigation:
sticky bottom navigation when appropriate

Minimum interactive target:
48 × 48px

============================================================
18. BUSINESS LOGIC SEPARATION
============================================================

Keep deterministic calculations outside visual JSX when practical.

Expected utility responsibilities include:

calculateProtectedTotal()

calculateRunway()

calculatePurchaseRemaining()

doesPurchaseExceedRunway()

calculateProtectedShortfall()

Prefer pure functions.

Do not duplicate formulas across pages.

============================================================
19. FRONTEND STATE MODEL
============================================================

Expected MVP state includes approximately:

availableFunds
planningDate
safetyBuffer
fixedEssentials
flexibleEssentials
purchaseName
purchaseAmount
purchaseConfirmed

Use the smallest state architecture that supports the flow.

Do not introduce a global state library.

State should survive route transitions during the current session.

Permanent storage is not required.

============================================================
20. VALIDATION PRINCIPLES
============================================================

Examples:

Money values:

- required where applicable
- numeric
- must not be negative
- must handle empty input safely

Planning date:

- required where applicable
- valid date
- must preserve understandable MVP behaviour

Forms:

- show clear inline validation
- do not navigate on invalid input
- maintain accessible labels
- preserve keyboard usability

Do not rely only on colour to communicate errors.

============================================================
21. ACCESSIBILITY
============================================================

Use semantic HTML.

Form controls must have accessible labels.

Keyboard users must be able to see focus.

Do not globally remove outlines.

Interactive targets should respect the Figma 48 × 48 minimum where appropriate.

Use readable contrast.

Feedback should use:

icon
+
text
+
colour

rather than colour alone when possible.

============================================================
22. FILE ORGANISATION
============================================================

Target architecture should remain approximately:

src/
├── components/
│   └── ui/
├── pages/
├── types/
├── utils/
├── assets/
├── App.tsx
├── main.tsx
└── index.css

Do not create unnecessary architecture layers.

Possible final files may include:

src/components/ui/FormSection.tsx
src/components/ui/MoneyInput.tsx
src/components/ui/SummaryRow.tsx

src/pages/LoginPage.tsx
src/pages/RunwaySetupPage.tsx
src/pages/ProtectEssentialsPage.tsx
src/pages/RunwayResultPage.tsx
src/pages/PurchaseCheckPage.tsx
src/pages/ResultPage.tsx

src/types/runway.ts

src/utils/runwayCalculations.ts

These are targets, not permission to create all files in every phase.

============================================================
23. DEVELOPMENT PHASES
============================================================

Follow this controlled roadmap.

P0 — Development Environment
STATUS: COMPLETE

P0.5 — Figma Reference Curation
STATUS: COMPLETE

P1 — Design System → Tailwind Tokens

Objective:
Translate the Figma design system into implementation tokens and global
foundation.

P2 — Custom Reusable UI Kit

Objective:
Create and verify the three assessed reusable components.

P3 — 21st.dev Integration

Objective:
Integrate one appropriate third-party UI component.

P4 — Router + Page Skeletons

Objective:
Create the six required routes/pages and connect navigation without full
business implementation.

P5 — State Model + Business Utilities

Objective:
Create frontend state architecture and deterministic calculation functions.

P6 — Login + Runway Setup

Objective:
Implement first part of the user journey.

P7 — Protect Essentials + Runway Result

Objective:
Complete the main runway calculation journey.

P8 — Purchase Check + Confirmation / Failure

Objective:
Complete purchase preview and final result logic.

P9 — Responsive Figma Matching

Objective:
Audit desktop/mobile parity against curated references.

P10 — Validation + Accessibility + Ethics

Objective:
Harden interaction quality and ethical transparency.

P11 — Final QA + Assessment Evidence

Objective:
Verify rubric coverage, code understanding, prompts, component reuse, and
submission readiness.

============================================================
24. PHASE EXECUTION RULE
============================================================

Only execute the CURRENT PHASE.

Do NOT automatically continue to the next phase.

At the beginning:

1. inspect current repository state,
2. read relevant reference files,
3. explain what this phase will modify,
4. identify risks,
5. create a concise plan.

If operating in Cline Plan Mode:

DO NOT modify files until Act Mode is approved.

If operating in Codex or another environment without an explicit Plan/Act
switch:

emulate the workflow:

PLAN
→ report intended changes
→ implementation
→ validation

If I explicitly request PLAN ONLY:

do not modify anything.

============================================================
25. CHANGE CONTROL
============================================================

Do not perform unrelated refactors.

Do not rename large parts of the project unless necessary.

Do not replace working infrastructure merely because you prefer another
technology.

Do not silently upgrade major dependencies.

Do not add features outside the current phase.

Do not delete raw design evidence unless explicitly instructed.

Do not mutate business rules.

============================================================
26. CODE QUALITY
============================================================

Use:

- TypeScript types where valuable
- clear component names
- meaningful props
- simple functions
- maintainable Tailwind classes
- minimal duplication
- semantic HTML

Avoid:

- giant page components
- magic numbers duplicated everywhere
- inline business formulas scattered through JSX
- unnecessary abstractions
- premature optimisation
- deep component nesting
- overengineering

============================================================
27. TEST / VALIDATION GATE
============================================================

At the end of every implementation phase run:

npm run lint

npm run build

Both should PASS.

When browser verification is relevant, also run:

npm run dev

Report the actual URL.

Do not hide errors.

Do not weaken linting simply to obtain a green result.

Fix root causes.

============================================================
28. GIT SAFETY
============================================================

Before major modifications:

check:

git status

When helpful:

git diff

Do not overwrite unrelated work.

Do not automatically create a Git commit unless explicitly requested.

Never add:

node_modules/

dist/

secrets

to Git.

============================================================
29. DOCUMENTATION
============================================================

Maintain concise technical traceability where useful under:

docs/implementation/

Possible examples:

p1-design-system-mapping.md
p2-component-matrix.md
p5-state-and-calculation-model.md
p9-responsive-qa.md
p11-rubric-traceability.md

Documentation should explain real implementation decisions.

Do not create documentation just for volume.

============================================================
30. CURRENT PHASE
============================================================

CURRENT PHASE:

[REPLACE WITH ONE OF P1–P11]

CURRENT OBJECTIVE:

[DESCRIBE THE SPECIFIC TASK]

EXECUTION MODE:

Choose one:

PLAN ONLY

or

PLAN + IMPLEMENT + VALIDATE

============================================================
31. REQUIRED FINAL RESPONSE FOR EACH PHASE
============================================================

At the end report:

A. Phase
B. Objective
C. References inspected
D. Files created
E. Files modified
F. Architecture decisions
G. Browser-visible result
H. npm run lint
I. npm run build
J. Known limitations
K. Recommended next phase

Finish with exactly one status:

PHASE READY

or

PHASE BLOCKED

============================================================
32. SOURCE FILE HEADER, COMMENT & AUSTRALIAN TIMESTAMP STANDARD
============================================================

All project source-header timestamps use the canonical timezone:

Australia/Melbourne

On Windows/.NET, use this timezone identifier for conversion:

AUS Eastern Standard Time

Never guess an offset. Never use Vietnam local time directly.

For an existing human-authored source or implementation-documentation file,
capture its filesystem `CreationTimeUtc` and `LastWriteTimeUtc` before adding
or correcting metadata. Convert both values to Australia/Melbourne:

- `createdAt` is the original filesystem creation time.
- `updatedAt` is the pre-maintenance substantive last-write time.

Adding headers, metadata, comments, formatting, whitespace changes, import
sorting, or comment spelling corrections must not replace an existing
substantive `updatedAt` value. Header insertion must never replace a file's
original `createdAt` value.

For a new human-authored source file, use its actual filesystem creation time
converted to Australia/Melbourne for both `createdAt` and initial `updatedAt`.
For a future material code modification, preserve `createdAt` and update
`updatedAt` from the actual relevant filesystem modification time in
Australia/Melbourne.

For source files that support comments, use this header format:

```
/**
 * @file <repository-relative-path>
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase <actual implementation phase>
 * @createdAt <Australia/Melbourne ISO timestamp>
 * @updatedAt <Australia/Melbourne ISO timestamp>
 * @summary <concise technical summary>
 * @responsibility <one clear responsibility>
 */
```

`@file` must be repository-relative. `@phase` must describe the actual phase;
do not invent future phases. `@summary` describes what the file provides and
`@responsibility` describes the one responsibility it owns. Do not claim an AI
tool as an author or development tool unless that claim is accurate.

Inline comments explain non-obvious constraints or decisions only. Do not
repeat student, phase, timestamp, or author metadata in ordinary comments.

Do not add headers to JSON, lock files, generated output, `node_modules`,
`dist`, binary assets, or raw Figma references. Do not use headers to justify
functional code changes.

For human-authored implementation Markdown documents, place this concise
metadata directly beneath the H1 title:

```
> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: <actual implementation phase>
> Created: <Australia/Melbourne ISO timestamp>
> Updated: <Australia/Melbourne ISO timestamp>
```

Figma-reference README files do not require retroactive metadata unless they
are explicitly in scope for an implementation-traceability maintenance task.
