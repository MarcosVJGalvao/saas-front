# 26 — Automated Compliance Skill

## Objetivo

Consolidar uma auditoria objetiva de conformidade antes de merge/PR.

## Comandos oficiais

```txt
rg -n "\bas\b|as const|\bany\b|@ts-ignore|eslint-disable" src tests
rg -n "\.\./\.\./|\.\./\.\./\.\./" src tests
rg -n "@features/" src/shared
rg -n "from '@mui/material'" src/features
rg -n "�|Ã|\uFFFD" src tests .ai-skills AGENTS.md
npm run lint
npm run typecheck
npm test
```

## Critérios de aprovação

- Sem violações proibidas de TypeScript.
- Sem dependência `shared -> features`.
- Sem import relativo profundo onde alias existe.
- Sem texto corrompido/encoding inválido.
- `lint`, `typecheck` e `test` verdes.
