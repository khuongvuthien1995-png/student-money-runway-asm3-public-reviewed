# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# P11 — FINAL QA + ASSESSMENT EVIDENCE + SUBMISSION READINESS
# UNIVERSAL MASTER FINAL-GATE PROMPT
#
# Student: Thien Khuong Vu
# Recommended model: GPT-5.6 Terra — MEDIUM
#
# EXECUTION MODE:
# RECONCILE → GIT BASELINE → FULL QA → RUBRIC AUDIT →
# EVIDENCE AUDIT → SUBMISSION AUDIT → DOCUMENT → FINAL VERDICT
#
# ============================================================
# CRITICAL P11 BOUNDARY
# ============================================================
#
# P11 is the FINAL project implementation phase.
#
# The application is already functionally complete through P10.
#
# P11 must NOT:
#
# - add new product features
# - redesign architecture
# - change business formulas
# - change route structure
# - introduce persistence
# - add backend/authentication
# - invent assessment evidence
# - claim Cline evidence that does not actually exist
# - claim screenshots/video evidence that has not actually been captured
#
# P11 performs:
#
# 1. Git baseline/checkpoint
# 2. full repository reconciliation
# 3. final runtime regression
# 4. final code quality audit
# 5. rubric traceability
# 6. reusable component evidence audit
# 7. 21st.dev evidence audit
# 8. Cline evidence audit
# 9. Prompt Document evidence preparation
# 10. video evidence preparation
# 11. submission ZIP readiness audit
# 12. final readiness verdict
#
# Do not automatically claim READY merely because lint/build pass.
#
# READY requires assessment evidence as well as functioning code.

============================================================
0. ROLE
============================================================

Act simultaneously as:

- Senior React Developer
- Frontend Software Architect
- TypeScript Reviewer
- QA Lead
- Accessibility Reviewer
- Assessment Compliance Auditor
- BUS4012 Lecturer-style Reviewer
- Evidence Traceability Reviewer
- Submission Packaging Reviewer
- Git Repository Reviewer

You are performing the final gate for an existing BUS4012 Assignment 02
submission.

The objective is not to praise the implementation.

The objective is to determine whether the project is actually ready for:

- assessment video recording
- Prompt Document preparation
- project ZIP submission

Use a burden-of-proof standard.

Do not give credit for evidence that probably exists.

Give credit only when it is visible in the repository or explicitly verifiable.

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

P11 — Final QA + Assessment Evidence

============================================================
2. COMPLETED PHASES
============================================================

These phases are expected to be COMPLETE:

P0
Environment

P0.5
Figma Reference Curation

P1
Design System

P2
Reusable UI Kit

P2A
FormSection

P2B
MoneyInput

P2C
SummaryRow

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
Purchase Check + Result + Explicit Confirmation

P9
Responsive + Figma Matching

P10
Validation + Accessibility + Ethics + Source Hygiene

Expected closed gates:

P7 FINAL GATE PASS

P8 FINAL GATE PASS

P9 RESPONSIVE AND FIGMA QA READY

P10 QUALITY HARDENING READY

Do not assume these statements are sufficient by themselves.

Reconcile them against actual current source.

============================================================
3. READ ALL BINDING PROJECT CONTEXT
============================================================

Before changing anything read:

docs/prompts/00-master-project-context.md

Then read ALL implementation documentation:

docs/implementation/p1-design-system-mapping.md

docs/implementation/p2-component-matrix.md

docs/implementation/p3-21st-dev-integration.md

docs/implementation/p4-route-map.md

docs/implementation/p5-state-and-calculation-model.md

docs/implementation/p6-login-and-runway-setup.md

docs/implementation/p7-protect-essentials-runway-result.md

docs/implementation/p8-purchase-check-result-confirmation.md

docs/implementation/p9-responsive-figma-qa.md

docs/implementation/p10-validation-accessibility-ethics-source-hygiene.md

Read:

docs/figma-reference/README.md

Read all phase prompts under:

docs/prompts/

Inspect the complete current:

src/

tree.

Inspect:

package.json
package-lock.json
.gitignore
.prettierrc
eslint.config.js
vite configuration
tailwind configuration
tsconfig files

============================================================
4. ASSESSMENT REQUIREMENTS TO VERIFY
============================================================

The final project must visibly support the BUS4012 Assignment 02 requirements,
including at minimum:

- Login screen
- 2–3 information-entry screens
- final screen indicating successful or unsuccessful result
- at least three custom reusable UI components
- each custom component visibly reused across at least two screens
- one genuine 21st.dev sourced component
- React component architecture the student can explain
- props passed parent → child
- callback/data flow child → parent
- structured prompting evidence
- development workflow evidence
- video-ready walkthrough evidence
- Prompt Document evidence
- complete project ZIP without node_modules

Do not invent any missing assessment evidence.

============================================================
5. GIT CHECKPOINT — FIRST ACTION
============================================================

Before P11 QA, create a stable baseline/checkpoint IF Git identity allows it.

First run:

git status

Then inspect:

git log --oneline --decorate -5

Determine whether the repository currently has any commit.

If NO baseline commit exists:

inspect:

git config --local user.name

git config --local user.email

and, if needed:

git config --global user.name

git config --global user.email

============================================================
6. GIT IDENTITY SAFETY
============================================================

Never invent a Git email address.

Never fabricate the student's university email.

If a valid Git email is already configured:

use it.

If user.name is missing but user.email exists:

set LOCAL repository user.name to:

Thien Khuong Vu

using:

git config user.name "Thien Khuong Vu"

Do NOT use --global unless already configured by the user.

If user.email is missing:

DO NOT fabricate one.

DO NOT create a fake noreply address.

Do NOT block the rest of P11 QA.

Instead:

- report that baseline commit could not be created because user.email is absent
- continue the P11 audit
- classify Git baseline as an outstanding setup item

============================================================
7. CREATE BASELINE COMMIT WHEN POSSIBLE
============================================================

If Git identity is valid and repository has no baseline commit:

first inspect:

.gitignore

Confirm it excludes at minimum:

node_modules/
dist/
.env
.env.*
appropriate generated/local files

Do NOT stage secrets.

Run:

git status --short

Then stage the intended project:

git add .

Review staged files:

git status

If unsafe/generated/private files are staged:

STOP and correct staging before commit.

If staging is safe:

commit:

git commit -m "feat: complete Student Money Runway MVP through P10"

Then verify:

git status

Expected:

working tree clean

or only intentional P11 files created after the baseline.

============================================================
8. EXISTING BASELINE CASE
============================================================

If one or more commits already exist:

do NOT create a redundant P0-P10 baseline commit.

Use the existing repository history.

Report:

latest commit hash
latest commit message
working tree state

============================================================
9. GIT BASELINE PURPOSE
============================================================

The baseline exists so P11 changes can be reviewed using:

git diff

P11 must NOT rewrite historical implementation merely to produce a cleaner
commit history.

No rebasing.

No force reset.

No amend unless explicitly required and safe.

============================================================
10. P11 PROMPT PRESERVATION
============================================================

Ensure this exact P11 master prompt is preserved at:

docs/prompts/p11-final-qa-assessment-evidence.md

Do not rewrite or shorten the prompt.

If it already exists:

verify it is preserved accurately.

============================================================
11. SOURCE TREE INVENTORY
============================================================

Inventory current:

src/

At minimum identify:

components/layout
components/ui
pages
types
utils
App.tsx
main.tsx
index.css

Count human-authored source files.

Confirm no temporary experimental source remains.

============================================================
12. TEMPORARY / DEBUG FILE AUDIT
============================================================

Search repository for obvious temporary artifacts such as:

temp
tmp
debug
backup
copy
old
test-output
pasted-text
scratch
draft
unused previews

Use judgement.

Do NOT delete legitimate coursework evidence simply because its filename
contains "prompt" or "reference".

If temporary files are found:

identify them.

Remove only when clearly safe and not assessment evidence.

============================================================
13. DEBUG CODE AUDIT
============================================================

Search human-authored source for:

console.log
console.debug
console.warn
console.error
debugger

Review every occurrence.

Remove accidental development diagnostics.

Preserve only purposeful production-safe logging if genuinely needed.

Never log:

password
email
financial amounts
purchase information

unless there is an explicit non-sensitive technical reason, which is not
expected in this MVP.

============================================================
14. TODO / FIXME / PLACEHOLDER AUDIT
============================================================

Search repository source and implementation docs for:

TODO
FIXME
HACK
TEMP
PLACEHOLDER
COMING SOON
Lorem ipsum
example only
dummy
fake

Review context.

Do not mechanically delete valid explanatory uses.

No unfinished production placeholder may remain in the final app.

============================================================
15. MOJIBAKE / SOURCE HYGIENE FINAL AUDIT
============================================================

P10 reported a clean source scan.

Verify again across human-authored source for suspicious sequences including:

â
Ã
�
Â

Confirm:

no known mojibake remains in src/.

Do not alter timestamps for comment-only corrections contrary to the master
convention.

============================================================
16. FINAL ROUTE CONTRACT
============================================================

Verify routes remain:

/

/login

/setup

/essentials

/runway

/purchase

/result

Expected:

/ redirects to /login

unknown route handled deterministically

No accidental extra production routes.

============================================================
17. FULL USER JOURNEY TEST
============================================================

Run the actual application and verify:

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
Purchase Result
↓
explicit confirmation

Use actual browser interaction where available.

Do not treat HTTP 200 route smoke tests alone as full user-flow verification.

============================================================
18. LOGIN FINAL TEST
============================================================

Verify:

empty submit → errors

invalid email → error

valid email + non-empty password → /setup

No backend authentication claim.

No password persistence.

No credential logging.

============================================================
19. SETUP FINAL TEST
============================================================

Canonical input:

Available Funds:

950

Safety Buffer:

100

Planning Date:

valid native date

Expected:

valid submission → /essentials

Verify state persists on back navigation.

============================================================
20. ESSENTIALS FINAL TEST
============================================================

Canonical:

Fixed Essentials:

455

Flexible Essentials:

180

Expected:

Protected Total:

735

valid submission → /runway

============================================================
21. RUNWAY FINAL TEST
============================================================

Canonical:

A = 950
F = 455
V = 180
B = 100

Expected:

