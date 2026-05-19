# 27 — List Page Canonical Pattern

## Objetivo

Definir o modelo canônico completo para páginas de listagem: estrutura de arquivos, responsabilidades de cada camada e exemplos prontos para uso.

## Estrutura de arquivos

```
feature/
├── types/
│   └── feature.ts                    ← entidade + requests + query params
├── services/
│   ├── endpoints.ts                  ← chamadas HTTP puras
│   ├── types.ts                      ← aliases de request/response
│   └── service.ts                    ← métodos async
├── hooks/
│   ├── useFeatureList.ts             ← fetch + queryParams + pagination
│   └── useFeatureListPage.ts         ← lógica da página (ações, modais, columns)
├── components/
│   └── featureListColumns.tsx        ← buildFeatureColumns() com JSX de células
└── pages/
    └── FeaturePage.tsx               ← orquestra: hook + shared components
```

> `components/` só existe se houver JSX para column builders ou elemento genuinamente exclusivo da feature. Nunca criar componente intermediário apenas para "embrulhar" a page.

## `hooks/useFeatureList.ts` — dados e paginação

```ts
import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type { Feature, FeatureQueryParams } from '../types/feature';
import { featureService } from '../services/service';

export const useFeatureList = () => {
  const [rows, setRows] = useState<Feature[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0, page: 1, limit: 10, totalPages: 0,
  });
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

## `hooks/useFeatureListPage.ts` — lógica da página

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
    } finally {
      setIsDeleting(false);
    }
  };

  const tableColumns = buildFeatureColumns({
    onDetails: (feature) => navigate(`/client/features/${feature.id}`),
    onEdit: (feature) =>
      navigate(`/client/features/${feature.id}/edit`, { state: { entity: feature } }),
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

## `components/featureListColumns.tsx` — builders de coluna (único JSX da listagem)

```tsx
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { StatusChip } from '@shared/components/data-display/StatusChip';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { Feature } from '../types/feature';

export interface FeatureColumnActions {
  onDetails: (feature: Feature) => void;
  onEdit: (feature: Feature) => void;
  onDelete: (feature: Feature) => void;
}

export const buildFeatureColumns = (actions: FeatureColumnActions): DataTableColumn<Feature>[] => [
  { key: 'name', header: 'Nome', render: (feature) => feature.name },
  { key: 'status', header: 'Status', render: (feature) => <StatusChip status={feature.status} /> },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (feature) => (
      <RowActionsMenu
        actions={[
          { label: 'Ver detalhes', onClick: () => actions.onDetails(feature) },
          { label: 'Editar', onClick: () => actions.onEdit(feature) },
          { label: 'Excluir', onClick: () => actions.onDelete(feature), color: 'error.main' },
        ]}
      />
    ),
  },
];
```

## `pages/FeaturePage.tsx` — orquestra, não tem lógica

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
        subtitle="Gerencie os registros."
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

## Checklist de verificação

- [ ] `useFeatureList.ts` — extensão `.ts` (sem JSX), retorna `rows`, `pagination`, `queryParams`, `updateQueryParams`, `reload`
- [ ] `useFeatureListPage.ts` — extensão `.ts`, importa `buildFeatureColumns` do `components/`
- [ ] `featureListColumns.tsx` — extensão `.tsx`, exporta `buildFeatureColumns` e `FeatureColumnActions`
- [ ] Nomes de parâmetros autodescritivos: `pageIndex`, `rowsPerPage`, `filterKey`, `filterValue`
- [ ] `onEdit` passa `{ state: { entity: feature } }` na navegação
- [ ] Nenhuma constante de módulo para valores que podem ser inlined
- [ ] Page usa apenas shared components — sem MUI cru
