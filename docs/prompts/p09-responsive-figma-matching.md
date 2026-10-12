# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# P9 — RESPONSIVE + FIGMA MATCHING
# UNIVERSAL MASTER IMPLEMENTATION PROMPT
#
# Student: Thien Khuong Vu
# Recommended model: GPT-5.6 Terra — MEDIUM
#
# EXECUTION MODE:
# INSPECT → COMPARE → AUDIT → FIX → VERIFY → DOCUMENT → STOP
#
# ============================================================
# CRITICAL P9 BOUNDARY
# ============================================================
#
# P9 is a VISUAL / RESPONSIVE / LAYOUT QUALITY phase.
#
# Do NOT change business logic.
# Do NOT change calculation formulas.
# Do NOT change purchase-confirmation semantics.
# Do NOT change state ownership.
# Do NOT add new product features.
#
# P9 must preserve all approved P5-P8 behaviour.
#
# The objective is:
#
# Make the completed Student Money Runway MVP visually consistent with the
# approved desktop/mobile Figma references across the supported responsive
# breakpoints.
#
# Do NOT continue to P10.

============================================================
0. ROLE
============================================================

Act simultaneously as:

- Senior Frontend Engineer
- Responsive Web Specialist
- UI Implementation Engineer
- Figma-to-React Reviewer
- Design-System Reviewer
- Accessibility-aware UI Reviewer
- Performance-conscious CSS Reviewer
- BUS4012 Vibe Coding implementation assistant

You are continuing an already-functional React MVP.

P0-P8 have passed their implementation gates.

Your job is NOT to change how the product works.

Your job is to make the implemented product:

- visually coherent
- responsive
- consistent with Figma
- consistent with the design system
- stable across viewport sizes
- free from obvious overflow/layout defects

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

P9 — Responsive + Figma Matching

============================================================
2. COMPLETED BASELINE
============================================================

The following phases are COMPLETE and must be preserved:

P0
Development Environment

P0.5
Figma Reference Curation

P1
Design System Foundation

P2
Reusable UI Kit

P3
21st.dev StatusActionButton Integration

P4
Router + Page Skeletons

P5
State Model + Pure Business Logic

P6
Login + Runway Setup

P7
Protect Essentials + Runway Result

P8
Purchase Check + Result + Explicit Confirmation

P7 FINAL GATE:
PASS

P8 FINAL GATE:
PASS

Do not reopen these phases unless P9 exposes a purely visual defect.

============================================================
3. BINDING CONTEXT TO READ FIRST
============================================================

Before changing anything, read:

docs/prompts/00-master-project-context.md

Then read:

docs/implementation/p1-design-system-mapping.md
docs/implementation/p2-component-matrix.md
docs/implementation/p3-21st-dev-integration.md
docs/implementation/p4-route-map.md
docs/implementation/p5-state-and-calculation-model.md
docs/implementation/p6-login-and-runway-setup.md
docs/implementation/p7-protect-essentials-runway-result.md
docs/implementation/p8-purchase-check-result-confirmation.md

Read:

docs/figma-reference/README.md

Inspect this prompt if already saved:

docs/prompts/p09-responsive-figma-matching.md

============================================================
4. INSPECT ALL CURRENT UI SOURCE
============================================================

Inspect before changing:

src/App.tsx
src/main.tsx
src/index.css

src/components/layout/AppShell.tsx

src/components/ui/FormSection.tsx
src/components/ui/MoneyInput.tsx
src/components/ui/SummaryRow.tsx
src/components/ui/StatusActionButton.tsx

src/pages/LoginPage.tsx
src/pages/RunwaySetupPage.tsx
src/pages/ProtectEssentialsPage.tsx
src/pages/RunwayResultPage.tsx
src/pages/PurchaseCheckPage.tsx
src/pages/ResultPage.tsx

Inspect any presentation helper used for:

currency
dates
status display

Do not assume visual structure.

Read actual source.

============================================================
5. FIGMA AUTHORITY
============================================================

Inspect ALL curated approved references under:

docs/figma-reference/

including:

design-system/
screens/desktop/
screens/mobile/
states/
components/

Use the actual curated manifest.

Focus especially on:

DESKTOP

P1 Landing / entry visual language
P2 Runway Setup
P3 Protect Essentials
P4 Runway Dashboard
P5 Purchase Check
P6 Purchase Impact Preview

MOBILE

M-P1
M-P2
M-P3
M-P4
M-P5
M-P6

STATES

Updated success dashboard
Protected shortfall

DESIGN SYSTEM

DS-01 Foundations
DS-02 Responsive Navigation
DS-03 Forms & Core Controls
DS-04 Financial Components
DS-06 Feedback & Accessibility
DS-07 Landing Components
DS-08 Responsive Architecture

BOTTOM NAVIGATION

Use the curated Bottom Navigation reference where applicable.