Protected Total:

735

Discretionary Runway:

215

Shortfall:

0

============================================================
22. SHORTFALL FINAL TEST
============================================================

Verify:

Available:

650

Protected:

734

Expected:

Runway:

0

Shortfall:

84

No negative runway.

No judgemental language.

============================================================
23. PURCHASE WITHIN FINAL TEST
============================================================

Runway:

215

Purchase:

160

Expected preview:

Remaining:

55

Exceeds:

false

Available Funds BEFORE confirmation:

950

purchaseConfirmed:

false

============================================================
24. BACK WITHOUT SAVING TEST
============================================================

From within-runway preview:

Back Without Saving

Expected:

availableFunds still:

950

purchaseConfirmed:

false

No purchase recorded.

============================================================
25. EXACT RUNWAY FINAL TEST
============================================================

Runway:

215

Purchase:

215

Expected:

Remaining:

0

Exceeds:

false

Confirmation available.

============================================================
26. EXCEEDS FINAL TEST
============================================================

Runway:

215

Purchase:

300

Expected:

Remaining:

0

Exceeds:

true

Excess:

85

No Mark as spent confirmation.

No source mutation.

============================================================
27. CONFIRM FINAL TEST
============================================================

Canonical explicit confirmation:

Available Funds:

950 → 790

Protected Total:

735 → 735

Runway:

215 → 55

purchaseConfirmed:

false → true

No double subtraction.

============================================================
28. DOUBLE CONFIRM FINAL TEST
============================================================

Repeated activation must not produce:

630

Expected:

790

after the same purchase is confirmed once.

============================================================
29. NEXT PURCHASE TEST
============================================================

If "Check another purchase" exists:

after canonical confirmation:

Available Funds remains:

790

new current Runway:

55

purchase draft resets only after explicit user action.

No confirmed financial mutation is reversed.

============================================================
30. DIRECT ROUTE FINAL TEST
============================================================

Fresh session:

/runway
/purchase
/result

Expected deterministic redirects.

No:

NaN
Infinity
broken currency
runtime exception

============================================================
31. BUSINESS UTILITY AUDIT
============================================================

Inspect:

src/utils/runwayCalculations.ts

Confirm one authoritative implementation for:

calculateProtectedTotal

calculateRunway

calculateProtectedShortfall

calculatePurchaseRemaining

doesPurchaseExceedRunway

calculatePurchaseExcess

if still part of current source.

Search for duplicate business arithmetic in pages.

No page should independently recreate locked formulas unnecessarily.

============================================================
32. DERIVED STATE AUDIT
============================================================

Confirm no mutable React state exists for:

protectedTotal
runway
shortfall
purchaseRemaining
purchaseExcess
purchaseExceedsRunway

These must remain derived.

============================================================
33. NO CALCULATION SYNC EFFECT
============================================================

Confirm no useEffect synchronizes deterministic financial calculations into
mutable state.

============================================================
34. SOURCE STATE AUDIT
============================================================

Confirm App-owned source state remains equivalent to:

availableFunds
planningDate
safetyBuffer
fixedEssentials
flexibleEssentials
purchaseName
purchaseAmount
purchaseConfirmed

Do not add derived copies in P11.

============================================================
35. REUSABLE COMPONENT AUDIT
============================================================

Inspect actual rendered usage of:

FormSection

MoneyInput

SummaryRow

Do not rely solely on documentation.

Verify exact screen usage from current source.

============================================================
36. FORMSECTION EVIDENCE
============================================================

Expected actual reuse:

Runway Setup

Protect Essentials

and possibly Purchase Check if current implementation genuinely uses it.

Required minimum:

at least two screens.

Report exact source evidence.

============================================================
37. MONEYINPUT EVIDENCE
============================================================

Expected actual reuse across:

Runway Setup

Protect Essentials

Purchase Check

Required minimum:

at least two screens.

Report exact props used.

============================================================
38. SUMMARYROW EVIDENCE
============================================================

Expected actual reuse across:

Protect Essentials

Runway Result

Purchase Check and/or Result

Required minimum:

at least two screens.

Report actual usage.

============================================================
39. CUSTOM COMPONENT ORIGIN AUDIT
============================================================

The three assessed custom components are intended to be:

FormSection

MoneyInput

SummaryRow

Confirm:

- they are custom project components
- they are not copied third-party components
- their prompts/evidence are traceable
- each is visibly reused on at least two screens

Do not count StatusActionButton as one of the three custom components.

============================================================
40. 21ST.DEV COMPONENT AUDIT
============================================================

Inspect:

src/components/ui/StatusActionButton.tsx

and:

docs/prompts/p03-21st-dev-original-prompt.md

docs/implementation/p3-21st-dev-integration.md

Confirm:

Source:

21st.dev

Component:

Dynamic Status Button

Library/author:

Ruixen UI

Final real application use:

Result confirmation
→ Mark as spent

============================================================
41. 21ST.DEV PROVENANCE
============================================================

Confirm provenance remains visible and honest.

Do not claim the entire component was written from scratch by the student.

Do not remove 21st.dev evidence.

Confirm any adapted source header remains correct.

============================================================
42. 21ST.DEV ASSESSMENT EVIDENCE
============================================================

