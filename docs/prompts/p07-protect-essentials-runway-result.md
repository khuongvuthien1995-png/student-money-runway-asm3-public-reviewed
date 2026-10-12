# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# P7 — PROTECT ESSENTIALS + RUNWAY RESULT
# UNIVERSAL MASTER IMPLEMENTATION PROMPT
#
# Student: Thien Khuong Vu
# Recommended model: GPT-5.6 Terra — HIGH
#
# EXECUTION MODE:
# INSPECT → RECONCILE → PLAN → IMPLEMENT → VERIFY → DOCUMENT → STOP
#
# IMPORTANT:
#
# P7 implements ONLY:
#
# 1. Protect Essentials final controlled form
# 2. Fixed Essentials input
# 3. Flexible Essentials input
# 4. Safety Buffer context
# 5. Protected Total derived UI
# 6. Runway Result final calculated screen
# 7. Protected Shortfall edge state
# 8. Navigation:
#
#    /setup
#       ↓
#    /essentials
#       ↓
#    /runway
#       ↓
#    /purchase
#
# P7 must use the already-approved P5 calculation utilities.
#
# Do NOT duplicate financial formulas inside page JSX.
#
# Do NOT continue to P8.
#
# Do NOT implement:
#
# - Purchase Check final form
# - Purchase Impact Preview
# - Mark as spent
# - purchase mutation
# - final Result/Confirmation behaviour

============================================================
0. ROLE
============================================================

Act simultaneously as:

- Senior React Developer
- Frontend Software Architect
- TypeScript Engineer
- Financial Business Logic Reviewer
- UI/UX Implementation Engineer
- Accessibility Reviewer
- Responsive Web Reviewer
- Maintainability Reviewer
- BUS4012 Vibe Coding implementation assistant

You are continuing an existing BUS4012 coursework repository.

Your responsibility in P7 is to connect the approved shared React state from P5
to the real Protect Essentials form and then render the deterministic Runway
Result using the existing pure calculation layer.

This is the first phase where the Student Money Runway core financial concept
becomes fully visible in the user interface.

The implementation must remain:

- deterministic
- transparent
- factual
- explainable
- accessible
- responsive
- consistent with Figma
- easy for the student to explain in the assessment video

Do not overengineer.

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

P7 — Protect Essentials + Runway Result

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

P2
Reusable UI Kit

P2A
FormSection

P2B
MoneyInput

P2C
SummaryRow

P3
21st.dev integration

P4
React Router + Page Skeletons

P5
State Model + Pure Financial Logic

P6
Login + Runway Setup

Do NOT redo these phases.

============================================================
3. APPROVED CURRENT ARCHITECTURE
============================================================

The application already has:

App.tsx

owning:

RunwayState

using:

useState(INITIAL_RUNWAY_STATE)

Approved source-state fields include:

availableFunds: string
planningDate: string
safetyBuffer: string
fixedEssentials: string
flexibleEssentials: string
purchaseName: string
purchaseAmount: string
purchaseConfirmed: boolean

Monetary values remain raw strings in React form/session state.

Derived values are NOT stored as mutable state.

This architecture is LOCKED unless a genuine defect is discovered.

============================================================
4. READ BINDING SOURCES FIRST
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

Read:

docs/figma-reference/README.md

Inspect the P7 master prompt itself if already saved:

docs/prompts/p07-protect-essentials-runway-result.md

============================================================
5. INSPECT CURRENT SOURCE
============================================================

Inspect before modifying:

src/App.tsx

src/pages/RunwaySetupPage.tsx
src/pages/ProtectEssentialsPage.tsx
src/pages/RunwayResultPage.tsx
src/pages/PurchaseCheckPage.tsx

src/components/ui/FormSection.tsx
src/components/ui/MoneyInput.tsx
src/components/ui/SummaryRow.tsx
src/components/ui/StatusActionButton.tsx

src/components/layout/AppShell.tsx

src/types/runway.ts

src/utils/runwayCalculations.ts

Also inspect any validation/helper utilities that already exist after P6.

Do not assume P6 validation remains page-local.

Discover the actual source.

============================================================
6. FIGMA REFERENCES
============================================================

Inspect the approved curated Figma references for:

Protect Essentials

Desktop P3

Mobile M-P3

Runway Result / Dashboard

Desktop P4

Mobile M-P4

Also inspect:

DS-03 — Forms & Core Controls

DS-04 — Financial Components

DS-06 — Feedback & Accessibility

DS-08 — Responsive Architecture

Shortfall state references under:

docs/figma-reference/states/

Use the actual curated file names from the repository.

Do not invent visual patterns that contradict the approved references.

============================================================
7. GIT SAFETY
============================================================

Before implementation run:

git status

If a Git baseline commit exists:

git diff

Do not overwrite unrelated changes.

Do NOT automatically commit.

============================================================
8. SOURCE PRIORITY
============================================================

When sources conflict follow:

1. BUS4012 ASM2 official requirements
2. Locked Student Money Runway ASM1 business logic
3. docs/prompts/00-master-project-context.md
4. approved P1-P6 implementation documentation
5. curated Hi-Fi Figma references
6. current source implementation
7. implementation judgement

Do not silently alter financial definitions.

============================================================
9. BUS4012 THEORY BASIS
============================================================

P7 must visibly demonstrate:

CONTROLLED INPUTS

value
+
onChange

PROPS DOWN

App
 ↓
ProtectEssentialsPage
 ↓
MoneyInput

CALLBACKS UP

MoneyInput
 ↑
ProtectEssentialsPage
 ↑
