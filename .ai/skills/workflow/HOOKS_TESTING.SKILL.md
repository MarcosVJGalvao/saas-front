# Skill: Hooks Testing (Vitest)

## Mandatory Rule

Whenever a hook is created, updated, or has behavior changed:

- Create or update its test file.
- Cover success and failure flow when applicable.

## Structure

- Hook tests live in `src/hooks/__tests__`.
- Naming: `<hookName>.test.ts`.

## Base Stack

- Vitest + Testing Library (`renderHook`).
- Setup file: `src/test/setup.ts`.

## Required Checks

- Run `npm run test`.
- Keep `npm run lint`, `npm run typecheck`, `npm run build` green.
