# Plano de Refatoração — Padronização Arquitetural do Projeto

## Contexto

O projeto é uma plataforma SaaS multi-tenant com dois domínios: **Platform** (admin SaaS) e **Client** (escola/instituição). A estrutura geral já segue boas práticas (feature-based, ViewModel hooks, service factory), porém existem inconsistências graves que violam SoC/SRP e tornam o projeto difícil de navegar e manter:

1. **Hooks que exportam componentes React** — o anti-padrão mais crítico (8+ arquivos)
2. **Pages que delegam tudo a um componente com 15 props** — sem orquestração real
3. **ViewModel hooks que contêm toda a montagem de dados + JSX de renderização**
4. **Ausência de modelo canônico documentado** para list, form e details pages

O objetivo desta refatoração é estabelecer um padrão único, reproduzível e claro para todas as pages, hooks, services, schemas e types do projeto.

---

## Diagnóstico: Anti-padrões Encontrados

### 🔴 P1 — Hook exporta componente React (8+ arquivos)

**Arquivos afetados:**
- `src/features/client/medical-info/hooks/useMedicalInfoDetailsPageViewModel.tsx`
- `src/features/client/students/hooks/useStudentDetailsPageViewModel.tsx`
- `src/features/client/people/hooks/usePersonDetailsPageViewModel.tsx`
- `src/features/client/employees/hooks/useEmployeeDetailsPageViewModel.tsx`
- `src/features/client/documents/hooks/useDocumentDetailsPageViewModel.tsx`
- `src/features/client/contacts/hooks/useContactDetailsPageViewModel.tsx`
- `src/features/client/addresses/hooks/useAddressDetailsPageViewModel.tsx`
- `src/features/client/academic/hooks/useAcademicYearDetailsPageViewModel.tsx`

**Por que é errado:**

Um arquivo de hook (`use*.ts` / `use*.tsx`) tem uma única responsabilidade: encapsular estado e lógica. Exportar um componente React de dentro de um hook viola o princípio de responsabilidade única e quebra a separação de camadas. O consumidor (a page) perde a clareza de onde está o componente — ele está num arquivo de hook. Além disso, a page vira uma casca de 1 linha sem nenhum valor.

**Problema:**
```tsx
// ❌ ERRADO — hook file exporta componente
export const MedicalInfoDetailsPageContent = () => {
  const model = useMedicalInfoDetailsPageViewModel();
  return <EntityDetailsPage {...model} />;
};
```
```tsx
// ❌ ERRADO — page é 1 linha sem valor algum
const MedicalInfoDetailsPage = () => <MedicalInfoDetailsPageContent />;
```

**Correto:**
```ts
// ✅ CORRETO — hook só exporta hook, extensão .ts
// hooks/useMedicalInfoDetailsPage.ts
export const useMedicalInfoDetailsPage = (id: string) => {
  // fetch + normalizer
  const data = entity ? toMedicalInfoDetailsData(entity) : { headerData: null, tabs: [] };
  return { viewState, data, errorMessage, onBack, onRetry };
};
```
```tsx
// ✅ CORRETO — page usa EntityDetailsPage diretamente, sem componente intermediário
// pages/MedicalInfoDetailsPage.tsx
const MedicalInfoDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { viewState, data, errorMessage, onBack, onRetry } = useMedicalInfoDetailsPage(id!);
  return (
    <AppStack>
      <PageHeader title="Informações Médicas" actions={...} />
      <EntityDetailsPage
        viewState={viewState}
        data={data}
        errorMessage={errorMessage}
        onRetry={onRetry}
        {/* content é opcional — defaults vêm de sharedComponentsI18n.entityDetails */}
        {/* passe content={{ emptyTitle: '...' }} apenas para sobrescrever algo específico */}
      />
    </AppStack>
  );
};
```

---

### 🔴 P2 — Page que apenas passa props para um componente genérico

**Arquivo afetado:**
- `src/features/client/report-cards/pages/ReportCardGradeSubjectsPage.tsx`
- Outros similares no módulo `report-cards` (Subjects, Grades, etc.)

**Por que é errado:**

A page existe para orquestrar. Quando ela só repassa config para um componente ultra-genérico, o componente genérico acaba acumulando toda a complexidade (props de título, subtítulo, service, createService, mensagens de erro, etc.). Isso cria acoplamento invertido: a page não tem comportamento, e o componente tem comportamento demais. Cada page deve ter seu próprio hook com lógica específica e usar os shared components do design system diretamente.

**Problema:**
```tsx
// ❌ ERRADO — page não orquestra nada, só repassa config
const ReportCardGradeSubjectsPage = () => (
  <ReportCardCatalogListPage
    mode="gradeSubjects"
    title="Matriz curricular"
    subtitle="Configure disciplinas por série e ano letivo."
    routeBase="/client/report-cards/grade-subjects"
    service={(params) => reportCardService.listGradeSubjects(params)}
    createService={(payload) => reportCardService.createGradeSubject(payload)}
    errorMessageFallback="Não foi possível carregar matriz curricular."
    emptyTitle="Nenhum vínculo encontrado"
    emptyDescription="Disciplinas vinculadas por série aparecerão nesta consulta."
  />
);
```

**Correto:**
```tsx
// ✅ CORRETO — page orquestra com hook próprio
const ReportCardGradeSubjectsPage = () => {
  const navigate = useNavigate();
  const { list, columns, createModal } = useGradeSubjectListPage();

  return (
    <AppStack>
      <PageHeader
        title="Matriz curricular"
        subtitle="Configure disciplinas por série e ano letivo."
        actions={<AppButton onClick={createModal.open}>Novo vínculo</AppButton>}
      />
      <QueryDataTable
        rows={list.rows}
        columns={columns}
        loading={list.loading}
        errorMessage={list.errorMessage}
        page={(list.query.page ?? 1) - 1}
        rowsPerPage={list.query.limit ?? 10}
        totalCount={list.meta.total}
        onPageChange={(pageIndex) => list.updateQuery({ page: pageIndex + 1 })}
        onRowsPerPageChange={(rowsPerPage) => list.updateQuery({ limit: rowsPerPage, page: 1 })}
      />
    </AppStack>
  );
};
```

---

### 🟡 P3 — ViewModel acumula responsabilidades demais

**Por que é errado:**

Hooks como `useMedicalInfoDetailsPageViewModel` fazem ao mesmo tempo: fetch de dados, tratamento de erro, formatação de valores para exibição (máscaras, datas), e montagem completa da estrutura de tabs/sections que o componente de UI vai consumir. Isso viola SRP. A montagem da estrutura de exibição (`EntityDetailsPageData`) é uma transformação de dados — responsabilidade do **normalizer**, não do hook.