============================================================
6. SOURCE PRIORITY
============================================================

When visual sources conflict follow:

1. approved current Figma references
2. P1 design system
3. approved P4-P8 product architecture
4. master context
5. current implementation
6. implementation judgement

When visual preference conflicts with product logic:

product logic wins.

Do not visually "fix" something by breaking business behaviour.

============================================================
7. P9 PRIMARY OBJECTIVE
============================================================

Audit and improve every completed route:

/login
/setup
/essentials
/runway
/purchase
/result

Across:

mobile
tablet
desktop

without changing product behaviour.

============================================================
8. RESPONSIVE BREAKPOINT CONTRACT
============================================================

Use the approved responsive contract:

Mobile:

< 768px

Tablet:

768px–1024px

Desktop:

> 1024px

Approved desktop content reference:

max width approximately 1280px

Approved mobile reference:

approximately 390px wide

Do not create independent mobile/desktop applications.

Use one responsive component tree.

============================================================
9. REQUIRED VIEWPORT AUDIT
============================================================

At minimum verify each relevant route at approximately:

390px

768px

1024px

1280px

Also inspect:

320px

for minimum-width safety if practical.

The app must remain usable without horizontal scrolling at minimum supported
width.

============================================================
10. P9 HARD INVARIANT — NO BUSINESS CHANGES
============================================================

Do NOT modify:

R = MAX(0, A - F - V - B)

Protected Total rules

Protected Shortfall rules

Purchase preview calculations

Purchase confirmation behaviour

Available Funds mutation semantics

Double-confirmation guard

Preview non-mutation invariant

Do NOT change P5-P8 functionality while styling.

============================================================
11. P9 HARD INVARIANT — NO STATE ARCHITECTURE CHANGES
============================================================

Do NOT move state ownership.

App.tsx remains the RunwayState owner.

Do NOT introduce:

Redux
Zustand
Context architecture
new reducers
persistent state
localStorage
sessionStorage

P9 is not an architecture refactor.

============================================================
12. P9 HARD INVARIANT — NO NEW FEATURES
============================================================

Do NOT add:

animations merely for polish
charts
progress graphs
new onboarding
new screens
tooltips unless necessary for existing accessibility
new financial fields
new nav destinations
new modals
new backend behaviour

Only implement what is required to achieve approved visual/responsive parity.

============================================================
13. DESIGN SYSTEM LOCK
============================================================

Prefer existing semantic tokens.

Known approved values include:

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

Money Display:
40px semibold

Hero:
48px bold

H1:
32px semibold

Body Large:
16px regular

Label Caps:
12px semibold
letter spacing approximately 0.05em

Spacing:
8
16
24
32
48

Radii:
4
8
12
pill

Minimum touch target:
48×48px where appropriate

Do not invent random visual values if existing tokens already cover the need.

============================================================
14. AUDIT CSS/TOKEN USAGE FIRST
============================================================

Before editing pages, inspect:

tailwind.config.js

src/index.css

Confirm:

- semantic colours
- typography utilities
- spacing
- radii
- max widths
- breakpoints
- focus styles

Do not duplicate global styles inside pages if the design system already owns
them.

============================================================
15. TYPOGRAPHY AUDIT
============================================================

Across every route inspect:

font family

page h1

section headings

body text

money values

labels

supporting copy

buttons

status text

Ensure consistent hierarchy.

Do not make every screen use different arbitrary text sizes.

============================================================
16. SPACING AUDIT
============================================================

Inspect:

page top spacing

section spacing

field spacing

card padding

row gaps

action spacing

mobile gutters

desktop gutters

Avoid:

random gap-5/gap-7/gap-11 combinations

unless they intentionally map to approved spacing rhythm.

Prefer the approved 8-point-like spacing hierarchy.

============================================================
17. SURFACE / CARD AUDIT
============================================================

Ensure cards/surfaces consistently use:

approved background

border

radius

shadow if approved

padding hierarchy

Do not add strong shadows if Figma uses quiet surfaces.

Student Money Runway should remain calm and practical.

============================================================
18. INPUT AUDIT
============================================================

Audit:

Email
Password
Planning Date
all MoneyInput usages
Purchase Name

Check:

height

border

radius

label spacing

helper/error spacing

focus

disabled state

mobile width

desktop width

No field should visually look like a different design system.

============================================================
19. BUTTON AUDIT
============================================================

Audit:

primary buttons

secondary/back buttons

text actions

StatusActionButton

Ensure consistent:

height
radius
typography
focus
spacing
responsive width

Do not make every desktop button full-width if Figma does not.

On mobile, full-width actions may be appropriate if supported by Figma.

============================================================
20. LOGIN RESPONSIVE AUDIT
============================================================

Route:

/login

Inspect against entry/landing design language.

Verify:

brand/title hierarchy

form width

