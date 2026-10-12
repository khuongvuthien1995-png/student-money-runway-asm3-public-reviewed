# Student Money Runway — Figma Reference Manifest

## Purpose

This folder contains the curated PNG exports from the Assignment 01 Figma file. They are visual design references for the BUS4012 implementation process.

These files are not runtime assets. They must not be imported by the React application or placed under `src/assets`. That directory is reserved for runtime logos, illustrations, and image resources.

## Source-of-truth priority

1. ASM2 assignment requirements
2. ASM1 locked business logic
3. Hi-Fi Figma references in this folder
4. Implementation code

## Canonical business values

| Value | Amount |
| --- | ---: |
| Available funds | AUD 950 |
| Fixed essentials | AUD 455 |
| Flexible essentials | AUD 180 |
| Safety buffer | AUD 100 |
| Protected total | AUD 735 |
| Discretionary runway | AUD 215 |

Purchase example: `AUD 215 - AUD 160 = AUD 55`.

## Core ASM2 flow

Login → Runway Setup → Protect Essentials → Runway Result → Purchase Check → Confirmation / Result

## Visual-reference mapping

| Screen or state | References |
| --- | --- |
| Login | P1 + DS-03 + DS-07 |
| Runway Setup | P2 + M-P2 |
| Protect Essentials | P3 + M-P3 |
| Runway Result | P4 + M-P4 |
| Purchase Check | P5 + M-P5 |
| Purchase Preview | P6 + M-P6 |
| Success Result | P4-B + M-P4-B |
| Failure visual language | E1 + M-E1 + DS-06 |

## Responsive contract

- Mobile: `< 768px`
- Tablet: `768px–1024px`
- Desktop: `> 1024px`
- Desktop max content/grid reference: `1280px / 12 columns`
- Mobile reference: `390px / 4 columns`

## Design-system authority

The authoritative design-system references are:

- DS-01 Foundations
- DS-02 Responsive Navigation
- DS-03 Forms & Core Controls
- DS-04 Financial Product Components
- DS-06 Feedback, States & Accessibility
- DS-07 Landing Website Components
- DS-08 Responsive Behavior & Figma Architecture

DS-05 is intentionally excluded from the core ASM2 reference set.
