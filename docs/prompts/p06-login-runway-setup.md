# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# P6 — LOGIN + RUNWAY SETUP
# UNIVERSAL MASTER IMPLEMENTATION PROMPT
#
# Student: Thien Khuong Vu
# Recommended model: GPT-5.6 Terra — MEDIUM
#
# EXECUTION MODE:
# INSPECT → PLAN → IMPLEMENT → VALIDATE → DOCUMENT → STOP
#
# IMPORTANT:
# P6 implements ONLY:
#
# 1. Login screen behaviour
# 2. Runway Setup controlled form
# 3. Baseline field validation
# 4. Props-down / callbacks-up integration
# 5. Navigation:
#
#    /login → /setup → /essentials
#
# Do NOT continue to P7.
#
# Do NOT implement Protect Essentials final form.
# Do NOT implement Runway Result calculations in the UI.
# Do NOT implement Purchase Check.
# Do NOT implement purchase confirmation.
#
# P5 state ownership and calculation architecture are already approved.
# Preserve them.

============================================================
0. ROLE
============================================================

Act simultaneously as:

- Senior React Developer
- Frontend Software Architect
- TypeScript Engineer
- UI/UX Implementation Engineer
- Form Validation Reviewer
- Accessibility Reviewer
- Responsive Web Reviewer
- BUS4012 Vibe Coding implementation assistant

You are continuing an existing BUS4012 university coursework repository.

Your responsibility in P6 is to turn the existing Login and Runway Setup
skeleton pages into real interactive screens while preserving the approved
architecture from P1-P5.

The implementation must remain:

- simple
- explainable
- maintainable
- accessible
- responsive
- consistent with Figma
- aligned with BUS4012 course concepts

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

P6 — Login + Runway Setup

============================================================
2. COMPLETED BASELINE
============================================================

The following phases are COMPLETE:

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
Custom Reusable UI Kit

P3
21st.dev Dynamic Status Button integration

P4
React Router + Page Skeletons

P5
State Model + Pure Business Logic

Do NOT rebuild or replace these foundations.

============================================================
3. READ BINDING CONTEXT FIRST
============================================================

Before modifying anything, read:

docs/prompts/00-master-project-context.md

Then read:

docs/implementation/p1-design-system-mapping.md
docs/implementation/p2-component-matrix.md
docs/implementation/p3-21st-dev-integration.md
docs/implementation/p4-route-map.md
docs/implementation/p5-state-and-calculation-model.md

Read:

docs/figma-reference/README.md

Inspect relevant Figma references under:

docs/figma-reference/screens/desktop/
docs/figma-reference/screens/mobile/
docs/figma-reference/design-system/
docs/figma-reference/components/

For P6 focus especially on:

- Landing / entry visual language
- Runway Setup desktop reference
- Runway Setup mobile reference
- DS-03 Forms & Core Controls
- DS-06 Feedback & Accessibility
- DS-08 Responsive Architecture

Inspect current source:

src/App.tsx
src/main.tsx

src/pages/LoginPage.tsx
src/pages/RunwaySetupPage.tsx
src/pages/ProtectEssentialsPage.tsx

src/components/ui/FormSection.tsx
src/components/ui/MoneyInput.tsx
src/components/ui/SummaryRow.tsx
src/components/ui/StatusActionButton.tsx

src/components/layout/AppShell.tsx

src/types/runway.ts
src/utils/runwayCalculations.ts

Inspect:

package.json
package-lock.json

============================================================
4. GIT SAFETY CHECK
============================================================

Before implementation run:

git status

If a baseline commit exists:

git diff

Do not overwrite unrelated user work.

If files are already modified before P6:

inspect them before editing.

Do NOT automatically commit.

============================================================
5. SOURCE PRIORITY
============================================================

When sources conflict follow:

1. BUS4012 ASM2 requirements
2. Locked Student Money Runway product/business rules
3. docs/prompts/00-master-project-context.md
4. approved implementation docs P1-P5
5. curated Hi-Fi Figma references
6. current repository implementation
7. implementation judgement

Do not silently invent product behaviour.

============================================================
6. BUS4012 THEORY BASIS
============================================================

P6 must demonstrate the React concepts expected by the course.

Use:

CONTROLLED INPUT

value
+
onChange

STATE OWNERSHIP

Shared application data remains in App.tsx.

PROPS DOWN

App
 ↓
RunwaySetupPage
 ↓
MoneyInput

CALLBACKS UP

MoneyInput
 ↑
RunwaySetupPage
 ↑
App

TOUCHED VALIDATION

Do not show all validation errors before the user interacts.

NAVIGATION

Use React Router v6:

useNavigate()

SEPARATION OF RESPONSIBILITIES

Page:
form interaction + page validation

Reusable component:
presentation + controlled input contract

App:
shared session state

Calculation utilities:
pure business calculations

Do not mix these layers unnecessarily.

============================================================
7. S — SITUATION
============================================================

P4 created real routes:

/login
/setup
/essentials
/runway
/purchase
/result

P5 created:

- RunwayState
- INITIAL_RUNWAY_STATE
- RunwayStatePatch
- central state ownership in App.tsx
- deterministic financial calculation utilities

P6 must now make:

/login

and:

/setup

real functional screens.

============================================================
8. C — CHALLENGE
============================================================

Implement a frontend-only Login flow followed by a controlled Runway Setup
form.

Required flow:

/login
   ↓ successful frontend form validation
/setup
   ↓ successful Runway Setup validation
/essentials

The shared financial state must remain owned by App.tsx.

