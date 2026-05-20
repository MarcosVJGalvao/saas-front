import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  schoolClassService,
  teacherSubjectService,
} from '@features/client/academic/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('schoolClassService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista turmas com filtros', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'class-1', name: 'Turma A', status: 'active' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await schoolClassService.list({ page: 1, limit: 10, status: 'active' });

    expect(getSpy).toHaveBeenCalledWith('/api/school-classes', {
      params: { page: 1, limit: 10, status: 'active', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.name).toBe('Turma A');
  });

  it('busca resumo da turma', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'class-1', name: 'Turma A', studentsTotal: 20 },
    });

    const response = await schoolClassService.getSummary('class-1');

    expect(getSpy).toHaveBeenCalledWith('/api/school-classes/class-1/summary');
    expect(response.studentsTotal).toBe(20);
  });

  it('vincula alunos e professores-disciplina', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ data: undefined });

    await schoolClassService.assignStudents('class-1', ['student-1']);
    await schoolClassService.assignTeacherSubjects('class-1', ['teacher-subject-1']);

    expect(postSpy).toHaveBeenCalledWith('/api/school-classes/class-1/students', {
      studentIds: ['student-1'],
    });
    expect(postSpy).toHaveBeenCalledWith('/api/school-classes/class-1/teacher-subjects', {
      teacherSubjectIds: ['teacher-subject-1'],
    });
  });

  it('remove alunos e professores-disciplina pelos endpoints corretos', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ data: undefined });

    await schoolClassService.removeStudents('class-1', ['student-1']);
    await schoolClassService.removeTeacherSubjects('class-1', ['teacher-subject-1']);

    expect(postSpy).toHaveBeenCalledWith('/api/school-classes/class-1/students/remove', {
      studentIds: ['student-1'],
    });
    expect(postSpy).toHaveBeenCalledWith('/api/school-classes/class-1/teacher-subjects/remove', {
      teacherSubjectIds: ['teacher-subject-1'],
    });
  });
});

describe('teacherSubjectService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista vínculos professor-disciplina', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'teacher-subject-1', status: 'active' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await teacherSubjectService.list({ page: 1, limit: 10, status: 'active' });

    expect(getSpy).toHaveBeenCalledWith('/api/teacher-subjects', {
      params: { page: 1, limit: 10, status: 'active', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.id).toBe('teacher-subject-1');
  });
});