App

DERIVED DATA

Source state
 ↓
pure functions
 ↓
calculated UI

REUSABLE COMPONENTS

FormSection

MoneyInput

SummaryRow

SEPARATION OF CONCERNS

UI components:
rendering

Pages:
interaction + validation

App:
shared state

Utility functions:
financial calculations

Do not collapse these responsibilities.

============================================================
10. S — SITUATION
============================================================

P6 now collects:

Available Funds

Planning Date

Safety Buffer

and stores them in App-owned RunwayState.

P7 must collect:

Fixed Essentials

Flexible Essentials

Then derive and display:

Protected Total

Discretionary Runway

Protected Shortfall

using P5 pure functions.

============================================================
11. C — CHALLENGE
============================================================

Complete the core Student Money Runway journey:

Runway Setup
      ↓
Protect Essentials
      ↓
Runway Result

without introducing duplicate state or duplicate formulas.

The user must be able to understand:

1. What money is currently available
2. What amount is protected
3. What remains discretionary
4. Whether protected commitments exceed available funds

The UI must present facts, not financial advice.

============================================================
12. A — AUDIENCE
============================================================

Primary audience:

International university students in Australia managing near-term expenses.

The experience should feel:

- calm
- understandable
- factual
- transparent
- reversible
- non-judgmental

Avoid alarmist language.

============================================================
13. F — FORMAT / STACK
============================================================

Use existing:

React
TypeScript
Vite
React Router DOM v6
Tailwind CSS v3

P7 must add:

NO NEW PACKAGES

Do not install:

validation libraries
state libraries
currency libraries
date libraries
chart libraries
UI frameworks

Use existing code and platform features.

============================================================
14. LOCKED BUSINESS FORMULA
============================================================

The Student Money Runway formula is:

R = MAX(0, A - F - V - B)

Where:

A = Available Funds

F = Fixed Essentials

V = Flexible Essential Allowance

B = Safety Buffer

R = Discretionary Runway

Do not alter this formula.

============================================================
15. PROTECTED TOTAL
============================================================

Protected Total is:

F + V + B

Use the existing P5 function:

calculateProtectedTotal(...)

Do NOT duplicate:

fixed + flexible + buffer

directly across JSX.

============================================================
16. PROTECTED SHORTFALL
============================================================

Protected Shortfall is:

S = MAX(0, F + V + B - A)

Use:

calculateProtectedShortfall(...)

Runway must NEVER become negative.

When protected commitments exceed available funds:

Runway = 0

Shortfall > 0

============================================================
17. APPROVED P5 FUNCTIONS
============================================================

Inspect and reuse the actual exports from:

src/utils/runwayCalculations.ts

Expected functions include:

calculateProtectedTotal

calculateRunway

calculateProtectedShortfall

calculatePurchaseRemaining

doesPurchaseExceedRunway

calculatePurchaseExcess

P7 should use only the relevant functions:

calculateProtectedTotal

calculateRunway

calculateProtectedShortfall

Do NOT rewrite them inside page components.

============================================================
18. CANONICAL CORE CASE
============================================================

Required verification:

Available Funds:

950

Fixed Essentials:

455

Flexible Essentials:

180

Safety Buffer:

100

Protected Total:

455 + 180 + 100

= 735

Discretionary Runway:

950 - 455 - 180 - 100

= 215

P7 must render the equivalent correct values.

============================================================
19. SHORTFALL CASE
============================================================

Required verification:

Available Funds:

650

Protected Total:

734

Expected:

Runway:

0

Protected Shortfall:

84

If the approved Figma/state reference supplies exact:

Fixed Essentials
Flexible Essentials
Safety Buffer

values for this scenario:

use those exact values.

If not:

use a simple test-only combination whose protected total equals 734.

Clearly document that component values were selected only to verify the locked
734 total if they are not source-defined.

Do not treat test-only values as product defaults.

============================================================
20. PROTECT ESSENTIALS PAGE
============================================================

Route:

/essentials

Turn the existing P4 skeleton into the final P7 Protect Essentials form.

The page must collect:

Fixed Essentials

Flexible Essentials

It should also show Safety Buffer context from P6 where supported by the
approved Figma.

============================================================
21. FIXED ESSENTIALS
============================================================

Use:

MoneyInput

Bind:

value={runwayState.fixedEssentials}

Report changes through the existing typed App callback.

Do NOT create authoritative local monetary state.

Local touched/error state is allowed.

============================================================
22. FLEXIBLE ESSENTIALS
============================================================

Use:

MoneyInput

Bind:

value={runwayState.flexibleEssentials}

Report changes through the existing typed App callback.

Do NOT create:

FlexibleEssentialsInput.tsx

or other page-specific duplicates.

============================================================
23. SAFETY BUFFER ON ESSENTIALS
============================================================

Safety Buffer was collected during P6.

On Protect Essentials:

do NOT create a second authoritative Safety Buffer input unless the approved
Figma explicitly requires editing it there.

Prefer showing it as protected context / summary.

If the user needs to change it:

Back should return to /setup.

Avoid duplicate editing ownership.

============================================================
24. FORMSECTION REUSE
============================================================

Use the existing:

FormSection

naturally on Protect Essentials.

This creates genuine visible reuse:

Runway Setup
+
Protect Essentials

Do NOT create a second section-wrapper component.

============================================================
25. MONEYINPUT REUSE
============================================================

Use the same approved:

MoneyInput

for:

Fixed Essentials

Flexible Essentials

This creates genuine visible reuse across:

