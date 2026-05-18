import { describe, expect, it } from 'vitest';
import {
  buildAcademicCatalogInitialValues,
  normalizeAcademicCatalogPayload,
} from '@features/client/academic/normalizers/academicCatalogFormNormalizer';
import { academicCatalogFormSchema } from '@features/client/academic/schemas/academicCatalogFormSchema';

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
    const values = academicCatalogFormSchema.parse({
      name: ' Ensino Fundamental ',
      code: ' EF ',
      status: 'active',
      description: '',
      educationLevelId: ' level-1 ',
    });

    expect(normalizeAcademicCatalogPayload(values)).toEqual({
      name: 'Ensino Fundamental',
      code: 'EF',
      status: 'active',
      description: undefined,
      educationLevelId: 'level-1',
    });
  });
});
