# GitHub publication and clone audit

## Current boundary

Exact repository: https://github.com/khuongvuthien1995-png/student-money-runway-asm3 . The user's latest privacy instruction requires it remain PRIVATE until a separately approved remediation. No visibility change, force-push, new repository or history rewrite occurred. Local Git identity is the previously approved repository-local author/noreply identity; no global identity change.

Initial local/remote main: `bcbad4dfb09c68ddae55eaad258604ee6aa79001`. Runtime tree matches the deployed `08c2f38d97b3c580fcf73f3b6e2808d609c79ae9` for src/backend/app/api, manifests and deployment configuration. Later changes are tests/tools/documentation, not an undeployed runtime fix. Final private source synchronization and clone evidence are appended after execution.

## Security and privacy

`tools/audit-public-history.py` inspects every reachable blob with exact-length batch reads, including binary bytes, known private local-value equality and token/key patterns. It derives peer identity needles from historical templates, so redacting current templates cannot hide history findings. Initial scan: 12 reachable commits, 493 blobs, zero credential matches, 13 peer-privacy blob findings across five paths. [History audit](evidence/public-history-audit.json), [affected snapshots](evidence/privacy-affected-commits.json), [reviewable proposal](ASM3_HISTORY_REDACTION_PROPOSAL.md).

Working candidates and staged blobs are checked separately with `tools/check-repository-secrets.py`. Both populated account/backend environment files and SMTP file are ignored; private academic archives and original PDFs stay outside candidates. No raw financial rows, passwords, sessions or tokens are exported. Original peer records were locally archived before redaction. Raster/video semantic privacy and distribution rights require separate human/visual review; pattern scans are not universal proof.

## Public access / clone

Fresh unauthenticated GitHub repository API: HTTP404. Git with credential helper disabled, noninteractive and no embedded credential: ls-remote exit128. This is expected while intentionally private, not a source defect. **PUBLIC CLONE / PUBLIC README REPRODUCIBILITY: BLOCKED, NOT CLAIMED PASS.**

Independent private fresh-clone installation is permitted and will be recorded separately; it cannot substitute for an anonymous public clone. The existing original repository is preserved. No dependency folder or populated environment is copied into the fresh clone.

## Required next approval

Review the scoped history-redaction proposal and choose either continued private assessment access or explicitly authorize the concrete isolated redaction/ref-update process. Only after that privacy gate can a public switch and genuine anonymous clone be considered. Current newly redacted HEAD does not erase old disclosures.


## Executed private-clone result

Audited source commit `b481da0adcba08fee525e251212547ecf8aa2d7c` was committed and pushed normally to the verified PRIVATE exact repository; local and remote HEAD matched. Vercel project has no Git integration link, so this push did not trigger a deployment. A new authenticated clone outside the workspace installed fresh npm dependencies and Python3.12 virtual environment/runtime/development requirements. **PASS:** 152 frontend tests; 184 backend passed, two hosted skipped; lint/build/compile/pip check;19 local HTTP checks;24 routing checks; bundle/source scans; assessment artifact validation; exact README Uvicorn env-file startup using only the blank template, health200/financial401 and clean shutdown. No real credentials or existing dependencies were copied. The privacy gate correctly returned1 for historical peer identifiers. [Machine evidence](evidence/private-fresh-clone.json). This is PRIVATE reproducibility, not anonymous/public-clone PASS.

The fresh clone tested all runtime/test/tool source in b481da0. Subsequent follow-up changes are evidence/docs and focused read-only observer diagnostics; any such later observer change is explicitly separate from the tested runtime snapshot. The public switch remains blocked and unexecuted.