Runway Setup must use the approved MoneyInput component rather than creating
page-specific monetary input components.

============================================================
9. A — AUDIENCE
============================================================

Primary product users:

International university students in Australia managing near-term living
expenses.

The experience should feel:

- calm
- clear
- transparent
- predictable
- non-judgmental
- easy to understand

Avoid:

- financial advice
- fear-based copy
- unnecessary jargon
- gamification
- excessive animation
- fake security claims

============================================================
10. F — FORMAT / EXISTING STACK
============================================================

Use only the existing stack:

React
TypeScript
Vite
React Router DOM v6
Tailwind CSS v3
Framer Motion only where already required by the P3 component

P6 should add:

NO NEW PACKAGES

Do not install:

React Hook Form
Formik
Zod
Yup
Redux
Zustand
Firebase
Supabase
authentication libraries
date libraries

P6 is simple enough without them.

============================================================
11. P6 FILE SCOPE
============================================================

Expected primary modifications:

src/pages/LoginPage.tsx

src/pages/RunwaySetupPage.tsx

src/App.tsx

Possibly:

src/index.css

ONLY if a genuine project-level style adjustment is required.

Possibly create a small utility only if there is a clear reuse case.

Do not create unnecessary abstractions.

Create documentation:

docs/implementation/p6-login-and-runway-setup.md

Ensure this master prompt exists at:

docs/prompts/p06-login-runway-setup.md

============================================================
12. LOCKED P5 STATE MODEL
============================================================

The shared P5 model contains source fields equivalent to:

availableFunds: string
planningDate: string
safetyBuffer: string

fixedEssentials: string
flexibleEssentials: string

purchaseName: string
purchaseAmount: string

purchaseConfirmed: boolean

Do NOT change monetary source-state fields to numbers.

Do NOT store parsed numeric duplicates in central state.

Do NOT add derived values such as:

runway
protectedTotal
shortfall

to mutable state.

P5 architecture is approved.

============================================================
13. WHY MONEY REMAINS STRING STATE
============================================================

MoneyInput uses:

value: string

onChange: (value: string) => void

Preserve this contract.

A controlled field must be able to represent:

""

"1"

"1."

"1.5"

during user interaction without immediately becoming NaN.

Do not force conversion inside MoneyInput.

Numeric conversion belongs after validation at the page/business boundary.

============================================================
14. LOGIN PAGE — PRODUCT BOUNDARY
============================================================

LoginPage is an ASM2 frontend MVP screen.

It is NOT real authentication.

Do NOT add:

Firebase Authentication
Supabase
OAuth
JWT
backend login APIs
credential storage
password hashes
session tokens
cookies
localStorage credentials

The Login screen exists to demonstrate the user journey.

============================================================
15. LOGIN FORM FIELDS
============================================================

Implement:

Email

Password

Use semantic input types:

type="email"

type="password"

Use proper:

label
id
name
autocomplete

Recommended:

email:
autoComplete="email"

password:
autoComplete="current-password"

Do not store password in:

App.tsx
RunwayState
localStorage
sessionStorage
URL/query parameters

Login form values should remain LOCAL to LoginPage.

============================================================
16. LOGIN VALIDATION
============================================================

Baseline login validation:

EMAIL

Required.

Must be syntactically email-like.

Do not attempt enterprise-grade RFC email validation.

Use a simple understandable validation rule.

PASSWORD

Required.

Do not invent complex password-strength rules.

Because this is not real account authentication, a non-empty password is
sufficient unless existing authority explicitly defines more.

Do NOT tell the user:

"Incorrect password"

because there is no backend account database.

Do NOT pretend to authenticate a real account.

============================================================
17. LOGIN ERROR UX
============================================================

Use touched/submission-aware validation.

Do NOT display errors immediately when the page first opens.

Errors should become visible when:

- field is blurred after interaction
OR
- user attempts submit

Use clear factual messages.

Examples:

"Enter your email."

"Enter a valid email address."

"Enter your password."

Avoid:

"Authentication failed."

"Account not found."

"Incorrect credentials."

Those claims would imply real authentication.

============================================================
18. LOGIN SUBMISSION
============================================================

On valid form submission:

1. prevent default browser submission
2. invoke the existing P5 session-start callback if appropriate
3. begin/reset the in-memory financial planning session as defined by current
   App architecture
4. navigate to:

/setup

Do not create fake loading delays.

Do not add setTimeout solely to simulate a server.

============================================================
19. LOGIN SESSION RESET
============================================================

Inspect the existing P5:

LoginPage.onStartSession()

or equivalent callback.

P5 report indicates it resets the empty in-memory planning session.

Preserve this intent.

Starting a new planning session may reset RunwayState to:

INITIAL_RUNWAY_STATE

Do not reset state merely because LoginPage re-rendered.

Reset only after explicit valid user submission / session start.

============================================================
20. LOGIN COPY
============================================================

Use product-appropriate copy.

Examples conceptually:

Student Money Runway

Plan what is actually available before your next commitment.

Sign in

Email

Password

Continue

If helpful, a subtle clarification may indicate this is an MVP/demo login.

Do NOT create legal/security claims unsupported by implementation.

Do not say:

"Bank-level secure"

"Your credentials are encrypted"

unless that is genuinely implemented and verified.

============================================================
21. LOGIN PAGE VISUAL DIRECTION
============================================================

ASM1 may not provide a direct dedicated Login screen.

Therefore derive visual language from:

- Landing reference
- DS-03 Forms & Core Controls
- DS-06 Feedback & Accessibility
- overall P1 design system

Do not invent a dramatically different visual system.

Use:

Inter
existing semantic colours
existing radius
existing spacing
existing focus styles

============================================================
22. LOGIN ACCESSIBILITY
============================================================

Login must support:

- semantic <form>
- one page h1
- real labels
- keyboard navigation
- visible focus
- Enter submits the form
- error text associated with fields
- password input with proper label
- no icon-only critical controls

If error IDs are used:

connect via:

aria-describedby

Use:

aria-invalid

when appropriate.

============================================================
23. RUNWAY SETUP PAGE PURPOSE
============================================================

Route:

/setup

Runway Setup collects the first shared planning inputs:

1. Available Funds
2. Planning Date
3. Safety Buffer

These values belong to shared:

RunwayState

owned by App.tsx.

============================================================
24. RUNWAY SETUP FIGMA AUTHORITY
============================================================

Use the curated Runway Setup desktop and mobile Hi-Fi references as visual
authority.

Match:

- content hierarchy
- page heading
- explanatory copy
- section layout
- control placement
- action placement
- responsive stacking
- spacing hierarchy

Do NOT redesign the screen from scratch.

Do not chase pixel perfection at the cost of maintainability.

P9 will perform final responsive/Figma parity audit.

============================================================
25. RUNWAY SETUP — AVAILABLE FUNDS
============================================================

Use:

MoneyInput

for Available Funds.

Controlled contract:

value={runwayState.availableFunds}

onChange={(value) => ...}

The page forwards a typed state patch to App.

Do NOT create local authoritative duplicate state for availableFunds.

Local touched state is allowed.

Shared field value belongs to App.

============================================================
26. RUNWAY SETUP — SAFETY BUFFER
============================================================

Use:

MoneyInput

for Safety Buffer.

Controlled contract:

value={runwayState.safetyBuffer}

onChange={(value) => ...}

Again:

no duplicate authoritative local monetary state.

============================================================
27. RUNWAY SETUP — PLANNING DATE
============================================================

Use a semantic date input:

input type="date"

unless the approved Figma/source clearly establishes another native-compatible
pattern.

Bind it to:

runwayState.planningDate

through props/callback.

Do NOT install a date-picker package.

Do NOT invent a complex calendar component.

============================================================
28. PLANNING DATE VALIDATION
============================================================

Planning Date must be:

- present
- syntactically valid as supplied by the native date control

Do NOT invent additional business restrictions such as:

- must be today
- must be future
- maximum 30 days
- minimum 7 days

unless an approved source explicitly defines them.

P6 should not create unsupported product rules.

============================================================
29. MONEY VALIDATION — PRINCIPLE
============================================================

Available Funds and Safety Buffer are raw strings in state.

Page-level validation determines whether each raw string is usable.

A valid submitted monetary value should represent:

- a finite numeric amount
- zero or greater
- normal decimal monetary input
- no negative sign

Do not silently convert an invalid value into zero.

Do not silently correct user data.

============================================================
30. MONEY VALIDATION — EMPTY
============================================================

Empty monetary inputs are invalid on submission.

Example errors:

Available Funds:

"Enter your available funds."

Safety Buffer:

"Enter a safety buffer."

Do not display:

NaN

or implementation language.

============================================================
31. MONEY VALIDATION — NEGATIVE VALUES
============================================================

Negative money is invalid.

Examples:

-1

-100

Do not silently clamp user-entered negatives to zero.

Instead show a factual validation message.

Example:

"Enter an amount of 0 or more."

============================================================
32. MONEY VALIDATION — DECIMAL VALUES
============================================================

Allow reasonable currency decimals.

Do not require integer-only money.

Accept examples such as:

950
950.5
950.50
0
0.00

Do not prematurely format the controlled string while typing.

Avoid cursor-jumping formatting logic.

Do not automatically insert commas while editing.

============================================================
33. MONEY VALIDATION — FINITE VALUE
============================================================

Submitted values must convert to finite numeric values.

Reject invalid input that would result in:

NaN
Infinity

Do not pass such values to financial calculation functions.

============================================================
34. VALIDATION OWNERSHIP
============================================================

P6 form validation belongs at page level.

MoneyInput remains reusable.

Do not teach MoneyInput:

what "Available Funds" means.

MoneyInput may display:

helperText
error
required

but the PAGE determines the actual error string.

This preserves reuse.

============================================================
35. TOUCHED STATE
============================================================

Use simple local touched state for:

LoginPage

and:

RunwaySetupPage

as appropriate.

Example concept:

const [touched, setTouched] = useState(...)

Do not add touched state to central RunwayState.

Touched UI state is page-specific.

Do not add:

availableFundsTouched

to App.tsx.

============================================================
36. SUBMISSION VALIDATION
============================================================

On Setup form submit:

validate all required fields.

If invalid:

- remain on /setup
- display relevant errors
- focus or expose errors appropriately
- do NOT navigate to /essentials

If valid:

navigate to:

/essentials

Do not calculate final runway yet.

============================================================
37. VALIDATION VS P10
============================================================

P6 implements baseline functional validation required for these two screens.

P10 later performs final:

- validation consistency audit
- accessibility audit
- ethics audit
- edge-case hardening

Do not intentionally leave obvious P6 validation broken because P10 exists.

But do not over-expand P6 into the complete P10 quality pass.

============================================================
38. PROPS-DOWN CONTRACT
============================================================

RunwaySetupPage should receive shared financial state via props.

Use a clear contract.

