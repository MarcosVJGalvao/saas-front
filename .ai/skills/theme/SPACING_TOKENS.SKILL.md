# Skill: Spacing Tokens (No Magic Spacing)

## Goal

Ensure spacing uses semantic theme tokens, not raw numeric literals in components.

## Rules

- Prefer `layoutSpacing` and `spacingScale` from `src/theme/spacing.ts`.
- Avoid direct numeric spacing values in `sx` (e.g. `p: 2`, `mt: 3`, `gap: 1.5`) unless unavoidable.
- If a new spacing pattern appears more than once, extract a semantic token.

## Usage

- App/page paddings: `layoutSpacing.pagePaddingX`, `layoutSpacing.pagePaddingY`
- Form spacing: `layoutSpacing.formGap`, `layoutSpacing.formContainerPadding`
- Grid/card spacing: `layoutSpacing.gridGap`, `layoutSpacing.cardPadding`
