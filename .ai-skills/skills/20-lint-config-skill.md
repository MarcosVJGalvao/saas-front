# 20 — Lint Config Skill

## Objetivo

Configurar ESLint, TypeScript e ferramentas de qualidade para bloquear más práticas automaticamente.

## Regras obrigatórias

- Bloquear `any`.
- Bloquear type assertion.
- Bloquear `as`.
- Bloquear `as const`.
- Bloquear comentários de disable do ESLint.
- Bloquear variáveis sem uso.
- Bloquear `var`.
- Preferir `const`.
- Exigir consistência de imports.
- Exigir regras type-aware do TypeScript ESLint.

## Regras ESLint sugeridas

```js
rules: {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'never'
    }
  ],
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/strict-boolean-expressions': 'error',
  '@typescript-eslint/no-unused-vars': 'error',
  'prefer-const': 'error',
  'no-var': 'error',
  'eslint-comments/no-use': 'error',
  'eslint-comments/no-unlimited-disable': 'error',
  'eslint-comments/no-unused-disable': 'error'
}
```

## Plugin para bloquear eslint-disable

Instalar:

```bash
npm install -D eslint-plugin-eslint-comments
```

Configurar:

```js
plugins: ['eslint-comments'];
```

## TypeScript config sugerido

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Regras de arquitetura por camada

Além das regras globais, o projeto aplica regras específicas por camada via `files` no ESLint.

### Hooks (`src/**/hooks/**/*.{ts,tsx}`)

```js
'no-restricted-syntax': [
  'error',
  {
    selector: 'JSXElement, JSXFragment',
    message: 'Hooks não podem conter JSX. Mova o componente para pages/ ou components/.',
  },
],
```

Bloqueia JSX dentro de qualquer arquivo de hook. Se um hook tiver JSX, o build falha.

### `services/endpoints.ts`

```js
'no-restricted-syntax': [
  'error',
  { selector: 'AwaitExpression', message: 'endpoints.ts não pode usar await.' },
  { selector: "MemberExpression[property.name='data']", message: 'endpoints.ts não pode acessar .data.' },
],
```

Garante que `endpoints.ts` só retorna Promises do httpClient, sem `await` nem `.data`.

### `services/service.ts`

```js
'no-restricted-imports': [
  'error',
  { patterns: [{ group: ['**/httpClient*'], message: 'service.ts não pode importar httpClient diretamente.' }] },
],
```

Garante que `service.ts` só usa `endpoints.ts`, nunca importa `httpClient` diretamente.

### Hooks importando endpoints

```js
// src/**/hooks/**/*.ts
'no-restricted-imports': [
  'error',
  { patterns: [{ group: ['**/endpoints*'], message: 'Hooks não podem importar endpoints diretamente. Use service.ts.' }] },
],
```

### Pages (`src/pages/**/*.{ts,tsx}`)

```js
'no-restricted-syntax': [
  { selector: "CallExpression[callee.name=/^use(State|Effect|Memo|Callback|Reducer|Ref)$/]",
    message: 'Pages devem ser composição; mova lógica para hooks.' },
  { selector: "CallExpression[callee.object.name=/.+Service$/]",
    message: 'Pages não devem chamar services diretamente; use hooks.' },
],
complexity: ['error', 3],
```

### Variáveis com nomes curtos

```js
'id-length': ['error', { min: 2, exceptions: ['i', 'j', '_'], properties: 'never' }],
```

Já ativo globalmente. Bloqueia variáveis de 1 caractere como `q`, `p`, `n` (exceto iteradores `i`, `j`).

---

## Proibido

- Relaxar regra para fazer build passar.
- Usar comentário para ignorar lint.
- Usar comentário para ignorar TypeScript.
- Usar casting para contornar erro de tipo.
- Desligar regras em arquivo específico.

## Regra final

Se o lint falhou, corrija o código. Não silencie a ferramenta.
