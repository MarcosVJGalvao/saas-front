import type {
  CreateStudentEnrollmentRequest,
  StudentEnrollmentSummaryData,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

export const buildStudentEnrollmentSummary = (
  value: CreateStudentEnrollmentRequest,
): StudentEnrollmentSummaryData => {
  const studentName = value.student?.person.fullName ?? '';
  const guardianName = value.student?.legalGuardians[0]?.person?.fullName ?? '';
  const address = value.student?.addresses[0];
  const addressText = address?.city && address.state ? `${address.city}/${address.state}` : '';
  const hasMedicalInfo = Boolean(
    value.student?.medicalInfo?.allergies ||
    value.student?.medicalInfo?.chronicDiseases ||
    value.student?.medicalInfo?.medications,
  );

  return {
    student: studentName || 'Dados principais do aluno.',
    guardians: guardianName || 'Responsável principal da matrícula.',
    contactsAddress: addressText || 'Endereço e contatos do aluno.',
    medicalInfo: hasMedicalInfo
      ? 'Informações médicas preenchidas.'
      : 'Sem alertas médicos informados.',
    academic: value.academic.academicYearId
      ? `Ano letivo selecionado. Data: ${value.academic.enrollmentDate || 'não informada'}`
      : 'Ano letivo, turma e data da matrícula.',
    review: value.observations || 'Revise os dados antes de finalizar.',
  };
};