**Problema:**
```tsx
// ❌ ERRADO — hook monta estrutura de UI via useMemo
const data: EntityDetailsPageData = useMemo(
  () => ({
    headerData: medicalInfo ? {
      title: medicalInfo.person?.fullName ?? 'Registro médico',
      subtitle: medicalInfo.bloodType ?? 'Sem tipo sanguíneo',
      avatarFallback: 'M',
    } : null,
    tabs: medicalInfo ? [{
      id: 'summary',
      label: 'Resumo',
      sections: [
        {
          id: 'person',
          title: 'Pessoa',
          items: [
            { label: 'Pessoa', value: medicalInfo.person?.fullName ?? '-' },
            { label: 'ID da pessoa', value: medicalInfo.personId ?? '-' },
          ],
        },
        // ... mais 3 sections
      ],
    }] : [],
  }),
  [medicalInfo],
);
```

**Correto:**
```tsx
// ✅ CORRETO — hook apenas chama o normalizer
// hooks/useMedicalInfoDetailsPage.ts
const data = medicalInfo ? toMedicalInfoDetailsData(medicalInfo) : null;
```
```ts
// ✅ CORRETO — normalizer é função pura e testável
// normalizers/medicalInfoDetails.normalizer.ts
export const toMedicalInfoDetailsData = (entity: MedicalInfo): EntityDetailsPageData => ({
  headerData: {
    title: entity.person?.fullName ?? entity.personId ?? 'Registro médico',
    subtitle: entity.bloodType ?? 'Sem tipo sanguíneo',
    avatarFallback: 'M',
  },
  tabs: [{
    id: 'summary',
    label: 'Resumo',
    sections: [
      {
        id: 'person',
        title: 'Pessoa',
        items: [
          { label: 'Pessoa', value: entity.person?.fullName ?? '-' },
          { label: 'ID da pessoa', value: entity.personId ?? entity.person?.id ?? '-' },
        ],
      },
      // ...
    ],
  }],
});
```

---

### 🟡 P4 — JSX dentro de hooks (column builders inline)

**Por que é errado:**

Quando um hook retorna arrays de colunas com funções `render: (row) => <JSX />` definidas inline dentro do hook, o arquivo precisa ter extensão `.tsx` e mistura definição de lógica com definição de apresentação. A solução é extrair os builders para arquivos `.tsx` em `components/`, que é a camada onde JSX é permitido.

**Problema:**
```tsx
// ❌ ERRADO — JSX inline dentro do hook
// useAddressesListPageViewModel.ts → precisa virar .tsx
const columns: DataTableColumn<Address>[] = [
  {
    key: 'actions',
    header: 'Ações',
    render: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
  },
];
```

**Correto:**
```tsx
// ✅ CORRETO — builder em components/
// components/addressListColumns.tsx
export const buildAddressColumns = (actions: AddressColumnActions): DataTableColumn<Address>[] => [
  { key: 'street', header: 'Endereço', render: (row) => formatAddress(row) },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => <RowActionsMenu actions={[
      { label: 'Ver detalhes', onClick: () => actions.onDetails(row) },
      { label: 'Editar', onClick: () => actions.onEdit(row) },
      { label: 'Excluir', onClick: () => actions.onDelete(row), color: 'error.main' },
    ]} />,
  },
];
```
```ts
// ✅ CORRETO — hook importa o builder, sem JSX
// hooks/useAddressesListPage.ts (extensão .ts)
import { buildAddressColumns } from '../components/addressListColumns';

const columns = buildAddressColumns({
  onDetails: (row) => navigate(`/client/addresses/${row.id}`),
  onEdit: (row) => navigate(`/client/addresses/${row.id}/edit`),
  onDelete: setPendingDelete,
});
```

---

## Arquitetura Alvo — Camadas e Responsabilidades

```
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA        RESPONSABILIDADE                  ARQUIVO         │
├─────────────────────────────────────────────────────────────────┤
│  types/        Contratos com o backend (API)     *.types.ts      │
│  schemas/      Validação de formulários (Zod)    *.schema.ts     │
│  normalizers/  Transformação de dados            *.normalizer.ts │
│  services/     Chamadas HTTP puras               *.service.ts    │
│  hooks/        Estado + lógica de negócio        use*.ts         │
│  components/   Componentes apresentacionais      *.tsx           │
│  pages/        Orquestração de layout e rotas    *Page.tsx       │
└─────────────────────────────────────────────────────────────────┘
```

### Regras de importação entre camadas

| Camada | Pode importar de | NÃO pode importar de |
|--------|-----------------|----------------------|
| `types/` | — (nada interno) | qualquer outra camada |
| `schemas/` | `types/`, `shared/schemas` | `components/`, `hooks/`, `services/` |
| `normalizers/` | `types/`, `schemas/`, `shared/formatters`, `shared/masks` | `components/`, `hooks/`, `services/` |
| `services/` | `types/`, `shared/services/httpClient` | `hooks/`, `components/`, `schemas/` |
| `hooks/` | `types/`, `services/`, `normalizers/`, outros `hooks/`, `shared/hooks` | `components/` (JSX proibido em `.ts`) |
| `components/` | `types/`, `hooks/`, `shared/components`, `normalizers/` | `services/` diretamente |
| `pages/` | tudo acima | lógica de negócio inline (sem `useState` de domínio, sem `fetch`) |

> **Regra de ouro:** se o arquivo tem extensão `.ts` (sem x), não pode ter JSX. Se tem `.tsx`, pode ter JSX mas não deve ter lógica de estado complexa — isso vai para o hook.

---

## Modelos Canônicos

Os três modelos abaixo são o padrão a ser seguido em **todas** as features do projeto. Cada variação deve ter justificativa explícita.

---

### 🗂️ Modelo Canônico — LIST PAGE

#### Estrutura de arquivos

```
feature/
├── types/
│   └── feature.ts                    ← entidade + requests + query params (contrato com o backend)
├── services/
│   ├── endpoints.ts                  ← chamadas HTTP puras (só httpClient)
│   ├── types.ts                      ← aliases de request/response (ponte entre types/ e services/)
│   └── service.ts                    ← métodos async que chamam endpoints e retornam .data
├── normalizers/
│   └── featureList.normalizer.ts     ← formatações de células (opcional, só se complexo)
├── hooks/
│   ├── useFeatureList.ts             ← fetch + paginação + query state
│   └── useFeatureListPage.ts         ← lógica da página: filtros, ações, modais
├── components/
│   └── featureListColumns.tsx        ← buildFeatureColumns(): DataTableColumn[]
└── pages/
    └── FeaturePage.tsx               ← orquestra: hook + PageHeader + ListFilters + QueryDataTable
```

