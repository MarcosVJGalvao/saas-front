import { useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type {
  CreateStudentEnrollmentRequest,
  DocumentType,
  EnrollmentAddress,
  EnrollmentLegalGuardianInput,
  EnrollmentMedicalInfo,
  EnrollmentPerson,
  EnrollmentStudentInput,
  Gender,
  GuardianRelationshipType,
  MaritalStatus,
  Nationality,
  StudentEnrollmentOnboardingUiExtras,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

export type StudentEnrollmentActions = {
  updateSelectedStudentId: (value: string) => void;
  updateStudentFullName: (value: string) => void;
  updateStudentDocumentType: (value: DocumentType) => void;
  updateStudentDocumentNumber: (value: string) => void;
  updateStudentDateOfBirth: (value: string) => void;
  updateStudentGender: (value: Gender | undefined) => void;
  updateStudentMaritalStatus: (value: MaritalStatus | undefined) => void;
  updateStudentNationality: (value: Nationality | undefined) => void;
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
  updateGuardianDocumentType: (value: DocumentType) => void;
  updateGuardianDocumentNumber: (value: string) => void;
  updateGuardianRelationshipType: (value: GuardianRelationshipType) => void;
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

type UseStudentEnrollmentActionsParams = {
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>;
  setUiExtras: Dispatch<SetStateAction<StudentEnrollmentOnboardingUiExtras>>;
};

const emptyPerson = (): EnrollmentPerson => ({
  fullName: '',
  documentNumber: '',
  documentType: 'CPF',
  dateOfBirth: '',
  gender: undefined,
  maritalStatus: undefined,
  nationality: 'brazilian',
  monthlyIncome: '',
});

const emptyAddress = (): EnrollmentAddress => ({
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Brasil',
});

const emptyMedicalInfo = (): EnrollmentMedicalInfo => ({
  bloodType: '',
  allergies: '',
  chronicDiseases: '',
  medications: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  notes: '',
});

const emptyGuardian = (): EnrollmentLegalGuardianInput => ({
  relationshipType: 'mother',
  isPrimary: true,
  person: emptyPerson(),
  addresses: [emptyAddress()],
  contacts: [
    { type: 'email', value: '' },
    { type: 'phone', value: '' },
  ],
});

const ensureStudent = (current: CreateStudentEnrollmentRequest): EnrollmentStudentInput => ({
  registrationCode: current.student?.registrationCode ?? '',
  person: current.student?.person ?? emptyPerson(),
  addresses: current.student?.addresses ?? [emptyAddress()],
  contacts: current.student?.contacts ?? [
    { type: 'email', value: '' },
    { type: 'phone', value: '' },
  ],
  medicalInfo: current.student?.medicalInfo ?? emptyMedicalInfo(),
  legalGuardians: current.student?.legalGuardians ?? [emptyGuardian()],
});

const updateStudent = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  updater: (student: EnrollmentStudentInput) => EnrollmentStudentInput,
) => {
  setValue((current) => ({
    ...current,
    student: updater(ensureStudent(current)),
  }));
};

const updateStudentPerson = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  updater: (person: EnrollmentPerson) => EnrollmentPerson,
) => updateStudent(setValue, (student) => ({ ...student, person: updater(student.person) }));

const updateStudentAddress = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  updater: (address: EnrollmentAddress) => EnrollmentAddress,
) =>
  updateStudent(setValue, (student) => {
    const address = student.addresses[0] ?? emptyAddress();
    return { ...student, addresses: [updater(address)] };
  });

const updateGuardian = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  updater: (guardian: EnrollmentLegalGuardianInput) => EnrollmentLegalGuardianInput,
) =>
  updateStudent(setValue, (student) => {
    const guardian = student.legalGuardians[0] ?? emptyGuardian();
    return { ...student, legalGuardians: [updater(guardian)] };
  });

const updateGuardianPerson = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  updater: (person: EnrollmentPerson) => EnrollmentPerson,
) =>
  updateGuardian(setValue, (guardian) => ({
    ...guardian,
    person: updater(guardian.person ?? emptyPerson()),
  }));

const updateGuardianAddress = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  updater: (address: EnrollmentAddress) => EnrollmentAddress,
) =>
  updateGuardian(setValue, (guardian) => {
    const address = guardian.addresses?.[0] ?? emptyAddress();
    return { ...guardian, addresses: [updater(address)] };
  });

const updateMedicalInfo = (
  setValue: Dispatch<SetStateAction<CreateStudentEnrollmentRequest>>,
  updater: (medicalInfo: EnrollmentMedicalInfo) => EnrollmentMedicalInfo,
) =>
  updateStudent(setValue, (student) => ({
    ...student,
    medicalInfo: updater(student.medicalInfo ?? emptyMedicalInfo()),
  }));

