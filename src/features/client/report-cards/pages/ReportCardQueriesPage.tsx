import { ActionButtons } from '@shared/components/actions/ActionButtons';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import { useReportCardQueriesPage } from '@features/client/report-cards/hooks/useReportCardQueriesPage';

const ReportCardQueriesPage = () => {
  const model = useReportCardQueriesPage();

  return (
    <AppStack spacing={2}>
      <PageHeader title="Consultas de boletim" subtitle="Consulte boletins por aluno ou turma." />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Filtros de consulta</AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'studentId',
                label: 'Aluno',
                placeholder: 'ID do aluno',
                mobileOrder: 1,
              },
              {
                type: 'text',
                name: 'schoolClassId',
                label: 'Turma',
                placeholder: 'ID da turma',
                mobileOrder: 2,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.loadByStudent();
            }}
            onClear={model.clear}
            loading={model.loadingMode !== undefined}
            applyLabel="Consultar aluno"
          />
          <ActionButtons
            fullWidthOnMobile={false}
            align="flex-start"
            actions={[
              {
                type: 'custom',
                label: model.loadingMode === 'class' ? 'Consultando...' : 'Consultar turma',
                onClick: () => {
                  void model.loadByClass();
                },
                disabled: model.loadingMode !== undefined,
                variant: 'outlined',
              },
            ]}
          />
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default ReportCardQueriesPage;