> **Por que três arquivos em `services/`?**
> - `endpoints.ts` — responsabilidade única: sabe onde está a API e como chamar. Não sabe o que fazer com a resposta.
> - `types.ts` — responsabilidade única: nomeia os contratos de request/response usados pelo service, importando os tipos de `types/feature.ts`.
> - `service.ts` — responsabilidade única: expõe a interface que os hooks consomem, desacoplada do `httpClient` diretamente.

#### `types/feature.ts`
```ts
// Contrato com o backend — entidade, requests e query params

export type FeatureStatus = 'active' | 'inactive';

export type Feature = {
  id: string;
  name: string;
  status: FeatureStatus;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FeatureQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: FeatureStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type CreateFeatureRequest = {
  name: string;
  status?: FeatureStatus;
  description?: string;
};

export type UpdateFeatureRequest = {
  [Key in keyof CreateFeatureRequest]?: CreateFeatureRequest[Key];
};
```

#### `services/types.ts`
```ts
// Aliases que fazem a ponte entre types/feature.ts e os contratos de request/response do service

import type {
  Feature,
  FeatureQueryParams,
  CreateFeatureRequest,
  UpdateFeatureRequest,
} from '../types/feature';
import type { PaginatedResponse } from '@shared/types/pagination';

export type FeatureListResponse = PaginatedResponse<Feature>;
export type FeatureDetailsResponse = Feature;
export type FeatureCreateResponse = Feature;
export type FeatureUpdateResponse = Feature;
export type FeatureDeleteResponse = void;

export type FeatureListParams = FeatureQueryParams;
export type FeatureCreatePayload = CreateFeatureRequest;
export type FeatureUpdatePayload = UpdateFeatureRequest;
```

#### `services/endpoints.ts`
```ts
// Responsabilidade única: chamadas HTTP puras — sabe onde está a API, não sabe o que fazer com os dados

import { httpClient } from '@shared/services/httpClient';
import type {
  FeatureListParams,
  FeatureListResponse,
  FeatureDetailsResponse,
  FeatureCreatePayload,
  FeatureCreateResponse,
  FeatureUpdatePayload,
  FeatureUpdateResponse,
  FeatureDeleteResponse,
} from './types';

const BASE_PATH = '/api/features';

export const featureEndpoints = {
  list: (params: FeatureListParams) =>
    httpClient.get<FeatureListResponse>(BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),

  getById: (id: string) =>
    httpClient.get<FeatureDetailsResponse>(`${BASE_PATH}/${id}`),

  create: (payload: FeatureCreatePayload) =>
    httpClient.post<FeatureCreateResponse>(BASE_PATH, payload),

  update: (id: string, payload: FeatureUpdatePayload) =>
    httpClient.patch<FeatureUpdateResponse>(`${BASE_PATH}/${id}`, payload),

  remove: (id: string) =>
    httpClient.delete<FeatureDeleteResponse>(`${BASE_PATH}/${id}`),
};
```

#### `services/service.ts`
```ts
// Responsabilidade única: interface que os hooks consomem — async/await sobre os endpoints

import { featureEndpoints } from './endpoints';
import type {
  FeatureListParams,
  FeatureListResponse,
  FeatureDetailsResponse,
  FeatureCreatePayload,
  FeatureCreateResponse,
  FeatureUpdatePayload,
  FeatureUpdateResponse,
} from './types';

export const featureService = {
  async list(params: FeatureListParams): Promise<FeatureListResponse> {
    const { data } = await featureEndpoints.list(params);
    return data;
  },

  async getById(id: string): Promise<FeatureDetailsResponse> {
    const { data } = await featureEndpoints.getById(id);
    return data;
  },

  async create(payload: FeatureCreatePayload): Promise<FeatureCreateResponse> {
    const { data } = await featureEndpoints.create(payload);
    return data;
  },

  async update(id: string, payload: FeatureUpdatePayload): Promise<FeatureUpdateResponse> {
    const { data } = await featureEndpoints.update(id, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await featureEndpoints.remove(id);
  },
};
```

#### `hooks/useFeatureList.ts`
```ts
import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type { Feature, FeatureQueryParams } from '../types/feature';
import { featureService } from '../services/service';

export const useFeatureList = () => {
  const [rows, setRows] = useState<Feature[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [queryParams, setQueryParams] = useState<FeatureQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchList = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await featureService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar os registros.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchList(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchList]);

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    updateQueryParams: (patch: Partial<FeatureQueryParams>) =>
      setQueryParams((current) => ({ ...current, ...patch, page: 1 })),
    reload: fetchList,
  };
};
```

#### `hooks/useFeatureListPage.ts`
```ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildFeatureColumns } from '../components/featureListColumns';
import { featureService } from '../services/service';
import { useFeatureList } from './useFeatureList';
import type { Feature } from '../types/feature';

export const useFeatureListPage = () => {
  const navigate = useNavigate();
  const featureList = useFeatureList();
  const [featurePendingDelete, setFeaturePendingDelete] = useState<Feature | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!featurePendingDelete) return;
    setIsDeleting(true);
    try {
      await featureService.remove(featurePendingDelete.id);
      setFeaturePendingDelete(undefined);
      await featureList.reload();
    } catch {
      // erro silencioso — a lista reexibirá o errorMessage no reload
    } finally {
      setIsDeleting(false);
    }
  };

  const tableColumns = buildFeatureColumns({
    onDetails: (feature) => navigate(`/client/features/${feature.id}`),
    onEdit: (feature) => navigate(`/client/features/${feature.id}/edit`),
    onDelete: setFeaturePendingDelete,
  });

  return {
    featureList,
    tableColumns,
    deleteModal: {
      featurePendingDelete,
      openWith: setFeaturePendingDelete,
      close: () => setFeaturePendingDelete(undefined),
      confirm: handleDeleteConfirm,
      isDeleting,
    },
  };
};
```

#### `components/featureListColumns.tsx`
```tsx
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { StatusChip } from '@shared/components/data-display/StatusChip';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { Feature } from '../types/feature';

export interface FeatureColumnActions {
  onDetails: (row: Feature) => void;
  onEdit: (row: Feature) => void;
  onDelete: (row: Feature) => void;
}

export const buildFeatureColumns = (actions: FeatureColumnActions): DataTableColumn<Feature>[] => [
  {
    key: 'name',
    header: 'Nome',
    render: (row) => row.name,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusChip status={row.status} />,
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <RowActionsMenu
        actions={[
          { label: 'Ver detalhes', onClick: () => actions.onDetails(row) },
          { label: 'Editar', onClick: () => actions.onEdit(row) },
          { label: 'Excluir', onClick: () => actions.onDelete(row), color: 'error.main' },
        ]}
      />
    ),
  },
];
```

