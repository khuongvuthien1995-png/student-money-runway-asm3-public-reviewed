# P3 — Original 21st.dev Prompt

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P3 — 21st.dev Integration
> Source: 21st.dev
> Component: Dynamic Status Button
> Source URL: https://21st.dev/@ruixen.ui/components/dynamic-status-button
> Created: 2026-09-15T23:10:04+10:00
> Updated: 2026-09-15T23:13:16+10:00

## Original Prompt

# Dynamic Status Button

> The DynamicStatusButton component is a sleek and professional UI element built entirely with shadcn UI. It displays an icon and label that dynamically change based on context, such as theme, weather, or system status, while using plain, neutral colors for a clean and modern appearance. Each status has its own background and text color, chosen for clarity and readability, ensuring seamless integration into dashboards, apps, or any interface. The component is fully configurable, supports smooth animated transitions between statuses, and adapts gracefully to different button sizes, making it a versatile and elegant solution for context-aware interactive buttons.

- Author: [Ruixen](https://21st.dev/@ruixen.ui)
- Library: [Ruixen UI](https://21st.dev/@ruixen.ui/library/ruixen-ui)
- License: unknown
- npm dependencies: framer-motion
- Live preview: https://21st.dev/@ruixen.ui/components/dynamic-status-button

## Install

```bash
npx shadcn@latest add "https://21st.dev/r/ruixen.ui/dynamic-status-button?api_key=$API_KEY_21ST"
```

Requires a 21st API key (generate one at https://21st.dev/mcp) passed as `API_KEY_21ST`. Free accounts get a limited number of installs per day; unlimited on a paid plan — see https://21st.dev/pricing.

Full component directory: https://21st.dev/llms.txt

## Local Integration Notes

- The official 21st.dev Markdown instruction above was retrieved from `https://21st.dev/@ruixen.ui/components/dynamic-status-button.md` and is preserved verbatim in the **Original Prompt** section.
- The direct 21st.dev registry endpoint required an API key and returned HTTP 403 in this environment, so the source implementation was not retrieved or represented as copied source code.
- `StatusActionButton` is a documented local adaptation of the verified Dynamic Status Button concept: an icon and label change across idle, processing, and success states with modest `framer-motion` transitions.
- The local component uses the project’s P1 Tailwind tokens and the approved Purchase Impact action wording. It does not import shadcn UI or an icon package.
