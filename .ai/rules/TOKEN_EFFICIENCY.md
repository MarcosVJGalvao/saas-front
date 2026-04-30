# Token Efficiency Rules

## Objective

Reduce token consumption while preserving quality, correctness, and safety.

## Mandatory Practices

- Read only the minimum required files for the task.
- Prefer targeted search scopes (feature/module paths) over repo-wide scans.
- Avoid repeating analysis for unchanged files.
- Reuse previously gathered context instead of reopening the same content.
- Keep intermediate progress updates concise and low-frequency when no new signal exists.
- Prefer short structured outputs: objective, change, validation.

## Tooling Strategy

- Use focused commands first (`rg` with scoped paths).
- Avoid full file dumps unless strictly necessary.
- For large files, inspect only relevant sections.
- Run selective checks during development when possible; run full gates at completion.

## Completion Gate

At task end, still run mandatory full verification required by project rules.
