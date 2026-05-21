import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { ActionButtons } from '@shared/components/actions/ActionButtons';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import { useFinancialReportsPage } from '@features/client/financial/hooks/useFinancialReportsPage';

const FinancialReportsPage = () => {
  const financialReportsPage = useFinancialReportsPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Relatórios financeiros"
        subtitle="Consulte fluxo de caixa, contas e inadimplência escolar."
      />
      {financialReportsPage.errorMessage ? (
        <AppAlert severity="error">{financialReportsPage.errorMessage}</AppAlert>
      ) : null}
      {financialReportsPage.successMessage ? (
        <AppAlert severity="success">{financialReportsPage.successMessage}</AppAlert>
      ) : null}
      <AppStack spacing={2}>
        {financialReportsPage.reportOptions.map((report) => (
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
                    label:
                      financialReportsPage.loadingKey === report.key ? 'Carregando...' : 'Carregar',
                    onClick: () => {
                      void financialReportsPage.requestReport(report.key);
                    },
                    disabled: financialReportsPage.loadingKey !== undefined,
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
