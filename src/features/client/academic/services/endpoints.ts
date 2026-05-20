import { httpClient } from '@shared/services/httpClient';
import type {
  AcademicCatalogCreatePayload,
  AcademicCatalogCreateResponse,
  AcademicCatalogDeleteResponse,
  AcademicCatalogDetailsResponse,
  AcademicCatalogListParams,
  AcademicCatalogListResponse,
  AcademicCatalogUpdatePayload,
  AcademicCatalogUpdateResponse,
  AcademicYearCloseResponse,
  AcademicYearCreatePayload,
  AcademicYearCreateResponse,
  AcademicYearDetailsResponse,
  AcademicYearListParams,
  AcademicYearListResponse,
  AcademicYearReopenResponse,
  AcademicYearUpdatePayload,
  AcademicYearUpdateResponse,
  SchoolClassAssignStudentsPayload,
  SchoolClassAssignTeacherSubjectsPayload,
  SchoolClassCreatePayload,
  SchoolClassCreateResponse,
  SchoolClassDeleteResponse,
  SchoolClassDetailsResponse,
  SchoolClassListParams,
  SchoolClassListResponse,
  SchoolClassSummaryResponse,
  SchoolClassUpdatePayload,
  SchoolClassUpdateResponse,
  TeacherSubjectCreatePayload,
  TeacherSubjectCreateResponse,
  TeacherSubjectDeleteResponse,
  TeacherSubjectDetailsResponse,
  TeacherSubjectListParams,
  TeacherSubjectListResponse,
  TeacherSubjectUpdatePayload,
  TeacherSubjectUpdateResponse,
} from './types';

const ACADEMIC_YEARS_BASE_PATH = '/api/academic-years';
const EDUCATION_LEVELS_BASE_PATH = '/api/education-levels';
const GRADES_BASE_PATH = '/api/grades';
const SUBJECTS_BASE_PATH = '/api/subjects';
const TEACHER_SUBJECTS_BASE_PATH = '/api/teacher-subjects';
const SCHOOL_CLASSES_BASE_PATH = '/api/school-classes';

const buildPagedParams = <TParams extends { sortOrder?: 'ASC' | 'DESC' | undefined }>(
  params: TParams,
): TParams & { sortOrder: 'ASC' | 'DESC' } => ({
  ...params,
  sortOrder: params.sortOrder ?? 'DESC',
});

