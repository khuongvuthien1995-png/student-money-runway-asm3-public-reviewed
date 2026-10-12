# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# P10 — VALIDATION + ACCESSIBILITY + ETHICS + SOURCE HYGIENE
# UNIVERSAL MASTER HARDENING PROMPT
#
# Student: Thien Khuong Vu
# Recommended model: GPT-5.6 Terra — HIGH
#
# EXECUTION MODE:
# INSPECT → SOURCE HYGIENE AUDIT → VALIDATION AUDIT →
# ACCESSIBILITY AUDIT → ETHICS AUDIT → FIX →
# REGRESSION VERIFY → DOCUMENT → STOP
#
# ============================================================
# CRITICAL P10 BOUNDARY
# ============================================================
#
# P10 is a CROSS-CUTTING QUALITY HARDENING phase.
#
# The functional product is already complete through P9.
#
# P10 must NOT redesign architecture.
# P10 must NOT add product features.
# P10 must NOT change the locked business formulas.
# P10 must NOT change route structure.
# P10 must NOT introduce persistence/backend/authentication.
#
# P10 additionally performs a COMPLETE source-header/comment hygiene audit
# across the human-authored files under src/.
#
# This is necessary because encoding corruption has been observed in existing
# source headers, for example:
#
# WRONG:
#
# Student Money Runway â€” BUS4012 Assignment 02
#
# P8 â€” Purchase Check + Result + Explicit Confirmation
#
# CORRECT:
#
# Student Money Runway — BUS4012 Assignment 02
#
# P8 — Purchase Check + Result + Explicit Confirmation
#
# Treat this as mojibake / encoding corruption, not intentional text.
#
# Do NOT continue automatically to P11.

============================================================
0. ROLE
============================================================

Act simultaneously as:

- Senior React Developer
- Frontend Software Architect
- TypeScript Reviewer
- Validation Reviewer
- Accessibility Reviewer
- Ethical UX Reviewer
- Privacy/Security Reviewer
- Source Quality Reviewer
- Technical Documentation Reviewer
- Regression Reviewer
- BUS4012 Vibe Coding implementation assistant

Your responsibility is to harden the completed Student Money Runway MVP
without changing its intended behaviour.

P10 must make the codebase:

- internally consistent
- accessible
- validation-safe
- ethically worded
- semantically correct
- free from obvious source-comment/header corruption
- ready for final P11 assessment QA

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

P10 — Validation + Accessibility + Ethics + Source Hygiene

============================================================
2. COMPLETED BASELINE
============================================================

These phases are COMPLETE and their behaviour is binding:

P0
Environment

P0.5
Figma Reference Curation

P1
Design System

P2
Reusable UI Kit

P3
21st.dev Integration

P4
Router + Page Skeletons

P5
State Model + Business Logic

P6
Login + Runway Setup

P7
Protect Essentials + Runway Result

P8
Purchase Check + Explicit Confirmation

P9
Responsive + Figma Matching

Final gates already passed:

P7 FINAL GATE PASS

P8 FINAL GATE PASS

P9 RESPONSIVE AND FIGMA QA READY

Do not reopen architectural decisions without a proven defect.

============================================================
3. READ BINDING CONTEXT FIRST
============================================================

Before modifying anything read:

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
docs/implementation/p9-responsive-figma-qa.md

Read:

docs/figma-reference/README.md

Inspect this P10 prompt if already preserved:

docs/prompts/p10-validation-accessibility-ethics-source-hygiene.md

============================================================
4. INSPECT CURRENT SOURCE
============================================================

Inspect ALL human-authored source under:

src/

including at minimum:

src/App.tsx
src/main.tsx
src/index.css

src/components/layout/

src/components/ui/

src/pages/

src/types/

src/utils/

Do not inspect only the currently open files.

P10 requires a complete source sweep.

============================================================
5. GIT SAFETY
============================================================

Before modifications run:

git status

If a baseline commit exists:

git diff

Do not overwrite unrelated work.

Do NOT automatically commit.

============================================================
6. P10 SOURCE HYGIENE — FULL SRC AUDIT
============================================================

Before functional P10 changes, inventory every human-authored source file under:

src/

For each file inspect:

1. source header
2. encoding quality
3. spelling
4. grammar
5. comment usefulness
6. phase metadata
7. student metadata
8. timestamp metadata
9. summary
10. responsibility
11. inline comments

Do not assume previous phases produced perfect metadata.

============================================================
7. MOJIBAKE / ENCODING AUDIT
============================================================

Search the entire:

src/

tree for suspicious encoding artifacts including patterns such as:

â€”
â€“
â€™
â€œ
â€
Ã
�
Â

and other obviously corrupted Unicode sequences.

Also visually inspect headers because a simple search may not catch every
corruption variant.

Common expected corrections include:

â€”
→
—

â€“
→
–

â€™
→
’

â€œ
→
“

corrupted closing quote
→
”

Only make a replacement when the intended text is unambiguous.

Do not blindly replace valid non-ASCII content.

