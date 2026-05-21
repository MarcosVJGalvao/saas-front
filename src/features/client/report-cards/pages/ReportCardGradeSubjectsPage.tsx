import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useReportCardGradeSubjectsPage } from '@features/client/report-cards/hooks/useReportCardGradeSubjectsPage';

const ReportCardGradeSubjectsPage = () => {
  const navigate = useNavigate();
  const reportCardGradeSubjectsPage = useReportCardGradeSubjectsPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Matriz curricular"
        subtitle="Configure disciplinas por série e ano letivo."
        actionLabel="Cadastrar"
        onAction={() => {
          void navigate('/client/report-cards/grade-subjects/new');
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Disciplina ou série',
            mobileOrder: 1,
          },
        ]}
        values={{ query: reportCardGradeSubjectsPage.reportCardCatalogList.query.search ?? '' }}
        onChange={(_, value) =>
          reportCardGradeSubjectsPage.reportCardCatalogList.updateQuery({
            search: typeof value === 'string' ? value.trim() : '',
            page: 1,
          })
        }
        onApply={() => reportCardGradeSubjectsPage.reportCardCatalogList.updateQuery({ page: 1 })}
        onClear={() =>
          reportCardGradeSubjectsPage.reportCardCatalogList.updateQuery({
            search: undefined,
            page: 1,
          })
        }
        loading={reportCardGradeSubjectsPage.reportCardCatalogList.loading}
      />
      <QueryDataTable
        rows={reportCardGradeSubjectsPage.reportCardCatalogList.rows}
        columns={reportCardGradeSubjectsPage.tableColumns}
        mobileConfig={reportCardGradeSubjectsPage.mobileConfig}
        meta={reportCardGradeSubjectsPage.reportCardCatalogList.meta}
        loading={reportCardGradeSubjectsPage.reportCardCatalogList.loading}
        errorMessage={reportCardGradeSubjectsPage.reportCardCatalogList.errorMessage}
        onRetry={() => {
          void reportCardGradeSubjectsPage.reportCardCatalogList.reload();
        }}
        query={reportCardGradeSubjectsPage.reportCardCatalogList.query.search ?? ''}
        onQueryChange={(search) =>
          reportCardGradeSubjectsPage.reportCardCatalogList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) =>
          reportCardGradeSubjectsPage.reportCardCatalogList.updateQuery({ page })
        }
        onRowsPerPageChange={(limit) =>
          reportCardGradeSubjectsPage.reportCardCatalogList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhum vínculo encontrado"
        emptyDescription="Disciplinas vinculadas por série aparecerão nesta consulta."
        toolbarContent={
          <AppText color="text.secondary">
            A matriz curricular conecta disciplina, série e ano letivo para cálculos de boletim.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default ReportCardGradeSubjectsPage;
