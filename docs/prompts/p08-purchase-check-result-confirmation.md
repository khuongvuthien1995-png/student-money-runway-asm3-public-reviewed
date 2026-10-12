# BUS4012 ASM2 — STUDENT MONEY RUNWAY
# P8 — PURCHASE CHECK + RESULT + EXPLICIT CONFIRMATION
# UNIVERSAL MASTER IMPLEMENTATION PROMPT
#
# Student: Thien Khuong Vu
# Recommended model: GPT-5.6 Terra — HIGH
#
# EXECUTION MODE:
# INSPECT → RECONCILE → PLAN → IMPLEMENT → VERIFY → DOCUMENT → STOP
#
# ============================================================
# CRITICAL P8 PRODUCT BOUNDARY
# ============================================================
#
# Purchase preview MUST NOT mutate recorded financial state.
#
# Only an explicit successful confirmation action:
#
# "Mark as spent"
#
# may mutate the recorded financial state.
#
# This is a HARD invariant.
#
# P8 completes:
#
# /runway
#    ↓
# /purchase
#    ↓
# /result
#
# P8 implements:
#
# 1. Purchase Check controlled form
# 2. Purchase name
# 3. Purchase amount
# 4. Purchase validation
# 5. Purchase Impact Preview
# 6. Within-runway result branch
# 7. Exceeds-runway result branch
# 8. Back Without Saving
# 9. Real StatusActionButton integration
# 10. Explicit "Mark as spent" mutation
# 11. Confirmed-success state
# 12. Updated runway after confirmation
#
# Do NOT continue to P9.
#
# Do NOT perform the final responsive parity audit.
# Do NOT perform the full P10 accessibility/ethics hardening pass.
# Do NOT perform P11 assessment packaging.
#
# ============================================================
# 0. ROLE
# ============================================================
#
# Act simultaneously as:
#
# - Senior React Developer
# - Frontend Software Architect
# - TypeScript Engineer
# - State Mutation Reviewer
# - Financial Business Logic Reviewer
# - UI/UX Implementation Engineer
# - Accessibility Reviewer
# - Security/Privacy Reviewer
# - BUS4012 Vibe Coding implementation assistant
#
# You are continuing an existing BUS4012 university coursework repository.
#
# Your responsibility in P8 is to complete the Student Money Runway core MVP
# purchase-check workflow without violating the already-approved P5-P7
# architecture.
#
# The most important architectural distinction in this phase is:
#
# PREVIEW
# !=
# CONFIRMATION
#
# A preview is derived information only.
#
# Confirmation is the only operation allowed to record the purchase into the
# current financial session.
#
# ============================================================
# 1. PROJECT
# ============================================================
#
# Project:
#
# Student Money Runway
#
# Course:
#
# BUS4012 — Vibe Coding for Startups
#
# Assessment:
#
# Assignment 02 — MVP Development
#
# Repository:
#
# C:\Dev\BUS4012\student-money-runway-mvp
#
# Student:
#
# Thien Khuong Vu
#
# Current phase:
#
# P8 — Purchase Check + Result + Explicit Confirmation
#
# ============================================================
# 2. COMPLETED BASELINE
# ============================================================
#
# The following phases are COMPLETE:
#
# P0
# Development Environment
#
# P0.5
# Figma Reference Curation
#
# P1
# Design System
#
# P2
# Reusable UI Kit
#
# P2A
# FormSection
#
# P2B
# MoneyInput
#
# P2C
# SummaryRow
#
# P3
# 21st.dev StatusActionButton integration
#
# P4
# Router + Page Skeletons
#
# P5
# State Model + Pure Business Logic
#
# P6
# Login + Runway Setup
#
# P7
# Protect Essentials + Runway Result
#
# P7 FINAL GATE:
#
# PASS
#
# Verified:
#
# Protected Total = 735
# Runway = 215
# Shortfall = 84
#
# No mutable derived financial state exists.
#
# Do NOT rebuild or replace the P0-P7 architecture.
#
# ============================================================
# 3. READ BINDING CONTEXT FIRST
# ============================================================
#
# Before modifying anything, read:
#
# docs/prompts/00-master-project-context.md
#
# Then read:
#
# docs/implementation/p1-design-system-mapping.md
# docs/implementation/p2-component-matrix.md
# docs/implementation/p3-21st-dev-integration.md
# docs/implementation/p4-route-map.md
# docs/implementation/p5-state-and-calculation-model.md
# docs/implementation/p6-login-and-runway-setup.md
# docs/implementation/p7-protect-essentials-runway-result.md
#
# Read:
#
# docs/figma-reference/README.md
#
# Inspect this P8 prompt if already saved:
#
# docs/prompts/p08-purchase-check-result-confirmation.md
#
# ============================================================
# 4. INSPECT CURRENT SOURCE
# ============================================================
#
# Inspect before changing:
#
# src/App.tsx
#
# src/pages/RunwayResultPage.tsx
# src/pages/PurchaseCheckPage.tsx
# src/pages/ResultPage.tsx
#
# src/components/ui/FormSection.tsx
# src/components/ui/MoneyInput.tsx
# src/components/ui/SummaryRow.tsx
# src/components/ui/StatusActionButton.tsx
#
# src/components/layout/AppShell.tsx
#
# src/types/runway.ts
#
# src/utils/runwayCalculations.ts
# src/utils/moneyValidation.ts
#
# Inspect any currency/date/display helper introduced during P7.
#
# Do not assume APIs.
#
# Read the actual current source first.
#
# ============================================================
# 5. FIGMA REFERENCES
# ============================================================
#
# Inspect the approved curated Figma references for:
#
# P5 — Purchase Check desktop
#
# M-P5 — Purchase Check mobile
#
# P6 — Purchase Impact Preview desktop
#
# M-P6 — Purchase Impact Preview mobile
#
# Also inspect:
#
# updated success state references
#
# E1 / failure or exceeds-runway visual language
#
# DS-03 — Forms & Core Controls
#
# DS-04 — Financial Components
#
# DS-06 — Feedback & Accessibility
#
# DS-08 — Responsive Architecture
#
# Use actual repository file names.
#
# Do not invent visual behaviour that contradicts curated sources.
#
# ============================================================
# 6. GIT SAFETY
# ============================================================
#
# Before implementation run:
#
# git status
#
# If a Git baseline exists:
#
# git diff
#
# Do not overwrite unrelated user work.
#
# Do not automatically commit.
#
# ============================================================
# 7. SOURCE PRIORITY
# ============================================================
#
# Follow:
#
# 1. BUS4012 ASM2 official requirements
# 2. Locked Student Money Runway ASM1 business logic
# 3. docs/prompts/00-master-project-context.md
# 4. approved P1-P7 implementation documentation
# 5. curated Hi-Fi Figma references
# 6. current repository source
# 7. implementation judgement
#
# Do not silently alter product semantics.
#
# ============================================================
# 8. BUS4012 THEORY BASIS
# ============================================================
#
# P8 must continue demonstrating:
#
# CONTROLLED INPUT
#
# value
# +
# onChange
#
# PROPS DOWN
#
# App
#  ↓
# PurchaseCheckPage
#  ↓
# MoneyInput
#
# CALLBACKS UP
#
# MoneyInput
#  ↑
# PurchaseCheckPage
#  ↑
# App
#
# PURE BUSINESS LOGIC
#
# source state
#   ↓
# validated number boundary
#   ↓
# pure calculation utilities
#   ↓
# preview
#
# EXPLICIT MUTATION
#
# user confirms
#   ↓
# application source state changes
#
# Do not merge preview and mutation.
#
# ============================================================
# 9. S — SITUATION
# ============================================================
#
# P7 now produces a valid current discretionary runway from:
#
# Available Funds
# Fixed Essentials
# Flexible Essentials
# Safety Buffer
#
# Example:
#
# Available Funds = 950
# Protected Total = 735
# Current Runway = 215
#
# P8 allows the user to enter a proposed purchase and see its impact BEFORE
# recording it.
#
# ============================================================
# 10. C — CHALLENGE
# ============================================================
#
# Complete:
#
# Runway Result
#       ↓
# Purchase Check
#       ↓
# Purchase Impact Preview
#
# without changing current recorded financial state during preview.
#
# Only:
#
# Mark as spent
#
# may record an eligible purchase.
#
# ============================================================
# 11. A — AUDIENCE
# ============================================================
#
# Primary audience:
#
# International university students in Australia managing short-horizon living
# expenses.
#
# Copy must remain:
#
# factual
# calm
# transparent
# non-judgmental
#
# The system calculates.
#
# It does NOT recommend purchases.
#
# ============================================================
# 12. F — FORMAT / STACK
# ============================================================
#
# Use existing:
#
# React
# TypeScript
# Vite
# React Router DOM v6
# Tailwind CSS v3
# Framer Motion already installed for P3
#
# Add:
#
# NO NEW PACKAGES
#
# Do NOT install:
#
# state frameworks
# validation frameworks
# currency libraries
# toast libraries
# modal libraries
# backend packages
#
# ============================================================
# 13. LOCKED P5 SOURCE STATE
# ============================================================
#
# Existing RunwayState source fields include:
#
# availableFunds: string
# planningDate: string
# safetyBuffer: string
# fixedEssentials: string
# flexibleEssentials: string
# purchaseName: string
# purchaseAmount: string
# purchaseConfirmed: boolean
#
# Preserve this architecture unless an actual defect is discovered.
#
# Do NOT create mutable:
#
# purchaseRemaining
# purchaseExcess
# purchaseExceedsRunway
# runwayBeforePurchase
#
# These are derived values.
#
# ============================================================
# 14. PURCHASE CHECK PAGE
# ============================================================
#
# Route:
#
# /purchase
#
# Turn the existing P4 skeleton into the final controlled Purchase Check form.
#
# Required user inputs:
#
# Purchase Name
#
# Purchase Amount
#
# Also show current discretionary runway as context.
#
# ============================================================
# 15. PURCHASE NAME
# ============================================================
#
# Use a semantic text input.
#
# Bind it to:
#
# runwayState.purchaseName
#
# through the existing App-owned state callback architecture.
#
# Do NOT create a second authoritative local purchase-name state.
#
# Local:
#
# touched
# errors
#
# are allowed.
#
# ============================================================
# 16. PURCHASE NAME VALIDATION
# ============================================================
#
# Purchase Name is required.
#
# A whitespace-only value is invalid.
#
# Example factual error:
#
# "Enter a purchase name."
#
# Do not invent unnecessary category classification.
#
# Do not add merchant/database functionality.
#
# ============================================================
# 17. PURCHASE AMOUNT
# ============================================================
#
# Use the existing:
#
# MoneyInput
#
# Bind:
#
# value={runwayState.purchaseAmount}
#
# Send updates through:
#
# onRunwayStateChange(...)
#
# Do NOT create a page-specific PurchaseAmountInput.
#
# ============================================================
# 18. PURCHASE MONEY VALIDATION
# ============================================================
#
# Reuse the approved P6/P7 monetary-input validation contract wherever possible.
#
# But Purchase Amount has one additional business rule:
#
# Purchase Amount MUST be greater than 0.
#
# Unlike:
#
# Safety Buffer
# Fixed Essentials
# Flexible Essentials
#
# where zero may be valid,
#
# a proposed purchase of:
#
# 0
#
# is not a meaningful purchase preview.
#
# Therefore:
#
# purchaseAmount > 0
#
# is required.
#
# ============================================================
# 19. PURCHASE AMOUNT INVALID CASES
# ============================================================
#
# Reject:
#
# empty
#
# malformed number
#
# negative
#
# zero
#
# non-finite
#
# unsupported precision according to the already-established money-input
# contract
#
# Do NOT silently convert invalid values to zero.
#
# ============================================================
# 20. PURCHASE FORM VALID SUBMISSION
# ============================================================
#
# On valid submission:
#
# navigate:
#
# /purchase
#    ↓
# /result
#
# IMPORTANT:
#
# This action MUST NOT alter:
#
# availableFunds
#
# fixedEssentials
#
# flexibleEssentials
#
# safetyBuffer
#
# It MUST NOT record spending.
#
# It is PREVIEW ONLY.
#
# ============================================================
# 21. PREVIEW INVARIANT
# ============================================================
#
# Before and after navigating:
#
# /purchase
# → /result
#
# current recorded Available Funds must remain identical.
#
# Example:
#
# Before preview:
#
# availableFunds = "950"
#
# Purchase:
#
# 160
#
# After preview:
#
# availableFunds must STILL be:
#
# "950"
#
# until explicit confirmation.
#
# ============================================================
# 22. EXISTING PURCHASE CALCULATION FUNCTIONS
# ============================================================
#
# Inspect:
#
# src/utils/runwayCalculations.ts
#
# Reuse:
#
# calculatePurchaseRemaining
#
# doesPurchaseExceedRunway
#
# calculatePurchaseExcess
#
# if calculatePurchaseExcess exists from P5.
#
# Do not duplicate purchase arithmetic in page JSX.
#
# ============================================================
# 23. PURCHASE PREVIEW FORMULAS
# ============================================================
#
# Current Runway:
#
# R
#
# Proposed Purchase:
#
# P
#
# Remaining Runway:
#
# MAX(0, R - P)
#
# Purchase Exceeds:
#
# P > R
#
# Excess:
#
# MAX(0, P - R)
#
# Use approved utility functions.
#
# ============================================================
# 24. CANONICAL WITHIN-RUNWAY CASE
# ============================================================
#
# Current Runway:
#
# 215
#
# Purchase:
#
# 160
#
# Expected:
#
# Remaining Runway:
#
# 55
#
# Exceeds:
#
# false
#
# Purchase Excess:
#
# 0
#
# ============================================================
# 25. EXACT-RUNWAY CASE
# ============================================================
#
# Current Runway:
#
# 215
#
# Purchase:
#
# 215
#
# Expected:
#
# Remaining:
#
# 0
#
# Exceeds:
#
# false
#
# This is still within the current discretionary runway.
#
# Confirmation is allowed.
#
# ============================================================
# 26. EXCEEDS-RUNWAY CASE
# ============================================================
#
# Current Runway:
#
# 215
#
# Purchase:
#
# 300
#
# Expected:
#
# Remaining:
#
# 0
#
# Exceeds:
#
# true
#
# Excess:
#
# 85
#
# Confirmation MUST NOT be offered for this branch.
#
# ============================================================
# 27. RESULT PAGE
# ============================================================
#
# Route:
#
# /result
#
# Turn the existing skeleton into the Purchase Impact Preview / Confirmation
# screen.
#
# The page must distinguish:
#
# A. Preview within runway
#
# B. Preview exceeds runway
#
# C. Confirmed purchase success state
#
# These are separate semantic states.
#
# ============================================================
# 28. RESULT PREREQUISITES
# ============================================================
#
# ResultPage must not render invalid output on direct access.
#
# Validate prerequisites.
#
# If earlier financial state is incomplete:
#
# redirect appropriately to:
#
# /setup
#
# or:
#
# /essentials
#
# If purchase draft is incomplete/invalid:
#
# redirect to:
#
# /purchase
#
# Do NOT render:
#
# NaN
# Infinity
# broken currency
# empty purchase result
#
# ============================================================
# 29. RUNWAY BEFORE PURCHASE
# ============================================================
#
# Before confirmation, derive Current Runway from the existing financial source
# state using:
#
# calculateRunway(...)
#
# Do NOT store a mutable runwayBeforePurchase snapshot unless absolutely
# required.
#
# Before confirmation, current source state itself still represents the
# pre-purchase financial state.
#
# Therefore it is sufficient for preview calculations.
#
# ============================================================
# 30. WITHIN-RUNWAY PREVIEW BRANCH
# ============================================================
#
# If:
#
# purchaseAmount <= currentRunway
#
# show factual status:
#
# "Within your current discretionary runway"
#
# or use exact approved Figma wording.
#
# Show meaningful values such as:
#
# Runway Before
#
# Purchase Amount
#
# Remaining Runway
#
# Use:
#
# SummaryRow
#
# where appropriate.
#
# ============================================================
# 31. WITHIN-RUNWAY LANGUAGE
# ============================================================
#
# Do NOT say:
#
# Safe to buy
#
# Good purchase
#
# You can afford this
#
# Smart choice
#
# Recommended
#
# Use factual language only.
#
# ============================================================
# 32. EXCEEDS-RUNWAY PREVIEW BRANCH
# ============================================================
#
# If:
#
# purchaseAmount > currentRunway
#
# show factual status:
#
# "Exceeds your current discretionary runway"
#
# or exact approved Figma wording.
#
# Show:
#
# Current Runway
#
# Purchase Amount
#
# Amount Above Runway
#
# For canonical:
#
# 215
# 300
# 85
#
# ============================================================
# 33. EXCEEDS BRANCH CONFIRMATION RULE
# ============================================================
#
# DO NOT render an enabled:
#
# Mark as spent
#
# confirmation action for a purchase exceeding current runway.
#
# This product flow does not record the purchase through this preview branch.
#
# Provide:
#
# Edit Purchase
#
# and/or:
#
# Back
#
# according to approved Figma.
#
# Do not provide financial advice.
#
# ============================================================
# 34. BACK WITHOUT SAVING
# ============================================================
#
# Within the eligible preview branch provide the approved:
#
# Back Without Saving
#
# interaction.
#
# It must navigate away WITHOUT mutating recorded financial state.
#
# In particular:
#
# availableFunds must remain unchanged.
#
# purchaseConfirmed must remain false.
#
# No purchase transaction is recorded.
#
# ============================================================
# 35. DRAFT PURCHASE STATE ON BACK
# ============================================================
#
# Do not introduce unnecessary state mutation merely for Back Without Saving.
#
# Preferred behaviour:
#
# preserve purchaseName and purchaseAmount as the user's current draft values
# unless Figma or existing product authority explicitly says to clear them.
#
# The critical invariant is:
#
# recorded financial state remains unchanged.
#
# ============================================================
# 36. STATUSACTIONBUTTON — REAL P8 INTEGRATION
# ============================================================
#
# Inspect:
#
# src/components/ui/StatusActionButton.tsx
#
# This component was sourced/adapted in P3 from:
#
# 21st.dev — Ruixen UI Dynamic Status Button
#
# P8 is its intended real product use.
#
# Integrate it into the eligible within-runway confirmation branch.
#
# User-facing action:
#
# Mark as spent
#
# ============================================================
# 37. STATUSACTIONBUTTON SEMANTICS
# ============================================================
#
# Desired semantic statuses are conceptually:
#
# IDLE
#
# Mark as spent
#
# CONFIRMED / SUCCESS
#
# Marked as spent
#
# A PROCESSING state may exist if required by the component API, but:
#
# do NOT create an artificial network delay.
#
# do NOT add setTimeout merely to show animation.
#
# Business mutation is local and synchronous.
#
# The component must not imply a remote backend operation.
#
# ============================================================
# 38. DO NOT FAKE ASYNC
# ============================================================
#
# Do NOT write:
#
# setTimeout(...)
#
# only to keep:
#
# Confirming...
#
# visible.
#
# Do not create fake loading.
#
# If StatusActionButton supports a success state without fake delay:
#
# use it.
#
# If its current API needs a minimal adaptation to support a controlled success
# state:
#
# make the smallest backwards-compatible change possible.
#
# Preserve 21st.dev provenance.
#
# Document the adaptation.
#
# ============================================================
# 39. EXPLICIT CONFIRMATION MUTATION
# ============================================================
#
# Only when:
#
# purchase is valid
#
# AND:
#
# purchaseAmount <= currentRunway
#
# AND:
#
# user explicitly activates:
#
# Mark as spent
#
# may App-owned source state mutate.
#
# The confirmed purchase must reduce currently available funds.
#
# Conceptually:
#
# newAvailableFunds
# =
# availableFunds
# -
# purchaseAmount
#
# Protected values remain unchanged.
#
# ============================================================
# 40. WHY AVAILABLE FUNDS MUTATES
# ============================================================
#
# The confirmed purchase is discretionary spending already made/recorded in the
# current session.
#
# Therefore reducing Available Funds causes the existing locked formula to
# naturally derive the new Runway.
#
# Example:
#
# Before confirmation:
#
# Available Funds = 950
#
# Protected Total = 735
#
# Runway = 215
#
# Purchase = 160
#
# After confirmation:
#
# Available Funds = 790
#
# Protected Total = 735
#
# Updated Runway = 55
#
# Do NOT directly mutate:
#
# runway = 55
#
# because Runway is derived, not source state.
#
# ============================================================
# 41. CONFIRMATION MUST NOT MUTATE DERIVED STATE
# ============================================================
#
# NEVER add:
#
# setRunway(55)
#
# setPurchaseRemaining(55)
#
# setProtectedTotal(...)
#
# The mutation is to source state only.
#
# Derived values update naturally.
#
# ============================================================
# 42. AVAILABLE FUNDS MONEY PRECISION
# ============================================================
#
# P6/P7 already established a monetary-input precision contract.
#
# When generating the new system-calculated Available Funds value after
# confirmation:
#
# preserve financial precision correctly.
#
# Do not expose binary floating-point artifacts such as:
#
# 789.9999999997
#
# Reconcile with the existing approved money format contract.
#
# Do not install a decimal library.
#
# Use a simple cents-safe or appropriately rounded strategy consistent with
# maximum supported money precision.
#
# Document it.
#
# ============================================================
# 43. CONFIRMED FLAG
# ============================================================
#
# On successful explicit confirmation:
#
# purchaseConfirmed
#
# becomes:
#
# true
#
# This field indicates that the current purchase draft has been explicitly
# recorded.
#
# Do not set it during preview.
#
# ============================================================
# 44. DOUBLE-SUBTRACTION PROTECTION — CRITICAL
# ============================================================
#
# After confirmation:
#
# availableFunds has already been reduced.
#
# Therefore ResultPage MUST NOT take the updated Runway and subtract the same
# purchase a second time.
#
# Example:
#
# Before:
#
# Available = 950
# Runway = 215
# Purchase = 160
#
# Confirm:
#
# Available becomes 790
#
# New derived Runway becomes 55
#
# WRONG:
#
# 55 - 160
#
# RIGHT:
#
# confirmed-success branch treats:
#
# 55
#
# as the already-updated discretionary runway.
#
# This is a HARD P8 invariant.
#
# ============================================================
# 45. RESULT STATE MACHINE
# ============================================================
#
# Implement a simple conceptual state distinction:
#
# purchaseConfirmed === false
#      │
#      ├── purchase <= runway
#      │       ↓
#      │   WITHIN PREVIEW
#      │
#      └── purchase > runway
#              ↓
#          EXCEEDS PREVIEW
#
# purchaseConfirmed === true
#      │
#      ↓
# CONFIRMED SUCCESS
#
# Do not recompute pre-confirm purchase preview arithmetic inside the confirmed
# success branch.
#
# ============================================================
# 46. CONFIRMED SUCCESS BRANCH
# ============================================================
#
# After successful confirmation:
#
# render a clear confirmed state using the updated financial source state.
#
# Suitable factual concepts:
#
# Purchase recorded
#
# Purchase:
# AUD 160
#
# Updated discretionary runway:
# AUD 55
#
# Use exact approved Figma success wording if available.
#
# Do not say:
#
# Great choice!
#
# Smart spending!
#
# ============================================================
# 47. KEEP PURCHASE NAME / AMOUNT FOR CONFIRMATION DISPLAY
# ============================================================
#
# It is acceptable to preserve:
#
# purchaseName
# purchaseAmount
#
# after confirmation so the success state can identify what was recorded.
#
# Do NOT use them to subtract again.
#
# They become descriptive information for the current confirmed action.
#
# ============================================================
# 48. CHECK ANOTHER PURCHASE
# ============================================================
#
# If the approved Figma/product flow provides a clear next action after
# confirmation, a small:
#
# Check another purchase
#
# action may:
#
# reset:
#
# purchaseName = ""
# purchaseAmount = ""
# purchaseConfirmed = false
#
# and navigate:
#
# /purchase
#
# Implement this only if it fits the approved success flow.
#
# Do not reset:
#
# availableFunds
# fixedEssentials
# flexibleEssentials
# safetyBuffer
#
# The confirmed financial mutation must remain recorded.
#
# ============================================================
# 49. RETURN TO RUNWAY
# ============================================================
#
# A confirmed-success action may also allow:
#
# View updated runway
#
# or equivalent Figma-supported navigation to:
#
# /runway
#
# Since availableFunds is now reduced, RunwayResultPage should automatically
# derive the updated Runway.
#
# Canonical:
#
# 55
#
# ============================================================
# 50. NEW PURCHASE AFTER CONFIRMATION
# ============================================================
#
# Ensure a future purchase preview starts with:
#
# purchaseConfirmed = false
#
# before evaluating a new draft.
#
# Do not let a prior confirmed flag cause all future ResultPage visits to show
# success.
#
# Use the smallest explicit reset point.
#
# A reasonable location is:
#
# "Check another purchase"
#
# or when intentionally starting a fresh purchase flow.
#
# Do NOT reset confirmed status during ordinary render.
#
# ============================================================
# 51. DO NOT RESET ON COMPONENT MOUNT
# ============================================================
#
# Avoid:
#
# useEffect(() => {
#   resetPurchase()
# }, [])
#
# merely because a page mounted.
#
# This can destroy state during navigation and StrictMode behaviour.
#
# State resets must follow explicit user actions.
#
# ============================================================
# 52. PURCHASE CHECK CURRENT RUNWAY CONTEXT
# ============================================================
#
# PurchaseCheckPage should derive and display the current discretionary runway.
#
# Use P5:
#
# calculateRunway(...)
#
# from valid source financial state.
#
# Do not store a copy in purchase form state.
#
# ============================================================
# 53. PURCHASE PAGE DIRECT ACCESS
# ============================================================
#
# If a fresh session directly visits:
#
# /purchase
#
# and required prior financial values are missing:
#
# redirect deterministically:
#
# missing Setup
# → /setup
#
# missing Essentials
# → /essentials
#
# Do not render fake:
#
# AUD 0
#
# for incomplete prerequisites.
#
# ============================================================
# 54. RESULT PAGE DIRECT ACCESS
# ============================================================
#
# If:
#
# /result
#
# is visited without a valid purchase draft:
#
# redirect:
#
# /purchase
#
# if financial prerequisites are valid.
#
# If financial prerequisites are also missing:
#
# redirect to the earliest required step.
#
# Do not create a complex guard framework.
#
# ============================================================
# 55. MONEYINPUT REUSE
# ============================================================
#
# Purchase Amount must use:
#
# MoneyInput
#
# This gives real visible reuse across:
#
# Runway Setup
#
# Protect Essentials
#
# Purchase Check
#
# Do not create another money component.
#
# ============================================================
# 56. FORMSECTION REUSE
# ============================================================
#
# Use:
#
# FormSection
#
# on Purchase Check if it naturally matches approved Figma.
#
# Do not force it if the Figma uses one consolidated surface and FormSection
# would distort the design.
#
# Preserve truthful component reuse.
#
# ============================================================
# 57. SUMMARYROW REUSE
# ============================================================
#
# Use:
#
# SummaryRow
#
# where appropriate on:
#
# Purchase Check
#
# and/or:
#
# Result
#
# to display:
#
# Current Runway
#
# Purchase Amount
#
# Remaining Runway
#
# Amount Above Runway
#
# Do not create parallel summary-row markup manually.
#
# ============================================================
# 58. ASSESSMENT COMPONENT REUSE
# ============================================================
#
# By P8, verify actual rendered reuse:
#
# FormSection:
#
# Runway Setup
# Protect Essentials
# possibly Purchase Check where appropriate
#
# MoneyInput:
#
# Runway Setup
# Protect Essentials
# Purchase Check
#
# SummaryRow:
#
# Protect Essentials
# Runway Result
# Purchase Result
#
# StatusActionButton:
#
# real final use:
# Purchase Result confirmation
#
# Document actual evidence only.
#
# ============================================================
# 59. P3 COMPONENT PROVENANCE
# ============================================================
#
# Do not remove or obscure:
#
# 21st.dev provenance
#
# from StatusActionButton source/documentation.
#
# If materially modifying it:
#
# preserve:
#
# @source
#
# and original createdAt.
#
# Update updatedAt according to project convention.
#
# Document exactly what P8 changed.
#
# ============================================================
# 60. STATUSACTIONBUTTON API CHANGES
# ============================================================
#
# Prefer consuming the current approved P3 API.
#
# If the current API cannot support real controlled confirmation semantics:
#
# make the smallest justified change.
#
# Any API change must:
#
# remain reusable
#
# remain accessible
#
# not embed Student Money Runway financial calculations inside the button
#
# preserve source provenance
#
# The button must not know:
#
# availableFunds
#
# purchaseAmount
#
# runway formula
#
# It receives state/actions through props.
#
# ============================================================
# 61. BUTTON RESPONSIBILITY
# ============================================================
#
# StatusActionButton may own:
#
# rendering
#
# interaction visuals
#
# status presentation
#
# It must NOT own:
#
# purchase business logic
#
# financial mutation
#
# purchase eligibility calculation
#
# App/page determines whether confirmation is allowed.
#
# ============================================================
# 62. PURCHASE CONFIRMATION CALLBACK FLOW
# ============================================================
#
# Preferred conceptual flow:
#
# ResultPage
#     │
#     │ user presses
#     │ "Mark as spent"
#     ▼
# onConfirmPurchase()
#     │
#     ▼
# App.tsx
#     │
#     ├── validates current purchase eligibility defensively
#     │
#     ├── reduces availableFunds
#     │
#     └── sets purchaseConfirmed = true
#             │
#             ▼
# ResultPage re-renders
#             │
#             ▼
# CONFIRMED SUCCESS
#
# The exact callback naming may follow current architecture.
#
# Keep it typed and simple.
#
# ============================================================
# 63. DEFENSIVE CONFIRMATION
# ============================================================
#
# UI eligibility alone must not be the only protection against invalid
# confirmation.
#
# The confirmation callback should defensively ensure:
#
# purchase amount is valid
#
# financial prerequisites are valid
#
# purchase does not exceed current runway
#
# before mutating availableFunds.
#
# Do not assume button visibility alone guarantees valid state.
#
# ============================================================
# 64. IDEMPOTENCY / DOUBLE CLICK
# ============================================================
#
# Explicitly prevent accidental double subtraction.
#
# Once:
#
# purchaseConfirmed === true
#
# the same purchase must not be confirmable again.
#
# Rapid double-click / repeated activation must not subtract purchase twice.
#
# Use the simplest reliable state guard.
#
# Do not build distributed-lock infrastructure.
#
# ============================================================
# 65. CONFIRM BUTTON DISABLED STATE
# ============================================================
#
# After confirmation:
#
# do not leave an active:
#
# Mark as spent
#
# button capable of firing again.
#
# Confirmed branch should replace or disable the confirmation interaction.
#
# ============================================================
# 66. ETHICAL LANGUAGE
# ============================================================
#
# Search P8 copy for:
#
# safe
# unsafe
# good purchase
# bad purchase
# smart purchase
# can afford
# should buy
# should not buy
# recommended
#
# Replace financial judgement with factual statements.
#
# Approved conceptual language:
#
# Within your current discretionary runway
#
# Exceeds your current discretionary runway
#
# Remaining runway
#
# Amount above runway
#
# Purchase recorded
#
# ============================================================
# 67. NO FINANCIAL ADVICE
# ============================================================
#
# The app may report:
#
# purchase amount
# current runway
# remaining runway
# excess
#
# It must not recommend what the user should do.
#
# ============================================================
# 68. ACCESSIBILITY — PURCHASE FORM
# ============================================================
#
# PurchaseCheckPage requires:
#
# semantic <form>
#
# one h1
#
# real label for Purchase Name
#
# MoneyInput label for Purchase Amount
#
# touched/submission-aware errors
#
# aria-invalid where appropriate
#
# associated error text
#
# visible focus
#
# keyboard submission
#
# correct button types
#
# ============================================================
# 69. ACCESSIBILITY — RESULT
# ============================================================
#
# ResultPage must:
#
# communicate status in text
#
# not rely only on:
#
# green
# orange
# red
#
# make numerical relationships readable
#
# provide keyboard-accessible actions
#
# provide descriptive action labels
#
# ============================================================
# 70. ACCESSIBILITY — STATUS BUTTON
# ============================================================
#
# Ensure StatusActionButton retains:
#
# semantic button behaviour
#
# keyboard activation
#
# accessible label
#
# visible focus
#
# disabled semantics
#
# reduced-motion handling
#
# If status text changes:
#
# avoid noisy duplicated announcements.
#
# ============================================================
# 71. REDUCED MOTION
# ============================================================
#
# Preserve the P3 reduced-motion handling.
#
# Do not reintroduce unnecessary spinner/motion when:
#
# prefers-reduced-motion
#
# is enabled.
#
# ============================================================
# 72. RESPONSIVE — PURCHASE
# ============================================================
#
# P8 is not P9.
#
# But the completed purchase flow must be usable around:
#
# 390px mobile
#
# 1280px desktop
#
# Avoid obvious breakage around:
#
# 768px
# 1024px
#
# No separate mobile/desktop React pages.
#
# ============================================================
# 73. RESPONSIVE — RESULT
# ============================================================
#
# At mobile width:
#
# status remains readable
#
# summary values do not clip
#
# large money values wrap/scale appropriately
#
# actions stack appropriately
#
# 48px interaction targets remain
#
# no horizontal overflow
#
# At desktop:
#
# preserve approved P6 visual hierarchy.
#
# ============================================================
# 74. SOURCE HEADER STANDARD
# ============================================================
#
# Follow:
#
# docs/prompts/00-master-project-context.md
#
# Student:
#
# Thien Khuong Vu
#
# Phase:
#
# P8 — Purchase Check + Result + Explicit Confirmation
#
# Canonical timezone:
#
# Australia/Melbourne
#
# Windows/.NET:
#
# AUS Eastern Standard Time
#
# Never use Vietnam local time directly.
#
# Never guess timestamp offsets.
#
# ============================================================
# 75. EXISTING FILE TIMESTAMPS
# ============================================================
#
# PurchaseCheckPage.tsx
#
# ResultPage.tsx
#
# App.tsx
#
# StatusActionButton.tsx
#
# are existing files.
#
# If materially modified:
#
# preserve original @createdAt
#
# update @updatedAt using the binding Melbourne timestamp convention.
#
# ============================================================
# 76. NEW FILE TIMESTAMPS
# ============================================================
#
# If a new P8 helper is genuinely required:
#
# use actual filesystem timestamps.
#
# Convert to:
#
# Australia/Melbourne
#
# Do not invent timestamps.
#
# ============================================================
# 77. INLINE COMMENT STANDARD
# ============================================================
#
# Comment non-obvious WHY.
#
# GOOD:
#
# // Preview calculations stay derived from the current source state; only the
# // explicit confirmation callback is allowed to reduce available funds.
#
# GOOD:
#
# // Once confirmed, the current runway already reflects the purchase, so the
# // result branch must not subtract the draft amount again.
#
# BAD:
#
# // Calculate purchase.
#
# // Set status.
#
# // Navigate back.
#
# ============================================================
# 78. APP.TSX RESPONSIBILITY
# ============================================================
#
# App.tsx remains:
#
# application route composition
#
# +
#
# shared RunwayState owner
#
# P8 may add typed purchase confirmation callbacks here.
#
# Do not turn App.tsx into a giant financial UI component.
#
# Keep arithmetic delegated to utilities.
#
# ============================================================
# 79. NO MUTATION INSIDE RESULT RENDER
# ============================================================
#
# Never mutate state during render.
#
# Mutation must occur only in explicit event handlers.
#
# Do not write logic equivalent to:
#
# if (purchaseConfirmed) {
#   setAvailableFunds(...)
# }
#
# inside render.
#
# ============================================================
# 80. NO CALCULATION USEEFFECT MUTATION
# ============================================================
#
# Do not use:
#
# useEffect
#
# to automatically record a purchase because a preview became valid.
#
# Preview eligibility is not consent.
#
# Explicit user action is mandatory.
#
# ============================================================
# 81. NO AUTOMATIC CONFIRMATION
# ============================================================
#
# Navigating to:
#
# /result
#
# must never auto-confirm a purchase.
#
# Reloading:
#
# /result
#
# must never auto-confirm.
#
# A valid within-runway preview is still only a preview.
#
# ============================================================
# 82. NO PERMANENT STORAGE
# ============================================================
#
# Do not add:
#
# localStorage
#
# sessionStorage
#
# IndexedDB
#
# database
#
# backend
#
# Purchase recording exists only in the current in-memory React session.
#
# ============================================================
# 83. REFRESH LIMITATION
# ============================================================
#
# Because permanent storage is intentionally excluded:
#
# browser refresh may reset application state according to current architecture.
#
# Do not add persistence solely to avoid this.
#
# Document as an MVP limitation if relevant.
#
# ============================================================
# 84. DOCUMENTATION
# ============================================================
#
# Create:
#
# docs/implementation/p8-purchase-check-result-confirmation.md
#
# Use:
#
# # P8 — Purchase Check, Result and Confirmation
#
# > Project: Student Money Runway — BUS4012 Assignment 02
# > Student: Thien Khuong Vu
# > Phase: P8 — Purchase Check + Result + Explicit Confirmation
# > Created: <actual Melbourne filesystem timestamp>
# > Updated: <actual Melbourne filesystem timestamp>
#
# Document:
#
# 1. P8 scope
# 2. Purchase Check fields
# 3. Purchase validation rules
# 4. Props-down flow
# 5. Callback-up flow
# 6. Current Runway derivation
# 7. Preview architecture
# 8. Preview-is-not-mutation invariant
# 9. Within-runway branch
# 10. Exact-runway boundary
# 11. Exceeds-runway branch
# 12. Purchase Excess calculation
# 13. Back Without Saving behaviour
# 14. StatusActionButton final integration
# 15. Explicit confirmation callback
# 16. Available Funds mutation
# 17. Why Runway itself is not mutated
# 18. Double-subtraction protection
# 19. Double-confirmation protection
# 20. Confirmed-success branch
# 21. Component reuse
# 22. Figma references
# 23. Accessibility
# 24. Ethical language
# 25. Responsive verification
# 26. P9 boundary
#
# ============================================================
# 85. REQUIRED P8 DATA FLOW DIAGRAM
# ============================================================
#
# Include an ASCII diagram equivalent to:
#
# App.tsx
# │
# │ owns RunwayState
# │
# ▼
# PurchaseCheckPage
# │
# ├── Purchase Name
# │
# └── MoneyInput — Purchase Amount
#         │
#         │ callback up
#         ▼
#      App.tsx
#         │
#         │ valid submit
#         ▼
#      /result
#         │
#         ▼
# ResultPage
# │
# ├── calculateRunway(...)
# ├── calculatePurchaseRemaining(...)
# ├── doesPurchaseExceedRunway(...)
# └── calculatePurchaseExcess(...)
#         │
#         ▼
#       PREVIEW
#         │
#         ├── exceeds → Edit Purchase
#         │
#         └── within
#               │
#               ▼
#       StatusActionButton
#       "Mark as spent"
#               │
#               │ explicit user action
#               ▼
#       onConfirmPurchase()
#               │
#               ▼
#            App.tsx
#               │
#               ├── availableFunds -= purchaseAmount
#               └── purchaseConfirmed = true
#                       │
#                       ▼
#                CONFIRMED SUCCESS
#                       │
#                       ▼
#              updated Runway derived
#
# ============================================================
# 86. TEST P1 — EMPTY PURCHASE FORM
# ============================================================
#
# Purchase Name:
#
# ""
#
# Purchase Amount:
#
# ""
#
# Expected:
#
# remain /purchase
#
# required errors visible after submit
#
# no navigation
#
# no mutation
#
# ============================================================
# 87. TEST P2 — WHITESPACE NAME
# ============================================================
#
# Purchase Name:
#
# "   "
#
# Purchase Amount:
#
# "160"
#
# Expected:
#
# invalid name
#
# remain /purchase.
#
# ============================================================
# 88. TEST P3 — ZERO PURCHASE
# ============================================================
#
# Purchase Name:
#
# "Groceries"
#
# Purchase Amount:
#
# "0"
#
# Expected:
#
# invalid
#
# purchase must be greater than zero.
#
# ============================================================
# 89. TEST P4 — NEGATIVE PURCHASE
# ============================================================
#
# Purchase:
#
# "-1"
#
# Expected:
#
# invalid.
#
# ============================================================
# 90. TEST P5 — DECIMAL PURCHASE
# ============================================================
#
# Purchase:
#
# "160.50"
#
# Expected:
#
# valid if compatible with established money precision.
#
# Raw purchase state remains string.
#
# ============================================================
# 91. TEST P6 — CANONICAL PREVIEW
# ============================================================
#
# Source:
#
# Available = 950
# Fixed = 455
# Flexible = 180
# Buffer = 100
#
# Current Runway:
#
# 215
#
# Purchase:
#
# 160
#
# Before preview:
#
# availableFunds = 950
#
# Expected preview:
#
# Remaining = 55
#
# Exceeds = false
#
# After preview but BEFORE confirmation:
#
# availableFunds MUST STILL equal:
#
# 950
#
# purchaseConfirmed:
#
# false
#
# ============================================================
# 92. TEST P7 — BACK WITHOUT SAVING
# ============================================================
#
# From canonical within-runway preview:
#
# activate:
#
# Back Without Saving
#
# Expected:
#
# navigate away according to approved flow
#
# availableFunds remains:
#
# 950
#
# Runway remains:
#
# 215
#
# purchaseConfirmed:
#
# false
#
# ============================================================
# 93. TEST P8 — CANONICAL CONFIRMATION
# ============================================================
#
# Starting:
#
# Available = 950
#
# Protected = 735
#
# Runway = 215
#
# Purchase = 160
#
# Explicitly activate:
#
# Mark as spent
#
# Expected source mutation:
#
# Available Funds:
#
# 790
#
# purchaseConfirmed:
#
# true
#
# Expected newly derived Runway:
#
# 55
#
# Do NOT mutate protected values.
#
# Do NOT subtract purchase twice.
#
# ============================================================
# 94. TEST P9 — EXACT RUNWAY
# ============================================================
#
# Current Runway:
#
# 215
#
# Purchase:
#
# 215
#
# Expected preview:
#
# Remaining = 0
#
# Exceeds = false
#
# Confirmation allowed.
#
# After explicit confirmation:
#
# Updated Runway:
#
# 0
#
# ============================================================
# 95. TEST P10 — EXCEEDS
# ============================================================
#
# Current Runway:
#
# 215
#
# Purchase:
#
# 300
#
# Expected:
#
# Remaining = 0
#
# Exceeds = true
#
# Excess = 85
#
# "Mark as spent" not available/enabled.
#
# No source financial mutation.
#
# ============================================================
# 96. TEST P11 — DOUBLE CONFIRM
# ============================================================
#
# Confirm canonical purchase once.
#
# Then attempt repeated activation / double click.
#
# Expected:
#
# availableFunds becomes:
#
# 790
#
# NOT:
#
# 630
#
# Purchase is applied once only.
#
# ============================================================
# 97. TEST P12 — CONFIRMED RESULT
# ============================================================
#
# After canonical confirmation:
#
# ResultPage must show confirmed-success state.
#
# Updated Runway:
#
# 55
#
# It must NOT compute:
#
# 55 - 160
#
# It must NOT switch incorrectly to the exceeds branch.
#
# ============================================================
# 98. TEST P13 — CHECK ANOTHER PURCHASE
# ============================================================
#
# If this action is implemented:
#
# after confirmed canonical purchase:
#
# new Available Funds stays:
#
# 790
#
# purchaseName clears
#
# purchaseAmount clears
#
# purchaseConfirmed becomes:
#
# false
#
# navigate:
#
# /purchase
#
# Current Runway for the next purchase:
#
# 55
#
# ============================================================
# 99. TEST P14 — EXCEEDS HAS NO MUTATION
# ============================================================
#
# Starting:
#
# Available = 950
#
# Purchase:
#
# 300
#
# Current Runway:
#
# 215
#
# Visit preview.
#
# Expected:
#
# availableFunds remains 950
#
# purchaseConfirmed false
#
# no confirmation mutation available.
#
# ============================================================
# 100. TEST P15 — DIRECT /RESULT
# ============================================================
#
# Fresh session:
#
# direct:
#
# /result
#
# Expected:
#
# deterministic redirect to the appropriate earlier screen.
#
# No:
#
# NaN
#
# Infinity
#
# runtime error.
#
# ============================================================
# 101. TEST P16 — STATE RETENTION
# ============================================================
#
# Enter valid purchase:
#
# Coffee machine
#
# 160
#
# Navigate:
#
# /purchase
# → /result
# → Edit Purchase
#
# Expected:
#
# draft Purchase Name and Amount remain available unless explicit reset action
# occurred.
#
# ============================================================
# 102. CALCULATION CROSS-CHECK
# ============================================================
#
# Explicitly verify:
#
# calculatePurchaseRemaining(
#   215,
#   160
# )
#
# = 55
#
# doesPurchaseExceedRunway(
#   215,
#   160
# )
#
# = false
#
# calculatePurchaseRemaining(
#   215,
#   215
# )
#
# = 0
#
# doesPurchaseExceedRunway(
#   215,
#   215
# )
#
# = false
#
# calculatePurchaseRemaining(
#   215,
#   300
# )
#
# = 0
#
# doesPurchaseExceedRunway(
#   215,
#   300
# )
#
# = true
#
# calculatePurchaseExcess(
#   215,
#   300
# )
#
# = 85
#
# if that helper exists.
#
# ============================================================
# 103. NO BUSINESS FORMULA DUPLICATION
# ============================================================
#
# Do not write:
#
# Math.max(0, runway - purchase)
#
# repeatedly in page JSX if a P5 utility already owns that rule.
#
# Keep one source of truth.
#
# ============================================================
# 104. NO NEW DERIVED REACT STATE
# ============================================================
#
# Do NOT introduce:
#
# useState(currentRunway)
#
# useState(purchaseRemaining)
#
# useState(purchaseExcess)
#
# useState(purchaseExceeds)
#
# These are derived.
#
# ============================================================
# 105. NO USEEFFECT CALCULATION SYNC
# ============================================================
#
# Do not use useEffect to keep purchase results synchronized.
#
# Derive directly from current valid source state.
#
# ============================================================
# 106. EXPECTED FILE SCOPE
# ============================================================
#
# Expected modifications:
#
# src/pages/PurchaseCheckPage.tsx
#
# src/pages/ResultPage.tsx
#
# src/App.tsx
#
# Possibly:
#
# src/components/ui/StatusActionButton.tsx
#
# ONLY if required for real P8 integration.
#
# Possible:
#
# src/utils/moneyValidation.ts
#
# ONLY if purchase-specific validation can reuse/extend the existing general
# contract cleanly.
#
# Possible small presentation/money helper:
#
# ONLY if required for safe confirmed mutation formatting.
#
# Create:
#
# docs/implementation/p8-purchase-check-result-confirmation.md
#
# Preserve:
#
# docs/prompts/p08-purchase-check-result-confirmation.md
#
# ============================================================
# 107. DO NOT MODIFY
# ============================================================
#
# Avoid unnecessary modifications to:
#
# LoginPage.tsx
#
# RunwaySetupPage.tsx
#
# ProtectEssentialsPage.tsx
#
# RunwayResultPage.tsx
#
# FormSection.tsx
#
# MoneyInput.tsx
#
# SummaryRow.tsx
#
# runwayCalculations.ts
#
# design tokens
#
# unless a concrete P8 defect requires correction.
#
# ============================================================
# 108. IMPLEMENTATION SEQUENCE
# ============================================================
#
# Follow:
#
# STEP 1
#
# Read master + P1-P7 implementation docs.
#
# STEP 2
#
# Inspect P5 state and calculation utilities.
#
# STEP 3
#
# Inspect P3 StatusActionButton real current API.
#
# STEP 4
#
# Inspect Purchase Check / Result Figma.
#
# STEP 5
#
# Reconcile current money validation.
#
# STEP 6
#
# Plan preview-vs-confirmation state transition before coding.
#
# STEP 7
#
# Implement PurchaseCheckPage controlled form.
#
# STEP 8
#
# Implement prerequisite handling.
#
# STEP 9
#
# Implement ResultPage preview derivation.
#
# STEP 10
#
# Implement within-runway branch.
#
# STEP 11
#
# Implement exceeds-runway branch.
#
# STEP 12
#
# Integrate StatusActionButton.
#
# STEP 13
#
# Implement explicit App-owned confirmation mutation.
#
# STEP 14
#
# Implement confirmed-success branch.
#
# STEP 15
#
# Protect against double confirmation.
#
# STEP 16
#
# Verify canonical / exact / exceeds cases.
#
# STEP 17
#
# Verify Back Without Saving.
#
# STEP 18
#
# Verify direct-route behaviour.
#
# STEP 19
#
# Verify responsive/accessibility baseline.
#
# STEP 20
#
# Create P8 documentation.
#
# STEP 21
#
# Run lint/build.
#
# STEP 22
#
# Inspect Git diff.
#
# STOP.
#
# ============================================================
# 109. BROWSER VERIFICATION
# ============================================================
#
# Run:
#
# npm run dev
#
# Record actual Vite URL.
#
# Verify:
#
# /runway
#
# /purchase
#
# /result
#
# Also regression-check:
#
# /login
#
# /setup
#
# /essentials
#
# ============================================================
# 110. DESKTOP VERIFICATION
# ============================================================
#
# Around:
#
# 1280px
#
# verify:
#
# Purchase Check hierarchy
#
# current runway context
#
# purchase form
#
# within preview
#
# exceeds preview
#
# confirmed success
#
# actions
#
# StatusActionButton
#
# ============================================================
# 111. MOBILE VERIFICATION
# ============================================================
#
# Around:
#
# 390px
#
# verify:
#
# no horizontal overflow
#
# input usable
#
# status text wraps
#
# money values readable
#
# actions remain touch-friendly
#
# StatusActionButton remains usable
#
# ============================================================
# 112. CONSOLE VERIFICATION
# ============================================================
#
# No new:
#
# React errors
#
# controlled/uncontrolled warnings
#
# NaN
#
# Infinity
#
# repeated state-update warnings
#
# route errors
#
# Existing React Router future-flag warnings may remain if unchanged.
#
# ============================================================
# 113. LINT
# ============================================================
#
# Run:
#
# npm run lint
#
# Required:
#
# PASS
#
# Do not suppress errors.
#
# ============================================================
# 114. BUILD
# ============================================================
#
# Run:
#
# npm run build
#
# Required:
#
# PASS
#
# ============================================================
# 115. PACKAGE AUDIT
# ============================================================
#
# Inspect:
#
# package.json
#
# package-lock.json
#
# Expected P8 new packages:
#
# NONE
#
# Existing:
#
# framer-motion
#
# remains from P3.
#
# ============================================================
# 116. GIT REVIEW
# ============================================================
#
# Run:
#
# git status
#
# git diff
#
# If baseline exists:
#
# inspect all P8 changes.
#
# Confirm:
#
# no P9 implementation
#
# no P10 broad hardening
#
# no backend
#
# no database
#
# no persistence
#
# Do not automatically commit.
#
# ============================================================
# 117. P8 ACCEPTANCE — PURCHASE CHECK
# ============================================================
#
# P8 Purchase Check passes only if:
#
# [ ] Purchase Name implemented
#
# [ ] Purchase Amount uses MoneyInput
#
# [ ] fields controlled by App-owned state
#
# [ ] Purchase Name required
#
# [ ] whitespace-only name rejected
#
# [ ] Purchase Amount required
#
# [ ] zero purchase rejected
#
# [ ] negative purchase rejected
#
# [ ] valid decimal accepted according to established contract
#
# [ ] current Runway shown as derived context
#
# [ ] invalid form remains /purchase
#
# [ ] valid form navigates /result
#
# [ ] navigation to /result does NOT mutate availableFunds
#
# ============================================================
# 118. P8 ACCEPTANCE — PREVIEW
# ============================================================
#
# [ ] Result uses P5 purchase utilities
#
# [ ] no duplicated formula in JSX
#
# [ ] purchase remaining is derived
#
# [ ] purchase exceeds is derived
#
# [ ] purchase excess is derived
#
# [ ] 160 vs 215 = 55 / false
#
# [ ] 215 vs 215 = 0 / false
#
# [ ] 300 vs 215 = 0 / true / excess 85
#
# [ ] preview never mutates recorded financial state
#
# [ ] Back Without Saving never records purchase
#
# ============================================================
# 119. P8 ACCEPTANCE — CONFIRMATION
# ============================================================
#
# [ ] Mark as spent appears only for eligible within-runway preview
#
# [ ] StatusActionButton is used for its real final purpose
#
# [ ] explicit user action required
#
# [ ] no automatic confirmation
#
# [ ] no fake async delay
#
# [ ] canonical confirmation reduces Available Funds 950 → 790
#
# [ ] purchaseConfirmed becomes true
#
# [ ] protected financial values remain unchanged
#
# [ ] updated derived Runway = 55
#
# [ ] no double subtraction
#
# [ ] no double confirmation
#
# [ ] confirmed branch clearly rendered
#
# ============================================================
# 120. P8 ACCEPTANCE — EXCEEDS
# ============================================================
#
# [ ] factual exceeds message
#
# [ ] amount above runway shown
#
# [ ] canonical excess = 85
#
# [ ] no Mark as spent confirmation offered
#
# [ ] no financial source mutation occurs
#
# [ ] edit/back action available
#
# ============================================================
# 121. ARCHITECTURE ACCEPTANCE
# ============================================================
#
# [ ] App remains RunwayState owner
#
# [ ] raw monetary input remains string
#
# [ ] calculations receive validated numbers
#
# [ ] derived values remain derived
#
# [ ] no useEffect calculation synchronization
#
# [ ] no localStorage/sessionStorage
#
# [ ] no new state library
#
# [ ] no new packages
#
# [ ] explicit confirmation callback is typed
#
# ============================================================
# 122. COMPONENT ACCEPTANCE
# ============================================================
#
# [ ] MoneyInput reused on Purchase Check
#
# [ ] SummaryRow reused on Purchase Result
#
# [ ] StatusActionButton integrated
#
# [ ] 21st.dev provenance preserved
#
# [ ] no custom component replaced unnecessarily
#
# ============================================================
# 123. ETHICS ACCEPTANCE
# ============================================================
#
# [ ] no "safe purchase"
#
# [ ] no "unsafe purchase"
#
# [ ] no "can afford"
#
# [ ] no recommendation language
#
# [ ] within/exceeds states are factual
#
# [ ] confirmation is explicit
#
# [ ] preview is reversible/non-mutating
#
# ============================================================
# 124. ACCESSIBILITY ACCEPTANCE
# ============================================================
#
# [ ] Purchase Check semantic form
#
# [ ] labels
#
# [ ] visible focus
#
# [ ] keyboard submit
#
# [ ] text errors
#
# [ ] Result state communicated by text
#
# [ ] StatusActionButton keyboard accessible
#
# [ ] disabled state correct
#
# [ ] reduced motion preserved
#
# ============================================================
# 125. SOURCE TRACEABILITY ACCEPTANCE
# ============================================================
#
# [ ] Student:
#     Thien Khuong Vu
#
# [ ] Phase:
#     P8 — Purchase Check + Result + Explicit Confirmation
#
# [ ] existing createdAt preserved
#
# [ ] updatedAt follows Australia/Melbourne convention
#
# [ ] 21st.dev source attribution retained where applicable
#
# [ ] no guessed timestamps
#
# ============================================================
# 126. FINAL REPORT
# ============================================================
#
# Return:
#
# A. References inspected
#
# ------------------------------------------------------------
#
# B. Purchase Check implementation
#
# Report:
#
# - Purchase Name
# - Purchase Amount
# - validation
# - state ownership
# - current Runway context
# - submit navigation
#
# ------------------------------------------------------------
#
# C. Preview architecture
#
# Explain exactly why:
#
# /purchase → /result
#
# does NOT mutate financial source state.
#
# ------------------------------------------------------------
#
# D. Within-runway branch
#
# Show canonical:
#
# Runway 215
#
# Purchase 160
#
# Remaining 55
#
# ------------------------------------------------------------
#
# E. Exact-runway branch
#
# Show:
#
# 215 / 215
#
# Remaining 0
#
# Exceeds false
#
# ------------------------------------------------------------
#
# F. Exceeds-runway branch
#
# Show:
#
# Runway 215
#
# Purchase 300
#
# Excess 85
#
# ------------------------------------------------------------
#
# G. Explicit confirmation architecture
#
# Show exact callback flow:
#
# ResultPage
# → StatusActionButton
# → callback
# → App
# → source-state mutation
#
# ------------------------------------------------------------
#
# H. Canonical confirmed mutation
#
# Table:
#
# Value | Before | After
#
# Available Funds | 950 | 790
#
# Protected Total | 735 | 735
#
# Runway | 215 | 55
#
# purchaseConfirmed | false | true
#
# ------------------------------------------------------------
#
# I. Double-subtraction protection
#
# Explain how confirmed ResultPage avoids:
#
# 55 - 160
#
# ------------------------------------------------------------
#
# J. Double-confirmation protection
#
# Report actual mechanism.
#
# ------------------------------------------------------------
#
# K. Back Without Saving verification
#
# Confirm:
#
# availableFunds unchanged
#
# purchaseConfirmed false
#
# ------------------------------------------------------------
#
# L. StatusActionButton integration
#
# Report:
#
# API used
#
# any P8 modification
#
# 21st.dev provenance
#
# accessibility
#
# motion handling
#
# ------------------------------------------------------------
#
# M. Component reuse evidence
#
# Table:
#
# Component
# Screens actually rendered
#
# Include:
#
# FormSection
# MoneyInput
# SummaryRow
# StatusActionButton
#
# ------------------------------------------------------------
#
# N. Test matrix
#
# Report:
#
# P1
# P2
# P3
# P4
# P5
# P6
# P7
# P8
# P9
# P10
# P11
# P12
# P13 if implemented
# P14
# P15
# P16
#
# With:
#
# Expected
# Actual
# PASS / FAIL
#
# ------------------------------------------------------------
#
# O. Responsive verification
#
# Mobile ~390px
#
# Desktop ~1280px
#
# ------------------------------------------------------------
#
# P. Accessibility verification
#
# ------------------------------------------------------------
#
# Q. Ethical-language review
#
# ------------------------------------------------------------
#
# R. Files created
#
# ------------------------------------------------------------
#
# S. Files modified
#
# ------------------------------------------------------------
#
# T. Source-header traceability
#
# Table:
#
# File
# Phase
# Created
# Updated
# Timezone
# Source if applicable
#
# ------------------------------------------------------------
#
# U. Package changes
#
# Expected:
#
# NONE
#
# ------------------------------------------------------------
#
# V. npm run lint
#
# PASS / FAIL
#
# ------------------------------------------------------------
#
# W. npm run build
#
# PASS / FAIL
#
# ------------------------------------------------------------
#
# X. Browser/runtime verification
#
# Report Vite URL.
#
# Report console status.
#
# ------------------------------------------------------------
#
# Y. Git/change assessment
#
# ------------------------------------------------------------
#
# Z. Deferred P9 work
#
# Explicitly state:
#
# final cross-screen responsive/Figma parity audit
#
# spacing polish
#
# typography parity
#
# navigation parity
#
# overflow checks
#
# breakpoint consistency
#
# ============================================================
# 127. HARD STOP
# ============================================================
#
# Do NOT continue to P9.
#
# Do NOT begin final responsive parity auditing.
#
# Do NOT begin P10 broad accessibility/ethics hardening.
#
# Do NOT begin P11 submission/evidence packaging.
#
# Do NOT add backend/database/persistence.
#
# If blocked finish exactly:
#
# P8 PURCHASE FLOW BLOCKED
#
# If all P8 acceptance criteria pass finish exactly:
#
# P8 PURCHASE FLOW READY