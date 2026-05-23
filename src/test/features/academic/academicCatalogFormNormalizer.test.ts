import { describe, expect, it } from 'vitest';
import {
  buildAcademicCatalogInitialValues,
  toAcademicCatalogCreatePayload,
  toEducationLevelCreatePayload,
  toEducationLevelEditPayload,
  toGradeCreatePayload,
  toGradeEditPayload,
  toSubjectCreatePayload,
  toSubjectEditPayload,
} from '@features/client/academic/normalizers/academicCatalogFormNormalizer';
import { academicCatalogCreateFormSchema } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';
import { academicCatalogEditFormSchema } from '@features/client/academic/schemas/academicCatalogEditForm.schema';

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

  it('normaliza payload genérico removendo textos vazios', () => {
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

  it('normaliza payload de nível de ensino sem campos inexistentes no create', () => {
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

  it('normaliza payload de nível de ensino sem status nem code no edit', () => {
    const values = academicCatalogEditFormSchema.parse({
      name: ' Ensino Fundamental ',
      code: ' EF ',
      status: 'active',
      description: ' Base comum ',
      educationLevelId: '',
    });

    expect(toEducationLevelEditPayload(values)).toEqual({
      name: 'Ensino Fundamental',
      description: 'Base comum',
    });
  });

  it('normaliza payload de série sem enviar status nem code no create', () => {
    const values = academicCatalogCreateFormSchema.parse({
      name: ' 1ª Série ',
      code: ' 1-EM ',
      status: 'active',
      description: ' Ensino médio ',
      educationLevelId: ' level-1 ',
    });

    expect(toGradeCreatePayload(values)).toEqual({
      name: '1ª Série',
      description: 'Ensino médio',
      educationLevelId: 'level-1',
    });
  });

  it('normaliza payload de série sem status nem code no edit', () => {
    const values = academicCatalogEditFormSchema.parse({
      name: ' 1ª Série ',
      code: ' 1-EM ',
      status: 'active',
      description: ' Ensino médio ',
      educationLevelId: ' level-1 ',
    });

    expect(toGradeEditPayload(values)).toEqual({
      name: '1ª Série',
      description: 'Ensino médio',
      educationLevelId: 'level-1',
    });
  });

  it('normaliza payload de disciplina sem status no create', () => {
    const values = academicCatalogCreateFormSchema.parse({
      name: ' Matemática ',
      code: ' MAT ',
      status: 'active',
      description: ' Núcleo comum ',
      educationLevelId: '',
    });

    expect(toSubjectCreatePayload(values)).toEqual({
      name: 'Matemática',
      code: 'MAT',
      description: 'Núcleo comum',
    });
  });

  it('normaliza payload de disciplina sem status nem code no edit', () => {
    const values = academicCatalogEditFormSchema.parse({
      name: ' Matemática ',
      code: ' MAT ',
      status: 'active',
      description: ' Núcleo comum ',
      educationLevelId: '',
    });

    expect(toSubjectEditPayload(values)).toEqual({
      name: 'Matemática',
      description: 'Núcleo comum',
    });
  });
});