vertical centering/layout

responsive gutters

input widths

button width

error states

No excessive empty space on mobile.

No giant stretched form on desktop.

============================================================
21. RUNWAY SETUP RESPONSIVE AUDIT
============================================================

Route:

/setup

Compare directly with:

desktop P2
mobile M-P2

Verify:

page title

explanatory text

FormSection positioning

Available Funds

Planning Date

Safety Buffer

actions

wizard/focused navigation

desktop vs mobile stacking

============================================================
22. PROTECT ESSENTIALS RESPONSIVE AUDIT
============================================================

Route:

/essentials

Compare:

desktop P3
mobile M-P3

Verify:

Fixed Essentials

Flexible Essentials

Safety Buffer context

Protected Total

SummaryRows

form section layout

buttons

mobile stacking

desktop balance

============================================================
23. RUNWAY RESULT RESPONSIVE AUDIT
============================================================

Route:

/runway

Compare:

desktop P4
mobile M-P4

Verify:

primary discretionary runway value

money-display typography

supporting explanation

breakdown hierarchy

SummaryRows

normal branch

zero-runway branch

shortfall branch

Check a Purchase CTA

updated confirmed-runway state

============================================================
24. PURCHASE CHECK RESPONSIVE AUDIT
============================================================

Route:

/purchase

Compare:

desktop P5
mobile M-P5

Verify:

Current Runway context

Purchase Name

Purchase Amount

FormSection if used

summary context

action hierarchy

mobile input stack

desktop content width

============================================================
25. RESULT RESPONSIVE AUDIT
============================================================

Route:

/result

Compare:

desktop P6
mobile M-P6

Audit all actual P8 states:

A. within-runway preview

B. exact-runway preview

C. exceeds-runway preview

D. confirmed success

Verify:

status hierarchy

Runway Before

Purchase Amount

Remaining Runway

Amount Above Runway

Back Without Saving

Edit Purchase

StatusActionButton

success actions

============================================================
26. SHORTFALL STATE AUDIT
============================================================

Test the P7 shortfall state visually.

Ensure:

Discretionary Runway = 0

Protected Shortfall visible

factual explanation readable

status not conveyed only through colour

action to review inputs clear

mobile layout does not overflow

============================================================
27. LARGE MONEY VALUE AUDIT
============================================================

Test visual resilience with larger but plausible display values.

Examples:

AUD 9,999.99

AUD 99,999.99

Do not change financial validation rules merely for this test.

Ensure large values:

do not clip

do not overlap

wrap/scale responsibly

preserve hierarchy

Avoid overly aggressive fixed widths.

============================================================
28. LONG TEXT AUDIT
============================================================

Test layout resilience with a longer Purchase Name.

Example:

"Monthly public transport pass"

Ensure:

no overflow

summary/value layout remains understandable

text truncation only where appropriate

Do not truncate essential financial status text unnecessarily.

============================================================
29. ERROR STATE RESPONSIVENESS
============================================================

Test validation errors at mobile width.

Ensure:

error text wraps

field height/layout remains stable enough

no overlapping controls

buttons remain reachable

No horizontal scroll caused by long error copy.

============================================================
30. MOBILE NAVIGATION AUDIT
============================================================

Inspect approved DS-02 / Bottom Navigation.

Where mobile bottom navigation is intentionally used:

ensure:

fixed/sticky behaviour is correct

page content includes sufficient bottom padding

last controls are not hidden behind nav

icons/text remain readable

touch targets meet minimum size

active state is clear

Do not use bottom nav on focused setup screens if Figma does not.

============================================================
31. DESKTOP NAVIGATION AUDIT
============================================================

Where desktop top navigation is used:

verify:

alignment

content max width

active location indication

spacing

brand placement

no excessive nav density

Focused wizard screens should remain focused if approved by Figma.

============================================================
32. APPSHELL AUDIT
============================================================

Inspect:

src/components/layout/AppShell.tsx

Determine whether its responsive shell matches approved navigation patterns.

Allowed P9 changes:

spacing
layout classes
responsive visibility
padding
max width
navigation positioning

Do NOT embed page-specific business content into AppShell.

============================================================
33. BOTTOM PADDING / FIXED NAV
============================================================

If mobile bottom navigation is fixed:

verify page main content has sufficient:

padding-bottom

so that:

buttons
error text
last SummaryRow

are not obscured.

This must be checked on every page that uses the bottom nav.

============================================================
34. VIEWPORT HEIGHT AUDIT
============================================================

Avoid layouts that rely on a fixed desktop viewport height and break on mobile.

Be careful with:

h-screen

100vh

fixed vertical centering

Mobile browser chrome may change viewport height.

Prefer:

min-height

and natural document flow where appropriate.

============================================================
35. WIDTH AUDIT
============================================================

Avoid arbitrary hard-coded widths such as:

