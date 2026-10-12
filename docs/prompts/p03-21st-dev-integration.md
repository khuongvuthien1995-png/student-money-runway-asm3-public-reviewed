# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# P3 — 21ST.DEV THIRD-PARTY UI INTEGRATION
# ONE-SHOT MASTER PROMPT
#
# Student: Thien Khuong Vu
# Compatible with: Codex EDU / Cline
#
# EXECUTION MODE:
# INSPECT → SOURCE → PRESERVE → IMPLEMENT → ADAPT → VALIDATE → DOCUMENT → STOP
#
# IMPORTANT:
# Execute the complete P3 workflow in this single task.
# Do not ask me to run separate P3A/P3B/P3C phases unless external access
# genuinely prevents you from obtaining the real 21st.dev source/prompt.
#
# P3 must NOT continue to P4.

============================================================
0. ROLE
============================================================

Act simultaneously as:

- Senior React Developer
- Frontend Software Architect
- UI Integration Engineer
- Accessibility Reviewer
- Product-minded Engineer
- BUS4012 Vibe Coding implementation assistant

You are continuing an existing BUS4012 university coursework repository.

Your responsibility in P3 is to integrate exactly ONE genuine third-party UI
component sourced from 21st.dev.

You must preserve clear provenance and assessment evidence.

Do NOT fabricate third-party provenance.

============================================================
1. PROJECT
============================================================

Project:

Student Money Runway

Course:

BUS4012 — Vibe Coding for Startups

Assessment:

Assignment 02 — MVP Development

Repository:

C:\Dev\BUS4012\student-money-runway-mvp

Student:

Thien Khuong Vu

Current phase:

P3 — 21st.dev Integration

============================================================
2. COMPLETED BASELINE
============================================================

The following are COMPLETE:

P0
Development Environment

P0.5
Figma Reference Curation

P1
Design System Foundation

P2A
FormSection

P2B
MoneyInput

P2C
SummaryRow

P2
Custom Reusable UI Kit Gate

P1/P2
Header / Australian Timestamp Traceability

Do NOT redo these phases.

============================================================
3. READ ALL BINDING CONTEXT
============================================================

Before modifying anything, read:

docs/prompts/00-master-project-context.md

Then read:

docs/implementation/p1-design-system-mapping.md
docs/implementation/p2-component-matrix.md
docs/figma-reference/README.md

Inspect:

src/components/ui/FormSection.tsx
src/components/ui/MoneyInput.tsx
src/components/ui/SummaryRow.tsx

Inspect relevant approved Figma references under:

docs/figma-reference/design-system/
docs/figma-reference/screens/
docs/figma-reference/states/
docs/figma-reference/components/

Pay special attention to:

ds-03-forms-core-controls.png
ds-04-financial-components.png
ds-06-feedback-accessibility.png
ds-08-responsive-architecture.png

Before changing anything also run:

git status

Inspect:

package.json
package-lock.json

============================================================
4. SOURCE PRIORITY
============================================================

Follow this authority order:

1. BUS4012 ASM2 requirements
2. Locked ASM1 Student Money Runway business logic
3. docs/prompts/00-master-project-context.md
4. curated Hi-Fi Figma references
5. P1 design system
6. P2 custom components
7. genuine 21st.dev source component
8. implementation judgement

The external component must adapt to Student Money Runway.

Student Money Runway must NOT be redesigned around the external component.

============================================================
5. BUS4012 WEEK 5 THEORY
============================================================

This phase implements the Week 5 third-party UI workflow:

Existing UI Kit
        ↓
Select additional UI component
        ↓
Obtain component from 21st.dev
        ↓
Use copy-prompt-and-implement workflow
        ↓
Coding agent implements component
        ↓
Adapt it to project design system
        ↓
Validate reuse/integration

This third-party component is separate from the three custom components:

FormSection
MoneyInput
SummaryRow

Do not replace those components.

============================================================
6. LOCKED 21ST.DEV TARGET
============================================================

Use this genuine 21st.dev component as the primary source:

Component:

Dynamic Status Button

Author / library:

Ruixen UI

21st.dev URL:

https://21st.dev/@ruixen.ui/components/dynamic-status-button

Intended Student Money Runway usage:

Purchase confirmation action

Future user-facing action:

Mark as spent

The component should ultimately be capable of communicating interaction states
such as:

IDLE
Mark as spent

PROCESSING
Confirming...

SUCCESS
Marked as spent

IMPORTANT:

P3 must NOT implement the real purchase mutation business logic yet.

That belongs to P8.

In P3, use temporary/demo state only for component verification.

============================================================
7. REAL 21ST.DEV SOURCE RETRIEVAL
============================================================

Access the specified 21st.dev component page.

Verify:

- component exists
- component identity
- author/source
- available Copy Prompt / implementation instruction
- component implementation
- required dependencies

Obtain the REAL 21st.dev copied prompt/instruction from the source.

Do NOT generate your own fake 21st.dev prompt.

Do NOT claim provenance based only on the component name.

If the environment can access the component page and retrieve the actual
Copy Prompt/instruction:

continue automatically.

If the page is accessible but the Copy Prompt UI cannot be programmatically
retrieved, inspect the genuine 21st.dev component implementation and report this
limitation clearly.

Only if external access is genuinely impossible may you stop with:

P3 EXTERNAL SOURCE ACCESS BLOCKED

Do not stop merely because a placeholder is absent from this prompt.

There is intentionally NO placeholder requiring manual replacement.

============================================================
8. PRESERVE 21ST.DEV EVIDENCE
============================================================

Create:

docs/prompts/p03-21st-dev-original-prompt.md

Preserve the actual 21st.dev prompt/instruction VERBATIM when retrievable.

Use:

# P3 — Original 21st.dev Prompt

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P3 — 21st.dev Integration
> Source: 21st.dev
> Component: Dynamic Status Button
> Source URL: https://21st.dev/@ruixen.ui/components/dynamic-status-button
> Created: <actual Melbourne filesystem timestamp>
> Updated: <actual Melbourne filesystem timestamp>

## Original Prompt

<actual unmodified 21st.dev copied prompt/instruction>

## Local Integration Notes

Document project-specific adaptations separately.

Never mix local modifications into the Original Prompt section.

If the source page does not expose copy-prompt text to the coding environment,
document that limitation truthfully rather than fabricating text.

============================================================
9. PRESERVE THIS P3 MASTER PROMPT
============================================================

Ensure this P3 task specification is preserved at:

docs/prompts/p03-21st-dev-integration.md

If the file already exists:

do not overwrite meaningful user-authored content unnecessarily.

Ensure the final repository retains clear evidence of:

- project P3 integration instructions
- genuine 21st.dev source
- implementation documentation

============================================================
10. SOURCE COMPONENT ANALYSIS
============================================================

Before implementation, inspect the genuine component carefully.

Determine:

- component API
- internal state
- animation behaviour
- accessibility behaviour
- dependencies
- styling assumptions
- Tailwind assumptions
- React assumptions

Identify incompatibilities with the current project.

The current stack is:

React
TypeScript
Vite
Tailwind CSS v3
React Router DOM v6

Do NOT upgrade project infrastructure merely because the source component was
written for a different environment.

============================================================
11. DEPENDENCY CONTROL
============================================================

Inspect package.json first.

Install ONLY dependencies genuinely required by the selected 21st.dev component.

The source currently appears to use animation functionality.

Verify the real source before installation.

If the genuine component requires:

framer-motion

install the compatible required dependency.

Do not blindly install unrelated libraries.

If icon dependencies are required:

first evaluate whether the project can use existing semantic/simple assets.

If the genuine source requires an icon package for the component to work,
install only the actual required dependency and document it.

Do NOT install:

- full shadcn component library unless genuinely required
- Material UI
- Chakra
- Ant Design
- Redux
- Zustand
- backend packages
- Firebase
- Supabase
- unrelated animation libraries

Do not upgrade:

React
Vite
Tailwind
React Router

============================================================
12. COMPONENT IMPLEMENTATION
============================================================

Create an appropriately named component under:

src/components/ui/

Use a semantic name based on responsibility.

Preferred naming if consistent with the genuine source adaptation:

StatusActionButton.tsx

or retain:

DynamicStatusButton.tsx

if keeping the source component identity is clearer for provenance.

Do NOT name it:

TwentyFirstComponent.tsx

The implementation must remain clearly traceable to the genuine 21st.dev source.

============================================================
13. SOURCE HEADER STANDARD
============================================================

Any new human-authored/adapted source file must follow:

docs/prompts/00-master-project-context.md

