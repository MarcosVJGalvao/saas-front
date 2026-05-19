# Plataform SaaS — Frontend

Frontend da plataforma SaaS multi-tenant, construído com React + TypeScript. O projeto é organizado por domínio (Platform e Client), segue Clean Architecture adaptada para frontend e mantém padrões rígidos de separação de responsabilidades entre camadas.

---

## Stack

| Categoria | Tecnologia |
|-----------|-----------|
| UI | React 19 + Material UI |
| Build | Vite |
| Tipagem | TypeScript strict |
| Roteamento | React Router v7 |
| Formulários | React Hook Form + Zod |
| HTTP | Axios |
| Testes | Vitest + Testing Library |
| Qualidade | ESLint + Prettier |

---

## Rodando o projeto

```bash
npm install
npm run dev
```

Acesso local: `http://localhost:5173`

| Contexto | URL |
|----------|-----|
| Login plataforma | `/platform/login` |
| Login cliente | `/client/login` |

---

## Scripts

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # typecheck + build de produção
npm run preview      # serve o build localmente
npm run lint         # ESLint (falha em qualquer warning)
npm run lint:fix     # correções automáticas de lint
npm run typecheck    # tsc --noEmit nos dois tsconfigs
npm run test         # suíte Vitest
npm run compliance   # auditoria estática de arquitetura
npm run check:all    # lint + typecheck + test + build
```

### Quality gate obrigatório

Antes de considerar qualquer alteração concluída:

```bash
npm run compliance
npm run lint
npm run typecheck
npm run test
```

---

## Domínios da aplicação

### Platform (`src/features/platform`)

Ambiente administrativo da plataforma. Gerencia clientes, planos e assinaturas.

Rotas: `/platform/login` · `/platform/home` · `/platform/clients` · `/platform/plans` · `/platform/subscriptions`

### Client (`src/features/client`)

Ambiente acessado pelo tenant (escola/instituição). Gerencia alunos, matrículas, colaboradores, financeiro e relatórios.

Rotas: `/client/login` · `/client/home` · `/client/students` · `/client/employees` · ...

---

## Estrutura de pastas

```
src/
  app/
    guards/        → AuthGuard, RoleGuard, PermissionGuard
    layout/        → AppLayout, Sidebar, Topbar
    providers/     → QueryProvider, ThemeProvider, SnackbarProvider
    router/        → definição centralizada de rotas
    theme/         → tokens, palette, typography, createAppTheme

  features/
    platform/      → features do contexto administrativo
    client/        → features do contexto do cliente

  shared/
    components/    → design system: inputs, layout, feedback, data-display, form
    hooks/         → hooks reutilizáveis
    services/      → httpClient, interceptors
    formatters/    → formatIsoDate, formatCurrency, ...
    masks/         → maskCpf, maskPhone, maskCep, ...
    parsers/       → parseCurrency, parseDate, ...
    normalizers/   → transformações compartilhadas
    i18n/pt-BR/    → errors.ts, enums.ts, labels.ts, validation.ts
    types/         → PaginatedResponse, PaginationMeta, ...
    utils/

  pages/           → páginas públicas ou neutras (sem feature)
  main.tsx
```

### Estrutura interna de cada feature

```
feature/
  types/           → entidade + requests + query params (contrato com o backend)
  schemas/         → schemas Zod + types inferidos
  normalizers/     → transformação de dados (funções puras)
  services/
    endpoints.ts   → chamadas HTTP puras
    types.ts       → aliases de request/response
    service.ts     → métodos async consumidos pelos hooks
  hooks/           → estado, lógica de negócio, ações da tela
  components/      → JSX exclusivo da feature (column builders, steps, etc.)
  pages/           → orquestração de layout
```

---

## Arquitetura

### Fluxo de dados

```
Page → Hook → Service → HttpClient → API
```

### Responsabilidade de cada camada

| Camada | Responsabilidade |
|--------|-----------------|
| `types/` | Contratos com o backend. Sem lógica, sem imports internos. |
| `schemas/` | Validação com Zod. Types vêm de `z.infer` — nunca duplicar. |
| `normalizers/` | Transformação de dados: form → payload, entidade → exibição. Funções puras. |
| `services/` | Comunicação HTTP. Sempre 3 arquivos. Nunca importados diretamente por pages. |
| `hooks/` | Estado, efeitos, lógica de negócio. Sem JSX. Sem exportar componentes. |
| `components/` | JSX exclusivo da feature. Sem chamar services diretamente. |
| `pages/` | Orquestra layout, hooks e shared components. Sem lógica inline. |

### Regras de importação entre camadas

| Camada | Pode importar de | Proibido |
|--------|-----------------|---------|
| `types/` | nada | qualquer outra camada |
| `schemas/` | `types/` | `hooks/`, `services/`, `components/` |
| `normalizers/` | `types/`, `schemas/` | `hooks/`, `services/`, `components/` |
| `services/` | `types/`, `httpClient` | `hooks/`, `components/` |
| `hooks/` | `types/`, `services/`, `normalizers/` | JSX — extensão `.ts` se não tem JSX |
| `components/` | `types/`, `hooks/`, `shared/` | `services/` diretamente |
| `pages/` | tudo acima | lógica de negócio, `useState` de domínio, fetch direto |

---

## Services — estrutura obrigatória

Toda feature tem exatamente 3 arquivos em `services/`. Nunca um arquivo único.

```
services/
  endpoints.ts  → só httpClient.get/post/patch/delete — sem await, sem .data
  types.ts      → aliases de request/response importados de types/feature.ts
  service.ts    → métodos async: chama endpoint, retorna .data
