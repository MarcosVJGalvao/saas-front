import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const ReportCardAcademicPeriodsPage = () => (
  <ClientTenantModulePage
    title="Períodos do Boletim"
    subtitle="Configure períodos acadêmicos usados no fechamento de boletins."
    moduleName="Períodos acadêmicos"
    icon={<MenuBookOutlinedIcon color="primary" />}
    endpoints={[
      'GET /api/report-cards/academic-periods',
      'POST /api/report-cards/academic-periods',
    ]}
    states={['loading', 'empty', 'error', 'forbidden', 'submitting']}
    nextStep="Conectar CRUD com validação de datas e conflitos de sequência."
  />
);

export default ReportCardAcademicPeriodsPage;