============================================================
8. SOURCE ENCODING STANDARD
============================================================

Human-authored source must remain UTF-8.

Do NOT intentionally convert files to:

ANSI
Windows-1252

Do not introduce a mixed-encoding repository.

The corrected Unicode em dash:

—

is valid UTF-8.

Do not replace all punctuation with ASCII solely to avoid fixing the actual
encoding problem.

============================================================
9. SOURCE HEADER AUDIT
============================================================

For human-authored source files supporting comments, verify the applicable
project header fields:

@file

@project

@student

@phase

@createdAt

@updatedAt

@summary

@responsibility

and where applicable:

@source

especially for the 21st.dev component.

Required project text:

Student Money Runway — BUS4012 Assignment 02

Required student:

Thien Khuong Vu

Do not leave mojibake in these fields.

============================================================
10. SOURCE HEADER FILE PATH
============================================================

@file must use repository-relative paths.

GOOD:

src/pages/ResultPage.tsx

BAD:

C:\Dev\BUS4012\student-money-runway-mvp\src\pages\ResultPage.tsx

Correct inaccurate paths if discovered.

============================================================
11. PHASE METADATA RULE
============================================================

Follow the binding convention in:

docs/prompts/00-master-project-context.md

Do NOT rewrite every file to P10 merely because it was audited.

If a file receives only:

- spelling correction
- encoding correction
- header correction
- comment correction

preserve its existing implementation phase.

If the file receives a MATERIAL P10 functional/semantic/accessibility change,
apply the master convention for phase metadata.

Do not fabricate history.

============================================================
12. CREATEDAT RULE
============================================================

NEVER overwrite an existing legitimate:

@createdAt

during P10.

Encoding/comment cleanup is not a reason to change creation history.

Preserve the original createdAt.

============================================================
13. UPDATEDAT RULE — COMMENT-ONLY
============================================================

The project master convention states that:

formatting-only
spelling-only
comment-only
metadata-only
encoding-only header cleanup

must NOT falsely become a new substantive updatedAt.

Therefore:

if a file is changed ONLY to fix:

â€”
typos
grammar
comments
header metadata formatting

preserve its existing substantive:

@updatedAt

Do NOT stamp the current time.

============================================================
14. UPDATEDAT RULE — MATERIAL P10 CHANGE
============================================================

If a source file receives a genuine material P10 implementation change such as:

accessibility semantics
validation behaviour
error association
keyboard behaviour
privacy correction

then update:

@updatedAt

according to the master Australian timestamp convention.

Preserve:

@createdAt

============================================================
15. AUSTRALIAN TIMEZONE STANDARD
============================================================

Canonical timezone:

Australia/Melbourne

Windows/.NET equivalent:

AUS Eastern Standard Time

Never use Vietnam time directly.

Never guess the UTC offset.

Automatically respect:

AEST
or
AEDT

according to the actual timestamp date.

============================================================
16. COMMENT SPELLING / GRAMMAR AUDIT
============================================================

Review all human-authored comments under:

src/

Correct clear:

- spelling errors
- grammar errors
- broken sentences
- mojibake
- misleading wording
- outdated phase wording
- copied text that no longer describes current behaviour

Do not rewrite technically correct comments merely for stylistic preference.

============================================================
17. COMMENT QUALITY STANDARD
============================================================

Inline comments should explain:

WHY

constraints

non-obvious architecture

important invariants

Examples of useful comments:

// Preview calculations remain derived; only explicit confirmation may mutate
// available funds.

// Keep raw monetary input as text so an empty controlled input does not become
// NaN while the user is editing.

Avoid comments such as:

// Set value.

// Navigate.

// Render button.

// Update state.

// Calculate result.

Remove obviously redundant comments when safe.

============================================================
18. COMMENT AUTHOR/TIMESTAMP REPETITION
============================================================

Inline comments must NOT repeatedly include:

student name
date
time
phase

That belongs in the source-file header.

Remove such redundant inline metadata if found.

============================================================
19. DO NOT DAMAGE SOURCE ATTRIBUTION
============================================================

For:

src/components/ui/StatusActionButton.tsx

preserve its:

@source 21st.dev ...

or equivalent provenance.

Do not remove third-party origin information while cleaning headers.

============================================================
20. SOURCE HYGIENE REPORT
============================================================

Maintain an internal inventory during P10 containing:

File

Header status

Encoding issue found?

Spelling/comment issue found?

Material P10 change?

createdAt preserved?

updatedAt action

Do not create a separate source file unless documentation needs the summary.

============================================================
21. NO LOGIC CHANGES DURING COMMENT CLEANUP
============================================================

Source hygiene edits must not alter:

imports
state
callbacks
formula logic
routes
validation behaviour

unless that same file independently requires a real P10 functional correction.

Do not combine unrelated refactoring with comment cleanup.

============================================================
22. P10 FUNCTIONAL SCOPE
============================================================

After source hygiene, perform the following audits:

1. validation consistency
2. accessibility
3. keyboard usability
4. semantic HTML
5. ARIA correctness
6. focus visibility
7. error communication
8. touch target sanity
9. reduced motion
10. ethical language
11. privacy/security claims
12. business regression

