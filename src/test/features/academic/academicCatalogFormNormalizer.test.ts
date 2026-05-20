import { describe, expect, it } from 'vitest';
import {
  buildAcademicCatalogInitialValues,
  toAcademicCatalogCreatePayload,
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
});
