import { useNavigate } from 'react-router-dom';
import {
  buildReportCardCatalogColumns,
  buildReportCardCatalogMobileConfig,
} from '@features/client/report-cards/components/reportCardCatalogListColumns';
import { useReportCardCatalogList } from '@features/client/report-cards/hooks/useReportCardCatalogList';
import type {
  ReportCardCatalogEntity,
  ReportCardQueryParams,
} from '@features/client/report-cards/types/reportCard.types';
import type { PaginationMeta } from '@shared/types/pagination';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

type ReportCardCatalogListService = (
  params: ReportCardQueryParams,
) => Promise<{ data: ReportCardCatalogEntity[]; meta: PaginationMeta }>;

type UseReportCardCatalogListPageParams = {
  mode: ReportCardCatalogMode;
  routeBase: string;
  service: ReportCardCatalogListService;
  errorMessageFallback: string;
};

export const useReportCardCatalogListPage = ({
  mode,
  routeBase,
  service,
  errorMessageFallback,
}: UseReportCardCatalogListPageParams) => {
  const navigate = useNavigate();
  const reportCardCatalogList = useReportCardCatalogList(service, errorMessageFallback);

  return {
    reportCardCatalogList,
    tableColumns: buildReportCardCatalogColumns({
      mode,
      actions: {
        onDetails: (row) => {
          void navigate(`${routeBase}/${row.id}`);
        },
      },
    }),
    mobileConfig: buildReportCardCatalogMobileConfig({
      mode,
      actions: {
        onDetails: (row) => {
          void navigate(`${routeBase}/${row.id}`);
        },
      },
    }),
  };
};