============================================================
23. LOCKED BUSINESS INVARIANTS
============================================================

P10 must preserve:

R = MAX(0, A - F - V - B)

Protected Total:

F + V + B

Protected Shortfall:

MAX(0, F + V + B - A)

Purchase Remaining:

MAX(0, R - P)

Purchase Exceeds:

P > R

No modification to these formulas is allowed unless a proven existing defect
contradicts the locked source.

============================================================
24. CANONICAL BUSINESS VALUES
============================================================

Preserve and regression-test:

Available Funds:

950

Fixed Essentials:

455

Flexible Essentials:

180

Safety Buffer:

100

Protected Total:

735

Runway:

215

Purchase:

160

Remaining:

55

============================================================
25. SHORTFALL VALUE
============================================================

Preserve:

Available:

650

Protected Total:

734

Runway:

0

Shortfall:

84

============================================================
26. PURCHASE EXCEEDS VALUE
============================================================

Preserve:

Runway:

215

Purchase:

300

Remaining:

0

Excess:

85

============================================================
27. CONFIRMATION VALUE
============================================================

Preserve:

Available Funds:

950 → 790

Protected Total:

735 → 735

Runway:

215 → 55

purchaseConfirmed:

false → true

No double subtraction.

No double confirmation.

============================================================
28. VALIDATION ARCHITECTURE AUDIT
============================================================

Inspect the validation patterns used by:

LoginPage

RunwaySetupPage

ProtectEssentialsPage

PurchaseCheckPage

and:

src/utils/moneyValidation.ts

Ensure the same monetary concepts use consistent shared rules where
appropriate.

Do not introduce a validation framework.

============================================================
29. MONEY VALIDATION CONTRACT
============================================================

Confirm the established money contract consistently handles:

empty

valid integer

valid decimal

zero

negative

malformed

non-finite

excess precision

according to the already-approved project rule.

Do not invent a new money syntax in P10.

============================================================
30. ZERO SEMANTICS
============================================================

Confirm:

Safety Buffer = 0
is valid.

Fixed Essentials = 0
is valid.

Flexible Essentials = 0
is valid.

Purchase Amount = 0
is invalid.

Do not accidentally reuse a generic validator in a way that changes these
business semantics.

============================================================
31. NO SILENT INVALID-TO-ZERO
============================================================

Search source for patterns such as:

Number(value) || 0

parseFloat(value) || 0

or equivalent logic that could silently turn invalid input into valid zero.

If found in a domain-sensitive path:

replace with explicit validation logic.

Do not change valid zero semantics.

============================================================
32. LOGIN VALIDATION AUDIT
============================================================

Verify:

Email required.

Email syntax validated reasonably.

Password required.

No real-authentication claims.

No hardcoded fake credential database.

No password persistence.

No password console logging.

============================================================
33. RUNWAY SETUP VALIDATION AUDIT
============================================================

Verify:

Available Funds required.

Safety Buffer required.

Planning Date required.

Negative monetary values rejected.

Valid decimal behaviour consistent.

Zero buffer allowed.

No unsupported business restriction added to Planning Date.

============================================================
34. ESSENTIALS VALIDATION AUDIT
============================================================

Verify:

Fixed Essentials required.

Flexible Essentials required.

Negative rejected.

Zero allowed.

Valid decimals accepted according to money contract.

============================================================
35. PURCHASE VALIDATION AUDIT
============================================================

Verify:

Purchase Name required.

Whitespace-only name invalid.

Purchase Amount required.

Purchase Amount > 0.

Negative invalid.

Zero invalid.

Malformed invalid.

============================================================
36. VALIDATION ERROR PRIORITY
============================================================

Each field should display one useful error at a time.

Example:

empty field

should not simultaneously show:

required
invalid number
negative amount

Prefer deterministic error priority:

required
→ format
→ domain rule

============================================================
37. TOUCHED / SUBMISSION VALIDATION
============================================================

Errors should not all appear immediately on initial page load.

Verify current touched/submission-aware behaviour remains consistent.

Do not move touched state into App-level business state.

============================================================
38. VALIDATION COPY
============================================================

Errors must be:

plain
factual
actionable

Avoid implementation language such as:

NaN
invalid float
parse error

Suitable:

Enter your available funds.

Enter a valid amount.

Enter an amount of 0 or more.

============================================================
39. SEMANTIC HTML AUDIT
============================================================

Across all routes inspect:

main

nav

form

header where appropriate

h1

h2

button

a

label

input

Use native semantics where possible.

Do not replace correct native HTML with unnecessary ARIA roles.

============================================================
40. ONE H1 PER PAGE
============================================================

Verify each routed screen has one clear primary h1:

/login

/setup

/essentials

/runway

/purchase

/result

Do not create duplicate primary headings due AppShell composition.

============================================================
41. HEADING ORDER
============================================================

Check logical heading hierarchy.

Avoid:

h1
→ h4

without justification.