w-[900px]

if responsive max-width containers are more appropriate.

Prefer:

w-full

+
max-width

+
responsive grids

where aligned with Figma.

============================================================
36. GRID / FLEX AUDIT
============================================================

Use flex/grid deliberately.

Desktop side-by-side patterns should stack vertically on mobile according to
DS-08.

Do not preserve two-column layouts below the width where they become cramped.

============================================================
37. TABLE-LIKE SUMMARY ROW AUDIT
============================================================

SummaryRow values must remain readable when:

labels are longer

amounts are larger

viewport narrows

Use wrapping/alignment responsibly.

Do not allow label/value overlap.

============================================================
38. RESPONSIVE FORM ACTIONS
============================================================

Audit Back/Continue action groups.

Desktop may use:

horizontal alignment

Mobile may use:

stacked or appropriately full-width actions

Follow Figma.

Ensure tab order remains logical.

============================================================
39. STATUSACTIONBUTTON VISUAL INTEGRATION
============================================================

Audit P3/P8 StatusActionButton in the final Result page.

Ensure:

looks intentional inside the P1 design system

does not visually appear from a completely different component library

focus remains visible

success state fits Figma

reduced-motion handling remains intact

Do not remove 21st.dev provenance.

============================================================
40. MOTION AUDIT
============================================================

P9 must not add unnecessary motion.

For existing StatusActionButton motion:

verify no layout shift breaks ResultPage

verify reduced motion remains supported

Do not introduce page transitions unless already approved.

============================================================
41. COLOUR AUDIT
============================================================

Ensure status colours are consistent:

primary
success
warning
danger

Do not use arbitrary Tailwind colour families such as:

blue-500
emerald-400
red-600

if semantic tokens exist.

Replace obvious visual drift with approved semantic tokens.

============================================================
42. CONTRAST BASELINE
============================================================

P10 will perform final accessibility hardening.

P9 should still avoid obvious contrast problems.

Ensure:

muted text remains readable

error text readable

button text readable

status backgrounds/text have sensible contrast

Do not weaken visual contrast merely to match an inaccurate interpretation.

============================================================
43. FOCUS STYLE VISUAL AUDIT
============================================================

Verify visible focus does not:

clip
overflow incorrectly
disappear behind container overflow

on:

inputs
links
buttons
bottom navigation
StatusActionButton

Do not remove outlines without an accessible replacement.

============================================================
44. NO HIDDEN OVERFLOW HACKS
============================================================

Do not fix layout defects by applying:

overflow-hidden

globally.

This can clip:

focus rings
error text
dropdown/native controls

Use overflow rules only when semantically justified.

============================================================
45. MOBILE SAFE AREA
============================================================

If the bottom nav or fixed mobile action area reaches device edges:

consider existing safe-area strategy if present.

Do not introduce elaborate device-specific code.

If useful and simple, ensure layout is not obviously broken by bottom inset.

============================================================
46. LOGIN / FORM AUTOFILL
============================================================

Check that browser autofill does not obviously break input styling.

Do not disable useful native autofill just for visuals.

============================================================
47. NATIVE DATE INPUT
============================================================

Planning Date remains a native:

input type="date"

Do not replace it with a custom calendar in P9.

Style it consistently without breaking platform usability.

============================================================
48. CONTENT ORDER
============================================================

Responsive CSS should not create confusing semantic reading order.

Avoid heavy use of:

order-*

that causes visual order to conflict with DOM/keyboard order.

If Figma requires reordering:

prefer component structure that preserves logical reading order.

============================================================
49. MOBILE-FIRST IMPLEMENTATION
============================================================

Where practical, keep responsive classes understandable.

Prefer:

base mobile styles
→ md adjustments
→ lg adjustments

Avoid extremely complex breakpoint combinations.

The code must remain explainable.

============================================================
50. NO DUPLICATE MOBILE COMPONENT TREES
============================================================

Do NOT implement:

{isMobile ? <MobilePage /> : <DesktopPage />}

for the main pages merely to match Figma.

Use responsive styling.

Do not duplicate business/validation behaviour.

============================================================
51. NO WINDOW WIDTH STATE
============================================================

Do not introduce:

window.innerWidth
resize listeners
React state for viewport width

just for normal responsive layout.

Use CSS/Tailwind media breakpoints.

Only use JavaScript viewport logic if a real non-CSS interaction demands it,
which is not expected in P9.

============================================================
52. PERFORMANCE
============================================================

Do not add:

unnecessary effects
layout measurement code
runtime responsive listeners

CSS should perform the layout work.

Keep bundle changes minimal.

============================================================
53. PAGE HIERARCHY CONSISTENCY
============================================================

Each route should have:

one primary h1

consistent intro copy spacing

clear main content surface

clear action hierarchy

Do not visually demote essential result values below secondary content.

