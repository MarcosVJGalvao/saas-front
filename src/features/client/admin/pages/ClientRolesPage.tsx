import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { ClientTenantModulePage } from '@features/client/shared/components/ClientTenantModulePage';

const ClientRolesPage = () => (
  <ClientTenantModulePage
    title="Perfis"
    subtitle="Gerencie perfis de acesso do tenant."
    moduleName="Perfis de acesso"
    icon={<AdminPanelSettingsOutlinedIcon color="primary" />}
    endpoints={[
      'GET /api/roles',
      'POST /api/roles',
      'PATCH /api/roles/:id',
      'DELETE /api/roles/:id',
    ]}
    states={['loading', 'empty', 'error', 'forbidden', 'submitting']}
    nextStep="Conectar CRUD de perfis e matriz de permissões quando disponível."
  />
);

export default ClientRolesPage;
