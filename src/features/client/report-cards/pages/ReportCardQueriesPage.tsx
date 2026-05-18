import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const ReportCardQueriesPage = () => (
  <ClientTenantModulePage
    title="Consultas de Boletim"
    subtitle="Consulte boletins por aluno, turma e período."
    moduleName="Consultas"
    icon={<SearchOutlinedIcon color="primary" />}
    endpoints={[
      'GET /api/report-cards/students/:studentId',
      'GET /api/report-cards/classes/:schoolClassId',
    ]}
    states={['loading', 'empty', 'error', 'forbidden']}
    nextStep="Conectar filtros acadêmicos e visualização tabular de notas e médias."
  />
);

export default ReportCardQueriesPage;
