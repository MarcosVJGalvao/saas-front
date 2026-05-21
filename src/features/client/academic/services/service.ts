import { academicEndpoints } from './endpoints';
import type {
  AcademicCatalogCreatePayload,
  AcademicCatalogCreateResponse,
  AcademicCatalogDetailsResponse,
  AcademicCatalogListParams,
  AcademicCatalogListResponse,
  AcademicCatalogUpdatePayload,
  AcademicCatalogUpdateResponse,
  AcademicYearCreatePayload,
  AcademicYearCreateResponse,
  AcademicYearDetailsResponse,
  AcademicYearListParams,
  AcademicYearListResponse,
  AcademicYearUpdatePayload,
  AcademicYearUpdateResponse,
  SchoolClassCreatePayload,
  SchoolClassCreateResponse,
  SchoolClassDetailsResponse,
  SchoolClassListParams,
  SchoolClassListResponse,
  SchoolClassSummaryResponse,
  SchoolClassUpdatePayload,
  SchoolClassUpdateResponse,
  TeacherSubjectCreatePayload,
  TeacherSubjectCreateResponse,
  TeacherSubjectDetailsResponse,
  TeacherSubjectListParams,
  TeacherSubjectListResponse,
  TeacherSubjectUpdatePayload,
  TeacherSubjectUpdateResponse,
} from './types';

export const academicYearService = {
  async list(params: AcademicYearListParams): Promise<AcademicYearListResponse> {
    const { data } = await academicEndpoints.listAcademicYears(params);
    return data;
  },
  async getById(id: string): Promise<AcademicYearDetailsResponse> {
    const { data } = await academicEndpoints.getAcademicYearById(id);
    return data;
  },
  async create(payload: AcademicYearCreatePayload): Promise<AcademicYearCreateResponse> {
    const { data } = await academicEndpoints.createAcademicYear(payload);
    return data;
  },
  async update(
    id: string,
    payload: AcademicYearUpdatePayload,
  ): Promise<AcademicYearUpdateResponse> {
    const { data } = await academicEndpoints.updateAcademicYear(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await academicEndpoints.removeAcademicYear(id);
  },
  async close(id: string): Promise<void> {
    await academicEndpoints.closeAcademicYear(id);
  },
  async reopen(id: string): Promise<void> {
    await academicEndpoints.reopenAcademicYear(id);
  },
};

export const educationLevelService = {
  async list(params: AcademicCatalogListParams): Promise<AcademicCatalogListResponse> {
    const { data } = await academicEndpoints.listEducationLevels(params);
    return data;
  },
  async getById(id: string): Promise<AcademicCatalogDetailsResponse> {
    const { data } = await academicEndpoints.getEducationLevelById(id);
    return data;
  },
  async create(payload: AcademicCatalogCreatePayload): Promise<AcademicCatalogCreateResponse> {
    const { data } = await academicEndpoints.createEducationLevel(payload);
    return data;
  },
  async update(
    id: string,
    payload: AcademicCatalogUpdatePayload,
  ): Promise<AcademicCatalogUpdateResponse> {
    const { data } = await academicEndpoints.updateEducationLevel(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await academicEndpoints.removeEducationLevel(id);
  },
};

export const gradeService = {
  async list(params: AcademicCatalogListParams): Promise<AcademicCatalogListResponse> {
    const { data } = await academicEndpoints.listGrades(params);
    return data;
  },
  async getById(id: string): Promise<AcademicCatalogDetailsResponse> {
    const { data } = await academicEndpoints.getGradeById(id);
    return data;
  },
  async create(payload: AcademicCatalogCreatePayload): Promise<AcademicCatalogCreateResponse> {
    const { data } = await academicEndpoints.createGrade(payload);
    return data;
  },
  async update(
    id: string,
    payload: AcademicCatalogUpdatePayload,
  ): Promise<AcademicCatalogUpdateResponse> {
    const { data } = await academicEndpoints.updateGrade(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await academicEndpoints.removeGrade(id);
  },
};

export const subjectService = {
  async list(params: AcademicCatalogListParams): Promise<AcademicCatalogListResponse> {
    const { data } = await academicEndpoints.listSubjects(params);
    return data;
  },
  async getById(id: string): Promise<AcademicCatalogDetailsResponse> {
    const { data } = await academicEndpoints.getSubjectById(id);
    return data;
  },
  async create(payload: AcademicCatalogCreatePayload): Promise<AcademicCatalogCreateResponse> {
    const { data } = await academicEndpoints.createSubject(payload);
    return data;
  },
  async update(
    id: string,
    payload: AcademicCatalogUpdatePayload,
  ): Promise<AcademicCatalogUpdateResponse> {
    const { data } = await academicEndpoints.updateSubject(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await academicEndpoints.removeSubject(id);
  },
};

export const teacherSubjectService = {
  async list(params: TeacherSubjectListParams): Promise<TeacherSubjectListResponse> {
    const { data } = await academicEndpoints.listTeacherSubjects(params);
    return data;
  },
  async getById(id: string): Promise<TeacherSubjectDetailsResponse> {
    const { data } = await academicEndpoints.getTeacherSubjectById(id);
    return data;
  },
  async create(payload: TeacherSubjectCreatePayload): Promise<TeacherSubjectCreateResponse> {
    const { data } = await academicEndpoints.createTeacherSubject(payload);
    return data;
  },
  async update(
    id: string,
    payload: TeacherSubjectUpdatePayload,
  ): Promise<TeacherSubjectUpdateResponse> {
    const { data } = await academicEndpoints.updateTeacherSubject(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await academicEndpoints.removeTeacherSubject(id);
  },
};

export const schoolClassService = {
  async list(params: SchoolClassListParams): Promise<SchoolClassListResponse> {
    const { data } = await academicEndpoints.listSchoolClasses(params);
    return data;
  },
  async getById(id: string): Promise<SchoolClassDetailsResponse> {
    const { data } = await academicEndpoints.getSchoolClassById(id);
    return data;
  },
  async create(payload: SchoolClassCreatePayload): Promise<SchoolClassCreateResponse> {
    const { data } = await academicEndpoints.createSchoolClass(payload);
    return data;
  },
  async update(id: string, payload: SchoolClassUpdatePayload): Promise<SchoolClassUpdateResponse> {
    const { data } = await academicEndpoints.updateSchoolClass(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await academicEndpoints.removeSchoolClass(id);
  },
  async getSummary(id: string): Promise<SchoolClassSummaryResponse> {
    const { data } = await academicEndpoints.getSchoolClassSummary(id);
    return data;
  },
  async assignStudents(id: string, studentIds: string[]): Promise<void> {
    await academicEndpoints.assignSchoolClassStudents(id, { studentIds });
  },
  async removeStudents(id: string, studentIds: string[]): Promise<void> {
    await academicEndpoints.removeSchoolClassStudents(id, { studentIds });
  },
  async assignTeacherSubjects(id: string, teacherSubjectIds: string[]): Promise<void> {
    await academicEndpoints.assignSchoolClassTeacherSubjects(id, { teacherSubjectIds });
  },
  async removeTeacherSubjects(id: string, teacherSubjectIds: string[]): Promise<void> {
    await academicEndpoints.removeSchoolClassTeacherSubjects(id, { teacherSubjectIds });
  },
};
