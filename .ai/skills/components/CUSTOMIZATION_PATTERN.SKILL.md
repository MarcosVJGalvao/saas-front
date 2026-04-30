# Skill: Component Customization Pattern

## Goal

When creating/refactoring UI, always prefer shared components with theme-based defaults and controlled customization.

## Mandatory

- Reuse shared component before creating a new one.
- Preserve default theme behavior.
- Expose focused customization props (`sx`, labels, callbacks, variants) when needed.
- Keep API minimal: defaults first, override second.

## Anti-patterns

- Creating near-duplicate components for small visual changes.
- Hardcoding spacing/color/typography when a shared component token already exists.
- Ignoring responsive behavior in shared components.

## Done Criteria

- Shared component reused or extended.
- Override path documented via props.
- Lint/typecheck/build/test pass.