============================================================
54. MONEY TYPOGRAPHY
============================================================

Money values are core product information.

Where Figma uses primary financial display:

use approved money-display hierarchy.

Do not apply 40px money typography to every minor SummaryRow value.

Use hierarchy intentionally.

============================================================
55. LABEL CAPS
============================================================

If Figma uses label caps:

apply the approved:

12px semibold
0.05em tracking

only where appropriate.

Do not uppercase every label globally.

============================================================
56. EMPTY SPACE AUDIT
============================================================

Desktop should not look:

cramped

or:

vastly empty

Match approved container/grid rhythm.

Use max widths rather than stretching all content to viewport edges.

============================================================
57. MOBILE GUTTER AUDIT
============================================================

Ensure consistent mobile horizontal gutters across:

Login
Setup
Essentials
Runway
Purchase
Result

Avoid one page using 16px and another appearing at 32px unless Figma supports
that difference.

============================================================
58. P9 REFACTOR BOUNDARY
============================================================

Small layout refactors are allowed.

Examples:

shared page container class

shared action-row utility

minor AppShell cleanup

But do NOT perform a broad component architecture rewrite.

P9 is parity/polish, not component-system redesign.

============================================================
59. REUSABLE COMPONENT PRESERVATION
============================================================

Do not duplicate:

FormSection
MoneyInput
SummaryRow
StatusActionButton

merely to achieve slightly different layout.

Use wrapper/layout classes around existing components first.

Only alter component internals if the visual problem genuinely belongs inside
that component.

============================================================
60. COMPONENT API CHANGES
============================================================

Avoid public API changes.

If one is genuinely required for visual flexibility:

make it:

small
optional
backwards-compatible
clearly justified

Then regression-test every current usage.

Do not add speculative props.

============================================================
61. BUSINESS COPY PRESERVATION
============================================================

Do not rewrite product copy broadly in P9.

P10 handles ethical-language final audit.

P9 may only adjust copy where Figma parity or visual hierarchy clearly requires
the approved text.

Do not alter meaning.

============================================================
62. ROUTES MUST REMAIN IDENTICAL
============================================================

Preserve:

/

/login

/setup

/essentials

/runway

/purchase

/result

No route additions or renaming.

============================================================
63. DIRECT-ROUTE BEHAVIOUR PRESERVATION
============================================================

Do not break P7/P8 prerequisite redirects.

After P9 verify direct visits still behave correctly.

Styling changes must not alter navigation/business guard logic.

============================================================
64. PREVIEW / CONFIRMATION INVARIANT
============================================================

After P9 verify:

Preview does not mutate.

Back Without Saving does not mutate.

Explicit Mark as spent is the only confirmation mutation.

Do not touch this architecture for visual reasons.

============================================================
65. EXACT / EXCEEDS BRANCH PRESERVATION
============================================================

After visual changes verify:

215 vs 215

still shows:

Remaining 0
Exceeds false

215 vs 300

still shows:

Excess 85
no confirmation action

============================================================
66. SHORTFALL BRANCH PRESERVATION
============================================================

After visual changes verify:

Available 650
Protected 734

still results:

Runway 0
Shortfall 84

Do not hide/obscure the shortfall state.

============================================================
67. SOURCE HEADER STANDARD
============================================================

Follow:

docs/prompts/00-master-project-context.md

Student:

Thien Khuong Vu

Phase:

P9 — Responsive + Figma Matching

Canonical timezone:

Australia/Melbourne

Windows/.NET mapping:

AUS Eastern Standard Time

For existing files:

preserve original @createdAt

Update @updatedAt only when materially changed.

Do not use Vietnam time directly.

Do not guess timestamps.

============================================================
68. HEADER RESPONSIBILITY
============================================================

Do NOT change a file's responsibility header merely because layout classes were
updated unless its actual responsibility changed.

Phase/updatedAt may reflect P9 material updates.

Keep summaries truthful.

============================================================
69. INLINE COMMENT STANDARD
============================================================

Do not add comments for obvious Tailwind layout.

Useful:

// Reserve mobile bottom space so fixed navigation never covers the final form
// action.

Not useful:

// Add padding.

// Mobile layout.

Keep comments minimal.

============================================================
70. P9 DOCUMENTATION
============================================================

Create:

docs/implementation/p9-responsive-figma-qa.md

Use:

# P9 — Responsive and Figma QA

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P9 — Responsive + Figma Matching
> Created: <actual Melbourne filesystem timestamp>
> Updated: <actual Melbourne filesystem timestamp>

Document:

1. P9 scope
2. Source/Figma references inspected
3. Breakpoint contract
4. Design-system consistency audit
5. Route-by-route findings
6. Desktop corrections
7. Mobile corrections
8. Tablet corrections
9. Navigation corrections
10. Typography corrections
11. Spacing corrections
12. Form-control corrections
13. Financial-result corrections
14. Result-state corrections
15. Shortfall-state corrections
16. Overflow audit
17. Large-value audit
18. Component-level changes
19. Responsive test matrix
20. Business-regression verification
21. Scope intentionally deferred to P10

