# Project Rules (Source of Truth)

## Mandatory

- Keep `src/pages` composition-only (no business logic).
- Reuse existing generic components/hooks/utils before creating new ones.
- No `any`, no type assertions, no non-null assertion.
- No barrel export (`index.ts`) aggregation.
- Semantic naming only (avoid short/generic variable names).
- Respect light/dark theme and responsive breakpoints.
- Avoid magic strings and magic numbers in business/UI logic.
- Avoid magic spacing in `sx`; use theme spacing tokens.
- Shared components must provide theme-based defaults and controlled customization props.
- Prefer color tokens from `src/theme/uiColors.ts` whenever possible.
- If a new design requires a different color, add it to `src/theme/uiColors.ts` (do not hardcode in feature files).
- Any new color token must include both light and dark mode values.

## Component Customization Policy (Mandatory)

- Prefer existing shared components (`src/components/common/**`) before creating new ones.
- Keep defaults driven by theme/tokens.
- Allow contextual overrides via focused props (`sx`, labels, handlers, variants).
- Do not create duplicate components for minor style changes.
- Avoid over-componentization: do not create tiny wrapper/passthrough components when page-level composition is already clear.
- Create a new component only when there is concrete reuse, shared complexity, or a clear boundary gain.

## No Magic Values Policy (Mandatory)

- Do not hardcode domain/status/action strings directly in logic branches.
- Do not hardcode significant numeric values directly in logic.
- Extract constants to the closest meaningful scope:
  - local constant for single-file/private use,
  - `src/models` or module constants for shared domain values,
  - `src/theme` for design tokens.
- Allowed inline literals:
  - trivial loop/index increments,
  - obvious primitive defaults (`0`, `1`, `true`, `false`, `''`) when not domain-defining,
  - well-known protocol/library required literals (example: HTTP method names in a request helper).

## Spacing Token Policy (Mandatory)

- Reuse `spacingScale` and `layoutSpacing` from `src/theme/spacing.ts`.
- Do not introduce raw spacing numbers in `sx` for repeated/layout-critical spacing.

## Hooks Testing Policy (Mandatory)

- If a hook is created, edited, or has behavior changed, its test must be created or updated in the same task.
- Hook tests must live under `src/test/hooks`.
- Tasks touching hooks are incomplete if hook tests are missing or outdated.

## Services Pattern Policy (Mandatory)

- Platform/client service modules under `src/services/**` must follow the same 3-file pattern:
  - `types.ts`: request/response and payload/params aliases
  - `endpoints.ts`: raw HTTP calls only (`httpClient.<method>`)
  - `service.ts`: orchestration layer returning `data` and exposing business-friendly methods
- Do not concentrate endpoint calls directly inside `service.ts` when creating new modules.
- Reuse the `src/services/platform/auth` structure as the source template.

## Folder Responsibilities

- `src/pages`: composition/layout only
- `src/components`: reusable UI
- `src/hooks`: shared logic
- `src/services`: backend integration
- `src/utils`: pure helpers
- `src/models`: types/contracts
- `src/theme`: tokens/theme setup
- `src/errors`: error normalization + UI patterns
- `src/forms`: schema + form wrappers

## Quality Gate (required before completion)

1. `npm run lint:fix`
2. `npm run typecheck`
3. `npm run build`
4. `npm run test`
