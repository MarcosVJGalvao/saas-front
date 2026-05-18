import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { ActionButtons } from '@shared/components/actions/ActionButtons';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import { useFinancialReportsPageViewModel } from '@features/client/financial/hooks/useFinancialReportsPageViewModel';

const FinancialReportsPage = () => {
  const model = useFinancialReportsPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Relatórios financeiros"
        subtitle="Consulte fluxo de caixa, contas e inadimplência escolar."
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      <AppStack spacing={2}>
        {model.reportOptions.map((report) => (
          <AppPaper key={report.key} sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
            <AppStack spacing={1}>
              <AppStack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <AssessmentOutlinedIcon color="primary" />
                <AppText variant="h6">{report.title}</AppText>
              </AppStack>
              <AppText color="text.secondary">{report.description}</AppText>
              <ActionButtons
                fullWidthOnMobile={false}
                align="flex-start"
                actions={[
                  {
                    type: 'custom',
                    label: model.loadingKey === report.key ? 'Carregando...' : 'Carregar',
                    onClick: () => {
                      void model.requestReport(report.key);
                    },
                    disabled: model.loadingKey !== undefined,
                    variant: 'contained',
                  },
                ]}
              />
            </AppStack>
          </AppPaper>
        ))}
      </AppStack>
    </AppStack>
  );
};

export default FinancialReportsPage;
