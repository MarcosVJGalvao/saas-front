# 14 — Refactor Clean Code Skill

## Objetivo

Manter o código simples, legível, testável e sustentável, seguindo os padrões canônicos definidos no projeto.

## Regras gerais

- Funções pequenas com responsabilidade única.
- Nomes autodescritivos — sem abreviações ambíguas.
- Evitar duplicação.
- Evitar componentes gigantes.
- Evitar boolean flags ambíguas.
- Extrair lógica para hooks quando crescer.
- Extrair chamadas externas para services.
- Extrair valores visuais para theme.
- Preferir composição em vez de condicionais complexas.
- Preferir early return quando melhora leitura.
- Separar transformação de dados da renderização.

---

## Anti-padrões críticos — o que refatorar e como

### P1 — Hook exportando componente React

**Sinal de alerta:** arquivo `use*.tsx` exporta um componente além do hook.

```tsx
// ❌ ERRADO
// hooks/useFeatureDetailsPageViewModel.tsx
export const useFeatureDetailsPage = (id: string) => { ... };

export const FeatureDetailsPageContent = () => {   // ← PROIBIDO
  const model = useFeatureDetailsPage('...');
  return <EntityDetailsPage {...model} />;
};
```

**Como refatorar:**
- Remover o componente do arquivo de hook.
- Mover o componente para `pages/FeatureDetailsPage.tsx`.
- O hook retorna apenas `{ entity, loading, errorMessage, onBack, onRetry }`.
- A page usa o hook e renderiza diretamente com shared components.

**Referência:** skill 29 — Details Page Canonical Pattern.

---

### P2 — Page delegando tudo para um componente com muitas props

**Sinal de alerta:** page com 1-3 linhas que apenas repassa props de configuração.

```tsx
// ❌ ERRADO
const ReportCardGradeSubjectsPage = () => (
  <ReportCardCatalogListPage
    mode="gradeSubjects"
    title="Matriz curricular"
    service={(params) => reportCardService.listGradeSubjects(params)}
    createService={(payload) => reportCardService.createGradeSubject(payload)}
    errorMessageFallback="Não foi possível carregar..."
    // ... mais 5 props de config
  />
);
```

**Como refatorar:**
- Criar `hooks/useGradeSubjectListPage.ts` com lógica específica.
- Refatorar a page para usar o hook + `PageHeader` + `ListFilters` + `QueryDataTable` diretamente.
- Avaliar se o componente genérico `ReportCardCatalogListPage` ainda tem utilidade — se não, deletar.

**Referência:** skill 27 — List Page Canonical Pattern.

---

### P3 — ViewModel/hook acumulando responsabilidades demais

**Sinal de alerta:** hook que ao mesmo tempo faz fetch, formata dados, monta estrutura de tabs/sections e retorna objeto de config de UI.

```tsx
// ❌ ERRADO
const data: EntityDetailsPageData = useMemo(() => ({
  headerData: { title: entity.name, subtitle: entity.status },
  tabs: [{ id: 'summary', sections: [{ items: [...] }] }],
}), [entity]);
```

**Como refatorar:**
- Extrair a montagem de `EntityDetailsPageData` para `normalizers/featureDetails.normalizer.ts`.
- Hook retorna `entity` bruta + estados de tela — não monta estrutura de UI.
- Page (ou normalizer) faz a transformação quando necessário.

---

### P4 — JSX inline dentro de hook (column builders)

**Sinal de alerta:** hook com extensão `.tsx` que define arrays de colunas com `render: (row) => <JSX />` inline.

```tsx
// ❌ ERRADO — JSX dentro do hook
// hooks/useFeatureListPage.tsx
const columns = [
  { key: 'actions', render: (row) => <RowActionsMenu actions={[...]} /> }
];
```

**Como refatorar:**
- Criar `components/featureListColumns.tsx` com `buildFeatureColumns(actions)`.
- Hook importa o builder e passa as ações: `const tableColumns = buildFeatureColumns({ onEdit, onDelete })`.
- Arquivo do hook passa a ter extensão `.ts` (sem JSX).

