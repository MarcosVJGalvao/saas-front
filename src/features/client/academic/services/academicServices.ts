import { httpClient } from '@shared/services/httpClient';
import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type {
  AcademicYear,
  AcademicYearQueryParams,
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
  SchoolClass,
  SchoolClassQueryParams,
  SchoolClassSummary,
  TeacherSubject,
  TeacherSubjectQueryParams,
} from '@features/client/academic/types/academic.types';

type AcademicPayload = ClientApiRecord;

export const academicYearService = {
  ...createClientCrudService<
    AcademicYear,
    AcademicYear,
    AcademicPayload,
    AcademicPayload,
    AcademicYearQueryParams
  >('/api/academic-years'),
  async close(id: string): Promise<void> {
    await httpClient.patch(`/api/academic-years/${id}/close`);
  },
  async reopen(id: string): Promise<void> {
    await httpClient.patch(`/api/academic-years/${id}/reopen`);
  },
};

export const educationLevelService = createClientCrudService<
  AcademicCatalogItem,
  AcademicCatalogItem,
  AcademicPayload,
  AcademicPayload,
  AcademicCatalogQueryParams
>('/api/education-levels');

export const gradeService = createClientCrudService<
  AcademicCatalogItem,
  AcademicCatalogItem,
  AcademicPayload,
  AcademicPayload,
  AcademicCatalogQueryParams
>('/api/grades');

export const subjectService = createClientCrudService<
  AcademicCatalogItem,
  AcademicCatalogItem,
  AcademicPayload,
  AcademicPayload,
  AcademicCatalogQueryParams
>('/api/subjects');

export const teacherSubjectService = createClientCrudService<
  TeacherSubject,
  TeacherSubject,
  AcademicPayload,
  AcademicPayload,
  TeacherSubjectQueryParams
>('/api/teacher-subjects');

export const schoolClassService = {
  ...createClientCrudService<
    SchoolClass,
    SchoolClass,
    AcademicPayload,
    AcademicPayload,
    SchoolClassQueryParams
  >('/api/school-classes'),
  async getSummary(id: string): Promise<SchoolClassSummary> {
    const { data } = await httpClient.get<SchoolClassSummary>(`/api/school-classes/${id}/summary`);
    return data;
  },
  async assignStudents(id: string, studentIds: string[]): Promise<void> {
    await httpClient.post(`/api/school-classes/${id}/students`, { studentIds });
  },
  async removeStudents(id: string, studentIds: string[]): Promise<void> {
    await httpClient.post(`/api/school-classes/${id}/students/remove`, { studentIds });
  },
  async assignTeacherSubjects(id: string, teacherSubjectIds: string[]): Promise<void> {
    await httpClient.post(`/api/school-classes/${id}/teacher-subjects`, { teacherSubjectIds });
  },
  async removeTeacherSubjects(id: string, teacherSubjectIds: string[]): Promise<void> {
    await httpClient.post(`/api/school-classes/${id}/teacher-subjects/remove`, {
      teacherSubjectIds,
    });
  },
};
