import { describe, expect, it } from 'vitest';
import {
  buildAcademicCatalogInitialValues,
  toAcademicCatalogCreatePayload,
  toEducationLevelCreatePayload,
  toGradeCreatePayload,
} from '@features/client/academic/normalizers/academicCatalogFormNormalizer';
import { academicCatalogCreateFormSchema } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';

describe('academic catalog form normalizer', () => {
  it('cria estado inicial padrão', () => {
    expect(buildAcademicCatalogInitialValues()).toEqual({
      name: '',
      code: '',
      status: 'active',
      description: '',
      educationLevelId: '',
    });
  });

  it('normaliza payload removendo textos vazios', () => {
    const values = academicCatalogCreateFormSchema.parse({
      name: ' Ensino Fundamental ',
      code: ' EF ',
      status: 'active',
      description: '',
      educationLevelId: ' level-1 ',
    });

    expect(toAcademicCatalogCreatePayload(values)).toEqual({
      name: 'Ensino Fundamental',
      code: 'EF',
      status: 'active',
      description: undefined,
      educationLevelId: 'level-1',
    });
  });

  it('normaliza payload de nível de ensino sem campos inexistentes', () => {
    const values = academicCatalogCreateFormSchema.parse({
      name: ' Ensino Fundamental ',
      code: ' EF ',
      status: 'active',
      description: ' Base comum ',
      educationLevelId: '',
    });

    expect(toEducationLevelCreatePayload(values)).toEqual({
      name: 'Ensino Fundamental',
      description: 'Base comum',
    });
  });

  it('normaliza payload de série sem enviar status', () => {
    const values = academicCatalogCreateFormSchema.parse({
      name: ' 1ª Série ',
      code: ' 1-EM ',
      status: 'active',
      description: ' Ensino médio ',
      educationLevelId: ' level-1 ',
    });

    expect(toGradeCreatePayload(values)).toEqual({
      name: '1ª Série',
      code: '1-EM',
      description: 'Ensino médio',
      educationLevelId: 'level-1',
    });
  });
});