Runway Setup
+
Protect Essentials

Do not alter MoneyInput's business responsibility.

============================================================
26. SUMMARYROW REUSE ON ESSENTIALS
============================================================

Use:

SummaryRow

for meaningful financial summary information where it matches Figma.

Appropriate rows may include:

Safety Buffer

Protected Total

or other approved values.

Do not artificially add rows just to increase reuse.

============================================================
27. PROTECTED TOTAL LIVE DERIVATION
============================================================

Protected Total is derived.

Do NOT store it in RunwayState.

If both fixed/flexible inputs and Safety Buffer are valid:

derive:

calculateProtectedTotal(...)

and show it where the approved Figma calls for a summary.

If inputs are incomplete/invalid:

do not display a misleading calculated value such as:

AUD 0

unless zero is genuinely the entered valid amount.

Prefer:

placeholder
neutral unavailable state
or omit the derived total

according to Figma.

Never convert invalid fields to zero silently.

============================================================
28. P6 MONEY VALIDATION RECONCILIATION
============================================================

Inspect the exact money validation implemented in P6.

P7 must preserve the same monetary-input contract.

Do not create inconsistent rules between:

Available Funds
Safety Buffer
Fixed Essentials
Flexible Essentials

If P6 already created a reusable money-validation helper:

reuse it.

If P6 validation is page-local and P7 would otherwise duplicate identical
logic:

you MAY extract the identical rule into a small shared utility.

Only do this if:

- behaviour remains unchanged
- the extraction clearly reduces duplication
- the utility has one simple responsibility
- P6 continues to pass

A reasonable path could be:

src/utils/moneyValidation.ts

but create it only if justified by actual source.

Do not introduce a validation framework.

============================================================
29. MONEY VALIDATION RULES
============================================================

Preserve the P6 approved monetary contract.

At minimum:

- required
- valid decimal money syntax
- finite numeric conversion
- zero allowed
- negative values rejected

If P6 already established a maximum decimal precision rule:

preserve that rule consistently.

Do NOT invent a new precision limit in P7.

============================================================
30. FIXED ESSENTIALS VALIDATION
============================================================

Required.

Examples of factual errors:

"Enter your fixed essentials."

"Enter a valid amount."

"Enter an amount of 0 or more."

Use existing P6 wording/pattern where applicable.

============================================================
31. FLEXIBLE ESSENTIALS VALIDATION
============================================================

Required.

Use the same validation contract.

Zero must be allowed.

For example:

fixed = 455

flexible = 0

is valid.

Do not require a positive flexible allowance.

============================================================
32. TOUCHED VALIDATION
============================================================

Use page-local touched/submission-aware state.

Do NOT add:

fixedEssentialsTouched

or:

flexibleEssentialsTouched

to App.tsx.

UI interaction state belongs to the page.

============================================================
33. ESSENTIALS SUBMIT
============================================================

On submit:

validate:

Fixed Essentials

Flexible Essentials

Also ensure prerequisite P6 values needed for calculations are usable.

If invalid:

remain:

/essentials

Do NOT navigate.

If valid:

navigate to:

/runway

============================================================
34. ESSENTIALS BACK ACTION
============================================================

Back should return to:

/setup

Preserve shared state.

Expected:

Setup values remain populated.

Essentials values should also remain in App state if the user returns again.

Do not clear state on Back.

============================================================
35. STATE PRESERVATION TEST
============================================================

Verify:

1. Enter valid Setup values
2. Continue to Essentials
3. Enter Essentials values
4. Back to Setup
5. Continue again to Essentials

Expected:

fixedEssentials remains populated

flexibleEssentials remains populated

No localStorage required.

App-level state remains the source of truth.

============================================================
36. RUNWAY RESULT PAGE
============================================================

Route:

/runway

Turn the P4 skeleton into the final calculated Runway Result screen.

Use the approved P4 desktop/mobile Figma references.

This page should present derived financial information.

It should NOT own mutable duplicate financial results.

============================================================
37. RUNWAY RESULT INPUTS
============================================================

The result is derived from:

runwayState.availableFunds

runwayState.fixedEssentials

runwayState.flexibleEssentials

runwayState.safetyBuffer

These are strings at React state level.

Before calling P5 calculations:

validate/convert them into finite numbers through a clearly defined page/domain
boundary.

Do NOT modify the stored strings.

============================================================
38. DO NOT PARSE INSIDE BUSINESS FUNCTIONS
============================================================

P5 calculation functions accept numeric domain values.

Do NOT change them to accept strings.

Bad:

calculateRunway(runwayState)

Good conceptual pattern:

const availableFunds = validated conversion

const runway = calculateRunway(
  availableFunds,
  fixedEssentials,
  flexibleEssentials,
  safetyBuffer
)

============================================================
39. SAFE CONVERSION BOUNDARY
============================================================

Do not use patterns that silently turn invalid input into zero.

Avoid:

Number(value) || 0

because:

invalid input
and
valid zero

become indistinguishable.

Use explicit validity checks.

If source data is invalid:

do not calculate.

============================================================
40. DIRECT ROUTE ACCESS SAFETY
============================================================

A user can directly enter:

/runway

in the browser.

P7 must never produce:

NaN
Infinity
broken currency
React errors

when prerequisite state is missing.

Implement the smallest deterministic prerequisite handling.

Preferred behaviour:

If Setup values are incomplete:

guide/redirect user to:

/setup

If Setup is valid but Essentials values are incomplete:

guide/redirect user to:

/essentials

Use the simplest React Router-compatible approach.

Do NOT build an authentication/route-guard framework.