Conceptually:

interface RunwaySetupPageProps {
  runwayState: RunwayState
  onRunwayStateChange: (patch: RunwayStatePatch) => void
}

Refine naming only if current P5 code already established equivalent names.

Do not duplicate competing APIs.

============================================================
39. CALLBACK-UP CONTRACT
============================================================

When Available Funds changes:

MoneyInput
    ↓ onChange(rawValue)

RunwaySetupPage
    ↓ onRunwayStateChange({
         availableFunds: rawValue
       })

App.tsx
    ↓ merges typed patch

RunwayState updated

Same pattern:

Safety Buffer

Planning Date

This should be easy to explain in the BUS4012 video.

============================================================
40. ASSESSMENT CODE EXAMPLE
============================================================

P6 should make this exact real example demonstrable:

Parent page:

RunwaySetupPage

Reusable child:

MoneyInput

Props down:

id
label
value
helperText
error
required

Callback up:

onChange

Then page callback:

onRunwayStateChange(...)

Then App.tsx:

handleRunwayStateChange(patch)

Document this as the primary code-understanding example.

============================================================
41. FORMSECTION USAGE
============================================================

Use:

FormSection

when it naturally matches the approved Setup page structure.

Do not duplicate FormSection markup manually.

Do not force five FormSections if Figma visually uses fewer sections.

Use the component intentionally.

============================================================
42. MONEYINPUT REUSE
============================================================

Runway Setup must visibly use the existing:

MoneyInput

for at least:

Available Funds

Safety Buffer

Do NOT create:

AvailableFundsInput.tsx

SafetyBufferInput.tsx

Those would defeat the reusable component architecture.

============================================================
43. SUMMARYROW
============================================================

Do not force SummaryRow into P6 if the approved Runway Setup screen does not
need it.

SummaryRow will naturally appear later in P7/P8.

Assessment reuse should reflect real product use, not artificial placement.

============================================================
44. STATUSACTIONBUTTON
============================================================

Do NOT use the P3:

StatusActionButton

for ordinary Login or Setup navigation merely to display the 21st.dev component
everywhere.

Its intended semantic use remains:

future explicit purchase confirmation.

P8 owns that integration.

============================================================
45. RUNWAY SETUP ACTIONS
============================================================

Implement clear navigation actions consistent with Figma.

Likely actions include:

Back

Continue

Back:

navigate to /login

or the approved preceding journey location.

Continue:

validates the form.

Only valid form:

navigate to /essentials

Do not use:

window.location.href

Use:

useNavigate()

============================================================
46. ROUTER CONTRACT
============================================================

Preserve P4 routes:

/

/login
/setup
/essentials
/runway
/purchase
/result

P6 must not redesign routing.

Do not introduce:

/signin
/onboarding
/setup-money

or duplicate alternative routes.

============================================================
47. DIRECT ROUTE ACCESS
============================================================

P6 does not need a sophisticated route guard.

Do NOT implement authentication guards merely because `/setup` is directly
reachable.

The assignment requires a login journey, not a production authentication
security model.

Avoid unnecessary:

ProtectedRoute
AuthProvider
session token infrastructure

unless approved source specifically demands it.

============================================================
48. SHARED SESSION STATE
============================================================

RunwayState remains mounted at App level.

Verify this practical behaviour:

1. Start at Login
2. Submit valid Login
3. Enter Setup values
4. Navigate to Essentials
5. Navigate back to Setup
6. Previously entered Setup values remain

This is an important P6 test.

Do NOT use localStorage to achieve it.

App-level React state should provide this behaviour.

============================================================
49. LOGIN FORM STATE
============================================================

Login values do NOT belong in RunwayState.

Use local LoginPage state for:

email
password

Reason:

They are temporary form values and are unrelated to financial planning state.

Do not add:

email
password

to:

RunwayState

============================================================
50. PASSWORD HANDLING
============================================================

Never log password values.

Do not:

console.log(password)

Do not include password in:

URLs
documentation examples
debug panels
state dumps
localStorage

No browser-visible debug data after P6 completes.

============================================================
51. NO REAL USER ACCOUNT
============================================================

Do not create a fake fixed credential such as:

student@example.com / password123

unless approved source explicitly requires demo credentials.

Preferred frontend behaviour:

any syntactically valid email
+
non-empty password

can begin the demo session.

This avoids falsely representing a real account database.

============================================================
52. BUSINESS CALCULATIONS
============================================================

P5 utilities already exist.

P6 should NOT yet render the final financial calculation result.

Do NOT implement full:

calculateProtectedTotal

calculateRunway

calculateProtectedShortfall

purchase calculations

inside Runway Setup.

Those become visible later in P7/P8.

Do not duplicate formulas in P6 JSX.

============================================================
53. AVAILABLE FUNDS EXPLANATORY COPY
============================================================

Copy should reflect the product definition:

Available Funds means money currently available for the planning period.

Future expected income is NOT counted until actually received.

Do not add future income as a P6 field.

Do not add:

salary
scholarship payment
future pay date

unless already received.

============================================================
54. SAFETY BUFFER EXPLANATORY COPY
============================================================

Safety Buffer is an amount intentionally protected from discretionary spending.

Use factual language.

Do not say:

"This is the amount you must save."

Do not make financial-advice claims.

============================================================
55. ETHICAL LANGUAGE
============================================================

P6 copy must not judge spending behaviour.

Avoid:

good
bad
safe
unsafe
smart
irresponsible
you should
you shouldn't

when referring to financial decisions.

