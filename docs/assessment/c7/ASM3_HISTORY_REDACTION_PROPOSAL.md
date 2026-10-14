# Reviewable history-redaction proposal

Date: 14 October 2026. **PROPOSAL ONLY - NOT AUTHORIZED TO EXECUTE.**

## Decision and preserved originals

The user confirmed no explicit consent for public disclosure of peers' full names/student IDs, and instructed that the exact repository stay PRIVATE. No history rewrite, force-push, record deletion, new repository or visibility change is authorized. Current working documents replace the identifiers with numbered peer-owner labels. Original academic files are preserved locally under `.git/private-academic-originals/` and in existing private Git history. Those private originals remain the basis for final individually identified assessment reports; do not submit anonymized templates as completed reviews.

## Affected content

Five paths contain the disclosures in reachable history:

- `docs/assessment/c7/PEER_REVIEW_01.md`
- `docs/assessment/c7/PEER_REVIEW_02.md`
- `docs/assessment/c7/PEER_REVIEW_03.md`
- `docs/assessment/c7/ASM3_C7_FINAL_REPORT.md`
- `docs/assessment/c7/ASM3_SUBMISSION_MANIFEST.md`

Affected historical tree snapshots: `3bb535df294973470548e01b29368f0dfc1306b5`, `4e0113ddce75e783e84af72cb10f90f047c7b606`, `bcbad4dfb09c68ddae55eaad258604ee6aa79001`. Exact paths per snapshot are recorded in [sanitized commit inventory](evidence/privacy-affected-commits.json). This inventory does not print the identifiers. Thirteen distinct historical blobs were flagged after expanding the check to peer names as well as IDs. No credential pattern/local-secret match was found in the initial 493 reachable blobs; this is a limited scan, not a security guarantee.

## Proposed public-source version

Keep all runtime React/FastAPI/SQL, tests, manifests, setup instructions and technical evidence. Keep academic prompt provenance truthful. Use numbered peer labels and omit unnecessary student IDs in public templates. Preserve actual peer identities, permission details and communications only in private assessment copies. Do not add an open-source license without a chosen license from the author. Do not redistribute course PDFs, unrelated personal files or populated environments. Preserve existing third-party attribution and flag unresolved licensing questions for review.

The current worktree is that reviewable source proposal; it has **not** removed the old blobs from history. A normal deletion commit, orphan branch or force-push by itself does not prove earlier objects/caches are inaccessible.

## Options requiring a later decision

1. **Keep PRIVATE:** immediately safe for continued engineering/authorized marker access; the official brief expressly permits it. This does not fulfill the user's optional public-source goal.
2. **Approve an exact scoped redaction workflow:** first create/verify a private full-history backup and archive original academic files; work in an isolated mirror; replace only the specified peer identifiers across every affected ref; verify all reachable commits/blobs and visual artifacts again; compare runtime trees to prove source integrity; prepare a complete old-to-new commit mapping and exact ref updates for review. Original commit SHAs will change, and historical evidence must explain that rather than imply untouched history.

Only after the user separately authorizes that concrete rewrite/ref update may the exact repository be updated using a guarded expected-HEAD lease. Protected branches, collaborators, tags and any pull-request refs must be considered. GitHub may retain cached views or refs beyond a normal branch update; assess supported sensitive-data removal/support steps before public visibility. Keep the original backup private and require collaborators to replace old clones. A further verified clean history/privacy gate and explicit visibility approval are required before going public.

No rewrite command, ref replacement or visibility PATCH has been executed. No secret rotation is recommended solely for these peer identifiers; no real credential exposure was detected. If a credential is later discovered, stop and rotate/revoke it separately.

## Current result

**PUBLICATION BLOCKED - HISTORICAL PEER PRIVACY.** Independent local tests, README and private-clone reproducibility can proceed. The user's requested reviewable proposal is complete; execution awaits specific separate authorization.