============================================================
71. REQUIRED ROUTE QA MATRIX
============================================================

In documentation include:

| Route | 390px | 768px | 1024px | 1280px |
|---|---|---|---|---|
| /login | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| /setup | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| /essentials | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| /runway | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| /purchase | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| /result | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |

Do not claim PASS unless actually reviewed.

============================================================
72. REQUIRED VISUAL AUDIT DIMENSIONS
============================================================

For every route inspect:

Page width

Horizontal gutter

Content max width

H1

Section heading

Body text

Field width

Button size

Surface padding

Card radius

Summary rows

Primary result value

Navigation

Overflow

Focus visibility

Mobile stacking

============================================================
73. LOGIN TEST
============================================================

At 390px:

form fits viewport

no horizontal overflow

button/input touch size adequate

errors wrap

At 1280px:

form has reasonable max width

does not stretch edge-to-edge

visual hierarchy matches design system.

============================================================
74. SETUP TEST
============================================================

At 390px:

Available Funds
Planning Date
Safety Buffer

stack clearly.

Actions usable.

At desktop:

form and surrounding content follow P2 layout hierarchy.

============================================================
75. ESSENTIALS TEST
============================================================

At 390px:

Fixed/Flexible fields stack

Protected Total remains readable

Back/Continue actions usable

At desktop:

form/summary hierarchy matches P3.

============================================================
76. RUNWAY NORMAL TEST
============================================================

Canonical:

Available 950
Fixed 455
Flexible 180
Buffer 100

At mobile and desktop:

AUD 215 remains visually prominent.

Breakdown remains readable.

Check a Purchase CTA visible.

============================================================
77. RUNWAY SHORTFALL TEST
============================================================

Available 650
Protected 734

At mobile/desktop:

Runway 0

Shortfall 84

factual explanatory text

review action

must fit without overflow.

============================================================
78. PURCHASE TEST
============================================================

Canonical current runway 215.

At mobile/desktop:

Purchase Name field

Purchase Amount

Current Runway context

form actions

match P5 layout direction.

============================================================
79. RESULT WITHIN TEST
============================================================

Runway:

215

Purchase:

160

Verify at 390/1280:

status

55 remaining

SummaryRows

Back Without Saving

Mark as spent

fit correctly.

============================================================
80. RESULT EXACT TEST
============================================================

Runway:

215

Purchase:

215

Verify:

remaining 0

within branch remains visually coherent.

No layout assumption that remaining is always positive.

============================================================
81. RESULT EXCEEDS TEST
============================================================

Runway:

215

Purchase:

300

Verify at mobile/desktop:

Exceeds state

Amount Above Runway 85

Edit/back actions

No StatusActionButton

No empty gap caused by absent confirmation action.

============================================================
82. RESULT CONFIRMED TEST
============================================================

Canonical confirmation:

Available 950 → 790

Runway 215 → 55

Verify confirmed success layout:

Purchase recorded

purchase identity/amount

updated runway 55

next actions

all remain readable on mobile/desktop.

============================================================
83. LONG PURCHASE NAME TEST
============================================================

Use:

"Monthly public transport pass"

or equivalent long input.

Verify result summaries remain stable.

Do not mutate source logic.

============================================================
84. LARGE CURRENCY DISPLAY TEST
============================================================

Use display-level values around:

9,999.99

99,999.99

Verify visual resilience.

This is layout verification only.

Do not expand product limits unless already allowed.

============================================================
85. ERROR STATE TEST
============================================================

At 390px verify:

Login errors

Setup errors

Essentials errors

Purchase errors

No clipping/overlap.

============================================================
86. NAVIGATION REGRESSION TEST
============================================================

Verify route flow remains:

/login
→ /setup
→ /essentials
→ /runway
→ /purchase
→ /result

Verify Back navigation still works.

============================================================
87. BUSINESS REGRESSION TEST
============================================================

Explicitly verify after P9:

Protected Total:

735

Runway:

215

Shortfall case:

84

Purchase 160:

remaining 55

Purchase 300:

excess 85

Confirmed purchase:

950 → 790

updated runway:

55

No layout change may alter these values.

============================================================
88. PREVIEW REGRESSION TEST
============================================================

Verify after P9:

/purchase
→ /result

does NOT change:

availableFunds

purchaseConfirmed

============================================================
89. DOUBLE CONFIRM REGRESSION
============================================================

Verify P8 guard still exists.

One purchase confirmation must apply once only.

No P9 UI change may accidentally expose multiple active confirmation controls.

============================================================
90. COMPONENT REUSE REGRESSION
============================================================

Verify actual render usage remains:

FormSection:
Runway Setup
Protect Essentials
Purchase Check where currently used

MoneyInput:
Runway Setup
Protect Essentials
Purchase Check

SummaryRow:
Protect Essentials
Runway Result
Purchase Check/Result as implemented

StatusActionButton:
Result confirmation

Do not break assessment evidence while polishing layout.

============================================================
91. NO NEW PACKAGES
============================================================

Expected:

package.json unchanged

package-lock.json unchanged

Do not install CSS/layout packages.

Tailwind is sufficient.

============================================================
92. EXPECTED FILE SCOPE
============================================================

Potentially modified:

src/index.css
tailwind.config.js

ONLY if existing semantic/responsive tokens genuinely require correction.

Likely modified:

src/components/layout/AppShell.tsx

src/components/ui/FormSection.tsx
src/components/ui/MoneyInput.tsx
src/components/ui/SummaryRow.tsx
src/components/ui/StatusActionButton.tsx

ONLY where visual/responsive corrections genuinely belong.

Likely modified pages:

src/pages/LoginPage.tsx
src/pages/RunwaySetupPage.tsx
src/pages/ProtectEssentialsPage.tsx
src/pages/RunwayResultPage.tsx
src/pages/PurchaseCheckPage.tsx
src/pages/ResultPage.tsx

Create:

docs/implementation/p9-responsive-figma-qa.md

Preserve:

docs/prompts/p09-responsive-figma-matching.md

============================================================
93. DO NOT TOUCH BUSINESS UTILITIES
============================================================

Do NOT modify:

src/utils/runwayCalculations.ts

unless a compile problem unrelated to P9 exists.

Do NOT modify financial formula implementations.

Normally P9 should not touch:

src/types/runway.ts

src/utils/moneyValidation.ts

============================================================
94. IMPLEMENTATION SEQUENCE
============================================================

Follow:

STEP 1

Read all P1-P8 documentation.

STEP 2

Inspect all curated desktop/mobile Figma references.

STEP 3

Inspect global tokens/styles.

STEP 4

Run current app before editing.

STEP 5

Audit /login at all required widths.

STEP 6

Audit /setup.

STEP 7

Audit /essentials.

STEP 8

Audit /runway normal + shortfall.

STEP 9

Audit /purchase.

STEP 10

Audit /result:
within
exact
exceeds
confirmed.

STEP 11

Audit AppShell / navigation.

STEP 12

Audit components globally.

STEP 13

Implement smallest responsive/style corrections.

STEP 14

Recheck all routes.

STEP 15

Run business regression checks.

STEP 16

Run lint/build.

STEP 17

Inspect Git diff.

STEP 18

Create P9 documentation.

STOP.

============================================================
95. CHANGE MINIMISATION
============================================================

Do not rewrite every page if only a few classes need adjustment.

Prefer small targeted corrections.

P9 diff should be explainable as:

visual/responsive quality improvements.

Avoid large component rewrites.

============================================================
96. BROWSER VERIFICATION
============================================================

Run:

npm run dev

Record actual Vite URL.

Use browser/devtools responsive mode if available.

Do not rely only on HTTP 200 smoke tests.

P9 requires visual layout inspection.

============================================================
97. CONSOLE AUDIT
============================================================

Verify no new:

React errors

layout-triggered runtime errors

controlled/uncontrolled warnings

key warnings

NaN

Infinity

Existing React Router future warnings may remain if unchanged.

============================================================
98. HORIZONTAL OVERFLOW AUDIT
============================================================

At 320px and 390px where practical verify:

document width does not exceed viewport unexpectedly.

Check especially:

money values

form controls

summary rows

fixed bottom nav

status button

long purchase names

============================================================
99. LINT
============================================================

Run:

npm run lint

Required:

PASS

Do not suppress lint errors.

============================================================
100. BUILD
============================================================

Run:

npm run build

Required:

PASS

============================================================
101. PACKAGE AUDIT
============================================================

Inspect:

package.json
package-lock.json

Expected new packages:

NONE

============================================================
102. GIT REVIEW
============================================================

Run:

git status

git diff

If baseline exists:

review every P9 change.

Confirm no:

business logic refactor

calculation change

state architecture change

P10/P11 work

Do not automatically commit.

============================================================
103. P9 ACCEPTANCE — RESPONSIVE
============================================================

P9 passes only if:

[ ] all six routes reviewed at 390px

[ ] all six routes reviewed at 768px

[ ] all six routes reviewed at 1024px

[ ] all six routes reviewed at 1280px

[ ] no obvious mobile horizontal overflow

[ ] desktop content width controlled

[ ] responsive stacking matches approved direction

[ ] mobile bottom navigation does not obscure content

[ ] action groups remain usable

[ ] inputs remain usable

[ ] large values remain readable

[ ] error text remains readable

