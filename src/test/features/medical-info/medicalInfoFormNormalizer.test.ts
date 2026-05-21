import { describe, expect, it } from 'vitest';
import { normalizeMedicalInfoPayload } from '@features/client/medical-info/normalizers/medicalInfoForm.normalizer';

describe('medicalInfoFormNormalizer', () => {
  it('normaliza informações médicas para o payload do guia', () => {
    const payload = normalizeMedicalInfoPayload({
      personId: ' person-1 ',
      bloodType: ' O+ ',
      allergies: ' Amendoim ',
      chronicDiseases: '',
      medications: ' Antialérgico ',
      emergencyContactName: ' Maria ',
      emergencyContactPhone: '(11) 99999-9999',
      notes: '',
    });

    expect(payload).toEqual({
      personId: 'person-1',
      bloodType: 'O+',
      allergies: 'Amendoim',
      chronicDiseases: undefined,
      medications: 'Antialérgico',
      emergencyContactName: 'Maria',
      emergencyContactPhone: '11999999999',
      notes: undefined,
    });
  });
});
