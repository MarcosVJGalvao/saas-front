import type { Dispatch, SetStateAction } from 'react';
import type {
  CreateStudentEnrollmentRequest,
  EnrollmentAddress,
  EnrollmentLegalGuardianInput,
  EnrollmentMedicalInfo,
  EnrollmentPerson,
  EnrollmentStudentInput,
} from '@features/client/student-enrollments/types/studentEnrollment.types';
import type {
  StudentEnrollmentOnboardingActions,
  StudentEnrollmentOnboardingUiExtras,
  StudentEnrollmentStateFactories,
} from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

type UseStudentEnrollmentOnboardingActionsParams = {
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>;
  setUiExtras: Dispatch<SetStateAction<StudentEnrollmentOnboardingUiExtras>>;
  stateFactories: StudentEnrollmentStateFactories;
};

const updateStudent = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  updater: (student: EnrollmentStudentInput) => EnrollmentStudentInput,
) => {
  setValue((currentValue) => ({
    ...currentValue,
    student: updater(ensureStudent(currentValue)),
  }));
};

const updateStudentPerson = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  updater: (person: EnrollmentPerson) => EnrollmentPerson,
) =>
  updateStudent(setValue, ensureStudent, (student) => ({
    ...student,
    person: updater(student.person),
  }));

const updateStudentAddress = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  createEmptyAddress: () => EnrollmentAddress,
  updater: (address: EnrollmentAddress) => EnrollmentAddress,
) =>
  updateStudent(setValue, ensureStudent, (student) => {
    const primaryAddress = student.addresses[0] ?? createEmptyAddress();
    return { ...student, addresses: [updater(primaryAddress)] };
  });

const updateGuardian = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  createEmptyGuardian: () => EnrollmentLegalGuardianInput,
  updater: (guardian: EnrollmentLegalGuardianInput) => EnrollmentLegalGuardianInput,
) =>
  updateStudent(setValue, ensureStudent, (student) => {
    const primaryGuardian = student.legalGuardians[0] ?? createEmptyGuardian();
    return { ...student, legalGuardians: [updater(primaryGuardian)] };
  });

const updateGuardianPerson = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  createEmptyGuardian: () => EnrollmentLegalGuardianInput,
  createEmptyPerson: () => EnrollmentPerson,
  updater: (person: EnrollmentPerson) => EnrollmentPerson,
) =>
  updateGuardian(setValue, ensureStudent, createEmptyGuardian, (guardian) => ({
    ...guardian,
    person: updater(guardian.person ?? createEmptyPerson()),
  }));

const updateGuardianAddress = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  createEmptyGuardian: () => EnrollmentLegalGuardianInput,
  createEmptyAddress: () => EnrollmentAddress,
  updater: (address: EnrollmentAddress) => EnrollmentAddress,
) =>
  updateGuardian(setValue, ensureStudent, createEmptyGuardian, (guardian) => {
    const primaryAddress = guardian.addresses?.[0] ?? createEmptyAddress();
    return { ...guardian, addresses: [updater(primaryAddress)] };
  });

const updateMedicalInfo = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  createEmptyMedicalInfo: () => EnrollmentMedicalInfo,
  updater: (medicalInfo: EnrollmentMedicalInfo) => EnrollmentMedicalInfo,
) =>
  updateStudent(setValue, ensureStudent, (student) => ({
    ...student,
    medicalInfo: updater(student.medicalInfo ?? createEmptyMedicalInfo()),
  }));

