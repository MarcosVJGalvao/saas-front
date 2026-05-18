import { StudentBasicFormPage } from '@features/client/students/components/StudentBasicFormPage';
import { legalGuardianService } from '@features/client/students/services/studentServices';

const LegalGuardianCreatePage = () => (
  <StudentBasicFormPage
    mode="guardian"
    title="Novo responsável"
    editTitle="Editar responsável"
    subtitle="Cadastre dados principais do responsável legal."
    backPath="/client/legal-guardians"
    service={legalGuardianService}
    loadErrorMessage="Não foi possível carregar o responsável."
    submitErrorMessage="Não foi possível salvar o responsável."
  />
);

export default LegalGuardianCreatePage;