#### `pages/FeaturePage.tsx`
```tsx
import { useNavigate } from 'react-router-dom';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppButton } from '@shared/components/inputs/AppButton';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { useFeatureListPage } from '../hooks/useFeatureListPage';

const FeaturePage = () => {
  const navigate = useNavigate();
  const { featureList, tableColumns, deleteModal } = useFeatureListPage();

  return (
    <AppStack>
      <PageHeader
        title="Features"
        subtitle="Gerencie os registros de feature."
        actions={
          <AppButton variant="contained" onClick={() => navigate('/client/features/new')}>
            Nova feature
          </AppButton>
        }
      />
      <ListFilters
        fields={[
          { key: 'search', type: 'text', placeholder: 'Buscar pelo nome...' },
          {
            key: 'status',
            type: 'select',
            label: 'Status',
            options: [
              { value: '', label: 'Todos' },
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ],
          },
        ]}
        values={{
          search: featureList.queryParams.search ?? '',
          status: featureList.queryParams.status ?? '',
        }}
        onChange={(filterKey, filterValue) =>
          featureList.updateQueryParams({ [filterKey]: filterValue || undefined })
        }
      />
      <QueryDataTable
        rows={featureList.rows}
        columns={tableColumns}
        loading={featureList.loading}
        errorMessage={featureList.errorMessage}
        page={(featureList.queryParams.page ?? 1) - 1}
        rowsPerPage={featureList.queryParams.limit ?? 10}
        totalCount={featureList.pagination.total}
        onPageChange={(pageIndex) => featureList.updateQueryParams({ page: pageIndex + 1 })}
        onRowsPerPageChange={(rowsPerPage) =>
          featureList.updateQueryParams({ limit: rowsPerPage, page: 1 })
        }
      />
      <ConfirmDialog
        open={Boolean(deleteModal.featurePendingDelete)}
        title="Excluir registro"
        description={`Deseja excluir "${deleteModal.featurePendingDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmColor="error"
        onConfirm={() => void deleteModal.confirm()}
        onCancel={deleteModal.close}
        loading={deleteModal.isDeleting}
      />
    </AppStack>
  );
};

export default FeaturePage;
```

---

### 📝 Modelo Canônico — FORM PAGE (Create e Edit são páginas separadas)

**Princípio fundamental:** Create e Edit são **páginas independentes** com hooks próprios. Não existe um componente `FeatureFormPage` compartilhado entre elas, porque a página de edição pode ter campos bloqueados, seções diferentes, validações distintas e comportamento específico. Reutilizar o form via props condicionais (`isEditMode ? ...`) cria ramificações implícitas que violam SRP.

#### Estrutura de arquivos

```
feature/
├── types/
│   └── feature.types.ts
├── schemas/
│   ├── featureCreateForm.schema.ts   ← schema de criação
│   └── featureEditForm.schema.ts     ← schema de edição (pode diferir)
├── normalizers/
│   └── featureForm.normalizer.ts     ← toCreatePayload() + toEditFormValues() + toEditPayload()
├── services/
│   └── feature.service.ts
├── hooks/
│   ├── useFeatureCreatePage.ts       ← lógica de criação
│   └── useFeatureEditPage.ts         ← carregar entidade + lógica de edição
└── pages/
    ├── FeatureCreatePage.tsx         ← form de criação com seus campos
    └── FeatureEditPage.tsx           ← form de edição com seus campos (pode ter campos readonly)
```

> **`components/` da feature:** só criar se houver um componente genuinamente exclusivo desta feature (ex: um seletor customizado, um card especial). Não criar componentes apenas para dividir o form em partes menores — isso vai para a própria page.

#### `schemas/featureCreateForm.schema.ts`
```ts
import { z } from 'zod';

export const featureCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  status: z.enum(['active', 'inactive'], { required_error: 'Selecione o status.' }),
  description: z.string().optional(),
});

export type FeatureCreateFormValues = z.infer<typeof featureCreateFormSchema>;
```

#### `schemas/featureEditForm.schema.ts`
```ts
import { z } from 'zod';

// Schema de edição pode ter campos diferentes — ex: status é obrigatório no edit
export const featureEditFormSchema = z.object({
  status: z.enum(['active', 'inactive'], { required_error: 'Selecione o status.' }),
  description: z.string().optional(),
  // name não aparece: é readonly na edição
});

export type FeatureEditFormValues = z.infer<typeof featureEditFormSchema>;
```

#### `normalizers/featureForm.normalizer.ts`
```ts
import type { Feature } from '../types/feature';
import type { FeatureCreateFormValues } from '../schemas/featureCreateForm.schema';
import type { FeatureEditFormValues } from '../schemas/featureEditForm.schema';

export const toFeatureCreatePayload = (values: FeatureCreateFormValues): FeatureCreatePayload => ({
  name: values.name.trim(),
  status: values.status,
  description: values.description?.trim() || undefined,
});

export const toFeatureEditFormValues = (entity: Feature): FeatureEditFormValues => ({
  status: entity.status,
  description: entity.description ?? '',
});

export const toFeatureEditPayload = (values: FeatureEditFormValues): FeatureEditPayload => ({
  status: values.status,
  description: values.description?.trim() || undefined,
});
```

#### `hooks/useFeatureCreatePage.ts`
```ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { featureCreateFormSchema } from '../schemas/featureCreateForm.schema';
import { toFeatureCreatePayload } from '../normalizers/featureForm.normalizer';
import { featureService } from '../services/service';

export const useFeatureCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm(featureCreateFormSchema);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await featureService.create(toFeatureCreatePayload(values));
      navigate('/client/features');
    } catch {
      setErrorMessage('Erro ao criar registro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  });

  return {
    form,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => navigate('/client/features'),
  };
};
```

#### `hooks/useFeatureEditPage.ts`

> **Estratégia de pré-carregamento:**
> O fluxo mais comum é: detalhes → edição. A entidade já está na memória da página de detalhes.
> Para evitar um GET redundante, a navegação para edição passa a entidade no `state` do React Router.
> O hook lê `location.state.entity` primeiro; só faz o GET se o estado não estiver disponível (acesso direto pela URL).

```ts
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { featureEditFormSchema } from '../schemas/featureEditForm.schema';
import { toFeatureEditFormValues, toFeatureEditPayload } from '../normalizers/featureForm.normalizer';
import { featureService } from '../services/service';
import type { Feature } from '../types/feature';

type FeatureEditLocationState = { entity?: Feature };

export const useFeatureEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as FeatureEditLocationState | null;

  const form = useAppForm(featureEditFormSchema);
  const [entity, setEntity] = useState<Feature | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // Pré-popula o form se a entidade já veio via navegação
  useEffect(() => {
    if (locationState?.entity) {
      form.reset(toFeatureEditFormValues(locationState.entity));
    }
  }, [locationState?.entity, form]);

  // Fallback: busca da API se chegou pela URL diretamente
  const fetchEntity = useCallback(async () => {
    if (locationState?.entity) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEntity = await featureService.getById(id);
      setEntity(fetchedEntity);
      form.reset(toFeatureEditFormValues(fetchedEntity));
    } catch {
      setErrorMessage('Erro ao carregar registro.');
    } finally {
      setLoading(false);
    }
  }, [id, locationState?.entity, form]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchEntity(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEntity]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await featureService.update(id, toFeatureEditPayload(values));
      navigate('/client/features');
    } catch {
      setErrorMessage('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  });

  return {
    form,
    entity,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => navigate('/client/features'),
  };
};
```

#### Como navegar para edição a partir de detalhes

Na página ou hook de detalhes, ao clicar em "Editar", passar a entidade no `state`:

```ts
// Em useFeatureDetailsPage.ts ou diretamente na FeatureDetailsPage
navigate(`/client/features/${entity.id}/edit`, { state: { entity } });
```

Isso garante que a edit page não dispare um GET extra quando vinda do fluxo normal de detalhes.

#### `pages/FeatureCreatePage.tsx`
```tsx
import { useNavigate } from 'react-router-dom';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormTextField } from '@shared/components/form/FormTextField';
import { FormActions } from '@shared/components/form/FormActions';
import { useFeatureCreatePage } from '../hooks/useFeatureCreatePage';
import type { FeatureCreateFormValues } from '../schemas/featureCreateForm.schema';

