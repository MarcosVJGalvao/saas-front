import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const ReportCardProcessingsPage = () => (
  <ClientTenantModulePage
    title="Processamentos"
    subtitle="Acompanhe processamentos de boletim e reenvie falhas."
    moduleName="Processamentos de boletim"
    icon={<SyncOutlinedIcon color="primary" />}
    endpoints={[
      'GET /api/report-cards/processings/:id',
      'POST /api/report-cards/processings/:id/resend-failed',
      'POST /api/report-cards/processings/:id/resend/students/:studentEnrollmentId',
    ]}
    states={['loading', 'empty', 'error', 'forbidden', 'submitting']}
    nextStep="Conectar status de processamento, itens com falha e ações de reenvio."
  />
);

export default ReportCardProcessingsPage;
