# TODO - Refatoração de Compliance das Skills

## Onda 0 - Gate e Fundação

- [x] Criar comando de compliance automatizado.
- [x] Adicionar aliases `@app`, `@shared` e `@features`.
- [x] Remover `as`, `as const`, assertions proibidas e textos com encoding corrompido.
- [x] Trocar imports relativos profundos por aliases.
- [x] Extrair providers para `src/app/providers`.
- [x] Extrair router para `src/app/router`.
- [x] Mover guards para `src/app/guards`.
- [x] Mover erros transversais para `src/shared/errors`.
- [x] Mover services transversais para `src/shared/services`.
- [x] Mover theme para `src/app/theme`.
- [x] Remover pastas vazias.

## Onda 1 - Shared Base

- [x] Criar estrutura `src/shared/formatters`.
- [x] Criar estrutura `src/shared/parsers`.
- [x] Criar estrutura `src/shared/masks`.
- [x] Criar estrutura `src/shared/validators`.
- [x] Criar estrutura `src/shared/normalizers`.
- [x] Criar estrutura `src/shared/schemas`.
- [x] Criar estrutura `src/shared/hooks`.
- [x] Criar estrutura `src/shared/i18n/pt-BR`.
- [x] Migrar utils compartilhados para `shared`.
- [x] Migrar schemas compartilhados para `shared/schemas`.
- [x] Migrar hook genérico de formulário para `shared/hooks`.
- [x] Remover `src/utils` e `src/forms` quando ficarem vazios.

## Onda 2 - Componentes Compartilhados

- [x] Criar wrappers faltantes: `AppButton`, `AppTextField`, `AppSelect`, `AppSwitch`.
- [x] Criar wrappers de feedback/loading: `AppErrorState`, `AppCircularProgress`, `AppSkeleton`.
- [x] Mover `AppSnackbar` e conteúdo de erro para `src/shared/components/feedback`.
- [x] Mover tipos compartilhados de erro e endereço para `src/shared/types`.
- [x] Mover componentes genéricos para `src/shared/components`.
- [x] Remover MUI cru das pages onde houver wrapper.
- [x] Remover `Button`, `TextField`, `MenuItem` e `Switch` crus das pages CRUD de clients/plans/subscriptions.
- [x] Garantir labels, aria-labels e mensagens acessíveis.

## Onda 3 - Features

- [x] Migrar `platform-auth` para `src/features/platform-auth`.
- [x] Migrar `client-auth` para `src/features/client-auth`.
- [x] Migrar `clients` para `src/features/clients`.
- [x] Migrar `plans` para `src/features/plans`.
- [x] Migrar `subscriptions` para `src/features/subscriptions`.
- [x] Criar specs por feature quando ausentes.
- [x] Criar normalizer inicial de clientes.
- [x] Criar normalizers específicos restantes por feature (`clients`, `plans` e `subscriptions` concluídos; auth sem normalizer específico necessário).
- [x] Garantir fluxo `Page -> Hook -> Service -> HttpClient`.

## Onda 4 - Hooks, ViewModels e Estados de Tela

- [x] Remover JSX de hooks.
- [x] Padronizar um controller/view model por page.
- [x] Eliminar sobreposições `Page`, `PageView`, `PageViewModel`.
- [x] Validar `loading`, `error`, `empty`, `unauthorized`, `forbidden`, `submitting`, `disabled`, `modal` e `snackbar` por page aplicável.
  - [x] Forms CRUD de `clients`, `plans` e `subscriptions`: `submitting` e `disabled` expostos via view model.
  - [x] `SubscriptionCreatePage` e `SubscriptionEditPage`: `empty`/`error` explícitos para ausência de plano ativo ou `tenantId`.
  - [x] Listagens: confirmar `loading`, `error`, `empty`, paginação, modal e drawer.
  - [x] Details: confirmar `loading`, `error`, `empty` e retry.
  - [x] Auth pages: confirmar `disabled`, feedback de sucesso/erro e estados de MFA.
  - [x] Guards: confirmar `unauthorized` e `forbidden`.

## Onda 5 - Design System Completo

- [x] Organizar `app/theme/tokens`.
- [x] Organizar `app/theme/mui`.
- [x] Criar `app/theme/utils/responsive.ts`.
- [x] Criar `app/theme/ThemeProvider.tsx`.
- [x] Criar `app/theme/useThemeMode.ts`.
- [x] Padronizar headers/layout das pages de `clients`, `plans` e `subscriptions`.
- [x] Remover hardcoded visual remanescente fora de tokens, exceto migração ampla de breakpoints `xs/sm/md/lg`, retirada do escopo por decisão do produto.

## Gate Final Por Onda

- [x] `npm run compliance`.
- [x] `npm run lint`.
- [x] `npm run typecheck`.
- [x] `npm test`.