Document the decision.

============================================================
41. DERIVED VALUES
============================================================

On valid result state derive:

protectedTotal

runway

shortfall

Do not store them using useState.

Do not create:

setRunway()

setProtectedTotal()

setShortfall()

These are deterministic results.

============================================================
42. RUNWAY RESULT MAIN VALUE
============================================================

The primary value should be:

Discretionary Runway

Use:

calculateRunway(...)

For canonical case:

215

The result page must make this number visually clear according to Figma.

Use existing:

money-display typography

and semantic design tokens.

============================================================
43. RESULT BREAKDOWN
============================================================

Use:

SummaryRow

to render meaningful breakdown values.

Expected concepts include:

Available Funds

Fixed Essentials

Flexible Essentials

Safety Buffer

Protected Total

Discretionary Runway

Do not blindly render every row if Figma uses a more concise structure.

Preserve the approved information hierarchy.

============================================================
44. SUMMARYROW REUSE EVIDENCE
============================================================

P7 should result in meaningful SummaryRow reuse across at least:

Protect Essentials

Runway Result

This is valuable BUS4012 assessment evidence.

Do not alter SummaryRow solely for P7 unless a genuine limitation is found.

============================================================
45. NORMAL RUNWAY STATE
============================================================

If:

shortfall === 0

and runway is positive or zero:

show the standard Runway Result layout.

Use factual language.

Example:

"Discretionary runway"

Do not say:

"You can safely spend AUD 215."

Do not say:

"You should spend AUD 215."

============================================================
46. ZERO RUNWAY WITHOUT SHORTFALL
============================================================

Boundary case:

Available Funds exactly equals Protected Total.

Example:

Available = 735
Protected = 735

Expected:

Runway = 0
Shortfall = 0

This is NOT a protected shortfall.

Do not incorrectly display shortfall messaging.

The factual state is simply:

Discretionary Runway = 0

============================================================
47. SHORTFALL STATE
============================================================

If:

protectedShortfall > 0

show the approved shortfall state.

Required facts:

Discretionary Runway:

0

Protected Shortfall:

calculated amount

Explain factually that currently entered protected amounts exceed currently
available funds by the calculated difference.

Avoid:

"You are in danger."

"You cannot afford your essentials."

"Your finances are bad."

============================================================
48. SHORTFALL COPY
============================================================

Suitable concept:

"Your currently entered protected amounts exceed your available funds by
AUD X."

or follow the exact Figma copy if provided.

Do not issue financial advice.

Provide a clear action to review inputs.

Likely action:

Review protected amounts

or:

Back to Protect Essentials

as supported by Figma.

============================================================
49. FUTURE INCOME RULE
============================================================

Do not include expected future income in calculations.

The product uses funds currently available.

If explanatory copy is required:

future income is excluded until received.

Do NOT add a future-income field.

============================================================
50. PLANNING DATE ON RESULT
============================================================

If the Figma Result screen displays the planning date/horizon:

use:

runwayState.planningDate

Do not convert a YYYY-MM-DD value through:

new Date("YYYY-MM-DD")

if doing so could introduce UTC/local-day shifting.

If display formatting is required:

prefer a small deterministic date-only formatter that treats the value as a
calendar date, not a timestamp.

Do not add a date library.

If Figma simply displays the raw/native date representation appropriately:

keep it simple.

============================================================
51. CURRENCY PRESENTATION
============================================================

Inspect the existing Figma and current code for established AUD formatting.

Do not introduce a different currency convention arbitrarily.

If a shared formatter already exists:

reuse it.

If repeated formatting now genuinely requires a helper:

you MAY create one small presentation utility.

Example responsibility:

format a validated numeric amount according to the approved Student Money
Runway AUD display convention.

Do not mix formatting into financial calculation utilities.

============================================================
52. CALCULATION VS PRESENTATION
============================================================

Keep:

runwayCalculations.ts

for arithmetic only.

If creating currency/date presentation helpers:

keep them separate.

Do not turn calculation functions into UI formatters.

============================================================
53. RUNWAY RESULT CTA
============================================================

Normal result state should expose the next user action:

Check a Purchase

Navigate to:

/purchase

using:

useNavigate()

or an existing semantic Router link.

Do NOT implement the Purchase Check form.

P8 owns that screen.

============================================================
54. RESULT BACK ACTION
============================================================

Provide appropriate Back/Edit navigation according to Figma.

Likely:

/essentials

Do not clear shared state.

============================================================
55. P8 BOUNDARY
============================================================

Do NOT implement:

purchaseName UI

purchaseAmount UI

purchase preview calculation UI

purchase success/failure

Mark as spent

StatusActionButton final use

purchaseConfirmed mutation

Those belong to P8.

============================================================
56. STATUSACTIONBUTTON
============================================================

Do not use:

StatusActionButton

for Runway Result's ordinary:

Check a Purchase

action merely to surface the P3 component.

Its semantic target remains explicit purchase confirmation in P8.

============================================================
57. APP STATE OWNERSHIP
============================================================

App.tsx remains the owner of:

RunwayState

P7 should not create a second provider/store.

Do not move financial state into:

ProtectEssentialsPage

or:

RunwayResultPage

============================================================
58. PROPS CONTRACT — ESSENTIALS
============================================================

Use the existing P5/P6 update contract.

Conceptually:

interface ProtectEssentialsPageProps {
  runwayState: RunwayState
  onRunwayStateChange: (patch: RunwayStatePatch) => void
}

Use actual established names from the repository.

Do not create a competing state API.

