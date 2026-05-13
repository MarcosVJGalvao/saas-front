# 22 — Import Alias Skill

## Objetivo

Padronizar imports com aliases e evitar inconsistência entre TypeScript, Vite e Vitest.

## Regras obrigatórias

- Preferir aliases (`@app`, `@features`, `@shared`, etc.) em vez de caminhos relativos longos.
- Evitar `../../..` em `src` e `tests`.
- Usar o mesmo padrão de alias em código de produção e em testes.
- Em `vi.mock(...)`, usar o mesmo specifier usado no import.

## Alinhamento obrigatório de configuração

Sempre manter aliases coerentes entre:

1. `tsconfig.app.json` (`compilerOptions.paths`)
2. `vite.config.ts` (`resolve.alias`)
3. `vitest.config.ts` (`resolve.alias`)

## Checklist de alteração de alias

- Atualizou `tsconfig.app.json`.
- Atualizou `vite.config.ts`.
- Atualizou `vitest.config.ts`.
- Rodou `npm run typecheck`.
- Rodou `npm test`.

## Proibido

- Alias funcionar só no TypeScript e quebrar no Vitest.
- Misturar import relativo profundo com alias sem justificativa.

## Definition of Done

- Sem imports relativos profundos em `src` e `tests` quando houver alias.
- Sem mistura de specifier para o mesmo módulo entre código e `vi.mock(...)`.
- `typecheck` e `test` verdes após migração.

Comandos recomendados:

```txt
rg -n "\.\./\.\./|\.\./\.\./\.\./" src tests
rg -n "vi\.mock\(" tests
npm run typecheck
npm test
```

## Exemplos por camada

Antes (`app`):

```ts
import { PlatformAuthGuard } from '../guards/PlatformAuthGuard';
```

Depois:

```ts
import { PlatformAuthGuard } from '@guards/PlatformAuthGuard';
```

Antes (`features`):

```ts
import { httpRequest } from '../../../shared/services/httpClient';
```

Depois:

```ts
import { httpRequest } from '@shared/services/httpClient';
```