export const useStudentEnrollmentOnboardingActions = ({
  setValue,
  setUiExtras,
  stateFactories,
}: UseStudentEnrollmentOnboardingActionsParams): StudentEnrollmentOnboardingActions => ({
  updateSelectedStudentId: (selectedStudentId) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, selectedStudentId })),
  updateStudentFullName: (fullName) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      fullName,
    })),
  updateStudentDocumentNumber: (documentNumber) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      documentNumber,
    })),
  updateStudentDocumentType: (documentType) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      documentType,
    })),
  updateStudentDateOfBirth: (dateOfBirth) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      dateOfBirth,
    })),
  updateStudentGender: (gender) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      gender,
    })),
  updateStudentMaritalStatus: (maritalStatus) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      maritalStatus,
    })),
  updateStudentNationality: (nationality) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      nationality,
    })),
  updateStudentRegistrationCode: (registrationCode) =>
    updateStudent(setValue, stateFactories.ensureStudent, (student) => ({
      ...student,
      registrationCode,
    })),
  updateStudentEmail: (studentEmail) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, studentEmail })),
  updateStudentPhone: (studentPhone) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, studentPhone })),
  updateStudentCep: (studentCep) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, studentCep })),
  updateStudentStreet: (street) =>
    updateStudentAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, street }),
    ),
  updateStudentNumber: (number) =>
    updateStudentAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, number }),
    ),
  updateStudentComplement: (complement) =>
    updateStudentAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, complement }),
    ),
  updateStudentNeighborhood: (neighborhood) =>
    updateStudentAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, neighborhood }),
    ),
  updateStudentCity: (city) =>
    updateStudentAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, city }),
    ),
  updateStudentState: (state) =>
    updateStudentAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, state }),
    ),
  updateStudentCountry: (country) =>
    updateStudentAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, country }),
    ),
  updateGuardianFullName: (fullName) =>
    updateGuardianPerson(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyPerson,
      (person) => ({ ...person, fullName }),
    ),
  updateGuardianDocumentNumber: (documentNumber) =>
    updateGuardianPerson(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyPerson,
      (person) => ({ ...person, documentNumber }),
    ),
  updateGuardianDocumentType: (documentType) =>
    updateGuardianPerson(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyPerson,
      (person) => ({ ...person, documentType }),
    ),
  updateGuardianRelationshipType: (relationshipType) =>
    updateGuardian(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      (guardian) => ({ ...guardian, relationshipType }),
    ),
  updateGuardianEmail: (guardianEmail) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, guardianEmail })),
  updateGuardianPhone: (guardianPhone) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, guardianPhone })),
  updateGuardianCep: (guardianCep) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, guardianCep })),
  updateGuardianStreet: (street) =>
    updateGuardianAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, street }),
    ),
  updateGuardianNumber: (number) =>
    updateGuardianAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, number }),
    ),
  updateGuardianComplement: (complement) =>
    updateGuardianAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, complement }),
    ),
  updateGuardianNeighborhood: (neighborhood) =>
    updateGuardianAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, neighborhood }),
    ),
  updateGuardianCity: (city) =>
    updateGuardianAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, city }),
    ),
  updateGuardianState: (state) =>
    updateGuardianAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, state }),
    ),
  updateGuardianCountry: (country) =>
    updateGuardianAddress(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyGuardian,
      stateFactories.createEmptyAddress,
      (address) => ({ ...address, country }),
    ),
  updateMedicalBloodType: (bloodType) =>
    updateMedicalInfo(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyMedicalInfo,
      (medicalInfo) => ({ ...medicalInfo, bloodType }),
    ),
  updateMedicalAllergies: (allergies) =>
    updateMedicalInfo(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyMedicalInfo,
      (medicalInfo) => ({ ...medicalInfo, allergies }),
    ),
  updateMedicalChronicDiseases: (chronicDiseases) =>
    updateMedicalInfo(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyMedicalInfo,
      (medicalInfo) => ({ ...medicalInfo, chronicDiseases }),
    ),
  updateMedicalMedications: (medications) =>
    updateMedicalInfo(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyMedicalInfo,
      (medicalInfo) => ({ ...medicalInfo, medications }),
    ),
  updateMedicalEmergencyContactName: (emergencyContactName) =>
    updateMedicalInfo(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyMedicalInfo,
      (medicalInfo) => ({ ...medicalInfo, emergencyContactName }),
    ),
  updateMedicalEmergencyContactPhone: (emergencyContactPhone) =>
    updateMedicalInfo(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyMedicalInfo,
      (medicalInfo) => ({ ...medicalInfo, emergencyContactPhone }),
    ),
  updateMedicalNotes: (notes) =>
    updateMedicalInfo(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyMedicalInfo,
      (medicalInfo) => ({ ...medicalInfo, notes }),
    ),
  updateAcademicYearId: (academicYearId) =>
    setValue((currentValue) => ({
      ...currentValue,
      academic: { ...currentValue.academic, academicYearId },
    })),
  updateSchoolClassId: (schoolClassId) =>
    setValue((currentValue) => ({
      ...currentValue,
      academic: { ...currentValue.academic, schoolClassId },
    })),
  updateEnrollmentDate: (enrollmentDate) =>
    setValue((currentValue) => ({
      ...currentValue,
      academic: { ...currentValue.academic, enrollmentDate },
    })),
  updateEnrollmentCode: (enrollmentCode) =>
    setValue((currentValue) => ({ ...currentValue, enrollmentCode })),
  updateObservations: (observations) =>
    setValue((currentValue) => ({ ...currentValue, observations })),
});