Record for final evidence:

component name

source

source URL

original instruction/prompt evidence path

adaptations

final screen location

dependencies

why selected

Do not fabricate a Copy Prompt interaction if the exact UI interaction was not
available to the development agent.

Use the actual documented evidence.

============================================================
43. PROPS-DOWN / CALLBACK-UP CODE AUDIT
============================================================

Identify the strongest REAL code example currently present.

Preferred:

App.tsx
↓
RunwaySetupPage
↓
MoneyInput

Inspect actual source.

Record exact relevant props.

============================================================
44. EXPECTED DATA FLOW EVIDENCE
============================================================

Expected conceptual flow:

App.tsx

owns RunwayState

↓ props

RunwaySetupPage

↓ props

MoneyInput

↑ onChange(rawValue)

RunwaySetupPage

↑ onRunwayStateChange(patch)

App.tsx

updates RunwayState

Confirm this exact or equivalent flow exists in current code.

============================================================
45. CODE EXAMPLE EXTRACTION
============================================================

For assessment documentation, record:

Parent file

Child file

Prop names

Callback name

State owner

Why child remains reusable

Do NOT copy huge files into documentation.

Use concise evidence references.

============================================================
46. PROMPT EVIDENCE AUDIT
============================================================

Inventory:

docs/prompts/

Identify:

master project context

P2 custom component prompts/evidence

P3 21st.dev prompt

P4-P10 phase prompts

P11 prompt

Determine which prompts are relevant to the official Prompt Document.

Do not blindly include every huge engineering prompt in the final student
Prompt Document.

============================================================
47. OFFICIAL PROMPT DOCUMENT EVIDENCE NEEDS
============================================================

The Prompt Document should eventually contain evidence equivalent to:

1. full starting prompt used in Cline

2. 3–5 sentence annotation explaining:
   - strategy
   - intended result
   - major constraints

3. 2–3 key follow-up prompts
   and what each fixed/improved

4. prompts used for each of the three custom reusable components

5. note showing where each custom component is reused

6. prompt/instruction used for the 21st.dev component integration

Audit whether authentic repository evidence exists for each item.

============================================================
48. CRITICAL CLINE EVIDENCE AUDIT
============================================================

BUS4012 assessment evidence specifically requires Cline development evidence.

Do NOT assume Codex activity counts as Cline.

Do NOT relabel Codex work as Cline.

Do NOT fabricate Cline screenshots or prompt history.

Inspect repository/documentation for authentic Cline evidence.

Classify each requirement:

PASS

PARTIAL

MISSING

============================================================
49. THREE CUSTOM COMPONENTS + CLINE RISK
============================================================

Specifically verify whether:

FormSection

MoneyInput

SummaryRow

have authentic evidence of being created/reviewed/refined using Cline.

If they were only created using Codex:

report this as an ASSESSMENT EVIDENCE GAP.

Do not modify source provenance falsely.

A later legitimate Cline review/refinement pass may be required before recording
the assessment video.

Do not simulate it in P11.

============================================================
50. CLINE PLAN / ACT EVIDENCE
============================================================

Audit whether authentic evidence exists for:

Cline Plan mode

Cline Act mode

starting prompt

2–3 follow-up prompts

component prompts

21st.dev integration prompt

If missing:

flag clearly.

============================================================
51. CODE VS EVIDENCE DISTINCTION
============================================================

A technically excellent implementation does NOT automatically mean the
assessment is submission-ready.

P11 final verdict must separately evaluate:

A. Product/code readiness

B. Assessment evidence readiness

Do not merge these into one score.

============================================================
52. VIDEO REQUIREMENTS AUDIT
============================================================

Prepare a video evidence plan compatible with the assignment expectations.

Target structure:

approximately 10 minutes total.

Walkthrough:

approximately 5–7 minutes

Development/Cline explanation:

approximately 3–4 minutes

Do not create the video.

Prepare the recording plan.

============================================================
53. VIDEO WALKTHROUGH EVIDENCE
============================================================

The walkthrough plan must include:

Login

Runway Setup

Protect Essentials

Runway Result

Purchase Check

Within-runway preview

Exceeds-runway preview

explicit confirmation

confirmed updated runway

responsive/mobile evidence

============================================================
54. VIDEO CUSTOM COMPONENT EVIDENCE
============================================================

Video plan must explicitly show the three custom reusable components across
multiple screens.

Record exact screen pairs.

For example only if verified:

FormSection:
Setup + Essentials

MoneyInput:
Setup + Essentials + Purchase

SummaryRow:
Essentials + Runway + Result

============================================================
55. VIDEO 21ST.DEV EVIDENCE
============================================================

Video plan must identify:

StatusActionButton

as the sourced 21st.dev component.

Show it in:

Result
→ Mark as spent

Briefly explain its adaptation.

============================================================
56. VIDEO PROPS / CODE EVIDENCE
============================================================

Video plan must identify exact files/code lines/sections to open for:

props parent → child

callback child → parent

Recommended:

App.tsx

RunwaySetupPage.tsx

MoneyInput.tsx

Do not guess line numbers permanently because they may change.

Use file + symbol references.

============================================================
57. VIDEO ETHICS EVIDENCE
============================================================

