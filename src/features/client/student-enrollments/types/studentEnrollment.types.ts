import type { PaginationMeta } from '@shared/types/pagination';

export type DocumentType = 'CPF' | 'CNPJ' | 'RG' | 'PASSPORT' | 'OTHER';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'other';
export type Nationality = 'brazilian' | 'foreign' | 'other';
export type GuardianRelationshipType =
  | 'mother'
  | 'father'
  | 'legal_guardian'
  | 'grandparent'
  | 'other';
export type ContactType = 'email' | 'phone' | 'whatsapp' | 'linkedin' | 'other';
export type StudentStatus = 'active' | 'inactive' | 'cancelled';
export type EnrollmentStatus = 'active' | 'cancelled' | 'transferred';

export type EnrollmentPerson = {
  fullName: string;
  documentNumber: string;
  documentType: DocumentType;
  dateOfBirth?: string | undefined;
  gender?: Gender | undefined;
  maritalStatus?: MaritalStatus | undefined;
  nationality?: Nationality | undefined;
  monthlyIncome?: string | undefined;
};

export type EnrollmentAddress = {
  street: string;
  number: string;
  complement?: string | undefined;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type EnrollmentContact = {
  type: ContactType;
  value: string;
};

export type EnrollmentMedicalInfo = {
  bloodType?: string | undefined;
  allergies?: string | undefined;
  chronicDiseases?: string | undefined;
  medications?: string | undefined;
  emergencyContactName?: string | undefined;
  emergencyContactPhone?: string | undefined;
  notes?: string | undefined;
};

export type EnrollmentLegalGuardianInput = {
  legalGuardianId?: string | undefined;
  relationshipType: GuardianRelationshipType;
  isPrimary: boolean;
  person?: EnrollmentPerson | undefined;
  addresses?: EnrollmentAddress[] | undefined;
  contacts?: EnrollmentContact[] | undefined;
};

export type EnrollmentStudentInput = {
  registrationCode?: string | undefined;
  person: EnrollmentPerson;
  addresses: EnrollmentAddress[];
  contacts: EnrollmentContact[];
  medicalInfo?: EnrollmentMedicalInfo | undefined;
  legalGuardians: EnrollmentLegalGuardianInput[];
};

export type CreateStudentEnrollmentRequest = {
  studentId?: string | undefined;
  student?: EnrollmentStudentInput | undefined;
  academic: {
    academicYearId: string;
    schoolClassId?: string | undefined;
    enrollmentDate: string;
  };
  enrollmentCode?: string | undefined;
  observations?: string | undefined;
};

export type StudentEnrollment = {
  id: string;
  enrollmentCode?: string | null | undefined;
  status: EnrollmentStatus;
  enrollmentDate: string;
  observations?: string | null | undefined;
  student?: {
    id: string;
    registrationCode?: string | null | undefined;
    status?: StudentStatus | undefined;
    person?: {
      fullName: string;
      documentNumber: string;
      documentType?: DocumentType | undefined;
    } | null;
  } | null;
  academicYear?: {
    id: string;
    name: string;
  } | null;
  schoolClass?: {
    id: string;
    name: string;
    code?: string | null | undefined;
  } | null;
  financialSummary?: unknown;
};

export type StudentEnrollmentQueryParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'ASC' | 'DESC' | undefined;
  status?: EnrollmentStatus | undefined;
  academicYearId?: string | undefined;
  schoolClassId?: string | undefined;
};

export type StudentEnrollmentListResponse = {
  data: StudentEnrollment[];
  meta: PaginationMeta;
};

export type StudentEnrollmentOption = {
  id: string;
  label: string;
};
