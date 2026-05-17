# 18 — I18n Error Message Skill

## Objetivo

Centralizar mensagens em português para erros, enums, labels, validações e textos exibidos ao usuário.

## Estrutura recomendada

```txt
shared/i18n/pt-BR/
  errors.ts
  enums.ts
  labels.ts
  validation.ts
  messages.ts
```

## Regras obrigatórias

- Toda mensagem exibida ao usuário deve estar em português.
- Nunca exibir mensagem técnica do backend diretamente.
- Preferir tradução por `errorCode`.
- Se não houver `errorCode`, traduzir por `message` conhecido.
- Se não houver tradução, exibir mensagem genérica amigável.
- As mensagens devem ficar centralizadas em `shared/i18n/pt-BR`.
- Services devem normalizar erro.
- UI apenas exibe erro já tratado.
- Enums vindos do backend em inglês devem ser traduzidos para português.
- Labels de campos devem vir de fonte centralizada quando forem compartilhadas.

## Ordem de prioridade para erro

1. `errorCode`.
2. `message` traduzido/conhecido.
3. Fallback genérico.

## Checklist quando surgir novo `errorCode`

- Adicionar tradução em `shared/i18n/pt-BR/errors.ts`.
- Garantir cobertura de teste para o novo código.
- Garantir fallback amigável.

## Proibido

```tsx
toast(error.message);
status === 'ACTIVE' ? 'Ativo' : 'Inativo';
```

## Correto

```tsx
toast(getUserFriendlyErrorMessage(error));
translateUserStatus(status);
```

## Fallback obrigatório

Sempre deve existir uma mensagem genérica:

```txt
Ocorreu um erro inesperado. Tente novamente.
```

## Sem `as const`

Não usar `as const` para travar objetos de tradução. Usar tipos explícitos e `Record`.
