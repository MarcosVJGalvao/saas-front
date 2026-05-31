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

const updateGuardianAtIndex = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  index: number,
  updater: (guardian: EnrollmentLegalGuardianInput) => EnrollmentLegalGuardianInput,
) =>
  updateStudent(setValue, ensureStudent, (student) => {
    const guardians = student.legalGuardians.map((guardian, i) =>
      i === index ? updater(guardian) : guardian,
    );
    return { ...student, legalGuardians: guardians };
  });

const updateGuardianPersonAtIndex = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  createEmptyPerson: () => EnrollmentPerson,
  index: number,
  updater: (person: EnrollmentPerson) => EnrollmentPerson,
) =>
  updateGuardianAtIndex(setValue, ensureStudent, index, (guardian) => ({
    ...guardian,
    person: updater(guardian.person ?? createEmptyPerson()),
  }));

const updateGuardianAddressAtIndex = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  ensureStudent: (currentValue: CreateStudentEnrollmentRequest) => EnrollmentStudentInput,
  createEmptyAddress: () => EnrollmentAddress,
  index: number,
  updater: (address: EnrollmentAddress) => EnrollmentAddress,
) =>
  updateGuardianAtIndex(setValue, ensureStudent, index, (guardian) => {
    const primaryAddress = guardian.addresses?.[0] ?? createEmptyAddress();
    return { ...guardian, addresses: [updater(primaryAddress)] };
  });

const updateGuardianUiArrayField = (
  setUiExtras: Dispatch<SetStateAction<StudentEnrollmentOnboardingUiExtras>>,
  field: 'guardianCeps' | 'guardianEmails' | 'guardianPhones',
  index: number,
  value: string,
) =>
  setUiExtras((current) => {
    const arr = [...current[field]];
    arr[index] = value;
    return { ...current, [field]: arr };
  });

const updateGuardianPhoneIsWhatsAppAtIndex = (
  setUiExtras: Dispatch<SetStateAction<StudentEnrollmentOnboardingUiExtras>>,
  index: number,
  value: boolean,
) =>
  setUiExtras((current) => {
    const arr = [...current.guardianPhoneIsWhatsApp];
    arr[index] = value;
    return { ...current, guardianPhoneIsWhatsApp: arr };
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
  updateStudentNaturality: (naturality) =>
    updateStudentPerson(setValue, stateFactories.ensureStudent, (person) => ({
      ...person,
      naturality,
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
  updateStudentPhoneIsWhatsApp: (studentPhoneIsWhatsApp) =>
    setUiExtras((currentUiExtras) => ({ ...currentUiExtras, studentPhoneIsWhatsApp })),
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
  addGuardian: () => {
    setValue((currentValue) => {
      const student = stateFactories.ensureStudent(currentValue);
      return {
        ...currentValue,
        student: {
          ...student,
          legalGuardians: [
            ...student.legalGuardians,
            { ...stateFactories.createEmptyGuardian(), isPrimary: false },
          ],
        },
      };
    });
    setUiExtras((current) => ({
      ...current,
      guardianCeps: [...current.guardianCeps, ''],
      guardianEmails: [...current.guardianEmails, ''],
      guardianPhones: [...current.guardianPhones, ''],
      guardianPhoneIsWhatsApp: [...current.guardianPhoneIsWhatsApp, false],
    }));
  },
  removeGuardian: (index) => {
    setValue((currentValue) => {
      const student = stateFactories.ensureStudent(currentValue);
      return {
        ...currentValue,
        student: {
          ...student,
          legalGuardians: student.legalGuardians.filter((_, i) => i !== index),
        },
      };
    });
    setUiExtras((current) => ({
      ...current,
      guardianCeps: current.guardianCeps.filter((_, i) => i !== index),
      guardianEmails: current.guardianEmails.filter((_, i) => i !== index),
      guardianPhones: current.guardianPhones.filter((_, i) => i !== index),
      guardianPhoneIsWhatsApp: current.guardianPhoneIsWhatsApp.filter((_, i) => i !== index),
    }));
  },
  updateGuardianRelationshipType: (index, relationshipType) =>
    updateGuardianAtIndex(setValue, stateFactories.ensureStudent, index, (guardian) => ({
      ...guardian,
      relationshipType,
    })),
  updateGuardianFullName: (index, fullName) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, fullName }),
    ),
  updateGuardianDocumentNumber: (index, documentNumber) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, documentNumber }),
    ),
  updateGuardianDocumentType: (index, documentType) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, documentType }),
    ),
  updateGuardianDateOfBirth: (index, dateOfBirth) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, dateOfBirth }),
    ),
  updateGuardianNaturality: (index, naturality) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, naturality }),
    ),
  updateGuardianGender: (index, gender) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, gender }),
    ),
  updateGuardianMaritalStatus: (index, maritalStatus) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, maritalStatus }),
    ),
  updateGuardianNationality: (index, nationality) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, nationality }),
    ),
  updateGuardianMonthlyIncome: (index, monthlyIncome) =>
    updateGuardianPersonAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyPerson,
      index,
      (person) => ({ ...person, monthlyIncome }),
    ),
  updateGuardianCanPickUp: (index, canPickUp) =>
    updateGuardianAtIndex(setValue, stateFactories.ensureStudent, index, (guardian) => ({
      ...guardian,
      canPickUp,
    })),
  updateGuardianEmail: (index, value) =>
    updateGuardianUiArrayField(setUiExtras, 'guardianEmails', index, value),
  updateGuardianPhone: (index, value) =>
    updateGuardianUiArrayField(setUiExtras, 'guardianPhones', index, value),
  updateGuardianPhoneIsWhatsApp: (index, value) =>
    updateGuardianPhoneIsWhatsAppAtIndex(setUiExtras, index, value),
  updateGuardianCep: (index, value) =>
    updateGuardianUiArrayField(setUiExtras, 'guardianCeps', index, value),
  updateGuardianStreet: (index, street) =>
    updateGuardianAddressAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      index,
      (address) => ({ ...address, street }),
    ),
  updateGuardianNumber: (index, number) =>
    updateGuardianAddressAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      index,
      (address) => ({ ...address, number }),
    ),
  updateGuardianComplement: (index, complement) =>
    updateGuardianAddressAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      index,
      (address) => ({ ...address, complement }),
    ),
  updateGuardianNeighborhood: (index, neighborhood) =>
    updateGuardianAddressAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      index,
      (address) => ({ ...address, neighborhood }),
    ),
  updateGuardianCity: (index, city) =>
    updateGuardianAddressAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      index,
      (address) => ({ ...address, city }),
    ),
  updateGuardianState: (index, state) =>
    updateGuardianAddressAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      index,
      (address) => ({ ...address, state }),
    ),
  updateGuardianCountry: (index, country) =>
    updateGuardianAddressAtIndex(
      setValue,
      stateFactories.ensureStudent,
      stateFactories.createEmptyAddress,
      index,
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