Use factual language such as:

Available Funds

Safety Buffer

Planning Date

Continue

============================================================
56. RESPONSIVE REQUIREMENT
============================================================

P6 is not the final P9 responsive audit.

However both screens must work correctly at:

390px mobile

and:

1280px desktop

Also avoid obvious issues around:

768px
1024px

Use one responsive component tree.

Do NOT create:

LoginPageMobile.tsx
LoginPageDesktop.tsx

or:

RunwaySetupMobile.tsx
RunwaySetupDesktop.tsx

============================================================
57. MOBILE FORM UX
============================================================

On narrow screens:

- fields should stack naturally
- labels remain readable
- buttons remain easy to tap
- no horizontal overflow
- minimum interactive targets preserved
- error text wraps safely
- keyboard/input layout remains usable

Do not shrink text excessively to fit.

============================================================
58. DESKTOP FORM UX
============================================================

At desktop width:

- respect approved content max width
- do not stretch forms across the entire screen
- preserve visual hierarchy
- preserve whitespace
- align with Runway Setup Figma reference

============================================================
59. NATIVE INPUT STYLING
============================================================

Use project semantic styles.

For normal text/password/date fields:

match the visual language already defined for P1 controls.

Do not introduce random border colours or radius values.

Use:

focus-visible

or equivalent existing focus treatment.

============================================================
60. ERROR STYLING
============================================================

Use semantic danger/error token from the design system.

Do not use colour as the only error indicator.

Provide textual error message.

Use:

aria-invalid

and:

aria-describedby

where appropriate.

============================================================
61. FORM SUBMIT BUTTONS
============================================================

Use semantic:

<button type="submit">

Do not attach form submission only to:

onClick

when semantic form submission is appropriate.

Back controls should normally be:

type="button"

if placed inside a form.

Prevent accidental submission.

============================================================
62. ENTER KEY
============================================================

Verify:

Login form can submit with Enter.

Runway Setup form can submit with Enter where browser behaviour is appropriate.

Do not break native form semantics.

============================================================
63. FIELD HELPER TEXT
============================================================

Use concise helper text only when it improves comprehension.

Avoid paragraphs under every field.

Potential Available Funds clarification:

"Money currently available for this planning period."

Potential Safety Buffer clarification:

"Amount you want to keep protected from discretionary spending."

Keep copy aligned with existing Figma where available.

============================================================
64. PLANNING DATE LABEL
============================================================

Use a clear label such as:

Planning date

or the exact Figma label.

Do not rename product concepts unnecessarily.

============================================================
65. ERROR PRIORITY
============================================================

For a field:

if required value is empty:

show the required error.

Do not additionally show:

invalid number

at the same time.

Return one useful field error at a time.

============================================================
66. VALIDATION IMPLEMENTATION STYLE
============================================================

Keep validation readable.

Acceptable:

small page-local validation functions

or:

a small shared helper only if genuine reuse justifies it.

Avoid:

large schema systems
generic validation engines
complex regex collections

The student must be able to explain the code.

============================================================
67. MONEY VALIDATION HELPER
============================================================

If implementing a helper, give it one clear responsibility.

Conceptually:

validateMoneyInput(rawValue)

may return:

string | undefined

But do not make it know field-specific wording unless intentionally designed.

Another valid approach is simple local functions.

Choose the smallest maintainable solution.

============================================================
68. DATE STATE
============================================================

planningDate remains a raw string from:

<input type="date">

Do not convert central state to a Date object.

Reasons:

- native controlled input expects YYYY-MM-DD string
- avoids timezone ambiguity
- easier to serialize/display later

Do not introduce timezone conversions for planningDate.

The Australia/Melbourne requirement applies to source-file metadata timestamps,
not to user planning-date conversion.

============================================================
69. AUSTRALIAN SOURCE TIMESTAMP STANDARD
============================================================

All new/modified source files must follow:

docs/prompts/00-master-project-context.md

Canonical timezone:

Australia/Melbourne

Windows/.NET mapping:

AUS Eastern Standard Time

Never use Vietnam local time directly.

Never guess timestamp offsets.

For NEW files:

use actual filesystem CreationTime / LastWriteTime converted to Melbourne.

For EXISTING materially modified files:

preserve original @createdAt.

Update @updatedAt according to the binding master convention.

Do NOT overwrite file history with the time header was inserted.

============================================================
70. SOURCE HEADER EXAMPLE
============================================================

RunwaySetupPage should have a truthful header equivalent to:

/**
 * @file src/pages/RunwaySetupPage.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P6 — Login + Runway Setup
 * @createdAt <preserved original Melbourne creation timestamp>
 * @updatedAt <actual material P6 update timestamp>
 * @summary Implements the controlled Runway Setup form.
 * @responsibility Collects and validates initial planning inputs and reports typed state changes to the application root.
 */

Do not blindly copy this wording if current code responsibility differs.

============================================================
71. APP.TSX HEADER
============================================================

App.tsx is already an existing file.

If materially changed in P6:

preserve:

@createdAt

Update:

@updatedAt

according to master convention.

Its responsibility remains application-level route/state ownership.

Do not falsely label App.tsx as:

Login Page

or:

Runway Setup Form

============================================================
72. INLINE COMMENT STANDARD
============================================================

Only comment non-obvious WHY.

Good:

// Login credentials remain page-local because the MVP does not authenticate
// against an account service and financial session state must not store them.

Good:

// Keep raw monetary text in shared state so MoneyInput can represent empty and
// partially entered values without creating NaN during editing.

