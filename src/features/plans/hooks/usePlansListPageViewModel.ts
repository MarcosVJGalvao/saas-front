import {
  buildPlansMobileConfig,
  buildPlansTableColumns,
} from '@features/plans/components/plansListPresentation';
import type { Plan } from '@features/plans/types/plans';
import { usePlansListPage } from '@features/plans/hooks/usePlansListPage';

export const usePlansListPageViewModel = () => {
  const view = usePlansListPage();
  const buildPlanActions = (row: Plan) => [
    {
      key: 'view',
      label: 'Ver detalhes',
      onClick: () => void view.navigate(`/platform/plans/${row.id}`),
    },
    {
      key: 'edit',
      label: 'Editar',
      onClick: () => void view.navigate(`/platform/plans/${row.id}/edit`),
    },
    { key: 'delete', label: 'Excluir', onClick: () => view.setDeleteId(row.id) },
  ];

  return {
    view,
    columns: buildPlansTableColumns({ buildPlanActions }),
    query: view.list.query.search ?? '',
    mobileConfig: buildPlansMobileConfig({ buildPlanActions }),
    onQueryChange: (search: string) => view.list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => view.list.updateQuery({ page }),
    onRowsPerPageChange: (limit: number) => view.list.updateQuery({ limit, page: 1 }),
  };
};
