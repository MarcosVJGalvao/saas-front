import { describe, expect, it } from 'vitest';
import { normalizeAcademicYearPayload } from '@features/client/academic/normalizers/academicYearFormNormalizer';
import { normalizeSchoolClassCreatePayload } from '@features/client/academic/normalizers/schoolClassFormNormalizer';

describe('academic form normalizers', () => {
  it('normaliza o payload do ano letivo conforme o dto', () => {
    const payload = normalizeAcademicYearPayload({
      reportCardPolicyId: 'policy-1',
      name: ' Ano 2026 ',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      academicPeriods: [
        {
          academicPeriodId: 'period-1',
          name: ' 1o periodo ',
          code: ' P1 ',
          sequence: '1',
          startDate: '2026-01-01',
          endDate: '2026-06-30',
          weight: '1,5',
          isFinalPeriod: false,
        },
        {
          academicPeriodId: undefined,
          name: ' 2o periodo ',
          code: ' P2 ',
          sequence: '2',
          startDate: '2026-07-01',
          endDate: '2026-12-31',
          weight: '',
          isFinalPeriod: true,
        },
      ],
      calculationType: 'weighted',
      passingGrade: '6',
      minimumAttendancePercentage: '75',
      recoveryStrategy: 'replace_average',
      finalStatusStrategy: 'approval_recovery_or_failure',
    });

    expect(payload).toEqual({
      name: 'Ano 2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isClosed: false,
      academicPeriods: [
        {
          id: 'period-1',
          name: '1o periodo',
          code: 'P1',
          sequence: 1,
          startDate: '2026-01-01',
          endDate: '2026-06-30',
          weight: 1.5,
          isFinalPeriod: false,
        },
        {
          id: undefined,
          name: '2o periodo',
          code: 'P2',
          sequence: 2,
          startDate: '2026-07-01',
          endDate: '2026-12-31',
          weight: undefined,
          isFinalPeriod: true,
        },
      ],
      reportCardPolicy: {
        id: 'policy-1',
        calculationType: 'weighted',
        passingGrade: 6,
        minimumAttendancePercentage: 75,
        recoveryStrategy: 'replace_average',
        finalStatusStrategy: 'approval_recovery_or_failure',
      },
    });
  });

  it('normaliza o payload de criação da turma', () => {
    const payload = normalizeSchoolClassCreatePayload({
      name: ' Turma A ',
      code: '',
      shift: 'morning',
      maxCapacity: 35,
      academicYearId: ' year-1 ',
      gradeId: ' grade-1 ',
      coordinatorId: ' coordinator-1 ',
      description: ' Sala 1 ',
    });

    expect(payload).toEqual({
      name: 'Turma A',
      code: undefined,
      description: 'Sala 1',
      academicYearId: 'year-1',
      gradeId: 'grade-1',
      coordinatorId: 'coordinator-1',
      shift: 'morning',
      maxCapacity: 35,
    });
  });
});
