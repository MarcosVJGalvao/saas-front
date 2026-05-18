import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const ReportCardGradeSubjectsPage = () => (
  <ClientTenantModulePage
    title="Matriz Curricular"
    subtitle="Configure disciplinas por série e ano letivo."
    moduleName="Matriz curricular"
    icon={<ViewModuleOutlinedIcon color="primary" />}
    endpoints={['GET /api/report-cards/grade-subjects', 'POST /api/report-cards/grade-subjects']}
    states={['loading', 'empty', 'error', 'forbidden', 'submitting']}
    nextStep="Conectar matriz com carga horária, ordem de exibição e obrigatoriedade."
  />
);

export default ReportCardGradeSubjectsPage;