Bad:

// Set email.

// Update money.

// Navigate next.

Do not comment obvious JSX.

============================================================
73. P6 DOCUMENTATION
============================================================

Create:

docs/implementation/p6-login-and-runway-setup.md

Use:

# P6 — Login and Runway Setup

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P6 — Login + Runway Setup
> Created: <actual Australia/Melbourne filesystem timestamp>
> Updated: <actual Australia/Melbourne filesystem timestamp>

Document:

1. P6 scope
2. Login architecture
3. Why login values are local state
4. Why login is frontend-only
5. Login validation rules
6. Login navigation
7. Runway Setup fields
8. Controlled-input architecture
9. Props-down path
10. Callback-up path
11. Money validation rules
12. Planning-date validation
13. Touched/submission validation approach
14. Shared-state preservation across routes
15. Figma references used
16. Responsive behaviour
17. Accessibility decisions
18. Ethical-language decisions
19. Browser verification
20. Scope deferred to P7

============================================================
74. REQUIRED DATA FLOW DOCUMENTATION
============================================================

Include a diagram equivalent to:

App.tsx
│
│ owns RunwayState
│
│ runwayState
│ onRunwayStateChange
│
▼
RunwaySetupPage
│
│ value
│ onChange
│
▼
MoneyInput

User types "950"
      │
      ▼
MoneyInput.onChange("950")
      │
      ▼
RunwaySetupPage
      │
      ▼
onRunwayStateChange({
  availableFunds: "950"
})
      │
      ▼
App.tsx
      │
      ▼
RunwayState updated

Explain:

Props down.

Callbacks up.

No business logic inside MoneyInput.

============================================================
75. REQUIRED ASSESSMENT VIDEO NOTE
============================================================

In P6 documentation identify:

RunwaySetupPage → MoneyInput

as the strongest current candidate for demonstrating:

- parent component
- child component
- props
- controlled input
- callback
- shared state update

Describe it in clear non-academic jargon that the student can explain in the
10-minute assessment video.

============================================================
76. LOGIN TEST MATRIX
============================================================

Browser-test at least:

CASE L1

Email:
empty

Password:
empty

Expected:

stay on /login

show required errors after submit.

------------------------------------------------------------

CASE L2

Email:
not-an-email

Password:
abc

Expected:

stay on /login

show email-format error.

------------------------------------------------------------

CASE L3

Email:
student@example.com

Password:
non-empty

Expected:

frontend validation succeeds

session-start callback invoked

navigate to /setup

Do NOT interpret this as real account authentication.

------------------------------------------------------------

CASE L4

Keyboard navigation

Expected:

email
→ password
→ submit

all keyboard accessible.

============================================================
77. RUNWAY SETUP TEST MATRIX
============================================================

CASE S1 — EMPTY

availableFunds:
""

planningDate:
""

safetyBuffer:
""

Expected:

remain /setup

required validation visible after submit.

------------------------------------------------------------

CASE S2 — NEGATIVE AVAILABLE FUNDS

availableFunds:
"-1"

valid planningDate

safetyBuffer:
"100"

Expected:

remain /setup

non-negative amount error.

------------------------------------------------------------

CASE S3 — NEGATIVE SAFETY BUFFER

availableFunds:
"950"

valid planningDate

safetyBuffer:
"-100"

Expected:

remain /setup

non-negative amount error.

------------------------------------------------------------

CASE S4 — VALID WHOLE NUMBERS

availableFunds:
"950"

planningDate:
valid native date

safetyBuffer:
"100"

Expected:

shared state updated

navigate to /essentials.

------------------------------------------------------------

CASE S5 — VALID DECIMALS

availableFunds:
"950.50"

planningDate:
valid native date

safetyBuffer:
"100.25"

Expected:

valid

values remain raw strings in RunwayState

navigate to /essentials.

------------------------------------------------------------

CASE S6 — ZERO BUFFER

availableFunds:
"950"

planningDate:
valid native date

safetyBuffer:
"0"

Expected:

valid.

Zero is not negative.

------------------------------------------------------------

CASE S7 — RETURN NAVIGATION

Enter valid Setup values.

Navigate:

/setup
→ /essentials
→ back to /setup

Expected:

availableFunds remains populated

planningDate remains populated

safetyBuffer remains populated

No localStorage required.

============================================================
78. NO CANONICAL DATA PREFILL
============================================================

Do not prefill Setup with:

950
100

merely because those are canonical business-test values.

Initial form remains empty.

The user explicitly enters values.

Canonical numbers remain business verification cases, not fake user defaults.

============================================================
79. NO PROTECT ESSENTIALS IMPLEMENTATION
============================================================

When valid Setup submits:

navigate to:

/essentials

Do NOT proceed to implement the final Essentials form.

ProtectEssentialsPage may remain the approved P4 skeleton.

Do not add:

Fixed Essentials MoneyInput

Flexible Essentials MoneyInput

during P6.

Those belong to P7.

============================================================
80. NO RUNWAY RESULT IMPLEMENTATION
============================================================

Do NOT connect final calculations to:

RunwayResultPage

during P6.

No final display of:

AUD 215

protected total

shortfall

yet.

P7 owns this.

============================================================
81. NO PURCHASE FLOW
============================================================

Do not modify:

PurchaseCheckPage

ResultPage

StatusActionButton

unless a blocking compile issue directly caused by P6 exists.

P8 owns purchase functionality.

============================================================
82. NO P7/P8 FEATURES
============================================================

Do not implement:

fixedEssentials form

