import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type MedicalInfo = {
  id: string;
  personId?: string | undefined;
  bloodType?: string | undefined;
  allergies?: string | undefined;
  chronicDiseases?: string | undefined;
  medications?: string | undefined;
  emergencyContactName?: string | undefined;
  emergencyContactPhone?: string | undefined;
  notes?: string | undefined;
  person?: {
    id: string;
    fullName?: string | undefined;
    documentNumber?: string | undefined;
  } | null;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type MedicalInfoQueryParams = ClientBaseQueryParams;
