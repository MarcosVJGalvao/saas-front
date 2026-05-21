import { onlyDigits } from '@shared/parsers/stringParsers';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { MedicalInfoFormValues } from '@features/client/medical-info/schemas/medicalInfoForm.schema';
import type { MedicalInfo } from '@features/client/medical-info/types/medicalInfo.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildMedicalInfoInitialValues = (): MedicalInfoFormValues => ({
  personId: '',
  bloodType: '',
  allergies: '',
  chronicDiseases: '',
  medications: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  notes: '',
});

export const normalizeMedicalInfoInitialValues = (
  medicalInfo: MedicalInfo,
): MedicalInfoFormValues => ({
  personId: medicalInfo.personId ?? medicalInfo.person?.id ?? '',
  bloodType: medicalInfo.bloodType ?? '',
  allergies: medicalInfo.allergies ?? '',
  chronicDiseases: medicalInfo.chronicDiseases ?? '',
  medications: medicalInfo.medications ?? '',
  emergencyContactName: medicalInfo.emergencyContactName ?? '',
  emergencyContactPhone: medicalInfo.emergencyContactPhone ?? '',
  notes: medicalInfo.notes ?? '',
});

export const normalizeMedicalInfoPayload = (values: MedicalInfoFormValues): ClientApiRecord => ({
  personId: optionalText(values.personId),
  bloodType: optionalText(values.bloodType),
  allergies: optionalText(values.allergies),
  chronicDiseases: optionalText(values.chronicDiseases),
  medications: optionalText(values.medications),
  emergencyContactName: optionalText(values.emergencyContactName),
  emergencyContactPhone: values.emergencyContactPhone
    ? optionalText(onlyDigits(values.emergencyContactPhone))
    : undefined,
  notes: optionalText(values.notes),
});
