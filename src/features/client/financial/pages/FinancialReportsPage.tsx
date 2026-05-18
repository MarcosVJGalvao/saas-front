import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const FinancialReportsPage = () => (
  <ClientTenantModulePage
    title="Relatórios financeiros"
    subtitle="Consulte fluxo de caixa, contas e inadimplência escolar."
    moduleName="Relatórios financeiros"
    icon={<AssessmentOutlinedIcon color="primary" />}
    endpoints={[
      'GET /api/financial/reports/cash-flow',
      'GET /api/financial/reports/accounts-receivable',
      'GET /api/financial/reports/accounts-payable',
      'GET /api/financial/reports/school-defaulting',
    ]}
    states={['loading', 'empty', 'error', 'forbidden']}
    nextStep="Conectar filtros, tabelas analíticas e exportação quando definida pelo backend."
  />
);

export default FinancialReportsPage;
