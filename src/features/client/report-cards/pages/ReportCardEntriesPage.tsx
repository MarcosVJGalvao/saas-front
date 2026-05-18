import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const ReportCardEntriesPage = () => (
  <ClientTenantModulePage
    title="Lançamentos de Boletim"
    subtitle="Lance notas individuais ou em lote por turma."
    moduleName="Lançamentos"
    icon={<EditNoteOutlinedIcon color="primary" />}
    endpoints={[
      'POST /api/report-cards/entries',
      'POST /api/report-cards/classes/:schoolClassId/entries/bulk',
      'PATCH /api/report-cards/entries/:id',
      'DELETE /api/report-cards/entries/:id',
    ]}
    states={['loading', 'empty', 'error', 'forbidden', 'submitting']}
    nextStep="Conectar grade de lançamento com validação de período fechado e disciplina."
  />
);

export default ReportCardEntriesPage;