FormSection headings should remain beneath the page h1.

============================================================
42. LABEL AUDIT
============================================================

Every form field must have a programmatically associated label.

Inspect:

Email

Password

Available Funds

Planning Date

Safety Buffer

Fixed Essentials

Flexible Essentials

Purchase Name

Purchase Amount

Placeholder text is NOT a replacement for a label.

============================================================
43. ERROR ASSOCIATION
============================================================

Where field errors exist, verify appropriate:

aria-invalid

and:

aria-describedby

or equivalent accessible relationship.

Do not reference nonexistent element IDs.

Do not create duplicate IDs.

============================================================
44. HELPER + ERROR DESCRIPTIONS
============================================================

If both helper text and error text are present:

ensure aria-describedby points to the appropriate current descriptive content.

Avoid duplicated screen-reader announcements.

============================================================
45. BUTTON TYPE AUDIT
============================================================

Inside forms:

submit action:

type="submit"

Back/cancel/edit:

type="button"

Avoid accidental form submission.

============================================================
46. KEYBOARD AUDIT
============================================================

Verify a keyboard-only user can complete:

Login
→ Setup
→ Essentials
→ Runway
→ Purchase
→ Result

using:

Tab
Shift+Tab
Enter
Space where appropriate

No mouse-only critical interaction.

============================================================
47. FOCUS VISIBILITY
============================================================

Verify visible focus on:

inputs

links

primary buttons

secondary buttons

navigation

StatusActionButton

Do not remove native outline without a clear replacement.

============================================================
48. FOCUS CLIPPING
============================================================

Ensure P9 layout changes did not clip focus rings through:

overflow-hidden

or narrow containers.

Fix visually clipped focus if discovered.

============================================================
49. FOCUS ORDER
============================================================

DOM/tab order should follow logical reading/action order.

Avoid positive tabindex.

Do not use CSS visual reordering that makes keyboard order confusing.

============================================================
50. ERROR FOCUS BEHAVIOUR
============================================================

Do not implement an elaborate focus manager unless necessary.

On invalid form submission:

the errors must at minimum become clearly discoverable.

If current implementation already focuses the first invalid field correctly:

preserve it.

If not, add the smallest accessible improvement only where clearly beneficial.

============================================================
51. TOUCH TARGET AUDIT
============================================================

Audit interactive controls around mobile 390px.

Target approximately:

48×48px

where appropriate according to the design-system contract.

Do not enlarge text links into absurd layouts solely to hit an exact number.

Focus on primary buttons/navigation/form actions.

============================================================
52. COLOUR-ONLY STATE AUDIT
============================================================

Ensure these states are not communicated only by colour:

field error

shortfall

within-runway

exceeds-runway

confirmed-success

Text must identify the state.

============================================================
53. SHORTFALL ACCESSIBILITY
============================================================

Protected Shortfall must be understandable from text.

Do not rely on red/warning colour alone.

============================================================
54. PURCHASE RESULT ACCESSIBILITY
============================================================

Result states must clearly say:

Within your current discretionary runway

or:

Exceeds your current discretionary runway

or approved equivalent.

Do not rely solely on a green/red icon.

============================================================
55. STATUSACTIONBUTTON AUDIT
============================================================

Inspect:

src/components/ui/StatusActionButton.tsx

Verify:

semantic button

button type

keyboard activation

disabled semantics

accessible label

focus visibility

reduced-motion behaviour

21st.dev provenance

No financial calculation inside the component.

============================================================
56. REDUCED MOTION
============================================================

Preserve existing:

prefers-reduced-motion

behaviour.

Do not add new unnecessary animations during P10.

============================================================
57. ARIA AUDIT
============================================================

Avoid:

redundant roles

aria-label where visible label already suffices

incorrect aria-live

invalid aria attributes

ARIA should improve semantics, not duplicate them.

============================================================
58. LIVE REGION AUDIT
============================================================

Do not announce every financial calculation keystroke.

If StatusActionButton/status UI uses live announcements:

ensure they are restrained and useful.

No noisy screen-reader loop.

============================================================
59. NAVIGATION ACCESSIBILITY
============================================================

Audit:

desktop navigation

mobile bottom navigation

Ensure:

semantic nav where appropriate

meaningful names

active state understandable

not icon-only without accessible label

keyboard usable

============================================================
60. MOBILE BOTTOM NAVIGATION
============================================================

P9 added icon + label mobile navigation.

Verify:

icons are decorative where text already labels the item

or otherwise accessible.

Avoid duplicated accessible names such as:

"Runway Runway".

============================================================
61. APP SHELL LANDMARKS
============================================================

Inspect AppShell for logical landmarks.

Avoid multiple identical unnamed:

nav

landmarks if they are simultaneously present to assistive technology.

If desktop/mobile versions are conditionally hidden via CSS:

ensure the resulting accessibility behaviour is sensible.

============================================================
62. PRIVACY AUDIT
============================================================

Search source for:

console.log

console.debug

console.info

or other debugging that could expose:

password

email

financial values

purchase information