Required header example structure:

/**
 * @file src/components/ui/<file>.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P3 — 21st.dev Integration
 * @source 21st.dev — Ruixen UI / Dynamic Status Button
 * @createdAt <actual Australia/Melbourne filesystem creation timestamp>
 * @updatedAt <actual Australia/Melbourne filesystem timestamp>
 * @summary <concise summary>
 * @responsibility <single responsibility>
 */

Use:

Australia/Melbourne

Windows equivalent:

AUS Eastern Standard Time

Do NOT use Vietnam time.

Do NOT manually assume +10 or +11.

Use actual filesystem timestamps converted through the correct timezone.

============================================================
14. DESIGN-SYSTEM ADAPTATION
============================================================

Adapt the component visually to the existing P1 system.

Use existing semantic Tailwind tokens.

Preserve project authority values such as:

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
Inter

Minimum interactive target:
48px where applicable

Do not scatter arbitrary source hex colours through the adapted component when
existing semantic project tokens provide the appropriate meaning.

============================================================
15. STUDENT MONEY RUNWAY P3 VARIANTS
============================================================

Adapt the genuine status-button concept for the future purchase-confirmation
interaction.

The P3 preview may demonstrate states equivalent to:

IDLE

Label:
Mark as spent

Meaning:
Ready for explicit confirmation.

PROCESSING

Label:
Confirming...

Meaning:
Temporary UI processing demonstration only.

SUCCESS

Label:
Marked as spent

Meaning:
UI demonstration state only.

Do NOT mutate real financial state in P3.

Do NOT calculate purchase result in P3.

Do NOT implement P8 business behaviour early.

============================================================
16. ETHICAL COPY
============================================================

Keep copy factual.

Allowed:

Mark as spent
Confirming...
Marked as spent

Do not add:

Great choice!
Smart purchase!
Safe purchase!
Good spending!

The component must not provide financial judgement.

============================================================
17. ACCESSIBILITY
============================================================

Review and improve accessibility where necessary.

Required:

- semantic <button> where appropriate
- button type explicitly defined
- disabled state
- visible focus state
- persistent accessible name
- keyboard activation
- status change understandable without relying only on colour

For busy state, use an appropriate mechanism such as:

aria-busy

when semantically justified.

For status announcement, consider an appropriate accessible live region only
if necessary.

Avoid duplicate or noisy announcements.

============================================================
18. MOTION
============================================================

The genuine component may use animation.

Preserve modest useful animation where appropriate.

Add/support reduced-motion behaviour if the existing implementation does not
already handle it appropriately.

Users with:

prefers-reduced-motion

must not be forced through unnecessary motion.

Do not make animation critical to understanding state.

============================================================
19. RESPONSIVE BEHAVIOUR
============================================================

Verify:

mobile < 768px
tablet 768–1024px
desktop > 1024px

The button must:

- remain readable
- preserve minimum target size
- avoid horizontal overflow
- not produce layout shift that breaks parent UI
- remain usable on the 390px mobile reference width

============================================================
20. TEMPORARY PREVIEW ONLY
============================================================

The real Purchase Impact page is not built yet.

Therefore use the existing temporary App.tsx verification shell only as needed
to demonstrate:

- idle state
- processing state
- success state
- disabled behaviour
- keyboard/focus behaviour
- responsive layout

Do NOT turn App.tsx into the final Purchase Check page.

Document clearly that this is temporary P3 verification.

If App.tsx is materially changed:

preserve its existing createdAt

and update updatedAt according to the master timestamp standard.

============================================================
21. DO NOT START P4/P5/P6/P7/P8
============================================================

Do NOT create final:

LoginPage
RunwaySetupPage
ProtectEssentialsPage
RunwayResultPage
PurchaseCheckPage
ResultPage

Do NOT implement:

React Router changes
central financial state
runway calculations
purchase mutation
database
authentication
business flow

P3 is component integration only.

============================================================
22. IMPLEMENTATION DOCUMENTATION
============================================================

Create:

docs/implementation/p3-21st-dev-integration.md

Use Markdown metadata:

# P3 — 21st.dev Integration

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P3 — 21st.dev Integration
> Created: <actual Melbourne filesystem timestamp>
> Updated: <actual Melbourne filesystem timestamp>

Document:

