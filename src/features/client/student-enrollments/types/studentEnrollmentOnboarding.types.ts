import type {
  CreateStudentEnrollmentRequest,
  EnrollmentAddress,
  EnrollmentContact,
  EnrollmentLegalGuardianInput,
  EnrollmentMedicalInfo,
  EnrollmentPerson,
  EnrollmentStudentInput,
} from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';

export type StudentEnrollmentOnboardingUiExtras = {
  selectedStudentId: string;
  studentCep: string;
  guardianCep: string;
  guardianEmail: string;
  guardianPhone: string;
  studentEmail: string;
  studentPhone: string;
};

export type StudentEnrollmentSummaryData = {
  student: string;
  guardians: string;
  contactsAddress: string;
  medicalInfo: string;
  academic: string;
  review: string;
};

export type StudentEnrollmentStepValues = CreateStudentEnrollmentRequest;

export type StudentEnrollmentOnboardingActions = {
  updateSelectedStudentId: (value: string) => void;
  updateStudentFullName: (value: string) => void;
  updateStudentDocumentNumber: (value: string) => void;
  updateStudentDocumentType: (value: EnrollmentPerson['documentType']) => void;
  updateStudentDateOfBirth: (value: string) => void;
  updateStudentGender: (value: EnrollmentPerson['gender']) => void;
  updateStudentMaritalStatus: (value: EnrollmentPerson['maritalStatus']) => void;
  updateStudentNationality: (value: EnrollmentPerson['nationality']) => void;
  updateStudentRegistrationCode: (value: string) => void;
  updateStudentEmail: (value: string) => void;
  updateStudentPhone: (value: string) => void;
  updateStudentCep: (value: string) => void;
  updateStudentStreet: (value: string) => void;
  updateStudentNumber: (value: string) => void;
  updateStudentComplement: (value: string) => void;
  updateStudentNeighborhood: (value: string) => void;
  updateStudentCity: (value: string) => void;
  updateStudentState: (value: string) => void;
  updateStudentCountry: (value: string) => void;
  updateGuardianFullName: (value: string) => void;
  updateGuardianDocumentNumber: (value: string) => void;
  updateGuardianDocumentType: (value: EnrollmentPerson['documentType']) => void;
  updateGuardianRelationshipType: (value: EnrollmentLegalGuardianInput['relationshipType']) => void;
  updateGuardianEmail: (value: string) => void;
  updateGuardianPhone: (value: string) => void;
  updateGuardianCep: (value: string) => void;
  updateGuardianStreet: (value: string) => void;
  updateGuardianNumber: (value: string) => void;
  updateGuardianComplement: (value: string) => void;
  updateGuardianNeighborhood: (value: string) => void;
  updateGuardianCity: (value: string) => void;
  updateGuardianState: (value: string) => void;
  updateGuardianCountry: (value: string) => void;
  updateMedicalBloodType: (value: string) => void;
  updateMedicalAllergies: (value: string) => void;
  updateMedicalChronicDiseases: (value: string) => void;
  updateMedicalMedications: (value: string) => void;
  updateMedicalEmergencyContactName: (value: string) => void;
  updateMedicalEmergencyContactPhone: (value: string) => void;
  updateMedicalNotes: (value: string) => void;
  updateAcademicYearId: (value: string) => void;
  updateSchoolClassId: (value: string) => void;
  updateEnrollmentDate: (value: string) => void;
  updateEnrollmentCode: (value: string) => void;
  updateObservations: (value: string) => void;
};

export type StudentEnrollmentStepProps = {
  value: StudentEnrollmentStepValues;
  uiExtras: StudentEnrollmentOnboardingUiExtras;
  actions: StudentEnrollmentOnboardingActions;
  referenceOptions: {
    academicYearOptions: AppSelectOption[];
    schoolClassOptions: AppSelectOption[];
    studentOptions: AppSelectOption[];
    loading: boolean;
    errorMessage: string | undefined;
  };
};

export type StudentEnrollmentStepsProps = StudentEnrollmentStepProps & {
  activeStep: number;
};

export type StudentEnrollmentStateFactories = {
  createEmptyAddress: () => EnrollmentAddress;
  createEmptyContactList: () => EnrollmentContact[];
  createEmptyGuardian: () => EnrollmentLegalGuardianInput;
  createEmptyMedicalInfo: () => EnrollmentMedicalInfo;
  createEmptyPerson: () => EnrollmentPerson;
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput;
};
