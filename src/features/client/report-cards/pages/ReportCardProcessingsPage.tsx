import { ActionButtons } from '@shared/components/actions/ActionButtons';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import { useReportCardProcessingsPageViewModel } from '@features/client/report-cards/hooks/useReportCardProcessingsPageViewModel';

const ReportCardProcessingsPage = () => {
  const model = useReportCardProcessingsPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Processamentos"
        subtitle="Acompanhe processamentos de boletim e reenvie falhas."
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Consulta de processamento</AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'processingId',
                label: 'Processamento',
                placeholder: 'ID do processamento',
                mobileOrder: 1,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.loadProcessing();
            }}
            onClear={model.clear}
            loading={model.loadingAction !== undefined}
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
                disabled: model.loadingAction !== undefined,
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
