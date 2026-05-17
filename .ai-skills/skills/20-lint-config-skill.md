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

## Proibido

- Relaxar regra para fazer build passar.
- Usar comentário para ignorar lint.
- Usar comentário para ignorar TypeScript.
- Usar casting para contornar erro de tipo.
- Desligar regras em arquivo específico.

## Regra final

Se o lint falhou, corrija o código. Não silencie a ferramenta.
