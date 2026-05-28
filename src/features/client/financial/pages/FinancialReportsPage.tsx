import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { alphaColor } from '@theme/utils/alphaColor';
import { responsive } from '@theme/utils/responsive';
import { AppChip } from '@shared/components/data-display/AppChip';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppLoadingButton } from '@shared/components/inputs/AppLoadingButton';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import {
  useFinancialReportsPage,
  type FinancialReportKey,
} from '@features/client/financial/hooks/useFinancialReportsPage';

const REPORT_ICONS: Record<FinancialReportKey, typeof AssessmentOutlinedIcon> = {
  cashFlow: AccountBalanceOutlinedIcon,
  accountsReceivable: ReceiptLongOutlinedIcon,
  accountsPayable: MoneyOffOutlinedIcon,
  schoolDefaulting: AssessmentOutlinedIcon,
};

const FinancialReportsPage = () => {
  const financialReportsPage = useFinancialReportsPage();

  return (
    <AppStack spacing={2.5}>
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
      <AppBox
        sx={{
          display: 'grid',
          gridTemplateColumns: responsive({ xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }),
          gap: responsive({ xs: 1.5, md: 2 }),
        }}
      >
        {financialReportsPage.reportOptions.map((report) => {
          const Icon = REPORT_ICONS[report.key];
          const isLoading = financialReportsPage.loadingKey === report.key;
          const isDisabled = financialReportsPage.loadingKey !== undefined && !isLoading;

          return (
            <AppBox
              key={report.key}
              sx={(reportTheme) => ({
                bgcolor: 'background.paper',
                border: `1px solid ${alphaColor(reportTheme.palette.divider, 0.7)}`,
                borderRadius: 2.5,
                p: responsive({ xs: 2.5, md: 3 }),
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: reportTheme.transitions.create(['border-color', 'box-shadow'], {
                  duration: reportTheme.transitions.duration.shortest,
                }),
                '&:hover': {
                  borderColor: alphaColor(reportTheme.palette.primary.main, 0.28),
                  boxShadow: reportTheme.shadows[1],
                },
              })}
            >
              <AppStack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                <AppBox
                  sx={(iconTheme) => ({
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: alphaColor(iconTheme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'primary.main',
                  })}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </AppBox>
                <AppBox sx={{ flex: 1, minWidth: 0 }}>
                  <AppText variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {report.title}
                  </AppText>
                  <AppText variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                    {report.description}
                  </AppText>
                </AppBox>
                <AppChip
                  label="Relatório"
                  size="small"
                  variant="outlined"
                  sx={{ flexShrink: 0, fontSize: '0.68rem' }}
                />
              </AppStack>
              <AppBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AppLoadingButton
                  variant="outlined"
                  size="small"
                  loading={isLoading}
                  disabled={isDisabled}
                  onClick={() => void financialReportsPage.requestReport(report.key)}
                >
                  Gerar relatório
                </AppLoadingButton>
              </AppBox>
            </AppBox>
          );
        })}
      </AppBox>
    </AppStack>
  );
};

export default FinancialReportsPage;