============================================================
59. PROPS CONTRACT — RESULT
============================================================

RunwayResultPage needs access to source state needed for derived calculations.

Prefer passing the approved:

runwayState

rather than several disconnected copies if that remains clear and consistent
with P5.

Do NOT allow RunwayResultPage to mutate financial source state unless a clearly
defined edit interaction requires navigation back to the relevant form.

Result page should primarily derive/render.

============================================================
60. ASSESSMENT COMPONENT REUSE
============================================================

By the end of P7 verify visible reuse:

FORMSECTION

Runway Setup
Protect Essentials

MONEYINPUT

Runway Setup
Protect Essentials

SUMMARYROW

Protect Essentials
Runway Result

Document this explicitly.

This is strong evidence for the BUS4012 reusable-component criterion.

============================================================
61. DO NOT MODIFY COMPONENT APIS CASUALLY
============================================================

Do not modify:

FormSection

MoneyInput

SummaryRow

unless a real P7 limitation exists.

If modification is necessary:

- preserve backwards compatibility where practical
- explain why
- verify P6 still works
- update source headers correctly

Do not add props solely because they "might be useful later."

============================================================
62. ACCESSIBILITY — ESSENTIALS
============================================================

Protect Essentials must have:

- semantic <form>
- one clear h1
- real field labels
- required/error relationships
- aria-invalid where appropriate
- aria-describedby where appropriate
- visible focus
- keyboard-submit support
- button types correctly specified

============================================================
63. ACCESSIBILITY — RESULT
============================================================

Runway Result must:

- have one clear h1
- preserve logical heading hierarchy
- expose calculated values as readable text
- not communicate shortfall only through colour
- provide meaningful action labels
- support keyboard navigation

Do not overuse ARIA where native semantics already work.

============================================================
64. LIVE CALCULATION ACCESSIBILITY
============================================================

If Protected Total updates while typing:

do NOT create an aggressive aria-live announcement on every keystroke.

This could become noisy.

A normal visible summary is sufficient unless the approved interaction
specifically requires announcement.

============================================================
65. RESPONSIVE — ESSENTIALS
============================================================

Verify around:

390px mobile

1280px desktop

Also avoid obvious breakage near:

768px
1024px

On mobile:

- inputs stack
- summary remains readable
- actions remain touch-friendly
- no horizontal overflow
- errors wrap correctly

============================================================
66. RESPONSIVE — RESULT
============================================================

At mobile width:

- main Runway figure remains prominent
- breakdown stacks cleanly
- shortfall message remains readable
- CTA is easy to tap
- no horizontal clipping

At desktop:

match the P4 Hi-Fi layout hierarchy.

P9 will perform final pixel/responsive audit later.

============================================================
67. ETHICAL LANGUAGE
============================================================

Search all newly changed P7 copy for financial judgement.

Avoid:

safe
unsafe
good
bad
smart
poor choice
you should spend
you should not spend
you can afford

unless the word appears in an unrelated technical meaning.

Preferred:

Discretionary Runway

Protected Total

Protected Shortfall

Available Funds

Review inputs

Check a Purchase

============================================================
68. NO FINANCIAL ADVICE
============================================================

The app reports deterministic calculations based on user inputs.

It does not recommend:

spending
saving
investing
borrowing
lending

Do not add advice text in P7.

============================================================
69. SOURCE HEADER STANDARD
============================================================

All files must follow:

docs/prompts/00-master-project-context.md

Student:

Thien Khuong Vu

Phase:

P7 — Protect Essentials + Runway Result

Canonical timezone:

Australia/Melbourne

Windows/.NET:

AUS Eastern Standard Time

Never use Vietnam local time.

Never guess timestamps.

============================================================
70. EXISTING FILE TIMESTAMPS
============================================================

ProtectEssentialsPage.tsx

and:

RunwayResultPage.tsx

already exist from P4.

Preserve their original:

@createdAt

When materially modified in P7:

update:

@updatedAt

using the binding master timestamp method.

Do not replace creation time with P7 time.

============================================================
71. NEW FILE TIMESTAMPS
============================================================

If P7 legitimately creates a new helper or documentation file:

capture its actual filesystem timestamp.

Convert to:

Australia/Melbourne

Use correct AEST/AEDT offset automatically.

============================================================
72. SOURCE HEADER RESPONSIBILITIES
============================================================

ProtectEssentialsPage summary/responsibility should truthfully indicate that it:

- collects protected essential amounts
- validates them
- reports source-state changes upward
- derives relevant protected summary values

RunwayResultPage should truthfully indicate that it:

- derives
- presents

the runway/shortfall result from validated shared source state.

Do not claim that ResultPage owns calculations if arithmetic remains in P5
utilities.

============================================================
73. INLINE COMMENT STANDARD
============================================================

Comment WHY, not WHAT.

Good:

// Protected Total is derived rather than persisted so the UI cannot drift from
// the three source amounts.

Good:

// Treat missing prerequisite state separately from a valid zero amount to avoid
// presenting an incomplete direct-route visit as AUD 0.

Bad:

// Calculate total.

// Navigate next.

// Set fixed essentials.

============================================================
74. IMPLEMENTATION DOCUMENTATION
============================================================

Create:

docs/implementation/p7-protect-essentials-runway-result.md

Use:

# P7 — Protect Essentials and Runway Result

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P7 — Protect Essentials + Runway Result
> Created: <actual Melbourne filesystem timestamp>
> Updated: <actual Melbourne filesystem timestamp>

Document:

1. P7 scope
2. Protect Essentials field model
3. State ownership
4. Money validation strategy
5. Props-down flow
6. Callback-up flow
7. Protected Total derivation
8. Runway derivation
9. Shortfall derivation
10. Source-state vs derived-data rule
11. Canonical result
12. Shortfall result
13. Direct-route prerequisite handling
14. Normal Runway Result state
15. Zero-runway/no-shortfall boundary
16. Shortfall state
17. Component reuse matrix
18. Figma references
19. Responsive verification
20. Accessibility decisions
21. Ethical-language decisions
22. P8 boundary

============================================================
75. REQUIRED P7 DATA FLOW DIAGRAM
============================================================

Include a diagram equivalent to:

App.tsx
│
│ owns RunwayState
│
├───────────────┐
│               │
▼               │
ProtectEssentialsPage
│
├── MoneyInput — Fixed Essentials
│      ↑
│      └── onChange(rawValue)
│
├── MoneyInput — Flexible Essentials
│      ↑
│      └── onChange(rawValue)
│
└── SummaryRow — derived Protected Total
        │
        │ valid submit
        ▼
     /runway
        │
        ▼
RunwayResultPage
        │
        ├── calculateProtectedTotal(...)
        ├── calculateRunway(...)
        └── calculateProtectedShortfall(...)
                │
                ▼
            SummaryRow UI

Explain:

Source values are stored.

Results are derived.

============================================================
76. COMPONENT REUSE MATRIX
============================================================

Update/document a P7 reuse matrix equivalent to:

| Component | Screen 1 | Screen 2 | Role |
| FormSection | Runway Setup | Protect Essentials | Section structure |
| MoneyInput | Runway Setup | Protect Essentials | Monetary controlled input |
| SummaryRow | Protect Essentials | Runway Result | Financial summary display |

Do not alter P2 component matrix history unnecessarily.

P7 documentation may reference the original P2 matrix and record actual realised
reuse.

============================================================
77. PROTECT ESSENTIALS TEST — E1
============================================================

EMPTY

Fixed Essentials:
""

Flexible Essentials:
""

Expected:

remain /essentials

required errors after submission

No NaN output.

============================================================
78. PROTECT ESSENTIALS TEST — E2
============================================================

NEGATIVE FIXED

Fixed Essentials:
"-1"

Flexible Essentials:
"180"

Expected:

invalid

remain /essentials.

============================================================
79. PROTECT ESSENTIALS TEST — E3
============================================================

NEGATIVE FLEXIBLE

Fixed Essentials:
"455"

Flexible Essentials:
"-1"

Expected:

invalid.

============================================================
80. PROTECT ESSENTIALS TEST — E4
============================================================

ZERO VALUES

Fixed Essentials:
"0"

Flexible Essentials:
"0"

Valid P6 Setup values.

Expected:

valid.

Protected Total should reflect:

Safety Buffer only.

Zero is valid.

============================================================
81. PROTECT ESSENTIALS TEST — E5
============================================================

DECIMAL VALUES

Fixed Essentials:
"455.50"

Flexible Essentials:
"180.25"

Expected:

valid if compliant with the approved P6 money-format contract.

Do not round raw source state during typing.

============================================================
82. PROTECT ESSENTIALS TEST — E6
============================================================

CANONICAL

Available:
950

Safety Buffer:
100

Fixed:
455

Flexible:
180

Expected Protected Total:

735

Valid submit:

navigate /runway.

============================================================
83. RESULT TEST — R1 CANONICAL
============================================================

Inputs:

A = 950
F = 455
V = 180
B = 100

Expected:

Protected Total = 735

Discretionary Runway = 215

Protected Shortfall = 0

Normal result state.

============================================================
84. RESULT TEST — R2 EXACT PROTECTION
============================================================

Use inputs where:

Available Funds = Protected Total

Expected:

Runway = 0

Shortfall = 0

Do NOT show a shortfall state.

============================================================
85. RESULT TEST — R3 SHORTFALL
============================================================

Available:

650

Protected Total:

734

Expected:

Runway = 0

Shortfall = 84

Shortfall UI visible.

No negative Runway shown.

============================================================
86. RESULT TEST — R4 DIRECT ACCESS
============================================================

Start a fresh application session.

Directly visit:

/runway

with incomplete source state.

Expected:

No:

NaN
Infinity
broken currency
runtime error

User is deterministically guided to complete required earlier inputs.

============================================================
87. RESULT TEST — R5 BACK NAVIGATION
============================================================

Enter canonical values.

Reach:

/runway

Navigate back:

/essentials

Expected:

fixedEssentials = "455"

flexibleEssentials = "180"

remain populated.

============================================================
88. RESULT TEST — R6 NEXT NAVIGATION
============================================================

With a valid normal result:

activate:

Check a Purchase

Expected:

navigate to:

/purchase

PurchaseCheckPage may remain its current P4 skeleton.

Do NOT implement P8 form.

============================================================
89. CALCULATION CROSS-CHECK
============================================================

Explicitly verify function outputs independently of visual rendering.

Expected:

calculateProtectedTotal(
  455,
  180,
  100
)

= 735

calculateRunway(
  950,
  455,
  180,
  100
)

= 215

calculateProtectedShortfall(
  950,
  455,
  180,
  100
)

= 0

And shortfall scenario:

Protected Total:

734

Available:

650

Expected:

Runway = 0

Shortfall = 84

============================================================
90. DO NOT MODIFY P5 FORMULAS UNLESS DEFECTIVE
============================================================

P5 calculation functions already passed canonical verification.