Remove unsafe temporary debugging.

Do not remove purposeful harmless diagnostics unless unnecessary in production.

============================================================
63. PASSWORD PRIVACY
============================================================

Confirm password:

remains local to LoginPage

is not passed into RunwayState

is not persisted

is not logged

is not included in URL

is not documented as a real credential.

============================================================
64. SECURITY CLAIM AUDIT
============================================================

Search user-facing copy for unsupported claims such as:

secure

encrypted

bank-level security

protected account

authenticated

unless technically and accurately supported.

The Login page is frontend-only demo navigation.

Do not imply otherwise.

============================================================
65. AUTHENTICATION ETHICS
============================================================

Do not tell users:

Incorrect credentials

Account not found

Authentication failed

when there is no authentication backend.

Use only form-validation language.

============================================================
66. ETHICS FULL COPY SEARCH
============================================================

Search all relevant source/user-facing strings case-insensitively for terms and
phrases including:

safe

unsafe

good

bad

smart

stupid

responsible

irresponsible

afford

affordable

recommended

recommend

should buy

shouldn't buy

should not buy

good choice

bad choice

great choice

smart choice

financial advice

going broke

broke

danger

risky

risk-free

Also inspect semantically equivalent wording not captured by literal search.

============================================================
67. ETHICS REVIEW RULE
============================================================

Do NOT mechanically remove a word if it is used in an unrelated technical
context.

Example:

"safe area"

in responsive CSS terminology is not financial advice.

Judge context.

Only change user-facing financial judgement or misleading claims.

============================================================
68. APPROVED FINANCIAL LANGUAGE
============================================================

Prefer factual concepts such as:

Available Funds

Protected Total

Safety Buffer

Discretionary Runway

Protected Shortfall

Within your current discretionary runway

Exceeds your current discretionary runway

Remaining Runway

Amount Above Runway

Purchase recorded

============================================================
69. FORBIDDEN FINANCIAL JUDGEMENT
============================================================

Do not tell the user:

This purchase is safe.

This purchase is unsafe.

You can afford this.

You cannot afford this.

This is a smart purchase.

This is a bad decision.

You should buy this.

You should save instead.

============================================================
70. TRANSPARENCY AUDIT
============================================================

Users should be able to understand how major outputs relate to inputs.

Verify result pages expose meaningful breakdowns consistent with Figma.

Do not turn calculations into opaque scores or unexplained badges.

============================================================
71. USER CONTROL AUDIT
============================================================

Preserve:

Back

Edit Purchase

Back Without Saving

explicit Mark as spent

These support reversible preview and explicit consent.

Do not auto-record a purchase.

============================================================
72. PREVIEW ETHICS
============================================================

Preview must remain:

reversible

non-mutating

clearly distinct from recording a purchase.

This is both a business and ethical UX invariant.

============================================================
73. CONFIRMATION ETHICS
============================================================

Mutation requires explicit:

Mark as spent

Do not silently record because a preview is inside runway.

============================================================
74. FUTURE INCOME RULE
============================================================

Future expected income remains excluded until received.

Do not add speculative future income during P10.

============================================================
75. DATA MINIMISATION
============================================================

Do not add extra personal/financial fields.

The MVP collects only what is needed for its defined workflow.

============================================================
76. NO PERSISTENCE
============================================================

Confirm no accidental addition of:

localStorage

sessionStorage

IndexedDB

database

remote API

Persisting financial input is outside current scope.

============================================================
77. DIRECT-ROUTE HARDENING
============================================================

Regression-check:

/runway

/purchase

/result

with fresh/incomplete state.

No page may render:

NaN

Infinity

broken amount

uncaught error

Direct-route redirects must remain deterministic.

============================================================
78. RAW MONEY STRING CONTRACT
============================================================

Preserve raw monetary source values as strings.

Do not convert central source-state architecture to number state during P10.

============================================================
79. DERIVED DATA CONTRACT
============================================================

Confirm no mutable React state exists for deterministic:

protectedTotal

runway

shortfall

purchaseRemaining

purchaseExcess

purchaseExceedsRunway

Do not introduce any during P10.

============================================================
80. NO CALCULATION SYNCHRONISATION EFFECTS
============================================================

Do not introduce useEffect merely to synchronize deterministic financial
results.

Derive them.

============================================================
81. DOUBLE CONFIRMATION
============================================================

Regression-test that repeated confirmation cannot subtract twice.

Canonical final Available Funds remains:

790

not:

630

============================================================
82. DOUBLE SUBTRACTION
============================================================

Confirmed Result must continue treating:

55

as already-updated Runway.

Do not subtract:

160

again.

============================================================
83. EXACT-RUNWAY BOUNDARY
============================================================

Regression-test:

Runway:

215

Purchase:

215

Expected:

Remaining:

0

Exceeds:

false

Confirmation allowed.

============================================================
84. ZERO RUNWAY / NO SHORTFALL
============================================================

Regression-test:

Available Funds = Protected Total

Expected:

Runway:

0

Shortfall:

0

