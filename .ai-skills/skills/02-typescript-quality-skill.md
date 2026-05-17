# 02 — TypeScript Quality Skill

## Objetivo

Garantir código seguro, tipado, legível e sem más práticas de TypeScript.

## Regras obrigatórias

- Nunca usar `any`.
- Nunca usar `as`.
- Nunca usar `as const`.
- Nunca usar casting/type assertion.
- Preferir `unknown` quando o tipo for realmente desconhecido.
- Validar `unknown` com Zod, type guards ou narrowing.
- Não usar `@ts-ignore`.
- Não usar `@ts-expect-error` sem justificativa formal e aprovação.
- Usar `strict` no TypeScript.
- Preferir `const` em vez de `let`.
- Nunca usar `var`.
- Não criar tipos duplicados quando puder usar `z.infer`.
- Props de componentes devem ser explicitamente tipadas.
- Services devem ter retorno tipado.
- Dados externos devem ser validados com Zod.
- Evitar tipos genéricos sem necessidade.
- Evitar objetos com estrutura implícita e ambígua.

## Proibido

```ts
const response: any = await api.get('/users');
const user = response.data as User;
const labels = { ACTIVE: 'Ativo' } as const;
// @ts-ignore
// eslint-disable-next-line
```

## Correto

```ts
const response = await api.get('/users');
const users = usersSchema.parse(response.data);
```

## Para enums e labels

Preferir tipo explícito:

```ts
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

const userStatusLabels: Record<UserStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  BLOCKED: 'Bloqueado',
};
```

## Para mensagens de erro

```ts
type ErrorCode = 'USER_NOT_FOUND' | 'INVALID_CREDENTIALS' | 'INTERNAL_SERVER_ERROR';

const errorMessages: Record<ErrorCode, string> = {
  USER_NOT_FOUND: 'Usuário não encontrado.',
  INVALID_CREDENTIALS: 'E-mail ou senha inválidos.',
  INTERNAL_SERVER_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
};
```

## Type guards

Quando necessário, usar type guards sem casting:

```ts
function isErrorCode(value: string): value is ErrorCode {
  return value in errorMessages;
}
```

## Regra adicional para imports

- `import { X as Y }` também viola a política de `as`.
- Se precisar renomear, preferir:
  - export nomeado já com nome adequado no módulo de origem; ou
  - criar função/const local intermediária sem usar `as`.