Do not rewrite them merely while integrating P7.

If an actual defect is discovered:

- stop
- identify the defect
- explain the discrepancy
- make the minimum correction
- rerun all P5 canonical cases
- document it

Do not silently change locked arithmetic.

============================================================
91. NO DERIVED STATE
============================================================

Reject architecture like:

const [protectedTotal, setProtectedTotal] = useState(...)
const [runway, setRunway] = useState(...)
const [shortfall, setShortfall] = useState(...)

for deterministic values.

Use derivation from source state.

============================================================
92. NO EFFECT-BASED CALCULATION SYNCHRONISATION
============================================================

Avoid:

useEffect(() => {
  setRunway(...)
}, [...])

for deterministic arithmetic.

This creates redundant state and synchronisation risk.

Calculate directly from validated inputs.

============================================================
93. NO PREMATURE PERFORMANCE OPTIMISATION
============================================================

Do not add useMemo merely because calculations exist.

These calculations are trivial.

Use direct derived computation unless profiling demonstrates an actual issue.

============================================================
94. NO PACKAGE CHANGES
============================================================

Expected:

package.json unchanged

package-lock.json unchanged

Do not install packages.

============================================================
95. EXPECTED FILE SCOPE
============================================================

Primary expected modifications:

src/pages/ProtectEssentialsPage.tsx

src/pages/RunwayResultPage.tsx

src/App.tsx

ONLY if P7 prop wiring requires it.

Possible justified modification:

src/pages/RunwaySetupPage.tsx

ONLY if extracting shared money validation without changing P6 behaviour.

Possible new helper:

src/utils/moneyValidation.ts

ONLY if actual P6/P7 duplication clearly justifies extraction.

Possible presentation helper:

src/utils/<currency-or-date-helper>.ts

ONLY if repeated formatting genuinely requires it.

Create:

docs/implementation/p7-protect-essentials-runway-result.md

Preserve:

docs/prompts/p07-protect-essentials-runway-result.md

============================================================
96. DO NOT MODIFY
============================================================

Avoid modifying:

LoginPage.tsx

PurchaseCheckPage.tsx

ResultPage.tsx

StatusActionButton.tsx

runwayCalculations.ts

P1 design tokens

unless required by a concrete P7 defect.

============================================================
97. IMPLEMENTATION SEQUENCE
============================================================

Follow this sequence:

STEP 1

Read master/context docs.

STEP 2

Inspect actual P5/P6 source.

STEP 3

Inspect Figma Protect Essentials + Runway Result.

STEP 4

Reconcile P6 money-validation contract.

STEP 5

Plan P7 data flow before coding.

STEP 6

Implement Protect Essentials controlled form.

STEP 7

Implement derived Protected Total.

STEP 8

Validate Essentials navigation/state retention.

STEP 9

Implement Runway Result using P5 functions.

STEP 10

Implement normal / zero / shortfall presentation branches.

STEP 11

Implement minimal direct-route prerequisite safety.

STEP 12

Validate component reuse.

STEP 13

Run calculation test cases.

STEP 14

Run browser/mobile/desktop verification.

STEP 15

Create P7 documentation.

STEP 16

Run lint/build.

STEP 17

Inspect Git diff.

STOP.

============================================================
98. BROWSER VERIFICATION
============================================================

Run:

npm run dev

Verify actual Vite URL.

Test:

/essentials

/runway

Also ensure:

/login

/setup

still function after P7.

Verify no route regression.

============================================================
99. DESKTOP VERIFICATION
============================================================

At approximately:

1280px

Check:

Protect Essentials hierarchy

MoneyInput layout

Protected Total

Runway main result

SummaryRows

shortfall state

CTA placement

No obvious divergence from Figma.

============================================================
100. MOBILE VERIFICATION
============================================================

At approximately:

390px

Check:

no horizontal overflow

inputs stack

errors wrap

SummaryRow remains readable

Runway figure is not clipped

shortfall copy wraps

buttons remain usable

============================================================
101. CONSOLE VERIFICATION
============================================================

No new:

React errors

controlled/uncontrolled warnings

NaN rendering

Infinity rendering

uncaught exceptions

route errors

Existing non-blocking React Router future-flag warnings may remain.

Do not misclassify those as P7 failures if unchanged.

============================================================
102. LINT
============================================================

Run:

npm run lint

Required:

PASS

Do not suppress errors.

============================================================
103. BUILD
============================================================

Run:

npm run build

Required:

PASS

Do not weaken TypeScript.

============================================================
104. PACKAGE AUDIT
============================================================

Check:

package.json

package-lock.json

P7 expected package additions:

NONE

============================================================
105. GIT REVIEW
============================================================

Run:

git status

git diff

If a baseline exists:

review every changed file.

Confirm no P8 implementation entered the diff.

Do not automatically commit.

============================================================
106. P7 ACCEPTANCE — ESSENTIALS
============================================================

P7 Protect Essentials passes only if:

[ ] page uses real form

[ ] Fixed Essentials uses MoneyInput

[ ] Flexible Essentials uses MoneyInput

[ ] source values remain strings

[ ] values are owned by App

[ ] typed callback-up path works

[ ] FormSection is reused

[ ] SummaryRow is used meaningfully where Figma supports it

[ ] Safety Buffer context is shown appropriately

[ ] validation is consistent with P6

[ ] empty input rejected

[ ] negative input rejected

[ ] zero accepted

[ ] valid decimals accepted according to P6 contract

[ ] invalid submit remains /essentials

[ ] valid submit goes /runway

[ ] Back goes /setup