Do not present a shortfall warning.

============================================================
85. MONEY PRECISION
============================================================

Audit current:

formatMoneyInputValue

or equivalent helper.

Ensure confirmed calculations do not expose binary floating-point artifacts.

Do not add a decimal package.

============================================================
86. RESPONSIVE REGRESSION
============================================================

P9 already passed:

390
768
1024
1280

P10 should not redo pixel-level Figma matching.

But after semantic/validation fixes, confirm no obvious responsive regression at:

390px

1280px

for changed screens.

============================================================
87. NO NEW PACKAGES
============================================================

P10 should require:

NO NEW PACKAGES.

Do not install an accessibility framework solely for this phase.

If no automated accessibility tool exists:

perform source/browser/manual checks honestly.

Do not claim an automated audit that was not run.

============================================================
88. NO FAKE WCAG CERTIFICATION
============================================================

Do not claim:

WCAG compliant

AA certified

fully accessible

unless comprehensive verified evidence exists.

Use accurate wording:

accessibility audit completed

identified checks passed

or:

no obvious issue found in tested criteria.

============================================================
89. CONTRAST REVIEW
============================================================

Review obvious text/background contrast problems using the approved semantic
tokens.

If exact contrast measurement tooling is unavailable:

do not fabricate a ratio.

Report visual/source review honestly.

============================================================
90. SOURCE HYGIENE MUST COVER ALL SRC FILES
============================================================

Before P10 completes, ensure EVERY human-authored file under src/ was considered,
not only files changed by P6-P9.

This includes files that may still contain old P1/P2/P3 header corruption.

Do not stop after fixing App.tsx.

============================================================
91. EXPECTED SOURCE HYGIENE EXAMPLE
============================================================

The screenshot-observed corruption:

@project Student Money Runway â€” BUS4012 Assignment 02

must become:

@project Student Money Runway — BUS4012 Assignment 02

Likewise:

@phase P8 â€” Purchase Check + Result + Explicit Confirmation

must become:

@phase P8 — Purchase Check + Result + Explicit Confirmation

Search for analogous corruption repository-wide under src/.

============================================================
92. TYPO AUDIT
============================================================

Search headers/comments for obvious typos such as:

resposibility

responsibilty

assigment

finacial

calcuation

sucess

confimation

and similar errors discovered by inspection.

Do not limit the audit to these literal examples.

Use judgement.

============================================================
93. PUBLIC UI COPY VS COMMENTS
============================================================

Separate:

A. source comments/headers

from:

B. user-visible UI copy

Source comment correction may happen for technical clarity.

User-visible copy should change only when required for:

accessibility
ethics
accuracy
obvious spelling/encoding defect.

Do not casually rewrite the product voice.

============================================================
94. CSS COMMENTS
============================================================

If human-authored comments exist in:

src/index.css

audit those as well.

Do not add JSDoc syntax where normal CSS comments are required.

============================================================
95. NEW P10 SOURCE FILES
============================================================

Avoid creating new source files unless a genuine shared accessibility or
validation helper is necessary.

Prefer fixing existing structure.

Do not create:

accessibilityUtils.ts

merely to appear thorough.

============================================================
96. IMPLEMENTATION DOCUMENTATION
============================================================

Create:

docs/implementation/p10-validation-accessibility-ethics-source-hygiene.md

Use:

# P10 — Validation, Accessibility, Ethics and Source Hygiene

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P10 — Validation + Accessibility + Ethics + Source Hygiene
> Created: <actual Melbourne filesystem timestamp>
> Updated: <actual Melbourne filesystem timestamp>

Document:

1. P10 scope
2. source files audited
3. encoding/mojibake findings
4. header corrections
5. comment/spelling corrections
6. files with comment-only corrections
7. files with material P10 corrections
8. validation audit
9. accessibility audit
10. keyboard audit
11. semantic HTML audit
12. ARIA audit
13. focus audit
14. ethical-language search
15. privacy/security audit
16. direct-route audit
17. business regression
18. responsive regression
19. known limitations
20. P11 boundary

============================================================
97. REQUIRED SOURCE HYGIENE TABLE
============================================================

Include a table:

| File | Encoding issue | Header issue | Comment issue | Material P10 change | Result |
|---|---|---|---|---|---|

Include every human-authored source file under src/.

Do not omit clean files.

Clean files may report:

NONE

PASS

============================================================
98. REQUIRED ENCODING SEARCH REPORT
============================================================

Report:

Number of files scanned.

Number containing mojibake.

Exact affected file paths.

Types of corruption found.

Whether all were corrected.

After correction rerun search.

Expected final:

no known mojibake patterns remain in human-authored src files.

============================================================
99. IMPLEMENTATION SEQUENCE
============================================================

Follow this order:

STEP 1

Read master + P1-P9 docs.

STEP 2

Run Git safety check.

STEP 3

Inventory ALL src files.

STEP 4

Audit source headers/comments.

STEP 5

Search for mojibake.

STEP 6

Record all source-hygiene findings BEFORE editing.

STEP 7