Walkthrough should explain at least these ethical product decisions:

- financial result is factual, not advice
- future income excluded until received
- preview does not mutate
- purchase confirmation is explicit
- user can Back Without Saving
- no bank integration
- no permanent financial-data storage in MVP

Only state what current source supports.

============================================================
58. VIDEO NOVELTY EVIDENCE
============================================================

Prepare concise product framing:

Do NOT claim budgeting itself is unique.

Frame novelty as:

lightweight short-horizon workflow

protected commitments

transparent discretionary runway

reversible purchase preview

explicit confirmation

manual input

This should remain consistent with ASM1 positioning.

============================================================
59. ASSESSMENT EVIDENCE DIRECTORY
============================================================

Create if appropriate:

docs/assessment/

Use it for FINAL evidence planning documents.

Do NOT duplicate all implementation docs.

Create concise assessment-oriented files.

============================================================
60. CREATE FINAL RUBRIC TRACEABILITY
============================================================

Create:

docs/assessment/p11-rubric-traceability.md

Include metadata:

# P11 — BUS4012 ASM2 Rubric Traceability

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P11 — Final QA + Assessment Evidence
> Created: <actual Melbourne filesystem timestamp>
> Updated: <actual Melbourne filesystem timestamp>

Map evidence to rubric areas.

============================================================
61. RUBRIC AREA — APP STRUCTURE / UI
============================================================

Document evidence for:

Login

information-entry screens

result screen

responsive design

Figma alignment

screen flow

component reuse

Do not award points.

Report:

STRONG

ADEQUATE

GAP

with evidence.

============================================================
62. RUBRIC AREA — ETHICS
============================================================

Document evidence for:

non-judgmental financial language

transparent calculations

reversible preview

explicit confirmation

minimal data collection

no unsupported auth/security claims

no permanent storage

============================================================
63. RUBRIC AREA — NOVELTY
============================================================

Document defensible novelty:

short-horizon runway framing

protected essentials

safety buffer

purchase-impact preview

Do not overclaim uniqueness.

============================================================
64. RUBRIC AREA — PROMPTING
============================================================

Audit:

starting prompt

structured prompting

follow-ups

component prompts

21st.dev prompt

Cline evidence

Explicitly flag anything missing.

============================================================
65. RUBRIC AREA — COMPONENT ARCHITECTURE
============================================================

Document:

FormSection

MoneyInput

SummaryRow

reuse

props

callback flow

state ownership

pure calculations

21st.dev component

============================================================
66. CREATE ASSESSMENT EVIDENCE MATRIX
============================================================

Create:

docs/assessment/p11-evidence-matrix.md

Use columns such as:

Requirement

Evidence file

Code location

Video evidence

Prompt evidence

Status

Notes

Cover all official assessment requirements.

============================================================
67. CREATE VIDEO RECORDING PLAN
============================================================

Create:

docs/assessment/p11-video-recording-plan.md

Structure approximately:

0:00–0:30
Introduction

0:30–1:10
Login + product problem

1:10–2:00
Runway Setup

2:00–2:50
Protect Essentials

2:50–3:40
Runway Result

3:40–4:50
Purchase Check + within preview

4:50–5:30
Exceeds branch

5:30–6:20
Explicit confirmation + updated runway

6:20–7:00
Responsive / ethics summary

7:00–8:00
Cline starting prompt / Plan vs Act

8:00–9:00
Three custom components + reuse

9:00–9:40
Props down / callbacks up

9:40–10:00
21st.dev component + closing

Adjust only if actual assessment timing/evidence supports a better division.

Do not fabricate Cline content if missing.

Mark missing sections as NEED EVIDENCE.

============================================================
68. CREATE PROMPT DOCUMENT OUTLINE
============================================================

Create:

docs/assessment/p11-prompt-document-outline.md

This is NOT yet the final Word/PDF.

It is the evidence-complete source outline.

Include:

Title

Student

Project

Starting Prompt

Starting Prompt Annotation

Follow-up Prompt #1

What it fixed

Follow-up Prompt #2

What it fixed

Follow-up Prompt #3 if relevant

Three Custom Components

Component 1 prompt

reuse evidence

Component 2 prompt

reuse evidence

Component 3 prompt

reuse evidence

21st.dev integration prompt

21st.dev source

Final reflection if useful

Do not fill missing authentic prompt evidence with invented text.

Use:

MISSING AUTHENTIC CLINE EVIDENCE

where necessary.

============================================================
69. CLINE EVIDENCE GAP PLAN
============================================================

If authentic Cline evidence is incomplete:

create a section:

Required Cline Evidence Before Recording

List the minimum legitimate actions still required.

Examples:

- open project in Cline
- use Plan mode with authentic project starting prompt
- use Act mode
- review/refine FormSection
- review/refine MoneyInput
- review/refine SummaryRow
- run one legitimate accessibility/refactoring follow-up
- preserve resulting prompts/screenshots/history

Only recommend actions that are academically honest.

Do not tell the student to pretend earlier Codex work occurred in Cline.

============================================================
70. DO NOT REBUILD COMPONENTS JUST FOR EVIDENCE
============================================================