flexibleEssentials form

runway breakdown

protected shortfall state UI

purchase name

purchase amount

purchase preview

Mark as spent

confirmation mutation

============================================================
83. DESIGN SYSTEM PRESERVATION
============================================================

Do not alter P1 design tokens unnecessarily.

Do not hardcode arbitrary values when semantic classes already exist.

Use:

existing primary
surface
background
border
danger
focus
radius
spacing

systems.

============================================================
84. P2 COMPONENT PRESERVATION
============================================================

Do not modify:

FormSection
MoneyInput
SummaryRow

unless a real defect prevents P6 implementation.

If such a defect exists:

STOP and explain it before materially changing their public API.

P6 should consume the approved P2 API.

============================================================
85. P3 COMPONENT PRESERVATION
============================================================

Do not change:

StatusActionButton

P6 has no reason to alter its API.

============================================================
86. APP SHELL
============================================================

Preserve the P4 AppShell navigation model unless Figma-based P6 implementation
reveals a genuine structural bug.

Do not redesign global navigation as part of form implementation.

============================================================
87. LOGIN APP SHELL DECISION
============================================================

Login may intentionally use a focused standalone layout rather than the normal
authenticated/planning AppShell if current P4/Figma architecture supports that.

Do not force bottom navigation onto Login.

Use the existing structural decision from P4 where possible.

============================================================
88. SETUP APP SHELL DECISION
============================================================

P4 documentation indicates Setup and Essentials use focused wizard navigation.

Preserve that decision.

Do not suddenly add full desktop navigation or mobile bottom navigation if the
approved Figma uses a focused setup journey.

============================================================
89. PERFORMANCE
============================================================

Do not add unnecessary:

useMemo
useCallback
memo

for tiny form handlers.

Use normal React handlers unless actual performance need exists.

Readability is more important.

============================================================
90. TYPESCRIPT QUALITY
============================================================

No:

any

unless absolutely unavoidable and justified.

Prefer explicit page props interfaces.

Keep handler types clear.

Do not duplicate RunwayState type definitions inside pages.

Import from:

src/types/runway.ts

============================================================
91. ERROR OBJECT TYPES
============================================================

If using local error objects:

type them clearly.

Example concept:

interface LoginErrors {
  email?: string
  password?: string
}

interface RunwaySetupErrors {
  availableFunds?: string
  planningDate?: string
  safetyBuffer?: string
}

Do not place these UI-only types into the central domain type file unless they
are genuinely shared.

============================================================
92. VALIDATION ORDER
============================================================

For Setup money fields:

1. required
2. numeric format
3. finite numeric conversion
4. non-negative rule

Do not calculate business results if validation fails.

============================================================
93. NO SILENT TRIMMING OF MONEY INTO STATE
============================================================

Do not mutate shared monetary values into reformatted representations during
typing.

Validation may inspect:

rawValue.trim()

but avoid surprising the user by rewriting:

"950.50"

into:

"950.5"

on every keystroke.

============================================================
94. LOGIN EMAIL NORMALISATION
============================================================

It is acceptable to trim surrounding whitespace for validation/submission.

Do not silently modify passwords.

Because no backend account exists, no account-normalisation architecture is
needed.

============================================================
95. PASSWORD VISIBILITY TOGGLE
============================================================

Do NOT add a password visibility component unless:

- Figma supports it
- implementation remains small
- accessibility is correct

It is not required for P6.

Avoid feature creep.

============================================================
96. LOADING STATES
============================================================

Login is frontend-only and synchronous.

Do not fake a spinner.

Setup navigation is synchronous.

Do not fake loading.

StatusActionButton belongs to P8 purchase confirmation, not P6.

============================================================
97. SUCCESS STATES
============================================================

Successful Login:

navigate to /setup.

Successful Setup:

navigate to /essentials.

Do not insert unnecessary toast notifications.

Navigation itself is sufficient.

============================================================
98. BROWSER VALIDATION
============================================================

After implementation run:

npm run dev

Use the actual local dev URL reported by Vite.

Verify:

/login

/setup

/essentials

Also verify root redirect still works.

Check:

desktop around 1280px

mobile around 390px

============================================================
99. CONSOLE CHECK
============================================================

Browser console must contain no new:

React errors

uncaught exceptions

controlled/uncontrolled input warnings

duplicate-key warnings

route errors

P4 previously had React Router future-flag warnings.

Do not claim they are P6 runtime errors if they are existing non-blocking
library warnings.

But do not introduce new warnings.

============================================================
100. CONTROLLED INPUT WARNING CHECK
============================================================

Specifically verify no warnings like:

"A component is changing an uncontrolled input to be controlled"

All controlled values must always receive strings.

Use:

value={...}

with initialized string state.

============================================================
101. LINT VALIDATION
============================================================

Run:

npm run lint

Expected:

PASS

Do not disable lint rules.

Do not add eslint-disable merely to hide avoidable issues.

============================================================
102. BUILD VALIDATION
============================================================

Run:

npm run build

Expected:

PASS

No TypeScript errors.

No missing imports.

============================================================
103. PACKAGE AUDIT
============================================================

Inspect:

package.json
package-lock.json

Expected P6 package additions:

NONE

If packages changed unexpectedly:

investigate.

Do not leave accidental dependency changes.

============================================================
104. GIT DIFF REVIEW
============================================================

After implementation run:

git status

git diff

If a baseline commit exists, ensure P6 changes are limited to appropriate files.

Expected changes approximately:

LoginPage.tsx