const FeatureCreatePage = () => {
  const { form, submitting, errorMessage, onSubmit, onBack } = useFeatureCreatePage();

  return (
    <AppStack>
      <PageHeader
        title="Nova feature"
        subtitle="Preencha os dados para criar um novo registro."
      />
      {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}
      <AppForm form={form} onSubmit={onSubmit}>
        <FormTextField<FeatureCreateFormValues>
          name="name"
          label="Nome"
          placeholder="Digite o nome..."
          required
        />
        <FormTextField<FeatureCreateFormValues>
          name="description"
          label="Descrição"
          placeholder="Descreva o registro..."
          multiline
          rows={3}
        />
        <FormActions
          onCancel={onBack}
          submitLabel="Criar feature"
          loading={submitting}
        />
      </AppForm>
    </AppStack>
  );
};

export default FeatureCreatePage;
```

#### `pages/FeatureEditPage.tsx`
```tsx
import { useParams } from 'react-router-dom';
import { AppLoadingIndicator } from '@shared/components/data-display/AppLoadingIndicator';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppForm } from '@shared/components/form/AppForm';
import { FormTextField } from '@shared/components/form/FormTextField';
import { FormActions } from '@shared/components/form/FormActions';
import { useFeatureEditPage } from '../hooks/useFeatureEditPage';
import type { FeatureEditFormValues } from '../schemas/featureEditForm.schema';

const FeatureEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { form, entity, loading, submitting, errorMessage, onSubmit, onBack } =
    useFeatureEditPage(id!);

  if (loading) return <AppLoadingIndicator label="Carregando registro..." />;

  return (
    <AppStack>
      <PageHeader
        title="Editar feature"
        subtitle="Atualize as informações do registro."
      />
      {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}

      {/* Campo readonly: exibido fora do form, não editável */}
      <AppTextField
        label="Nome"
        value={entity?.name ?? ''}
        disabled
        helperText="O nome não pode ser alterado após a criação."
      />

      <AppForm form={form} onSubmit={onSubmit}>
        <FormTextField<FeatureEditFormValues>
          name="description"
          label="Descrição"
          placeholder="Descreva o registro..."
          multiline
          rows={3}
        />
        <FormActions
          onCancel={onBack}
          submitLabel="Salvar alterações"
          loading={submitting}
        />
      </AppForm>
    </AppStack>
  );
};

export default FeatureEditPage;
```

---

### 🔍 Modelo Canônico — DETAILS PAGE

**Princípio fundamental:** A page de detalhes renderiza a estrutura diretamente usando os shared components do design system (`AppStack`, `SectionCard`, `KeyValueGrid`, `AppLoadingIndicator`, `AppErrorState`). Não existe um componente intermediário `FeatureDetailsPageContent` — a page **é** o componente de detalhes. O normalizer (`featureDetails.normalizer.ts`) é opcional: só existe se as transformações de dados forem complexas o suficiente para justificar isolamento.

`components/` da feature só existe se houver um elemento visual genuinamente exclusivo desta tela (ex: um gráfico específico, um card com lógica própria). Nunca criar componentes apenas para "organizar" o JSX da page.

#### Estrutura de arquivos

```
feature/
├── types/
│   └── feature.types.ts
├── normalizers/
│   └── featureDetails.normalizer.ts  ← formatFeatureForDisplay() — OPCIONAL, só se complexo
├── services/
│   └── feature.service.ts
├── hooks/
│   └── useFeatureDetailsPage.ts      ← fetch, loading, error, entity, callbacks
└── pages/
    └── FeatureDetailsPage.tsx        ← renderiza a estrutura completa com shared components
```

#### `hooks/useFeatureDetailsPage.ts`
```ts
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { featureService } from '../services/service';
import type { Feature } from '../types/feature';

export const useFeatureDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const data = await featureService.getById(id);
      setEntity(data);
    } catch {
      setErrorMessage('Erro ao carregar registro.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return {
    entity,
    loading,
    errorMessage,
    onBack: () => navigate('/client/features'),
    onRetry: load,
  };
};
```

#### `pages/FeatureDetailsPage.tsx`
```tsx
import { useParams } from 'react-router-dom';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { KeyValueGrid } from '@shared/components/data-display/KeyValueGrid';
import { AppLoadingIndicator } from '@shared/components/data-display/AppLoadingIndicator';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { formatIsoDate } from '@shared/formatters';
import { useFeatureDetailsPage } from '../hooks/useFeatureDetailsPage';

const FeatureDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { entity, loading, errorMessage, onBack, onRetry } = useFeatureDetailsPage(id!);

  if (loading) return <AppLoadingIndicator label="Carregando feature..." />;
  if (errorMessage) return <AppErrorState message={errorMessage} onRetry={() => void onRetry()} />;
  if (!entity) return null;

  return (
    <AppStack>
      <PageHeader
        title={entity.name}
        subtitle={entity.status === 'active' ? 'Ativo' : 'Inativo'}
        onBack={onBack}
      />

      <SectionCard title="Informações gerais">
        <KeyValueGrid
          items={[
            { label: 'Nome', value: entity.name },
            { label: 'Status', value: entity.status === 'active' ? 'Ativo' : 'Inativo' },
            { label: 'Descrição', value: entity.description ?? '-' },
          ]}
        />
      </SectionCard>

      <SectionCard title="Controle">
        <KeyValueGrid
          items={[
            { label: 'Criado em', value: formatIsoDate(entity.createdAt) },
            { label: 'Atualizado em', value: formatIsoDate(entity.updatedAt) },
          ]}
        />
      </SectionCard>
    </AppStack>
  );
};

