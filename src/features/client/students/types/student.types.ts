import type {
  ContactTypeValue,
  DocumentTypeValue,
  GenderValue,
  GuardianRelationshipTypeValue,
  StudentStatusValue,
} from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type StudentStatus = StudentStatusValue;
export type StudentDocumentType = DocumentTypeValue;
export type StudentGender = GenderValue;
export type StudentContactType = ContactTypeValue;
export type LegalGuardianRelationshipType = GuardianRelationshipTypeValue;

export type StudentPerson = {
  id?: string | undefined;
  fullName: string;
  documentNumber?: string | undefined;
  documentType?: StudentDocumentType | undefined;
  dateOfBirth?: string | undefined;
  gender?: StudentGender | undefined;
};

export type StudentContact = {
  id?: string | undefined;
  type: StudentContactType;
  value: string;
};

export type StudentAddress = {
  id?: string | undefined;
  street?: string | undefined;
  number?: string | undefined;
  complement?: string | undefined;
  neighborhood?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  zipCode?: string | undefined;
  country?: string | undefined;
};

export type StudentEnrollmentSummary = {
  id: string;
  enrollmentCode?: string | undefined;
  status?: string | undefined;
  enrollmentDate?: string | undefined;
  academicYear?: {
    id: string;
    name: string;
  } | null;
  schoolClass?: {
    id: string;
    name: string;
    code?: string | undefined;
  } | null;
  financialSummary?: {
    total?: number | undefined;
    received?: number | undefined;
    open?: number | undefined;
    overdue?: number | undefined;
  } | null;
};

export type StudentLegalGuardianLink = {
  id: string;
  relationshipType?: LegalGuardianRelationshipType | undefined;
  isPrimary?: boolean | undefined;
  isFinancialResponsible?: boolean | undefined;
  legalGuardian?:
    | {
        id: string;
        person?: StudentPerson | null | undefined;
        contacts?: StudentContact[] | undefined;
        addresses?: StudentAddress[] | undefined;
      }
    | null
    | undefined;
};

export type Student = {
  id: string;
  registrationCode?: string | undefined;
  status: StudentStatus;
  person?: StudentPerson | null | undefined;
  contacts?: StudentContact[] | undefined;
  addresses?: StudentAddress[] | undefined;
  enrollments?: StudentEnrollmentSummary[] | undefined;
  legalGuardians?: StudentLegalGuardianLink[] | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type StudentQueryParams = ClientBaseQueryParams & {
  status?: StudentStatus | undefined;
  schoolClassId?: string | undefined;
};

export type StudentPersonRequest = {
  fullName?: string | undefined;
  documentNumber?: string | undefined;
  documentType?: StudentDocumentType | undefined;
  dateOfBirth?: string | undefined;
  gender?: StudentGender | undefined;
};

export type StudentRequest = {
  registrationCode?: string | undefined;
  status?: StudentStatus | undefined;
  person?: StudentPersonRequest | undefined;
};

export type LegalGuardianStudentLink = {
  id: string;
  registrationCode?: string | undefined;
  person?: StudentPerson | null | undefined;
};

export type LegalGuardian = {
  id: string;
  relationshipType?: LegalGuardianRelationshipType | undefined;
  isPrimary?: boolean | undefined;
  person?: StudentPerson | null | undefined;
  contacts?: StudentContact[] | undefined;
  addresses?: StudentAddress[] | undefined;
  students?: LegalGuardianStudentLink[] | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type LegalGuardianQueryParams = ClientBaseQueryParams & {
  relationshipType?: LegalGuardianRelationshipType | undefined;
};

export type LegalGuardianRequest = {
  relationshipType?: LegalGuardianRelationshipType | undefined;
  person?: StudentPersonRequest | undefined;
};

export type StudentFinancialHistoryQueryParams = ClientBaseQueryParams;
