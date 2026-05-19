import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type {
  MedicalInfo,
  MedicalInfoQueryParams,
} from '@features/client/medical-info/types/medicalInfo.types';

export const medicalInfoService = createClientCrudService<
  MedicalInfo,
  MedicalInfo,
  ClientApiRecord,
  ClientApiRecord,
  MedicalInfoQueryParams
>('/api/medical-info');