P11 must not arbitrarily rewrite good components merely to manufacture evidence.

If Cline evidence is missing:

flag the evidence gap.

Any later Cline interaction should perform legitimate:

review

refinement

verification

or small justified improvement

not fake historical recreation.

============================================================
71. FINAL SOURCE FILE AUDIT
============================================================

Audit human-authored src files for:

headers

correct student name

correct project name

valid UTF-8 text

no obvious typo

no misleading comments

Do not turn P11 into another broad comment rewrite unless a defect is found.

============================================================
72. UNUSED IMPORT / DEAD CODE AUDIT
============================================================

Use lint/compiler evidence plus source inspection.

Identify obvious:

unused imports

dead temporary functions

unused components

obsolete P1/P2 preview code

Remove only when clearly safe.

Do not remove assessment evidence docs.

============================================================
73. UNUSED ASSET AUDIT
============================================================

Inspect:

src/assets/

and runtime asset usage.

Identify clearly unused starter/demo assets.

If an asset such as an old starter:

hero.png

still exists and is definitely unused:

report it.

Remove only if safely verified unused and not needed as evidence.

============================================================
74. PUBLIC / DIST AUDIT
============================================================

Inspect:

public/

dist/

Determine whether dist is generated output.

Do not include dist in final submission ZIP unless assignment/project convention
requires it.

Preferred source submission normally excludes generated dist.

Document decision.

============================================================
75. NODE_MODULES SUBMISSION RULE
============================================================

Final project ZIP MUST NOT contain:

node_modules/

Verify:

.gitignore

and final packaging process.

Do not delete local node_modules unless necessary.

Packaging should exclude it.

============================================================
76. SECRET AUDIT
============================================================

Search for:

.env
.env.local
API keys
tokens
passwords
credentials

Do not expose secret values in documentation.

If no secrets exist:

report PASS.

============================================================
77. PACKAGE MANIFEST AUDIT
============================================================

Inspect:

package.json

Verify dependencies are justified.

Expected notable runtime dependencies include:

react

react-dom

react-router-dom

framer-motion

Do not remove required P3 dependency.

Identify accidental packages if any.

============================================================
78. PACKAGE LOCK CONSISTENCY
============================================================

Ensure:

package-lock.json

matches package.json.

Do not regenerate dependencies unnecessarily.

============================================================
79. FINAL LINT
============================================================

Run:

npm run lint

Required:

PASS

Do not suppress lint rules.

============================================================
80. FINAL BUILD
============================================================

Run:

npm run build

Required:

PASS

============================================================
81. FINAL DEV SERVER
============================================================

Run:

npm run dev

Verify actual Vite URL.

Perform final browser verification.

Stop server afterward if appropriate.

============================================================
82. RESPONSIVE FINAL CHECK
============================================================

Final spot-check at minimum:

390px

1280px

for:

/login
/setup
/essentials
/runway
/purchase
/result

Do not redo full P9 unless regression appears.

============================================================
83. KEYBOARD FINAL CHECK
============================================================

Spot-check keyboard journey through:

Login

Setup

Essentials

Purchase

Result confirmation

Confirm:

no obvious keyboard trap

focus visible

============================================================
84. FINAL BUSINESS REGRESSION MATRIX
============================================================

Verify:

Protected Total:

Expected 735

Runway:

Expected 215

Shortfall:

Expected 84

Purchase 160:

Expected 55 / false

Purchase 215:

Expected 0 / false

Purchase 300:

Expected 0 / true / excess 85

Confirm:

Expected Available 790

Updated Runway:

Expected 55

============================================================
85. COMPONENT REUSE FINAL MATRIX
============================================================

Document actual current usage:

Component

Screen 1

Screen 2

Additional screens

PASS/FAIL

Required components:

FormSection

MoneyInput

SummaryRow

============================================================
86. STATUSACTIONBUTTON FINAL EVIDENCE
============================================================

Document:

source

source URL

final file

screen location

role

provenance

dependency

adaptation

accessibility

============================================================
87. NO FALSE SCREENSHOT CLAIMS
============================================================

If screenshots have not been explicitly captured:

do not say:

Screenshot captured.

Instead say:

Screenshot recommended / pending.

P11 can define what screenshots should be captured.

============================================================
88. SCREENSHOT EVIDENCE PLAN
============================================================

Create a concise capture checklist in the evidence matrix.

Recommended browser screenshots:

1. Login

2. Runway Setup desktop

3. Protect Essentials

4. Runway Result canonical 215

5. Runway shortfall 84

6. Purchase Check

7. Within preview 55

8. Exceeds preview 85

9. Confirmed result 55

10. Mobile responsive example

11. reusable component code

12. 21st.dev source/component evidence

13. Cline Plan mode

14. Cline Act mode

Only mark Cline captures available if authentic.

============================================================
89. SUBMISSION ZIP PREPARATION
============================================================

Prepare a submission-ready ZIP ONLY after the final code QA passes.

Do not package:

node_modules/

dist/

.git/

temporary IDE files

secret environment files

unrelated screenshots unless intentionally part of coursework evidence

Do include source project files needed to install/build/run.

============================================================
90. ZIP CONTENTS
============================================================

Expected ZIP should include approximately:

src/

public/

