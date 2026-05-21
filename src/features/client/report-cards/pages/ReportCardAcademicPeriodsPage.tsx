import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useReportCardAcademicPeriodsPage } from '@features/client/report-cards/hooks/useReportCardAcademicPeriodsPage';

const ReportCardAcademicPeriodsPage = () => {
  const navigate = useNavigate();
  const reportCardAcademicPeriodsPage = useReportCardAcademicPeriodsPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Períodos do boletim"
        subtitle="Configure períodos acadêmicos usados no fechamento de boletins."
        actionLabel="Cadastrar"
        onAction={() => {
          void navigate('/client/report-cards/academic-periods/new');
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Período acadêmico',
            mobileOrder: 1,
          },
        ]}
        values={{ query: reportCardAcademicPeriodsPage.reportCardCatalogList.query.search ?? '' }}
        onChange={(_, value) =>
          reportCardAcademicPeriodsPage.reportCardCatalogList.updateQuery({
            search: typeof value === 'string' ? value.trim() : '',
            page: 1,
          })
        }
        onApply={() => reportCardAcademicPeriodsPage.reportCardCatalogList.updateQuery({ page: 1 })}
        onClear={() =>
          reportCardAcademicPeriodsPage.reportCardCatalogList.updateQuery({
            search: undefined,
            page: 1,
          })
        }
        loading={reportCardAcademicPeriodsPage.reportCardCatalogList.loading}
      />
      <QueryDataTable
        rows={reportCardAcademicPeriodsPage.reportCardCatalogList.rows}
        columns={reportCardAcademicPeriodsPage.tableColumns}
        mobileConfig={reportCardAcademicPeriodsPage.mobileConfig}
        meta={reportCardAcademicPeriodsPage.reportCardCatalogList.meta}
        loading={reportCardAcademicPeriodsPage.reportCardCatalogList.loading}
        errorMessage={reportCardAcademicPeriodsPage.reportCardCatalogList.errorMessage}
        onRetry={() => {
          void reportCardAcademicPeriodsPage.reportCardCatalogList.reload();
        }}
        query={reportCardAcademicPeriodsPage.reportCardCatalogList.query.search ?? ''}
        onQueryChange={(search) =>
          reportCardAcademicPeriodsPage.reportCardCatalogList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) =>
          reportCardAcademicPeriodsPage.reportCardCatalogList.updateQuery({ page })
        }
        onRowsPerPageChange={(limit) => {
          reportCardAcademicPeriodsPage.reportCardCatalogList.updateQuery({ limit, page: 1 });
        }}
        emptyTitle="Nenhum período encontrado"
        emptyDescription="Períodos acadêmicos aparecerão nesta consulta."
        toolbarContent={
          <AppText color="text.secondary">
            Os períodos configurados aqui alimentam lançamentos, processamentos e consultas de
            boletim.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default ReportCardAcademicPeriodsPage;
