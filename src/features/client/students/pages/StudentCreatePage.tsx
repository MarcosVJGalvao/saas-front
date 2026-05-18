import { StudentBasicFormPage } from '@features/client/students/components/StudentBasicFormPage';
import { studentsService } from '@features/client/students/services/studentServices';

const StudentCreatePage = () => (
  <StudentBasicFormPage
    mode="student"
    title="Novo aluno"
    editTitle="Editar aluno"
    subtitle="Cadastre dados principais do aluno e status acadêmico."
    backPath="/client/students"
    service={studentsService}
    loadErrorMessage="Não foi possível carregar o aluno."
    submitErrorMessage="Não foi possível salvar o aluno."
  />
);

export default StudentCreatePage;