docs/ if appropriate for evidence

package.json

package-lock.json

vite config

tailwind config

tsconfig files

eslint config

index.html

README if present

.gitignore may remain

Do not include absolute local paths as runtime dependencies.

============================================================
91. ZIP NAME
============================================================

If creating a final candidate ZIP, use a clear name such as:

Student_Money_Runway_BUS4012_AS02_Project.zip

Do not overwrite any existing submission ZIP without verifying first.

============================================================
92. ZIP VALIDATION
============================================================

After creating ZIP:

inspect its file list.

Confirm:

node_modules absent

dist absent unless intentionally required

.git absent

secrets absent

src present

package.json present

package-lock present

configs present

============================================================
93. CLEAN INSTALL READINESS
============================================================

Do NOT delete current node_modules.

But inspect whether a fresh recipient should be able to run:

npm install

npm run build

npm run dev

from the extracted source project.

Do not claim a clean install test unless actually performed.

If practical and safe, a separate temporary-directory clean-install validation
may be performed.

If not performed:

state:

NOT TESTED

rather than fabricating it.

============================================================
94. README AUDIT
============================================================

If repository has a README:

verify it does not contain outdated starter Vite instructions that contradict
the project.

If no project README exists:

do NOT create a large README solely for appearance.

A concise project README MAY be created if genuinely useful for submission.

If created, include:

project name

student

requirements

install

run

build

routes

brief MVP description

No assessment-inflation claims.

============================================================
95. SOURCE TIMESTAMP STANDARD
============================================================

All P11-created human-authored documentation follows:

Australia/Melbourne

Windows/.NET:

AUS Eastern Standard Time

Do not use Vietnam time directly.

Do not guess offset.

Existing source createdAt values remain preserved.

============================================================
96. P11 DOCUMENTATION
============================================================

Create:

docs/implementation/p11-final-qa-assessment-evidence.md

Use:

# P11 — Final QA and Assessment Evidence

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P11 — Final QA + Assessment Evidence
> Created: <actual Melbourne filesystem timestamp>
> Updated: <actual Melbourne filesystem timestamp>

Document:

1. final QA scope
2. Git baseline status
3. source audit
4. runtime regression
5. business regression
6. responsive spot-check
7. keyboard/accessibility spot-check
8. reusable component evidence
9. 21st.dev evidence
10. props/callback evidence
11. prompt evidence
12. Cline evidence
13. video evidence readiness
14. Prompt Document readiness
15. ZIP readiness
16. remaining assessment gaps
17. final verdict

============================================================
97. ASSESSMENT READINESS CATEGORIES
============================================================

Evaluate separately:

CODE READY

YES / NO

VIDEO EVIDENCE READY

YES / NO

PROMPT DOCUMENT READY

YES / NO

CLINE EVIDENCE READY

YES / NO

SUBMISSION ZIP READY

YES / NO

OVERALL ASSESSMENT READY

YES / NO

============================================================
98. CODE READY CRITERIA
============================================================

CODE READY requires:

[ ] lint PASS

[ ] build PASS

[ ] full flow works

[ ] canonical calculations correct

[ ] validation works

[ ] responsive structure intact

[ ] no runtime errors

[ ] no mojibake

[ ] no unfinished placeholders

[ ] no debug leakage

============================================================
99. REUSABLE COMPONENT CRITERIA
============================================================

[ ] FormSection custom component exists

[ ] FormSection reused ≥2 screens

[ ] MoneyInput custom component exists

[ ] MoneyInput reused ≥2 screens

[ ] SummaryRow custom component exists

[ ] SummaryRow reused ≥2 screens

[ ] actual source evidence recorded

============================================================
100. 21ST.DEV CRITERIA
============================================================

[ ] genuine 21st.dev source identified

[ ] provenance retained

[ ] original prompt/instruction evidence retained

[ ] component integrated visibly

[ ] final application use demonstrated

[ ] source is separate from three custom components

============================================================
101. PROPS / CALLBACK CRITERIA
============================================================

[ ] parent identified

[ ] child identified

[ ] props identified

[ ] callback identified

[ ] data owner identified

[ ] student can explain flow simply

============================================================
102. PROMPT DOCUMENT READY CRITERIA
============================================================

[ ] authentic starting prompt identified

[ ] 3–5 sentence annotation can be written from evidence

[ ] 2–3 authentic follow-up prompts identified

[ ] what each follow-up fixed is documented

[ ] custom component prompts available

[ ] custom reuse evidence available

[ ] 21st.dev prompt/instruction available

Do NOT mark READY if required evidence is missing.

============================================================
103. CLINE EVIDENCE READY CRITERIA
============================================================

[ ] authentic Cline interaction exists

[ ] Cline Plan mode evidence exists

[ ] Cline Act mode evidence exists

[ ] full starting prompt exists in Cline evidence

[ ] 2–3 follow-up interactions exist

[ ] component-related Cline evidence exists

Do not reinterpret Codex logs as Cline evidence.

============================================================
104. VIDEO READY CRITERIA
============================================================

[ ] full application flow stable

[ ] reusable components demonstrable

[ ] 21st.dev component demonstrable

[ ] props/callback code demonstrable

[ ] ethics talking points available

