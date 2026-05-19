# 18 — I18n Error Message Skill

## Objetivo

Centralizar mensagens em português para erros, enums, labels, validações e textos exibidos ao usuário — incluindo os textos padrão dos shared components.

## Estrutura recomendada

```txt
shared/i18n/pt-BR/
  errors.ts       ← códigos de erro do backend + mensagem genérica
  enums.ts        ← tradução de enums vindos do backend
  labels.ts       ← labels compartilhados (Salvar, Cancelar, Editar...)
  validation.ts   ← mensagens de validação de formulário
  messages.ts     ← mensagens de feedback gerais (loading, noRecords...)
  components.ts   ← strings padrão dos shared components (NOVO)
```

## `components.ts` — strings padrão dos shared components

Toda string visível ao usuário que aparece dentro de um shared component deve ter seu **default** centralizado aqui. Isso permite:

- Pages que não passam nada usam os defaults automaticamente
- Pages que precisam sobrescrever passam apenas o que difere
- Mudança global de texto feita em um único lugar

```ts
// shared/i18n/pt-BR/components.ts
export const sharedComponentsI18n = {
  entityDetails: {
    loadingLabel: 'Carregando...',
    emptyTitle: 'Registro não encontrado',
    emptyMessage: 'O registro solicitado não existe.',
    errorFallback: 'Não foi possível carregar os dados.',
    unauthorizedTitle: 'Acesso não autorizado',
    unauthorizedMessage: 'Faça login novamente.',
    forbiddenTitle: 'Acesso negado',
    forbiddenMessage: 'Sem permissão para este recurso.',
  },
  confirmDialog: {
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
  },
  errorState: {
    title: 'Erro ao carregar',
    retryLabel: 'Tentar novamente',
  },
  snackbarError: {
    correlationIdLabel: 'Código:',
    copyTooltip: 'Copiar código',
    copyAriaLabel: 'Copiar código do erro',
  },
};
```

## Como shared components usam o `components.ts`

O componente importa o objeto, define `DEFAULT_CONTENT` e faz merge com o que a page passou:

```tsx
// EntityDetailsPage
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
const DEFAULT_CONTENT = sharedComponentsI18n.entityDetails;

// internamente:
const c = { ...DEFAULT_CONTENT, ...content } as typeof DEFAULT_CONTENT;
```

Props de texto viram **opcionais** com defaults vindos do i18n — nunca hardcoded dentro do componente:

```tsx
// ConfirmDialog
confirmLabel = sharedComponentsI18n.confirmDialog.confirmLabel,
cancelLabel  = sharedComponentsI18n.confirmDialog.cancelLabel,
```

## Como as pages usam

Três formas válidas — todas coexistem:

```tsx
// 1. sem passar nada — usa tudo do i18n centralizado
<EntityDetailsPage viewState={viewState} data={data} onRetry={onRetry} />

// 2. sobrescreve só o específico desta feature
<EntityDetailsPage
  content={{ emptyTitle: 'Nenhum aluno encontrado', emptyMessage: 'Cadastre o primeiro aluno.' }}
  viewState={viewState} data={data} onRetry={onRetry}
/>

// 3. importa do i18n e passa (mistura hardcoded + i18n)
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
const CONTENT = {
  ...sharedComponentsI18n.entityDetails,
  emptyTitle: 'Nenhum aluno encontrado',
};
<EntityDetailsPage content={CONTENT} viewState={viewState} data={data} onRetry={onRetry} />
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
