import type { CreateStudentEnrollmentRequest } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { StudentEnrollmentSummaryData } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

export const buildStudentEnrollmentSummary = (
  formValues: CreateStudentEnrollmentRequest,
): StudentEnrollmentSummaryData => {
  const studentName = formValues.student?.person.fullName ?? '';
  const guardianName = formValues.student?.legalGuardians[0]?.person?.fullName ?? '';
  const address = formValues.student?.addresses[0];
  const addressText = address?.city && address.state ? `${address.city}/${address.state}` : '';
  const hasMedicalInfo = Boolean(
    formValues.student?.medicalInfo?.allergies ||
    formValues.student?.medicalInfo?.chronicDiseases ||
    formValues.student?.medicalInfo?.medications,
  );

  return {
    student: studentName || 'Dados principais do aluno.',
    guardians: guardianName || 'Responsável principal da matrícula.',
    contactsAddress: addressText || 'Endereço e contatos do aluno.',
    medicalInfo: hasMedicalInfo
      ? 'Informações médicas preenchidas.'
      : 'Sem alertas médicos informados.',
    academic: formValues.academic.academicYearId
      ? `Ano letivo selecionado. Data: ${formValues.academic.enrollmentDate || 'não informada'}`
      : 'Ano letivo, turma e data da matrícula.',
    review: formValues.observations || 'Revise os dados antes de finalizar.',
  };
};
