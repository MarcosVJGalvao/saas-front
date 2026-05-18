import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import {
  buildReportCardCatalogColumns,
  buildReportCardCatalogMobileConfig,
} from '@features/client/report-cards/components/reportCardCatalogPresentation';
import { useReportCardCatalogList } from '@features/client/report-cards/hooks/useReportCardCatalogList';
import type {
  ReportCardCatalogEntity,
  ReportCardQueryParams,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

type ReportCardCatalogListPageProps = {
  mode: ReportCardCatalogMode;
  title: string;
  subtitle: string;
  routeBase: string;
  service: (
    params: ReportCardQueryParams,
  ) => Promise<{ data: ReportCardCatalogEntity[]; meta: ReportCardCatalogListMeta }>;
  errorMessageFallback: string;
  emptyTitle: string;
  emptyDescription: string;
};

type ReportCardCatalogListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');

export const ReportCardCatalogListPage = ({
  mode,
  title,
  subtitle,
  routeBase,
  service,
  errorMessageFallback,
  emptyTitle,
  emptyDescription,
}: ReportCardCatalogListPageProps) => {
  const navigate = useNavigate();
  const list = useReportCardCatalogList(service, errorMessageFallback);

  const buildRowActions = useCallback(
    (row: ReportCardCatalogEntity): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`${routeBase}/${row.id}`),
      },
    ],
    [navigate, routeBase],
  );

  return (
    <AppStack spacing={2}>
      <PageHeader title={title} subtitle={subtitle} />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: mode === 'periods' ? 'Período' : 'Disciplina',
            mobileOrder: 1,
          },
        ]}
        values={{ query: list.query.search ?? '' }}
        onChange={(_, value) => list.updateQuery({ search: getStringValue(value), page: 1 })}
        onApply={() => list.updateQuery({ page: 1 })}
        onClear={() => list.updateQuery({ search: undefined, page: 1 })}
        loading={list.loading}
      />
      <QueryDataTable
        rows={list.rows}
        columns={buildReportCardCatalogColumns({ mode, buildRowActions })}
        mobileConfig={buildReportCardCatalogMobileConfig({ mode, buildRowActions })}
        meta={list.meta}
        loading={list.loading}
        errorMessage={list.errorMessage}
        onRetry={() => {
          void list.reload();
        }}
        query={list.query.search ?? ''}
        onQueryChange={(search) => list.updateQuery({ search, page: 1 })}
        onPageChange={(page) => list.updateQuery({ page })}
        onRowsPerPageChange={(limit) => list.updateQuery({ limit, page: 1 })}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        toolbarContent={
          <AppText color="text.secondary">Use a busca geral para localizar registros.</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};