export const academicEndpoints = {
  listAcademicYears: (params: AcademicYearListParams) =>
    httpClient.get<AcademicYearListResponse>(ACADEMIC_YEARS_BASE_PATH, {
      params: buildPagedParams(params),
    }),
  getAcademicYearById: (id: string) =>
    httpClient.get<AcademicYearDetailsResponse>(`${ACADEMIC_YEARS_BASE_PATH}/${id}`),
  createAcademicYear: (payload: AcademicYearCreatePayload) =>
    httpClient.post<AcademicYearCreateResponse>(ACADEMIC_YEARS_BASE_PATH, payload),
  updateAcademicYear: (id: string, payload: AcademicYearUpdatePayload) =>
    httpClient.patch<AcademicYearUpdateResponse>(`${ACADEMIC_YEARS_BASE_PATH}/${id}`, payload),
  removeAcademicYear: (id: string) =>
    httpClient.delete<AcademicCatalogDeleteResponse>(`${ACADEMIC_YEARS_BASE_PATH}/${id}`),
  closeAcademicYear: (id: string) =>
    httpClient.patch<AcademicYearCloseResponse>(`${ACADEMIC_YEARS_BASE_PATH}/${id}/close`),
  reopenAcademicYear: (id: string) =>
    httpClient.patch<AcademicYearReopenResponse>(`${ACADEMIC_YEARS_BASE_PATH}/${id}/reopen`),
  listEducationLevels: (params: AcademicCatalogListParams) =>
    httpClient.get<AcademicCatalogListResponse>(EDUCATION_LEVELS_BASE_PATH, {
      params: buildPagedParams(params),
    }),
  getEducationLevelById: (id: string) =>
    httpClient.get<AcademicCatalogDetailsResponse>(`${EDUCATION_LEVELS_BASE_PATH}/${id}`),
  createEducationLevel: (payload: AcademicCatalogCreatePayload) =>
    httpClient.post<AcademicCatalogCreateResponse>(EDUCATION_LEVELS_BASE_PATH, payload),
  updateEducationLevel: (id: string, payload: AcademicCatalogUpdatePayload) =>
    httpClient.patch<AcademicCatalogUpdateResponse>(`${EDUCATION_LEVELS_BASE_PATH}/${id}`, payload),
  removeEducationLevel: (id: string) =>
    httpClient.delete<AcademicCatalogDeleteResponse>(`${EDUCATION_LEVELS_BASE_PATH}/${id}`),
  listGrades: (params: AcademicCatalogListParams) =>
    httpClient.get<AcademicCatalogListResponse>(GRADES_BASE_PATH, {
      params: buildPagedParams(params),
    }),
  getGradeById: (id: string) =>
    httpClient.get<AcademicCatalogDetailsResponse>(`${GRADES_BASE_PATH}/${id}`),
  createGrade: (payload: AcademicCatalogCreatePayload) =>
    httpClient.post<AcademicCatalogCreateResponse>(GRADES_BASE_PATH, payload),
  updateGrade: (id: string, payload: AcademicCatalogUpdatePayload) =>
    httpClient.patch<AcademicCatalogUpdateResponse>(`${GRADES_BASE_PATH}/${id}`, payload),
  removeGrade: (id: string) =>
    httpClient.delete<AcademicCatalogDeleteResponse>(`${GRADES_BASE_PATH}/${id}`),
  listSubjects: (params: AcademicCatalogListParams) =>
    httpClient.get<AcademicCatalogListResponse>(SUBJECTS_BASE_PATH, {
      params: buildPagedParams(params),
    }),
  getSubjectById: (id: string) =>
    httpClient.get<AcademicCatalogDetailsResponse>(`${SUBJECTS_BASE_PATH}/${id}`),
  createSubject: (payload: AcademicCatalogCreatePayload) =>
    httpClient.post<AcademicCatalogCreateResponse>(SUBJECTS_BASE_PATH, payload),
  updateSubject: (id: string, payload: AcademicCatalogUpdatePayload) =>
    httpClient.patch<AcademicCatalogUpdateResponse>(`${SUBJECTS_BASE_PATH}/${id}`, payload),
  removeSubject: (id: string) =>
    httpClient.delete<AcademicCatalogDeleteResponse>(`${SUBJECTS_BASE_PATH}/${id}`),
  listTeacherSubjects: (params: TeacherSubjectListParams) =>
    httpClient.get<TeacherSubjectListResponse>(TEACHER_SUBJECTS_BASE_PATH, {
      params: buildPagedParams(params),
    }),
  getTeacherSubjectById: (id: string) =>
    httpClient.get<TeacherSubjectDetailsResponse>(`${TEACHER_SUBJECTS_BASE_PATH}/${id}`),
  createTeacherSubject: (payload: TeacherSubjectCreatePayload) =>
    httpClient.post<TeacherSubjectCreateResponse>(TEACHER_SUBJECTS_BASE_PATH, payload),
  updateTeacherSubject: (id: string, payload: TeacherSubjectUpdatePayload) =>
    httpClient.patch<TeacherSubjectUpdateResponse>(`${TEACHER_SUBJECTS_BASE_PATH}/${id}`, payload),
  removeTeacherSubject: (id: string) =>
    httpClient.delete<TeacherSubjectDeleteResponse>(`${TEACHER_SUBJECTS_BASE_PATH}/${id}`),
  listSchoolClasses: (params: SchoolClassListParams) =>
    httpClient.get<SchoolClassListResponse>(SCHOOL_CLASSES_BASE_PATH, {
      params: buildPagedParams(params),
    }),
  getSchoolClassById: (id: string) =>
    httpClient.get<SchoolClassDetailsResponse>(`${SCHOOL_CLASSES_BASE_PATH}/${id}`),
  createSchoolClass: (payload: SchoolClassCreatePayload) =>
    httpClient.post<SchoolClassCreateResponse>(SCHOOL_CLASSES_BASE_PATH, payload),
  updateSchoolClass: (id: string, payload: SchoolClassUpdatePayload) =>
    httpClient.patch<SchoolClassUpdateResponse>(`${SCHOOL_CLASSES_BASE_PATH}/${id}`, payload),
  removeSchoolClass: (id: string) =>
    httpClient.delete<SchoolClassDeleteResponse>(`${SCHOOL_CLASSES_BASE_PATH}/${id}`),
  getSchoolClassSummary: (id: string) =>
    httpClient.get<SchoolClassSummaryResponse>(`${SCHOOL_CLASSES_BASE_PATH}/${id}/summary`),
  assignSchoolClassStudents: (id: string, payload: SchoolClassAssignStudentsPayload) =>
    httpClient.post<void>(`${SCHOOL_CLASSES_BASE_PATH}/${id}/students`, payload),
  removeSchoolClassStudents: (id: string, payload: SchoolClassAssignStudentsPayload) =>
    httpClient.post<void>(`${SCHOOL_CLASSES_BASE_PATH}/${id}/students/remove`, payload),
  assignSchoolClassTeacherSubjects: (
    id: string,
    payload: SchoolClassAssignTeacherSubjectsPayload,
  ) => httpClient.post<void>(`${SCHOOL_CLASSES_BASE_PATH}/${id}/teacher-subjects`, payload),
  removeSchoolClassTeacherSubjects: (
    id: string,
    payload: SchoolClassAssignTeacherSubjectsPayload,
  ) => httpClient.post<void>(`${SCHOOL_CLASSES_BASE_PATH}/${id}/teacher-subjects/remove`, payload),
};