============================================================
104. P9 ACCEPTANCE — FIGMA
============================================================

[ ] Login follows approved entry visual language

[ ] Setup matches P2 hierarchy

[ ] Essentials matches P3 hierarchy

[ ] Runway matches P4 hierarchy

[ ] Purchase matches P5 hierarchy

[ ] Result matches P6 hierarchy

[ ] shortfall state matches approved state direction

[ ] confirmed success state remains coherent

[ ] navigation matches DS-02 direction

[ ] responsive composition follows DS-08

============================================================
105. P9 ACCEPTANCE — DESIGN SYSTEM
============================================================

[ ] Inter consistent

[ ] semantic colours used

[ ] spacing rhythm consistent

[ ] radii consistent

[ ] money typography used intentionally

[ ] headings consistent

[ ] buttons consistent

[ ] inputs consistent

[ ] focus remains visible

============================================================
106. P9 ACCEPTANCE — BUSINESS REGRESSION
============================================================

[ ] Protected Total = 735 canonical

[ ] Runway = 215 canonical

[ ] Shortfall = 84 canonical

[ ] 160 vs 215 = 55

[ ] 300 vs 215 = excess 85

[ ] preview does not mutate

[ ] confirmation 950 → 790

[ ] updated runway = 55

[ ] no double confirmation

[ ] direct-route safeguards preserved

============================================================
107. P9 ACCEPTANCE — ARCHITECTURE
============================================================

[ ] no new state architecture

[ ] no route changes

[ ] no financial utility changes

[ ] no persistence

[ ] no new packages

[ ] no duplicated mobile/desktop pages

[ ] no JS viewport-listener architecture

============================================================
108. SOURCE TRACEABILITY ACCEPTANCE
============================================================

[ ] Student:
    Thien Khuong Vu

[ ] Phase:
    P9 — Responsive + Figma Matching

[ ] existing createdAt values preserved

[ ] updatedAt follows Australia/Melbourne convention

[ ] no guessed timestamps

[ ] file responsibilities remain truthful

============================================================
109. FINAL REPORT
============================================================

Return:

A. References inspected

Include:

- Figma files
- design-system references
- implementation docs
- source files

------------------------------------------------------------

B. Responsive audit summary

Table:

Route
390
768
1024
1280
Result

------------------------------------------------------------

C. Login changes

------------------------------------------------------------

D. Setup changes

------------------------------------------------------------

E. Protect Essentials changes

------------------------------------------------------------

F. Runway Result changes

Include:

normal
zero
shortfall

------------------------------------------------------------

G. Purchase Check changes

------------------------------------------------------------

H. Result changes

Include:

within
exact
exceeds
confirmed

------------------------------------------------------------

I. AppShell/navigation changes

------------------------------------------------------------

J. Typography corrections

------------------------------------------------------------

K. Spacing/layout corrections

------------------------------------------------------------

L. Component-level corrections

For:

FormSection
MoneyInput
SummaryRow
StatusActionButton

Report only if actually changed.

------------------------------------------------------------

M. Overflow audit

Report:

320px if checked
390px

------------------------------------------------------------

N. Large-value audit

------------------------------------------------------------

O. Long-text audit

------------------------------------------------------------

P. Business regression

Table:

Case
Expected
Actual
PASS/FAIL

Include:

Protected Total 735

Runway 215

Shortfall 84

Purchase 160 → 55

Purchase 300 → excess 85

Confirmation 950 → 790

Updated Runway 55

------------------------------------------------------------

Q. Component reuse regression

------------------------------------------------------------

R. Files created

------------------------------------------------------------

S. Files modified

------------------------------------------------------------

T. Source-header traceability

Table:

File
Phase
Created
Updated
Timezone

------------------------------------------------------------

U. Packages added

Expected:

NONE

------------------------------------------------------------

V. npm run lint

PASS / FAIL

------------------------------------------------------------

W. npm run build

PASS / FAIL

------------------------------------------------------------

X. Browser/runtime verification

Report actual Vite URL.

Report console status.

------------------------------------------------------------

Y. Git/change assessment

Confirm whether changes remained visual/responsive only.

------------------------------------------------------------

Z. Deferred P10 work

Explicitly defer:

- final validation consistency audit
- comprehensive keyboard audit
- comprehensive accessibility audit
- semantic/ARIA hardening
- final contrast review
- full ethics-language search
- edge-case validation hardening

============================================================
110. HARD STOP
============================================================

Do NOT continue to P10.

Do NOT perform broad validation refactors.

Do NOT change business rules.

Do NOT change state architecture.

Do NOT change purchase-confirmation semantics.

Do NOT begin assessment packaging.

If blocked finish exactly:

P9 RESPONSIVE AND FIGMA QA BLOCKED

If all P9 criteria pass finish exactly:

P9 RESPONSIVE AND FIGMA QA READY