export const useStudentEnrollmentActions = ({
  setValue,
  setUiExtras,
}: UseStudentEnrollmentActionsParams): StudentEnrollmentActions =>
  useMemo(
    () => ({
      updateSelectedStudentId: (selectedStudentId) =>
        setUiExtras((current) => ({ ...current, selectedStudentId })),
      updateStudentFullName: (fullName) =>
        updateStudentPerson(setValue, (person) => ({ ...person, fullName })),
      updateStudentDocumentType: (documentType) =>
        updateStudentPerson(setValue, (person) => ({ ...person, documentType })),
      updateStudentDocumentNumber: (documentNumber) =>
        updateStudentPerson(setValue, (person) => ({ ...person, documentNumber })),
      updateStudentDateOfBirth: (dateOfBirth) =>
        updateStudentPerson(setValue, (person) => ({ ...person, dateOfBirth })),
      updateStudentGender: (gender) =>
        updateStudentPerson(setValue, (person) => ({ ...person, gender })),
      updateStudentMaritalStatus: (maritalStatus) =>
        updateStudentPerson(setValue, (person) => ({ ...person, maritalStatus })),
      updateStudentNationality: (nationality) =>
        updateStudentPerson(setValue, (person) => ({ ...person, nationality })),
      updateStudentRegistrationCode: (registrationCode) =>
        updateStudent(setValue, (student) => ({ ...student, registrationCode })),
      updateStudentEmail: (studentEmail) =>
        setUiExtras((current) => ({ ...current, studentEmail })),
      updateStudentPhone: (studentPhone) =>
        setUiExtras((current) => ({ ...current, studentPhone })),
      updateStudentCep: (studentCep) => setUiExtras((current) => ({ ...current, studentCep })),
      updateStudentStreet: (street) =>
        updateStudentAddress(setValue, (address) => ({ ...address, street })),
      updateStudentNumber: (number) =>
        updateStudentAddress(setValue, (address) => ({ ...address, number })),
      updateStudentComplement: (complement) =>
        updateStudentAddress(setValue, (address) => ({ ...address, complement })),
      updateStudentNeighborhood: (neighborhood) =>
        updateStudentAddress(setValue, (address) => ({ ...address, neighborhood })),
      updateStudentCity: (city) =>
        updateStudentAddress(setValue, (address) => ({ ...address, city })),
      updateStudentState: (state) =>
        updateStudentAddress(setValue, (address) => ({ ...address, state })),
      updateStudentCountry: (country) =>
        updateStudentAddress(setValue, (address) => ({ ...address, country })),
      updateGuardianFullName: (fullName) =>
        updateGuardianPerson(setValue, (person) => ({ ...person, fullName })),
      updateGuardianDocumentType: (documentType) =>
        updateGuardianPerson(setValue, (person) => ({ ...person, documentType })),
      updateGuardianDocumentNumber: (documentNumber) =>
        updateGuardianPerson(setValue, (person) => ({ ...person, documentNumber })),
      updateGuardianRelationshipType: (relationshipType) =>
        updateGuardian(setValue, (guardian) => ({ ...guardian, relationshipType })),
      updateGuardianEmail: (guardianEmail) =>
        setUiExtras((current) => ({ ...current, guardianEmail })),
      updateGuardianPhone: (guardianPhone) =>
        setUiExtras((current) => ({ ...current, guardianPhone })),
      updateGuardianCep: (guardianCep) => setUiExtras((current) => ({ ...current, guardianCep })),
      updateGuardianStreet: (street) =>
        updateGuardianAddress(setValue, (address) => ({ ...address, street })),
      updateGuardianNumber: (number) =>
        updateGuardianAddress(setValue, (address) => ({ ...address, number })),
      updateGuardianComplement: (complement) =>
        updateGuardianAddress(setValue, (address) => ({ ...address, complement })),
      updateGuardianNeighborhood: (neighborhood) =>
        updateGuardianAddress(setValue, (address) => ({ ...address, neighborhood })),
      updateGuardianCity: (city) =>
        updateGuardianAddress(setValue, (address) => ({ ...address, city })),
      updateGuardianState: (state) =>
        updateGuardianAddress(setValue, (address) => ({ ...address, state })),
      updateGuardianCountry: (country) =>
        updateGuardianAddress(setValue, (address) => ({ ...address, country })),
      updateMedicalBloodType: (bloodType) =>
        updateMedicalInfo(setValue, (medicalInfo) => ({ ...medicalInfo, bloodType })),
      updateMedicalAllergies: (allergies) =>
        updateMedicalInfo(setValue, (medicalInfo) => ({ ...medicalInfo, allergies })),
      updateMedicalChronicDiseases: (chronicDiseases) =>
        updateMedicalInfo(setValue, (medicalInfo) => ({ ...medicalInfo, chronicDiseases })),
      updateMedicalMedications: (medications) =>
        updateMedicalInfo(setValue, (medicalInfo) => ({ ...medicalInfo, medications })),
      updateMedicalEmergencyContactName: (emergencyContactName) =>
        updateMedicalInfo(setValue, (medicalInfo) => ({ ...medicalInfo, emergencyContactName })),
      updateMedicalEmergencyContactPhone: (emergencyContactPhone) =>
        updateMedicalInfo(setValue, (medicalInfo) => ({ ...medicalInfo, emergencyContactPhone })),
      updateMedicalNotes: (notes) =>
        updateMedicalInfo(setValue, (medicalInfo) => ({ ...medicalInfo, notes })),
      updateAcademicYearId: (academicYearId) =>
        setValue((current) => ({ ...current, academic: { ...current.academic, academicYearId } })),
      updateSchoolClassId: (schoolClassId) =>
        setValue((current) => ({ ...current, academic: { ...current.academic, schoolClassId } })),
      updateEnrollmentDate: (enrollmentDate) =>
        setValue((current) => ({ ...current, academic: { ...current.academic, enrollmentDate } })),
      updateEnrollmentCode: (enrollmentCode) =>
        setValue((current) => ({ ...current, enrollmentCode })),
      updateObservations: (observations) => setValue((current) => ({ ...current, observations })),
    }),
    [setUiExtras, setValue],
  );