RunwaySetupPage.tsx

App.tsx if callback wiring requires it

P6 implementation documentation

P6 prompt preservation

possibly minor style/layout changes only if justified

No P7/P8 implementation.

============================================================
105. P6 FUNCTIONAL ACCEPTANCE — LOGIN
============================================================

Login passes only if:

[ ] real <form> exists

[ ] email field exists

[ ] password field exists

[ ] labels exist

[ ] email local state exists

[ ] password local state exists

[ ] credentials are NOT stored in RunwayState

[ ] required validation works

[ ] invalid email validation works

[ ] valid frontend submission navigates to /setup

[ ] password is never persisted

[ ] no fake backend/authentication exists

[ ] keyboard submission works

[ ] focus styles are visible

============================================================
106. P6 FUNCTIONAL ACCEPTANCE — SETUP
============================================================

Setup passes only if:

[ ] Available Funds uses MoneyInput

[ ] Safety Buffer uses MoneyInput

[ ] Planning Date is controlled

[ ] values come from App-owned RunwayState

[ ] updates travel through typed callbacks

[ ] touched/submission validation works

[ ] empty values are rejected

[ ] negative money is rejected

[ ] valid decimals are accepted

[ ] zero buffer is accepted

[ ] invalid form stays on /setup

[ ] valid form navigates to /essentials

[ ] values survive back navigation during active React session

[ ] no localStorage used

============================================================
107. ARCHITECTURE ACCEPTANCE
============================================================

[ ] App remains shared financial state owner

[ ] raw money remains string state

[ ] MoneyInput API unchanged

[ ] no duplicated financial state

[ ] no derived financial state stored

[ ] no calculation formula duplicated into page JSX

[ ] Login credentials remain page-local

[ ] props-down path exists

[ ] callbacks-up path exists

[ ] no state library added

============================================================
108. VISUAL ACCEPTANCE
============================================================

[ ] Login follows existing visual system

[ ] Setup follows curated Hi-Fi reference

[ ] desktop layout usable

[ ] 390px mobile layout usable

[ ] no horizontal overflow

[ ] error states visually clear

[ ] interactive controls maintain suitable target sizes

[ ] no arbitrary design-system divergence

============================================================
109. ACCESSIBILITY ACCEPTANCE
============================================================

[ ] semantic forms

[ ] one clear h1 per page

[ ] field labels

[ ] aria-invalid where applicable

[ ] error association where applicable

[ ] visible keyboard focus

[ ] Enter submission

[ ] error meaning not colour-only

[ ] touch targets reasonable

============================================================
110. SOURCE TRACEABILITY ACCEPTANCE
============================================================

[ ] Student name:
    Thien Khuong Vu

[ ] Phase:
    P6 — Login + Runway Setup

[ ] existing createdAt values preserved

[ ] material updatedAt values follow master convention

[ ] Australia/Melbourne timezone used

[ ] Vietnam time not used directly

[ ] responsibilities/summary updated truthfully

============================================================
111. REQUIRED FINAL REPORT
============================================================

Return a structured report containing:

A. References inspected

List master/implementation/Figma files used.

------------------------------------------------------------

B. Login implementation

Report:

- state location
- fields
- validation rules
- submission behaviour
- navigation
- authentication boundary

------------------------------------------------------------

C. Runway Setup implementation

Report:

- Available Funds
- Planning Date
- Safety Buffer
- component usage
- validation
- navigation

------------------------------------------------------------

D. Props-down flow

Show exact real path.

------------------------------------------------------------

E. Callback-up flow

Show exact real path.

------------------------------------------------------------

F. State ownership

Confirm:

App.tsx owns RunwayState.

Login credentials are local only.

------------------------------------------------------------

G. Validation test results

Table:

Case
Expected
Actual
PASS/FAIL

Include:

L1
L2
L3
L4

S1
S2
S3
S4
S5
S6
S7

------------------------------------------------------------

H. Responsive verification

Mobile ~390px:

PASS / FAIL

Desktop ~1280px:

PASS / FAIL

------------------------------------------------------------

I. Accessibility verification

- keyboard
- labels
- focus
- field errors
- semantic form

------------------------------------------------------------

J. Files created

------------------------------------------------------------

K. Files modified

------------------------------------------------------------

L. Source-header traceability

Table:

File
Phase
Created
Updated
Timezone

------------------------------------------------------------

M. Package changes

Expected:

NONE

------------------------------------------------------------

N. npm run lint

PASS / FAIL

------------------------------------------------------------

O. npm run build

PASS / FAIL

------------------------------------------------------------

P. Runtime/browser verification

Report actual Vite URL.

Report console status.

------------------------------------------------------------

Q. Git/change assessment

Confirm whether modifications remained within P6 scope.

------------------------------------------------------------

R. Deferred P7 work

Explicitly list:

- Protect Essentials final form
- Fixed Essentials
- Flexible Essentials
- protected-total UI
- Runway Result
- shortfall state
- actual derived financial display

============================================================
112. HARD STOP
============================================================

Do NOT continue to P7.

Do NOT implement Protect Essentials final functionality.

Do NOT implement Runway Result final functionality.

Do NOT implement Purchase Check.

Do NOT implement Result/Confirmation.

Do NOT implement Mark as spent.

Do NOT add database/authentication.

Do NOT add new packages.

If P6 is blocked, finish exactly:

P6 LOGIN AND RUNWAY SETUP BLOCKED

If all P6 acceptance criteria pass, finish exactly:

P6 LOGIN AND RUNWAY SETUP READY