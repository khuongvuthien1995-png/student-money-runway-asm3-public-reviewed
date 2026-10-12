# P3 — 21st.dev Integration

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P3 — 21st.dev Integration
> Created: 2026-09-15T23:10:04+10:00
> Updated: 2026-09-15T23:14:10+10:00

## Selected component

| Item | Evidence |
| --- | --- |
| Component | Dynamic Status Button |
| Source author / library | Ruixen / Ruixen UI |
| Source URL | https://21st.dev/@ruixen.ui/components/dynamic-status-button |
| Local adaptation | `src/components/ui/StatusActionButton.tsx` |
| Intended final use | Purchase Impact Preview → **Mark as spent** |

The source component was selected because a status-aware confirmation action fits the explicit future purchase-confirmation step without duplicating P2’s form grouping, monetary input, or financial summary responsibilities.

## Source and prompt evidence

The source page was accessible and identified the component, author, library, animation dependency, live preview, and install command. The official 21st.dev Markdown instruction was retrieved from the component’s `.md` endpoint and preserved verbatim at [`docs/prompts/p03-21st-dev-original-prompt.md`](../prompts/p03-21st-dev-original-prompt.md).

The direct registry install endpoint required a 21st API key and returned HTTP 403 in this environment. The source implementation was therefore not retrieved or described as copied source. The local code is a traceable adaptation of the publicly documented Dynamic Status Button concept: dynamic icon and label changes with animated transitions.

## Dependency change

| Package | Category | Purpose | Required by source |
| --- | --- | --- | --- |
| `framer-motion` `13.3.0` | Runtime dependency | Animated state transitions and reduced-motion-aware presentation | Yes |

No shadcn UI package or icon package was installed. The source instruction lists `framer-motion`; its example icon package is for demonstration content rather than the component runtime.

## Local adaptation

- `StatusActionButton` accepts parent-owned `state`, `onClick`, optional `disabled`, and optional `className` props.
- The local P3 states are factual and presentation-only: `Mark as spent`, `Confirming...`, and `Marked as spent`.
- It uses the P1 `primary`, `primary-pressed`, `surface`, `border`, `muted`, and `on-surface` tokens; Inter typography; the `button` radius; `space-*` spacing; and the `min-h-control` 48px interaction target.
- Idle and processing use the approved primary action treatment; success is communicated by a check icon and changed label, rather than colour alone.
- The component does not calculate a financial amount, mutate purchase data, navigate, or contain page state.

## Accessibility and motion

- A semantic `button` has an explicit `type="button"`, persistent text label, disabled semantics, and a visible `focus-visible` ring.
- Processing sets `aria-busy`; processing and success state changes are announced in a concise polite live region.
- The icon is decorative because the label communicates the state.
- `framer-motion` uses short opacity/vertical transitions. When `prefers-reduced-motion` is enabled, motion distance and duration are removed; the processing spinner also stops.

## Temporary P3 browser preview

`src/App.tsx` remains a temporary UI-kit verification shell. It provides a demo-only state sequence (idle → processing → success), a reset control, and a disabled example. The timeout changes only local preview state; it does not record a purchase, change a runway amount, or implement P8 confirmation behaviour.

## Planned final use

At P8, the purchase-impact experience can supply the current action state and callback to `StatusActionButton` for the explicit **Mark as spent** action. The page/application layer will own any financial mutation and result logic.

## Known limitations and assessment notes

- P3 does not create a Purchase Check page, routing, central financial state, calculations, authentication, or persistence.
- The API-key-protected source installer could not be run, so provenance is supported by the public 21st.dev page and preserved official instruction rather than an automated registry import.
- For assessment, show the original-prompt evidence, `@source` header, `framer-motion` dependency, temporary state preview, keyboard activation, focus ring, and the separation between the P3 presentation component and future P8 business behaviour.