Audit validation consistency.

STEP 8

Audit semantic HTML/accessibility.

STEP 9

Audit keyboard/focus.

STEP 10

Audit ethical copy.

STEP 11

Audit privacy/security claims/debugging.

STEP 12

Plan the smallest required fixes.

STEP 13

Apply source hygiene fixes.

STEP 14

Apply functional P10 fixes only where defects actually exist.

STEP 15

Rerun mojibake/comment audit.

STEP 16

Run validation test matrix.

STEP 17

Run accessibility/keyboard checks.

STEP 18

Run business regression.

STEP 19

Run responsive regression.

STEP 20

Create P10 documentation.

STEP 21

Run lint/build.

STEP 22

Inspect Git diff.

STOP.

============================================================
100. LOGIN VALIDATION TESTS
============================================================

L1

empty email
empty password

Expected:

required errors after submit.

L2

invalid email

Expected:

email format error.

L3

valid email
non-empty password

Expected:

frontend session begins.

No real authentication claim.

============================================================
101. SETUP VALIDATION TESTS
============================================================

S1

all empty

Expected:

required errors.

S2

Available Funds -1

Expected:

invalid.

S3

Safety Buffer -1

Expected:

invalid.

S4

Available 950
Buffer 0
valid date

Expected:

valid.

S5

valid supported decimals

Expected:

valid.

============================================================
102. ESSENTIALS VALIDATION TESTS
============================================================

E1

empty fixed/flexible

Expected:

required.

E2

negative fixed

invalid.

E3

negative flexible

invalid.

E4

fixed 0
flexible 0

Expected:

valid.

============================================================
103. PURCHASE VALIDATION TESTS
============================================================

P1

empty name / amount

invalid.

P2

whitespace name

invalid.

P3

purchase 0

invalid.

P4

purchase -1

invalid.

P5

valid decimal > 0

valid.

============================================================
104. BUSINESS REGRESSION
============================================================

Verify:

Protected Total:

735

Runway:

215

Shortfall:

84

Purchase 160:

Remaining 55

Purchase 215:

Remaining 0
Exceeds false

Purchase 300:

Excess 85

Confirmed:

Available 790
Runway 55

============================================================
105. PREVIEW REGRESSION
============================================================

Before confirmation:

availableFunds remains:

950

purchaseConfirmed:

false

============================================================
106. BACK WITHOUT SAVING REGRESSION
============================================================

Back Without Saving:

no financial mutation.

============================================================
107. DOUBLE CONFIRM REGRESSION
============================================================

Repeated confirmation:

Available Funds remains:

790

not:

630

============================================================
108. KEYBOARD TEST MATRIX
============================================================

Keyboard-only verify:

/login

/setup

/essentials

/runway

/purchase

/result

Check:

logical Tab order

Shift+Tab

Enter form submission

Space/Enter button activation where native semantics apply

navigation reachable

StatusActionButton reachable

No keyboard trap.

============================================================
109. SCREEN STATE ACCESSIBILITY
============================================================

Verify textual communication for:

field error

shortfall

within-runway

exceeds-runway

confirmed-success

No state depends on colour alone.

============================================================
110. DIRECT ROUTE TEST
============================================================

Fresh session direct visits:

/runway

/purchase

/result

Expected:

deterministic earlier-route redirects

No NaN/Infinity/runtime error.

============================================================
111. RESPONSIVE REGRESSION
============================================================

At minimum test materially changed screens at:

390px

1280px

No horizontal overflow introduced by P10 changes.

============================================================
112. LINT
============================================================

Run:

npm run lint

Required:

PASS

Do not suppress lint rules.

============================================================
113. BUILD
============================================================

Run:

npm run build

Required:

PASS

============================================================
114. PACKAGE AUDIT
============================================================

Inspect:

package.json
package-lock.json

Expected packages added:

NONE

============================================================
115. GIT DIFF REVIEW
============================================================

Run:

git status
git diff

Review every P10 change.

Categorise each changed source file as:

A. comment/header/encoding-only

or:

B. material P10 implementation change

Ensure no accidental:

business refactor

route redesign

state architecture change

P11 work

============================================================
116. SOURCE METADATA FINAL CHECK
============================================================

After all edits:

verify no human-authored src file contains malformed project header text.

Specifically search final source for:

â

Ã

�

and known mojibake sequences.

Do not declare clean if corruption remains.

============================================================
117. P10 ACCEPTANCE — SOURCE HYGIENE
============================================================

P10 source hygiene passes only if:

[ ] all human-authored src files inventoried

[ ] headers reviewed

[ ] mojibake search performed

[ ] screenshot-observed â€” corruption fixed

[ ] equivalent corruption fixed elsewhere

[ ] obvious comment typos fixed

[ ] misleading comments corrected

[ ] trivial comments not added

[ ] 21st.dev provenance retained

[ ] createdAt history preserved

[ ] comment-only fixes did not falsely rewrite substantive updatedAt

[ ] final mojibake scan clean

============================================================
118. P10 ACCEPTANCE — VALIDATION
============================================================