**Referência:** skill 27 — List Page Canonical Pattern.

---

### P5 — Variáveis com nomes ambíguos

**Sinal de alerta:** variáveis de uma só letra (exceto `i`, `j`, `_`) ou abreviações que não se explicam.

```ts
// ❌ ERRADO
const res = await service.list(query);
const id = window.setTimeout(...);
setQuery((q) => ({ ...q, ...patch }));
onPageChange={(p) => updateQuery({ page: p + 1 })}
```

```ts
// ✅ CORRETO
const response = await service.list(queryParams);
const timeoutId = window.setTimeout(...);
setQueryParams((current) => ({ ...current, ...patch }));
onPageChange={(pageIndex) => updateQueryParams({ page: pageIndex + 1 })}
```

> A regra `id-length: min 2` no ESLint já bloqueia variáveis de 1 caractere automaticamente (exceto `i`, `j`, `_`).

---

### P6 — Constante de config de UI no arquivo de hook

**Sinal de alerta:** `const CONTENT`, `const DEFAULT_META`, `const CONFIG` definidos como constantes de módulo em arquivos de hook.

```ts
// ❌ ERRADO — constante de config de UI no hook
const CONTENT: EntityDetailsPageContent = {
  pageTitle: 'Detalhes',
  loadingLabel: 'Carregando...',
};
```

**Como refatorar:**
- Se o valor é de configuração de UI, mover para a page (inline ou como constante local do componente).
- Se é um valor padrão de estado, tipicamente não precisa ser constante de módulo — inicializar direto no `useState`.

---

## Sinais de alerta gerais

- Page com mais de 80 linhas (list/details) ou 120 linhas (form) — extrair para hook.
- Componente com muitas responsabilidades.
- Muitos `if` dentro do JSX.
- Props demais (mais de 8).
- Lógica repetida em várias telas.
- Arquivos difíceis de nomear.
- Funções com nomes genéricos.
- Variáveis chamadas `data`, `obj`, `item`, `res`, `q`, `p` sem contexto.
- Formulário fazendo parse manual no submit dentro da page.
- Hook com extensão `.tsx` sem necessidade real de JSX.

---

## Estratégias de refactor — por tipo de problema

| Problema | Estratégia |
|----------|-----------|
| Hook exporta componente | Mover componente para `pages/` ou `components/` |
| Page com lógica inline | Extrair para `hooks/useFeatureXxxPage.ts` |
| JSX em hook | Extrair para `components/featureListColumns.tsx` |
| ViewModel gordo | Extrair montagem de dados para `normalizers/` |
| Payload montado na page | Extrair para `normalizers/featureForm.normalizer.ts` |
| Schema único create/edit | Separar em `featureCreateForm.schema.ts` e `featureEditForm.schema.ts` |
| Service inline no hook | Extrair para `services/service.ts` |
| Lógica repetida em telas | Extrair para hook compartilhado ou `shared/hooks/` |
| Enum cru exibido | Centralizar tradução em `shared/i18n/pt-BR/enums.ts` |

---

## Referências canônicas obrigatórias

Ao refatorar pages, hooks ou services, sempre consultar:

- `27-list-page-canonical-skill.md` — modelo canônico para list pages
- `28-form-page-canonical-skill.md` — modelo canônico para form pages (create/edit)
- `29-details-page-canonical-skill.md` — modelo canônico para details pages
- `08-service-api-skill.md` — estrutura de 3 arquivos para services
- `09-hook-skill.md` — anti-padrões de hooks

---

## Proibido

- Refatorar escondendo problemas com casting ou `as`.
- Silenciar ESLint ou TypeScript para fazer o build passar.
- Reduzir tipagem para compilar.
- Criar abstração genérica demais sem uso real.
- Manter `use*.tsx` com JSX quando o JSX poderia estar em `components/`.
- Manter page com mais de 80 linhas de lógica sem extrair para hook.
