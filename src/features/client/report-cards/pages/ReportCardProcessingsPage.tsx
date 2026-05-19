import { ActionButtons } from '@shared/components/actions/ActionButtons';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import { useReportCardProcessingsPageViewModel } from '@features/client/report-cards/hooks/useReportCardProcessingsPageViewModel';

const ReportCardProcessingsPage = () => {
  const model = useReportCardProcessingsPageViewModel();
  const isLoading = model.loadingAction !== undefined;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Processamentos"
        subtitle="Acompanhe processamentos de boletim, reenvie falhas e controle fechamento."
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Consulta e reenvio</AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'processingId',
                label: 'Processamento',
                placeholder: 'ID do processamento',
                mobileOrder: 1,
              },
              {
                type: 'text',
                name: 'studentEnrollmentId',
                label: 'Matrícula',
                placeholder: 'ID da matrícula para reenvio individual',
                mobileOrder: 2,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.loadProcessing();
            }}
            onClear={model.clear}
            loading={isLoading}
            applyLabel="Consultar"
          />
          <ActionButtons
            fullWidthOnMobile={false}
            align="flex-start"
            actions={[
              {
                type: 'custom',
                label: model.loadingAction === 'resend' ? 'Reenviando...' : 'Reenviar falhas',
                onClick: () => {
                  void model.resendFailed();
                },
                disabled: isLoading,
                variant: 'outlined',
              },
              {
                type: 'custom',
                label:
                  model.loadingAction === 'resend-student'
                    ? 'Reenviando matrícula...'
                    : 'Reenviar matrícula',
                onClick: () => {
                  void model.resendStudent();
                },
                disabled: isLoading,
                variant: 'outlined',
              },
            ]}
          />
        </AppStack>
      </AppPaper>
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Fechamento de período</AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'schoolClassId',
                label: 'Turma',
                placeholder: 'ID da turma',
                mobileOrder: 1,
              },
              {
                type: 'text',
                name: 'academicPeriodId',
                label: 'Período',
                placeholder: 'ID do período',
                mobileOrder: 2,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.finalizePeriod();
            }}
            onClear={model.clear}
            loading={isLoading}
            applyLabel="Finalizar período"
          />
          <ActionButtons
            fullWidthOnMobile={false}
            align="flex-start"
            actions={[
              {
                type: 'custom',
                label: model.loadingAction === 'reopen' ? 'Reabrindo...' : 'Reabrir período',
                onClick: () => {
                  void model.reopenPeriod();
                },
                disabled: isLoading,
                variant: 'outlined',
              },
            ]}
          />
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default ReportCardProcessingsPage;