[ ] Cline evidence demonstrable

[ ] recording plan exists

============================================================
105. SUBMISSION ZIP READY CRITERIA
============================================================

[ ] project ZIP created or packaging procedure verified

[ ] node_modules absent

[ ] secrets absent

[ ] source included

[ ] package manifests included

[ ] generated junk excluded

[ ] ZIP contents audited

============================================================
106. FINAL GIT DIFF
============================================================

After P11 documentation/evidence files are created:

run:

git status

git diff

If baseline commit exists:

review P11 changes.

P11 should primarily contain:

final QA fixes if any

assessment docs

submission packaging metadata

No major feature implementation.

============================================================
107. OPTIONAL P11 COMMIT
============================================================

If:

- Git identity is valid
- P11 final audit passes
- P11 changes are safe
- no unresolved code defects remain

you MAY create a final P11 commit:

git add .

review staging

then:

git commit -m "docs: complete P11 final QA and assessment evidence"

Do NOT commit the generated submission ZIP if it is not intended for repository
tracking.

Do NOT commit node_modules/dist.

If evidence gaps remain:

it is still acceptable to commit truthful P11 audit documentation, but do not
label the project assessment-ready in commit text.

============================================================
108. FINAL REPORT FORMAT
============================================================

Return:

A. Git baseline

- baseline existed? YES/NO
- commit created? YES/NO
- commit hash
- identity issue if blocked
- final working tree status

------------------------------------------------------------

B. Repository/source audit

- human-authored source count
- placeholders
- TODO/FIXME
- debug code
- mojibake
- unused temporary assets/files

------------------------------------------------------------

C. Final functional flow

Report PASS/FAIL:

Login

Setup

Essentials

Runway

Purchase

Result

Confirmation

------------------------------------------------------------

D. Business regression

Table:

Case
Expected
Actual
PASS/FAIL

Include:

Protected 735

Runway 215

Shortfall 84

Purchase 160 → 55

Purchase 215 → 0 / false

Purchase 300 → 85 excess

Confirm 950 → 790

Updated Runway 55

------------------------------------------------------------

E. Responsive / accessibility spot-check

------------------------------------------------------------

F. Reusable component evidence

Table:

Component
Custom?
Screen 1
Screen 2
Additional
PASS/FAIL

------------------------------------------------------------

G. 21st.dev evidence

- source
- component
- URL
- prompt evidence
- final usage
- provenance status

------------------------------------------------------------

H. Props-down / callbacks-up evidence

Show actual current code path.

------------------------------------------------------------

I. Prompt evidence inventory

- starting prompt
- follow-ups
- P2 component prompts
- P3 21st.dev prompt
- missing items

------------------------------------------------------------

J. Cline evidence audit

Table:

Requirement
Evidence
Status

Use:

PASS
PARTIAL
MISSING

Do not fabricate.

------------------------------------------------------------

K. Video readiness

- recording plan path
- missing captures
- missing Cline evidence
- reusable component evidence
- 21st.dev evidence
- props/callback example

------------------------------------------------------------

L. Prompt Document readiness

- outline path
- evidence completeness
- missing authentic evidence

------------------------------------------------------------

M. Rubric traceability

Path:

docs/assessment/p11-rubric-traceability.md

Summarise major strengths and gaps.

------------------------------------------------------------

N. Evidence matrix

Path:

docs/assessment/p11-evidence-matrix.md

------------------------------------------------------------

O. Submission ZIP

- created? YES/NO
- path
- filename
- node_modules included? MUST BE NO
- dist included?
- .git included? MUST BE NO
- secrets included? MUST BE NO
- source present?
- package manifests present?

------------------------------------------------------------

P. npm run lint

PASS / FAIL

------------------------------------------------------------

Q. npm run build

PASS / FAIL

------------------------------------------------------------

R. Browser/runtime QA

- Vite URL
- runtime errors
- console status

------------------------------------------------------------

S. Files created

------------------------------------------------------------

T. Files modified

------------------------------------------------------------

U. Final readiness matrix

CODE READY:
YES / NO

REUSABLE COMPONENT EVIDENCE READY:
YES / NO

21ST.DEV EVIDENCE READY:
YES / NO

CLINE EVIDENCE READY:
YES / NO

PROMPT DOCUMENT READY:
YES / NO

VIDEO READY:
YES / NO

SUBMISSION ZIP READY:
YES / NO

OVERALL ASSESSMENT READY:
YES / NO

------------------------------------------------------------

V. Blocking issues

If none:

NONE

If any:

number them by severity.

------------------------------------------------------------

W. Exact next actions

If assessment is not ready:

give the minimum ordered steps required.

Do not recommend unnecessary product changes.

============================================================
109. FINAL VERDICT RULE
============================================================

There are THREE possible final statuses.

If code itself still has defects:

finish exactly:

P11 FINAL QA FAILED — CODE FIXES REQUIRED

If code passes but required authentic assessment evidence is incomplete,
especially Cline evidence:

finish exactly:

P11 CODE READY — ASSESSMENT EVIDENCE INCOMPLETE

Only if BOTH code AND all required assessment evidence are genuinely ready:

finish exactly:

READY TO RECORD VIDEO