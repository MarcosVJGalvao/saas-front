import { describe, expect, it } from 'vitest';
import { normalizeAcademicYearPayload } from '@features/client/academic/normalizers/academicYearFormNormalizer';
import { normalizeSchoolClassPayload } from '@features/client/academic/normalizers/schoolClassFormNormalizer';

describe('academic form normalizers', () => {
  it('normaliza o payload do ano letivo conforme o guia', () => {
    const payload = normalizeAcademicYearPayload({
      name: ' Ano 2026 ',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      periodName: ' 1º período ',
      periodCode: ' P1 ',
      periodSequence: '1',
      periodStartDate: '2026-01-01',
      periodEndDate: '2026-06-30',
      periodWeight: '1,5',
      periodIsFinal: 'false',
      calculationType: ' weighted ',
      passingGrade: '6',
      minimumAttendancePercentage: '75',
      recoveryStrategy: ' replace_average ',
      finalStatusStrategy: ' approval_recovery_or_failure ',
      description: '',
    });

    expect(payload).toEqual({
      name: 'Ano 2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isClosed: false,
      academicPeriods: [
        {
          name: '1º período',
          code: 'P1',
          sequence: 1,
          startDate: '2026-01-01',
          endDate: '2026-06-30',
          weight: 1.5,
          isFinalPeriod: false,
        },
      ],
      reportCardPolicy: {
        calculationType: 'weighted',
        passingGrade: 6,
        minimumAttendancePercentage: 75,
        recoveryStrategy: 'replace_average',
        finalStatusStrategy: 'approval_recovery_or_failure',
      },
      description: undefined,
    });
  });

  it('normaliza o payload da turma', () => {
    const payload = normalizeSchoolClassPayload({
      name: ' Turma A ',
      code: '',
      status: 'active',
      shift: 'morning',
      capacity: '35',
      academicYearId: ' year-1 ',
      gradeId: ' grade-1 ',
      educationLevelId: '',
      description: ' Sala 1 ',
    });

    expect(payload).toEqual({
      name: 'Turma A',
      code: undefined,
      status: 'active',
      shift: 'morning',
      maxCapacity: 35,
      academicYearId: 'year-1',
      gradeId: 'grade-1',
      educationLevelId: undefined,
      description: 'Sala 1',
    });
  });
});
