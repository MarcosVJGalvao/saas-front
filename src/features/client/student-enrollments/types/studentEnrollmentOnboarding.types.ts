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
  studentEmail: string;
  studentPhone: string;
  studentPhoneIsWhatsApp: boolean;
  guardianCeps: string[];
  guardianEmails: string[];
  guardianPhones: string[];
  guardianPhoneIsWhatsApp: boolean[];
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
  updateStudentPhoneIsWhatsApp: (value: boolean) => void;
  updateStudentCep: (value: string) => void;
  updateStudentStreet: (value: string) => void;
  updateStudentNumber: (value: string) => void;
  updateStudentComplement: (value: string) => void;
  updateStudentNeighborhood: (value: string) => void;
  updateStudentCity: (value: string) => void;
  updateStudentState: (value: string) => void;
  updateStudentCountry: (value: string) => void;
  addGuardian: () => void;
  removeGuardian: (index: number) => void;
  updateGuardianFullName: (index: number, value: string) => void;
  updateGuardianDocumentNumber: (index: number, value: string) => void;
  updateGuardianDocumentType: (index: number, value: EnrollmentPerson['documentType']) => void;
  updateGuardianRelationshipType: (
    index: number,
    value: EnrollmentLegalGuardianInput['relationshipType'],
  ) => void;
  updateGuardianDateOfBirth: (index: number, value: string) => void;
  updateGuardianGender: (index: number, value: EnrollmentPerson['gender']) => void;
  updateGuardianMaritalStatus: (index: number, value: EnrollmentPerson['maritalStatus']) => void;
  updateGuardianNationality: (index: number, value: EnrollmentPerson['nationality']) => void;
  updateGuardianMonthlyIncome: (index: number, value: string) => void;
  updateGuardianCanPickUp: (index: number, value: boolean) => void;
  updateGuardianEmail: (index: number, value: string) => void;
  updateGuardianPhone: (index: number, value: string) => void;
  updateGuardianPhoneIsWhatsApp: (index: number, value: boolean) => void;
  updateGuardianCep: (index: number, value: string) => void;
  updateGuardianStreet: (index: number, value: string) => void;
  updateGuardianNumber: (index: number, value: string) => void;
  updateGuardianComplement: (index: number, value: string) => void;
  updateGuardianNeighborhood: (index: number, value: string) => void;
  updateGuardianCity: (index: number, value: string) => void;
  updateGuardianState: (index: number, value: string) => void;
  updateGuardianCountry: (index: number, value: string) => void;
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