1. Selected component
2. Source author/library
3. Source URL
4. Why selected
5. Why it does not duplicate P2 components
6. Original prompt evidence path
7. Implementation file
8. Dependency changes
9. Original component behaviour
10. Student Money Runway adaptations
11. Design-token adaptations
12. Accessibility adaptations
13. Motion/reduced-motion handling
14. Temporary browser preview
15. Planned final use:
    Purchase Impact Preview → Mark as spent
16. Known limitations
17. Assessment demonstration notes

============================================================
23. INLINE COMMENT RULE
============================================================

Follow the binding master comment standard.

Inline comments explain WHY only.

Good:

// Keep the success transition presentational in P3; real purchase mutation is
// introduced later in P8.

Bad:

// Set button state.

// Student made this.

// Change colour to blue.

Do not comment obvious JSX.

============================================================
24. VALIDATION
============================================================

After implementation run:

npm run lint

Then:

npm run build

Both must PASS.

If either fails:

fix root cause.

Do not weaken linting.

Do not suppress TypeScript errors.

============================================================
25. BROWSER VERIFICATION
============================================================

Run:

npm run dev

Verify the temporary P3 preview.

Test:

NORMAL / IDLE

Expected:
Mark as spent

PROCESSING

Expected:
Confirming...

SUCCESS

Expected:
Marked as spent

DISABLED
if supported

KEYBOARD

Tab reaches the button.

Enter/Space activates appropriately.

FOCUS

Visible focus treatment exists.

MOBILE

Test narrow viewport around 390px.

DESKTOP

Test desktop layout.

MOTION

Verify reduced-motion handling where applicable.

CONSOLE

No runtime errors.

============================================================
26. PACKAGE AUDIT
============================================================

After implementation inspect:

package.json
package-lock.json

Report:

- every package added
- exact version
- reason
- runtime/dev category

Confirm no unrelated packages were added.

============================================================
27. GIT REVIEW
============================================================

Run:

git status

Then inspect:

git diff

If a Git baseline exists, ensure P3 changes are limited to:

- genuine 21st.dev component integration
- required dependency changes
- temporary preview
- P3 prompt evidence
- P3 implementation documentation
- necessary timestamp/header updates

Do NOT automatically commit.

============================================================
28. P3 ACCEPTANCE GATE
============================================================

P3 can PASS only if ALL are true:

[ ] Genuine 21st.dev page/source verified

[ ] Dynamic Status Button provenance verified

[ ] Genuine prompt/instruction preserved if retrievable

[ ] No fabricated provenance

[ ] Exactly one intended 21st.dev component integrated

[ ] Existing P2 components remain intact

[ ] Appropriate semantic source header exists

[ ] Student name is correct:
    Thien Khuong Vu

[ ] Australian timestamp convention followed

[ ] Component adapted to P1 design system

[ ] Accessibility reviewed

[ ] Reduced motion reviewed

[ ] Mobile verified

[ ] Desktop verified

[ ] Browser-visible temporary preview works

[ ] Dependencies controlled

[ ] npm run lint PASS

[ ] npm run build PASS

[ ] No P4+ work started

============================================================
29. FINAL REPORT
============================================================

Return:

A. 21st.dev source verification

- Component
- Author/library
- Source URL
- Source accessible: YES/NO
- Copy-prompt retrievable: YES/NO

B. Original prompt evidence

- evidence file
- provenance status

C. Implementation

- source file
- component name
- responsibility

D. Header traceability

- student
- phase
- source
- createdAt
- updatedAt
- timezone

E. Dependencies

Table:

Package
Version
Purpose
Required by source?

F. Adaptations

- colour
- typography
- radius
- spacing
- interaction
- accessibility
- motion

G. Planned final usage

Expected:

Purchase Impact Preview
→ Mark as spent

H. Browser verification

- idle
- processing
- success
- disabled
- keyboard
- focus
- mobile
- desktop
- reduced motion
- console

I. Files created

J. Files modified

K. npm run lint

L. npm run build

M. Git/change assessment

N. Remaining risks

============================================================
30. HARD STOP
============================================================

Do not continue to P4.

If external 21st.dev source cannot genuinely be accessed, finish:

P3 EXTERNAL SOURCE ACCESS BLOCKED

If implementation fails:

P3 21ST.DEV INTEGRATION BLOCKED

If all P3 acceptance criteria pass:

P3 21ST.DEV INTEGRATION READY