[ ] Login rules consistent

[ ] Setup rules consistent

[ ] Essentials rules consistent

[ ] Purchase rules consistent

[ ] zero semantics correct by field type

[ ] no invalid-to-zero coercion

[ ] touched/submission behaviour sensible

[ ] errors factual

============================================================
119. P10 ACCEPTANCE — ACCESSIBILITY
============================================================

[ ] semantic forms

[ ] one h1 per route

[ ] logical heading hierarchy

[ ] all fields labelled

[ ] aria-invalid correct where used

[ ] errors associated where appropriate

[ ] visible focus

[ ] keyboard journey works

[ ] no obvious keyboard trap

[ ] state not conveyed by colour alone

[ ] mobile navigation accessible

[ ] StatusActionButton accessible

[ ] reduced motion preserved

============================================================
120. P10 ACCEPTANCE — ETHICS
============================================================

[ ] no financial-advice language

[ ] no safe/unsafe purchase language

[ ] no affordability claim

[ ] no judgemental spending language

[ ] no unsupported security/auth claims

[ ] preview remains reversible

[ ] confirmation remains explicit

[ ] future income remains excluded until received

[ ] calculations remain transparent

============================================================
121. P10 ACCEPTANCE — PRIVACY
============================================================

[ ] password not logged

[ ] password not persisted

[ ] credentials not in RunwayState

[ ] no unnecessary sensitive console logging

[ ] no new persistence

============================================================
122. P10 ACCEPTANCE — REGRESSION
============================================================

[ ] Protected Total 735

[ ] Runway 215

[ ] Shortfall 84

[ ] Purchase 160 → 55

[ ] Purchase 215 → 0 / false

[ ] Purchase 300 → excess 85

[ ] preview non-mutating

[ ] confirmation 950 → 790

[ ] updated Runway 55

[ ] double confirm blocked

[ ] direct-route protections intact

[ ] responsive P9 architecture intact

============================================================
123. FINAL REPORT
============================================================

Return:

A. Source inventory

- total human-authored src files scanned

------------------------------------------------------------

B. Mojibake / encoding audit

Table:

File
Problem
Before
After

Specifically identify every file that contained:

â€”
or equivalent corruption.

------------------------------------------------------------

C. Header audit

Report:

- incorrect @project
- incorrect @phase
- incorrect @file
- incorrect student
- timestamp issues
- summary/responsibility issues

------------------------------------------------------------

D. Comment quality audit

Report:

- spelling corrections
- grammar corrections
- misleading comments
- redundant comments removed

------------------------------------------------------------

E. Timestamp treatment

Separate:

comment/header-only files

from:

material P10 files.

Confirm createdAt preservation.

------------------------------------------------------------

F. Validation audit

Table:

Area
Issue
Fix
Result

------------------------------------------------------------

G. Accessibility audit

Include:

semantics
labels
ARIA
keyboard
focus
status communication
reduced motion
navigation

------------------------------------------------------------

H. Ethical-language audit

Report literal searches performed.

List any user-facing phrases changed.

------------------------------------------------------------

I. Privacy/security audit

------------------------------------------------------------

J. Business regression

Table:

Case
Expected
Actual
PASS/FAIL

------------------------------------------------------------

K. Direct-route regression

------------------------------------------------------------

L. Responsive regression

390px
1280px

------------------------------------------------------------

M. Files created

------------------------------------------------------------

N. Files modified — header/comment/encoding only

------------------------------------------------------------

O. Files modified — material P10 implementation

------------------------------------------------------------

P. Source-header traceability

For material P10 files:

File
Phase
Created
Updated
Timezone

------------------------------------------------------------

Q. Final mojibake scan

Report exact result.

Expected:

CLEAN

------------------------------------------------------------

R. Packages added

Expected:

NONE

------------------------------------------------------------

S. npm run lint

PASS / FAIL

------------------------------------------------------------

T. npm run build

PASS / FAIL

------------------------------------------------------------

U. Browser/runtime verification

Report actual Vite URL.

Report console status.

------------------------------------------------------------

V. Git/change assessment

Confirm:

- source hygiene changes
- validation/a11y/ethics changes only
- no business architecture drift

------------------------------------------------------------

W. Known limitations

Be truthful.

Do not claim full WCAG certification.

------------------------------------------------------------

X. Deferred P11 work

Explicitly defer:

- final full application QA
- rubric traceability
- Cline evidence audit
- prompt-document evidence assembly
- reusable-component evidence capture
- 21st.dev evidence capture
- video walkthrough plan
- submission ZIP audit
- node_modules exclusion
- final assessment readiness decision

============================================================
124. HARD STOP
============================================================

Do NOT continue to P11.

Do NOT generate the final submission package.

Do NOT begin final assessment evidence assembly.

Do NOT change financial formulas.

Do NOT change product scope.

Do NOT add packages.

If blocked finish exactly:

P10 QUALITY HARDENING BLOCKED

If every required P10 acceptance gate passes finish exactly:

P10 QUALITY HARDENING READY