export default FeatureDetailsPage;
```

> **Quando usar o normalizer de details?** Apenas quando as transformações forem extensas demais para ficarem inline (ex: entidade com 15+ campos, múltiplas formatações de máscara, cálculos derivados). Nesse caso, criar `normalizers/featureDetails.normalizer.ts` com `formatFeatureForDisplay(entity: Feature): FeatureDisplayData` — um tipo simples com as strings já formatadas — e usar esse tipo na page.

---

---

## Padrões Estabelecidos — Shared Components

### Diretriz global: arquivo no formato antigo deve ser deletado

Quando um arquivo for refatorado para o novo padrão, o arquivo antigo **deve ser deletado** — não comentado, não marcado como deprecated, não mantido em paralelo. Imports devem ser atualizados antes da deleção. Arquivos já deletados neste processo:

- `src/shared/components/messages.ts` — migrado para `sharedComponentsI18n.filters` e `.overlays`

### Regra: `sx` obrigatório em todo shared component

Todo shared component deve aceitar `sx?: SxProps<Theme>` e repassar ao elemento raiz, permitindo que a page ajuste espaçamento, cor ou tamanho sem wrapper desnecessário.

```tsx
import type { SxProps, Theme } from '@mui/material/styles';

// quando o componente tem sx próprio — usar array merge:
<Box sx={[{ mb: 2 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} />

// quando não há sx próprio — repassar direto:
<Card sx={sx}>
```

### Regra: strings visíveis ao usuário via `shared/i18n/pt-BR/components.ts`

Todo texto padrão de shared component vem de `sharedComponentsI18n` — nunca hardcoded dentro do componente. Props de texto são opcionais; a page só passa quando quer sobrescrever o default.

```ts
// src/shared/i18n/pt-BR/components.ts — fonte única
export const sharedComponentsI18n = {
  entityDetails: { loadingLabel, emptyTitle, emptyMessage, errorFallback, unauthorizedTitle, unauthorizedMessage, forbiddenTitle, forbiddenMessage },
  confirmDialog: { confirmLabel, cancelLabel },
  errorState: { title, retryLabel },
  snackbarError: { correlationIdLabel, copyTooltip, copyAriaLabel },
  dataList: { emptyTitle, emptyDescription, mobileFallback, mobileItemsFallback, mobileActionsFallback, pagination: { rowsPerPage, previous, next, rangeLabel } },
  filters: { title, subtitle, searchPlaceholder, filterButton, applyLabel, applyingLabel, clearLabel, filterApply, filterClear, selectPlaceholder, dateStartLabel, dateEndLabel, collapseLabel, expandLabel },
  sessionExpired: { title, message, loginLabel },
  overlays: { openMenuAriaLabel },
};
```

**Como usar na page — três formas válidas:**

```tsx
// 1. sem passar nada — usa tudo do i18n centralizado
<EntityDetailsPage viewState={viewState} data={data} onRetry={onRetry} />

// 2. sobrescreve só o específico desta feature
<EntityDetailsPage
  content={{ emptyTitle: 'Nenhum aluno encontrado', emptyMessage: 'Cadastre o primeiro aluno.' }}
  viewState={viewState} data={data} onRetry={onRetry}
/>

// 3. importa e mescla explicitamente
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
const CONTENT = { ...sharedComponentsI18n.entityDetails, emptyTitle: 'Nenhum aluno encontrado' };
<EntityDetailsPage content={CONTENT} viewState={viewState} data={data} onRetry={onRetry} />
```

**Regra para novos textos:** qualquer nova string visível ao usuário em um shared component vai direto em `sharedComponentsI18n`, nunca inline no componente.

### Slots de customização: `loadingFallback` e `errorFallback`

`EntityDetailsPage` aceita `loadingFallback` e `errorFallback` como `ReactNode` para substituir o comportamento visual padrão quando necessário (ex: skeleton customizado, modal de erro):

```tsx
<EntityDetailsPage
  viewState={viewState}
  data={data}
  onRetry={onRetry}
  loadingFallback={<StudentSkeleton />}
  errorFallback={
    <ErrorModal
      open={viewState === 'error'}
      message={errorMessage}   // errorMessage vem do hook, disponível na page
      onRetry={() => void onRetry()}
    />
  }
/>
```

---

## Escopo Real — Auditoria Completa

> Auditoria realizada em 2026-05-19. A tabela abaixo representa o estado atual do código.

| Anti-padrão | Arquivos afetados | Domínio |
|-------------|------------------|---------|
| P1 — Hook exporta componente | 8 | client/ |
| P3 — Hook monta EntityDetailsPageData via useMemo | 9 | client/ |
| P4 — JSX inline em hooks (column builders) | 6 | client/ |
| P2 — Page delega tudo para componente genérico | 8 pages (2 componentes genéricos) | client/report-cards |
| P5 — Service como arquivo único (não 3 arquivos) | 13 | client/ |

**Platform/ está limpo** — 0 violações em todas as categorias. Já segue a estrutura de 3 arquivos em services.

---

## Plano de Execução por Feature

### FASE 1 — Eliminar hooks que exportam componentes (P1) + useMemo de UI (P3)

Fases 1 e 3 andam juntas: os 8 hooks do P1 são exatamente os mesmos do P3.

> **Nota:** o componente `EntityDetailsPage` foi reestilizado (faixa de gradiente, avatar 80px, tabs MUI, grid 3 colunas, InfoItem uppercase). Todas as features da Fase 1 se beneficiam automaticamente ao usar esse componente.

**Padrão-alvo para todas as features de detalhes com tabs (Padrão B — skill 29):**

| Arquivo | Responsabilidade |
|---------|-----------------|
| `hooks/useFeatureDetailsPage.ts` | Fetch, viewState, onBack, onRetry — sem componente, sem useMemo de tabs |
| `normalizers/featureDetails.normalizer.ts` | `toFeatureHeaderData()` + `toFeatureDetailsTabs()` — funções puras e testáveis |
| `pages/FeatureDetailsPage.tsx` | Constante `CONTENT` + `<EntityDetailsPage {...props} />` |

Em cada feature afetada:

1. Remover o export do componente do arquivo de hook
2. Remover o `useMemo` de montagem de `EntityDetailsPageData` — mover para normalizer
3. Remover a constante `content` do hook — mover para a page
4. Hook passa a retornar `{ viewState, data, errorMessage, onBack, onRetry }` onde `data` vem do normalizer
5. Renomear de `.tsx` para `.ts`
6. Page reescrita com constante `CONTENT` + `<EntityDetailsPage />` (ver skill 29, Padrão B)

#### 1.1 `medical-info`

| Ação | Arquivo |
|------|---------|
| Limpar hook (remover componente + useMemo) | `hooks/useMedicalInfoDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer (entidade com múltiplos campos de saúde) | `normalizers/medicalInfoDetails.normalizer.ts` |
| Reescrever page | `pages/MedicalInfoDetailsPage.tsx` |

#### 1.2 `students`

| Ação | Arquivo |
|------|---------|
| Limpar hook | `hooks/useStudentDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer (CPF, data nascimento, telefone, endereço) | `normalizers/studentDetails.normalizer.ts` |
| Reescrever page | `pages/StudentDetailsPage.tsx` |

#### 1.3 `people`

| Ação | Arquivo |
|------|---------|
| Limpar hook | `hooks/usePersonDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer (CPF, telefone, data) | `normalizers/personDetails.normalizer.ts` |
| Reescrever page | `pages/PersonDetailsPage.tsx` |

#### 1.4 `employees`

| Ação | Arquivo |
|------|---------|
| Limpar hook | `hooks/useEmployeeDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer se necessário | `normalizers/employeeDetails.normalizer.ts` |
| Reescrever page | `pages/EmployeeDetailsPage.tsx` |

#### 1.5 `documents`

| Ação | Arquivo |
|------|---------|
| Limpar hook | `hooks/useDocumentDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer se necessário | `normalizers/documentDetails.normalizer.ts` |
| Reescrever page | `pages/DocumentDetailsPage.tsx` |

#### 1.6 `contacts`

| Ação | Arquivo |
|------|---------|
| Limpar hook | `hooks/useContactDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer (telefone, email, endereço) | `normalizers/contactDetails.normalizer.ts` |
| Reescrever page | `pages/ContactDetailsPage.tsx` |

#### 1.7 `addresses`

| Ação | Arquivo |
|------|---------|
| Limpar hook | `hooks/useAddressDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer se necessário | `normalizers/addressDetails.normalizer.ts` |
| Reescrever page | `pages/AddressDetailsPage.tsx` |

#### 1.8 `academic` (AcademicYear)

| Ação | Arquivo |
|------|---------|
| Limpar hook | `hooks/useAcademicYearDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer se necessário | `normalizers/academicYearDetails.normalizer.ts` |
| Reescrever page | `pages/AcademicYearDetailsPage.tsx` |

#### 1.9 `student-enrollments` ⚠️ — NÃO estava no plano original

| Ação | Arquivo |
|------|---------|
| Limpar hook (useMemo de EntityDetailsPageData identificado) | `hooks/useStudentEnrollmentDetailsPageViewModel.tsx` → `.ts` |
| Criar normalizer se necessário | `normalizers/studentEnrollmentDetails.normalizer.ts` |
| Reescrever page | page correspondente em `pages/` |

#### 1.10 Hooks adicionais de details com P3 identificados na auditoria

Além dos 8 do P1, a auditoria identificou outros hooks que ainda montam `EntityDetailsPageData` via `useMemo` mas **não** exportam componentes:

| Hook a corrigir | Feature | Page a reescrever |
|----------------|---------|------------------|
| `useAcademicCatalogDetailsPageViewModel` | `academic` | page de detalhes do catálogo |
| `useSchoolClassDetailsPageViewModel` | `academic` | page de detalhes da turma |
| `useFinancialEntityDetailsPageViewModel` | `financial` | page de detalhes da entidade financeira |
| `useFinancialRecordDetailsPageViewModel` | `financial` | page de detalhes do registro financeiro |
| `useFinancialTransactionDetailsPageViewModel` | `financial` | page de detalhes da transação |

---

### FASE 2 — Corrigir pages que só repassam props (P2)

**Componentes genéricos a eliminar:**
- `src/features/client/report-cards/components/ReportCardCatalogListPage.tsx`
- `src/features/client/report-cards/components/ReportCardCatalogDetailsPage.tsx`

**8 pages que precisam ser refatoradas (auditoria confirmou):**

| Page atual | Hook a criar | Columns a criar |
|-----------|-------------|----------------|
| `ReportCardAcademicPeriodsPage.tsx` | `hooks/useAcademicPeriodListPage.ts` | `components/academicPeriodListColumns.tsx` |
| `ReportCardAcademicPeriodDetailsPage.tsx` | `hooks/useAcademicPeriodDetailsPage.ts` | — |
| `ReportCardGradeSubjectsPage.tsx` | `hooks/useGradeSubjectListPage.ts` | `components/gradeSubjectListColumns.tsx` |
| `ReportCardGradeSubjectDetailsPage.tsx` | `hooks/useGradeSubjectDetailsPage.ts` | — |
| + 4 outras pages identificadas na auditoria | idem | idem |

Para cada uma: reescrever usando `PageHeader` + `ListFilters` + `QueryDataTable` + `ConfirmDialog` diretamente.

Após refatorar todas: **deletar** `ReportCardCatalogListPage.tsx` e `ReportCardCatalogDetailsPage.tsx`.

---

### FASE 3 — Extrair column builders dos hooks (P4)

**6 hooks confirmados pela auditoria** (lista completa — o plano original estava incompleto):

| Hook afetado | Feature | Arquivo de columns a criar |
|-------------|---------|---------------------------|
| `useAddressesListPageViewModel.tsx` | `addresses` | `components/addressListColumns.tsx` |
| `useContactsListPageViewModel.tsx` | `contacts` | `components/contactListColumns.tsx` |
| `useEmployeesListPageViewModel.tsx` | `employees` ⚠️ faltava | `components/employeeListColumns.tsx` |
| `useMedicalInfoListPageViewModel.tsx` | `medical-info` ⚠️ faltava | `components/medicalInfoListColumns.tsx` |
| `usePeopleListPageViewModel.tsx` | `people` ⚠️ faltava | `components/peopleListColumns.tsx` |
| `usePersonDocumentsPageViewModel.tsx` | `person-documents` ⚠️ faltava | `components/personDocumentListColumns.tsx` |

> **Nota:** `useStudentsListPageViewModel` e `useLegalGuardiansListPageViewModel` citados no plano original **não foram confirmados** na auditoria — verificar antes de incluir.

Para cada um:
1. Criar `components/xxxListColumns.tsx` com `buildXxxColumns(actions: XxxColumnActions)`
2. Definir `interface XxxColumnActions` com os callbacks
3. No hook: `const tableColumns = buildXxxColumns({ onDetails, onEdit, onDelete })`
4. Renomear hook de `.tsx` para `.ts`

---

### FASE 4 — Migrar services para a estrutura de três arquivos

**13 services confirmados pela auditoria** (lista completa — o plano original estava incompleto):

| Service atual (arquivo único) | Ação |
|------------------------------|------|
| `client/academic/services/academicServices.ts` | Separar por entidade em subpastas: `academicYear/`, `grade/`, `schoolClass/` |
| `client/addresses/services/addressServices.ts` | Converter para `endpoints.ts` + `types.ts` + `service.ts` |
| `client/admin/services/adminServices.ts` ⚠️ faltava | Converter para 3 arquivos |
| `client/attendance/services/attendanceServices.ts` ⚠️ faltava | Converter para 3 arquivos |
| `client/contacts/services/contactServices.ts` | Converter para 3 arquivos |
| `client/documents/services/documentServices.ts` | Converter para 3 arquivos |
| `client/employees/services/employeeServices.ts` | Converter para 3 arquivos |
| `client/financial/services/financialServices.ts` ⚠️ faltava | Converter (ou separar por entidade se múltiplos recursos) |
| `client/medical-info/services/medicalInfoServices.ts` | Converter para 3 arquivos |
| `client/people/services/personServices.ts` | Converter para 3 arquivos |
| `client/person-documents/services/personDocumentServices.ts` ⚠️ faltava | Converter para 3 arquivos |
| `client/report-cards/services/reportCardServices.ts` | Converter (ou separar por entidade) |
| `client/students/services/studentServices.ts` | Converter para 3 arquivos |

**Já corretos (não mexer):**
- `client/auth/services/` — já tem 3 arquivos
- `platform/*/services/` — todos corretos (4 features)

**Regras de migração:**
- `endpoints.ts` — apenas `httpClient.get/post/patch/delete`. Sem `await`, sem `.data`.
- `types.ts` — apenas aliases de request/response importados de `types/feature.ts`.
- `service.ts` — apenas métodos `async` que chamam endpoints e retornam `data`.
- Após migrar: atualizar **todos os imports** nos hooks de `'../services/xxxServices'` para `'../services/service'`.

---

### FASE 5 — Padronizar naming de schemas

Regra: `schemas/entityNameForm.schema.ts`, com schema Zod e type inferido no mesmo arquivo. Create e Edit sempre separados quando os campos diferem.

| Arquivo atual | Arquivo alvo |
|--------------|-------------|
| `schemas/academicYearFormSchema.ts` | `schemas/academicYearForm.schema.ts` |
| `schemas/academicCatalogFormSchema.ts` | `schemas/academicCatalogForm.schema.ts` |
| `schemas/schoolClassFormSchema.ts` | `schemas/schoolClassForm.schema.ts` |
| Schemas inline em hooks | Mover para `schemas/` |

Verificar **todas as features** — grep por `z.object` fora de `schemas/`:
```bash
grep -rn "z\.object" src/features --include="*.ts" --include="*.tsx" | grep -v "schemas/"
```

---

### FASE 6 — Verificar e completar features incompletas

| Feature | Problema identificado | Ação |
|---------|----------------------|------|
| `attendance` | Service como arquivo único + hooks incompletos | Migrar service (Fase 4) + criar hooks/pages seguindo modelo canônico |
| `admin` | Service como arquivo único + naming genérico | Migrar service + revisar nomes de hooks |
| `person-documents` | JSX em hook (P4 confirmado) | Coberto na Fase 3 |
| `student-enrollments` | useMemo de EntityDetailsPageData (P3 confirmado) | Coberto na Fase 1.9 |
| `financial` | Service como arquivo único + 3 hooks de details com P3 | Coberto nas Fases 1.10 e 4 |
| `home` (client) | Dashboard simples | OK — sem lógica de domínio |

---

## Checklist de Verificação por Feature

Após refatorar cada feature, validar:

- [ ] Nenhum arquivo em `hooks/` exporta um componente React
- [ ] Nenhum hook tem `const VARIAVEL_MAIUSCULA` de configuração de UI
- [ ] Nenhum hook tem `useMemo` montando `EntityDetailsPageData`, tabs ou sections
- [ ] Hooks de details retornam apenas `{ entity, loading, errorMessage, onBack, onRetry }`
- [ ] Pages de details renderizam com shared components diretamente (`AppStack`, `SectionCard`, `KeyValueGrid`)
- [ ] Create e Edit são pages separadas com hooks separados
- [ ] Edit hook lê `location.state.entity` — só faz GET se veio pela URL diretamente
- [ ] Navegação detalhes → edição usa `navigate(path, { state: { entity } })`
- [ ] Campos readonly na edit page ficam **fora** do `AppForm`
- [ ] Nenhum hook tem extensão `.tsx` sem necessidade de JSX
- [ ] Todos os builders de colunas estão em `components/xxxListColumns.tsx`
- [ ] Services têm os 3 arquivos: `endpoints.ts` + `types.ts` + `service.ts`
- [ ] `endpoints.ts` sem `await` e sem `.data`
- [ ] `service.ts` não importa `httpClient` diretamente
- [ ] Hooks importam de `'../services/service'`
- [ ] Schemas em `schemas/entityNameForm.schema.ts` com type inferido via `z.infer`
- [ ] Normalizer de form com as 3 funções: `toCreatePayload`, `toEditFormValues`, `toEditPayload`
- [ ] Normalizer de details: apenas se 8+ campos ou formatações complexas
- [ ] Shared components aceitam `sx?: SxProps<Theme>` repassado ao elemento raiz
- [ ] Strings padrão de shared components vêm de `sharedComponentsI18n` em `shared/i18n/pt-BR/components.ts`
- [ ] `content` de `EntityDetailsPage` passado apenas quando há override — sem passar todo o objeto se usar defaults
- [ ] Arquivos no formato antigo deletados (não mantidos em paralelo)

---

## Comandos de Verificação Global

Rodar **após concluir todas as fases** para confirmar que nenhuma violação persiste:

```bash
# 1. ESLint — inclui regra que bloqueia JSX em hooks e await em endpoints
npm run lint

# 2. TypeScript sem erros
npx tsc --noEmit

# 3. Nenhum hook exporta componente React (deve retornar vazio)
grep -rn "export const [A-Z]" src/features/**/hooks/

# 4. Nenhum hook com useMemo montando tabs/sections (deve retornar vazio)
grep -rn "EntityDetailsPageData" src/features/**/hooks/

# 5. Services sem import de React
grep -rn "from 'react'" src/features/**/services/

# 6. Verificar schemas fora da pasta schemas/
grep -rn "z\.object" src/features --include="*.ts" --include="*.tsx" | grep -v "schemas/"

# 7. Strings hardcoded em shared components (deve retornar vazio — tudo em sharedComponentsI18n)
grep -rn "= '" src/shared/components --include="*.tsx" | grep -v "//\|className\|variant\|color\|size\|key\|type\|href\|target\|aria-"

# 8. Build sem erros
npm run build

# 9. Testes (se existirem)
npm run test
```