```

```ts
// endpoints.ts — só retorna a Promise, sem await
export const featureEndpoints = {
  list: (params: FeatureListParams) =>
    httpClient.get<FeatureListResponse>('/api/features', { params }),
};

// service.ts — async/await sobre os endpoints
export const featureService = {
  async list(params: FeatureListParams): Promise<FeatureListResponse> {
    const { data } = await featureEndpoints.list(params);
    return data;
  },
};
```

---

## Padrões canônicos de page

Todo código novo segue um dos quatro padrões abaixo. Sem variações.

### List page

```
hooks/useFeatureList.ts           → fetch, queryParams, paginação, loading, errorMessage
hooks/useFeatureListPage.ts       → ações, modal de delete, column builders
components/featureListColumns.tsx → buildFeatureColumns() com JSX das células
pages/FeaturePage.tsx             → PageHeader + ListFilters + QueryDataTable + ConfirmDialog
```

### Details page

```
hooks/useFeatureDetailsPage.ts    → fetch, loading, errorMessage, onBack, onRetry
pages/FeatureDetailsPage.tsx      → AppStack + SectionCard + KeyValueGrid (sem componente intermediário)
```

A page trata os três estados antes de renderizar:

```tsx
if (loading) return <AppLoadingIndicator />;
if (errorMessage) return <AppErrorState message={errorMessage} onRetry={() => void onRetry()} />;
if (!entity) return null;
// renderiza com shared components
```

### Form page — create e edit sempre separados

Create e Edit têm hooks, schemas e pages próprios. O Edit lê `location.state.entity` para evitar GET redundante ao vir de detalhes.

```
schemas/featureCreateForm.schema.ts
schemas/featureEditForm.schema.ts
normalizers/featureForm.normalizer.ts  → toCreatePayload + toEditFormValues + toEditPayload
hooks/useFeatureCreatePage.ts
hooks/useFeatureEditPage.ts            → lê location.state.entity, fallback para API
pages/FeatureCreatePage.tsx
pages/FeatureEditPage.tsx              → campos readonly fora do AppForm
```

Navegação de detalhes → edição (evita GET redundante):

```ts
navigate(`/client/features/${entity.id}/edit`, { state: { entity } });
```

### Wizard (multi-etapa)

Usa o shared `StepperWizard`. Dois hooks com responsabilidades distintas.

```
hooks/useFeatureOnboardingForm.ts    → estado: activeStep, value, uiExtras, actions
hooks/useFeatureOnboardingPage.ts    → navegação entre steps, disabled state, API call
hooks/useFeatureOnboardingActions.ts → um método por campo
components/onboarding/               → roteador de steps + steps individuais + Summary
pages/FeatureOnboardingPage.tsx      → StepperWizard + Summary
```

Steps recebem sempre `{ value, uiExtras, actions }`. Normalização aplicada apenas no payload final.

---

## Hooks — regras

- Hook é responsabilidade única: estado ou ações, nunca os dois misturados com lógica de layout.
- Extensão `.ts` — se o arquivo tem JSX, está no lugar errado.
- **Proibido:** exportar componente React de dentro de hook.
- **Proibido:** montar estrutura de tabs/sections via `useMemo` — isso vai para o normalizer.
- **Proibido:** JSX inline em arrays de colunas — vai para `components/featureListColumns.tsx`.
- Separação obrigatória para listagens: `useFeatureList` (dados) + `useFeatureListPage` (lógica da page).

---

## Formulários — regras

- Todo formulário usa React Hook Form + Zod.
- Types vêm de `z.infer` — nunca duplicar o tipo do schema.
- Create e Edit são sempre separados — nunca `isEditMode ? ... : ...`.
- Payload é construído no normalizer, nunca na page.
- Campos com máscara enviam dado limpo para o backend.

| Dado | Exibição | Backend |
|------|----------|---------|
| CPF/CNPJ | `123.456.789-00` | `12345678900` |
| Telefone | `(11) 99999-9999` | `11999999999` |
| Data | `25/09/2024` | `2024-09-25` |
| Moeda | `R$ 1.250,90` | `1250.9` |

---

## Aliases de import

```ts
@/*          → src/*
@app/*       → src/app/*
@features/*  → src/features/*
@shared/*    → src/shared/*
@theme/*     → src/app/theme/*
```

Usar sempre aliases — sem imports relativos profundos (`../../..`).

---

## Design System

Tokens e tema em `src/app/theme/`. Todo componente visual usa cores, espaçamentos e tipografia do tema.

Componentes wrapper disponíveis (usar sempre no lugar do MUI cru):

`AppButton` · `AppTextField` · `AppSelect` · `AppDatePicker` · `AppForm` · `AppStack` · `PageHeader` · `SectionCard` · `KeyValueGrid` · `QueryDataTable` · `ListFilters` · `ConfirmDialog` · `AppAlert` · `AppLoadingIndicator` · `AppErrorState` · `StatusChip` · `RowActionsMenu`

---

## Testes

Cobertura prioritária:

- schemas, normalizers, parsers, formatters
- hooks com lógica de negócio
- services
- componentes compartilhados
- fluxos críticos de formulário e autenticação

```bash
npm run test
```

---

## Compliance automatizado

O script `scripts/compliance-scan.mjs` audita:

- padrões proibidos de código
- imports problemáticos entre camadas
- dependência indevida de `shared` → `features`
- uso de MUI cru onde existe wrapper compartilhado
- encoding corrompido (caractere `U+FFFD`)
- TypeScript strict

```bash
npm run compliance
```
