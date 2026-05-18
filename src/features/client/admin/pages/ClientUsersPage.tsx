import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const ClientUsersPage = () => (
  <ClientTenantModulePage
    title="Usuários"
    subtitle="Gerencie usuários do tenant e vínculo com colaboradores."
    moduleName="Usuários"
    icon={<SettingsOutlinedIcon color="primary" />}
    endpoints={[
      'GET /api/users',
      'POST /api/users',
      'PATCH /api/users/:id',
      'DELETE /api/users/:id',
    ]}
    states={['loading', 'empty', 'error', 'forbidden', 'submitting']}
    nextStep="Conectar CRUD, status e permissões por perfil."
  />
);

export default ClientUsersPage;