[ ] state survives Back/Forward route navigation

============================================================
107. P7 ACCEPTANCE — RESULT
============================================================

Runway Result passes only if:

[ ] result uses P5 pure calculation functions

[ ] no duplicate formula exists in JSX

[ ] Protected Total derived

[ ] Runway derived

[ ] Shortfall derived

[ ] derived values not stored in mutable state

[ ] canonical total = 735

[ ] canonical runway = 215

[ ] shortfall case = 84

[ ] runway never rendered negative

[ ] zero-runway/no-shortfall boundary handled correctly

[ ] shortfall state uses factual language

[ ] direct route cannot render NaN/Infinity

[ ] Check a Purchase navigates /purchase

[ ] no P8 Purchase form implemented

============================================================
108. COMPONENT REUSE ACCEPTANCE
============================================================

Verify visible reuse after P7:

FormSection:

at least:
Runway Setup
Protect Essentials

MoneyInput:

at least:
Runway Setup
Protect Essentials

SummaryRow:

at least:
Protect Essentials
Runway Result

Document actual evidence.

Do not claim reuse where component is not actually rendered.

============================================================
109. ARCHITECTURE ACCEPTANCE
============================================================

[ ] App remains RunwayState owner

[ ] no Redux/Zustand/context system added

[ ] no localStorage/sessionStorage

[ ] no derived financial state

[ ] no useEffect calculation synchronization

[ ] calculation utilities remain pure

[ ] validation and calculations remain separate

[ ] no new dependencies

============================================================
110. ETHICS ACCEPTANCE
============================================================

[ ] no financial advice

[ ] no "safe/unsafe purchase" framing

[ ] no judgemental language

[ ] shortfall stated factually

[ ] future income excluded until received

[ ] calculations remain transparent

============================================================
111. ACCESSIBILITY ACCEPTANCE
============================================================

[ ] semantic Essentials form

[ ] one h1 per page

[ ] input labels

[ ] visible focus

[ ] errors not colour-only

[ ] keyboard submit works

[ ] result values readable as text

[ ] shortfall not colour-only

[ ] actions have descriptive accessible labels

============================================================
112. SOURCE TRACEABILITY ACCEPTANCE
============================================================

[ ] Student:
    Thien Khuong Vu

[ ] Phase:
    P7 — Protect Essentials + Runway Result

[ ] existing createdAt preserved

[ ] material updatedAt correct

[ ] Australia/Melbourne timezone

[ ] no guessed timestamps

[ ] summary/responsibility truthful

============================================================
113. FINAL REPORT
============================================================

Return:

A. References inspected

List:

- master context
- implementation docs
- Figma references
- source files

------------------------------------------------------------

B. Protect Essentials implementation

Report:

- Fixed Essentials
- Flexible Essentials
- Safety Buffer context
- validation strategy
- state ownership
- navigation

------------------------------------------------------------

C. Runway Result implementation

Report:

- Protected Total
- Runway
- Shortfall
- normal branch
- zero/no-shortfall branch
- shortfall branch
- direct-route handling

------------------------------------------------------------

D. Calculation verification

Table:

Case
Expected
Actual
PASS / FAIL

Must include:

Protected Total 735

Runway 215

Shortfall 84

Exact-protection boundary

------------------------------------------------------------

E. Source state vs derived values

Show clearly.

------------------------------------------------------------

F. Props-down path

Show exact real path.

------------------------------------------------------------

G. Callback-up path

Show exact real path.

------------------------------------------------------------

H. Reusable component evidence

Table:

Component
Screen 1
Screen 2
PASS / FAIL

For:

FormSection
MoneyInput
SummaryRow

------------------------------------------------------------

I. Validation test matrix

Report:

E1
E2
E3
E4
E5
E6

------------------------------------------------------------

J. Result test matrix

Report:

R1
R2
R3
R4
R5
R6

------------------------------------------------------------

K. Responsive verification

Mobile ~390px

Desktop ~1280px

------------------------------------------------------------

L. Accessibility verification

------------------------------------------------------------

M. Ethical-language review

------------------------------------------------------------

N. Files created

------------------------------------------------------------

O. Files modified

------------------------------------------------------------

P. Source-header traceability

Table:

File
Phase
Created
Updated
Timezone

------------------------------------------------------------

Q. Packages added

Expected:

NONE

------------------------------------------------------------

R. npm run lint

PASS / FAIL

------------------------------------------------------------

S. npm run build

PASS / FAIL

------------------------------------------------------------

T. Browser/runtime verification

Report Vite URL.

Report console status.

------------------------------------------------------------

U. Git/change assessment

------------------------------------------------------------

V. Deferred work for P8

Explicitly list:

- Purchase Check controlled form
- purchase name
- purchase amount
- purchase-impact preview
- within-runway branch
- exceeds-runway branch
- Back Without Saving
- StatusActionButton final integration
- Mark as spent confirmation
- confirmed mutation

============================================================
114. HARD STOP
============================================================

Do NOT continue to P8.

Do NOT implement Purchase Check final form.

Do NOT implement Purchase Impact Preview.

Do NOT implement:

purchaseAmount behaviour

purchaseName behaviour

purchase remaining UI

purchase excess UI

Mark as spent

purchaseConfirmed mutation

Do NOT modify StatusActionButton for its final business action.

If blocked finish exactly:

P7 PROTECT ESSENTIALS AND RUNWAY RESULT BLOCKED

If every P7 acceptance condition passes finish exactly:

P7 PROTECT ESSENTIALS AND RUNWAY RESULT READY