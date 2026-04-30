# AGENTS Orchestrator

This file orchestrates AI behavior by delegating details to:

- Rules: `.ai/rules/RULES.md`
- Token efficiency rules: `.ai/rules/TOKEN_EFFICIENCY.md`
- Skills: `.ai/skills/**`

## Execution Order

1. Read `.ai/rules/RULES.md`.
2. Read `.ai/rules/TOKEN_EFFICIENCY.md`.
3. Identify relevant skill context(s) in `.ai/skills`.
4. Reuse existing project building blocks.
5. Implement minimal safe changes.
6. Run mandatory quality gate commands.

## Non-Negotiables

- Never bypass rules.
- Prefer extension over duplication.
- Keep architecture boundaries intact.
- Minimize token usage by default.
