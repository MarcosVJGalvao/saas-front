# Skill: Services Module Pattern

When adding or refactoring integrations in `src/services/**`, follow this mandatory shape:

1. `types.ts`

- Define request/response aliases and payload/params aliases.
- Keep contracts explicit and import domain types from `src/models/**`.

2. `endpoints.ts`

- Keep only raw HTTP calls (`httpClient.get/post/patch/delete`).
- Keep base path constants local to the module.

3. `service.ts`

- Consume endpoints and return `data` for typed responses.
- Keep a clean, business-friendly API surface.

Reference implementation:

- `src/services/platform/auth/{types.ts,endpoints.ts,service.ts}`
