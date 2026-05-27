import { useEffect, useState } from 'react';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import {
  academicYearService,
  educationLevelService,
  gradeService,
  schoolClassService,
  subjectService,
  teacherSubjectService,
} from '@features/client/academic/services/service';
import { employeeService } from '@features/client/employees/services/service';
import type {
  AcademicCatalogItem,
  AcademicYear,
  SchoolClass,
  TeacherSubject,
} from '@features/client/academic/types/academic.types';
import type { Employee, EmployeeJobTitle } from '@features/client/employees/types/employee.types';

const REFERENCE_LIMIT = 100;
const EMPTY_OPTION: AppSelectOption = { value: '', label: 'Não selecionar' };

const toAcademicYearOption = (academicYear: AcademicYear): AppSelectOption => ({
  value: academicYear.id,
  label: academicYear.code ? `${academicYear.name} (${academicYear.code})` : academicYear.name,
});

const toCatalogOption = (item: AcademicCatalogItem): AppSelectOption => ({
  value: item.id,
  label: item.code ? `${item.name} (${item.code})` : item.name,
});

const toSchoolClassOption = (schoolClass: SchoolClass): AppSelectOption => ({
  value: schoolClass.id,
  label: schoolClass.code ? `${schoolClass.name} (${schoolClass.code})` : schoolClass.name,
});

const toTeacherSubjectOption = (teacherSubject: TeacherSubject): AppSelectOption => ({
  value: teacherSubject.id,
  label: `${teacherSubject.subject?.name ?? 'Disciplina'} - ${
    teacherSubject.teacher?.person?.fullName ?? teacherSubject.teacher?.name ?? 'Professor'
  }`,
});

const toTeacherOption = (employee: Employee): AppSelectOption => ({
  value: employee.id,
  label: employee.person?.fullName ?? employee.jobTitle ?? employee.id,
});

export interface UseAcademicReferenceOptionsParams {
  includeEducationLevels?: boolean | undefined;
  includeSchoolClasses?: boolean | undefined;
  includeSubjects?: boolean | undefined;
  includeTeacherSubjects?: boolean | undefined;
  includeTeachers?: boolean | undefined;
  employeeJobTitle?: EmployeeJobTitle | undefined;
}

export interface UseAcademicReferenceOptionsResult {
  academicYearOptions: AppSelectOption[];
  gradeOptions: AppSelectOption[];
  educationLevelOptions: AppSelectOption[];
  schoolClassOptions: AppSelectOption[];
  subjectOptions: AppSelectOption[];
  teacherOptions: AppSelectOption[];
  teacherSubjectOptions: AppSelectOption[];
  loading: boolean;
  errorMessage: string | undefined;
}

export const useAcademicReferenceOptions = ({
  includeEducationLevels = false,
  includeSchoolClasses = false,
  includeSubjects = false,
  includeTeacherSubjects = false,
  includeTeachers = false,
  employeeJobTitle,
}: UseAcademicReferenceOptionsParams = {}): UseAcademicReferenceOptionsResult => {
  const [academicYearOptions, setAcademicYearOptions] = useState<AppSelectOption[]>([]);
  const [gradeOptions, setGradeOptions] = useState<AppSelectOption[]>([]);
  const [educationLevelOptions, setEducationLevelOptions] = useState<AppSelectOption[]>([]);
  const [schoolClassOptions, setSchoolClassOptions] = useState<AppSelectOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<AppSelectOption[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<AppSelectOption[]>([]);
  const [teacherSubjectOptions, setTeacherSubjectOptions] = useState<AppSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async (): Promise<void> => {
      setLoading(true);
      setErrorMessage(undefined);

      try {
        const [
          academicYearsResponse,
          gradesResponse,
          educationLevelsResponse,
          schoolClassesResponse,
          subjectsResponse,
          teachersResponse,
          teacherSubjectsResponse,
        ] = await Promise.all([
          academicYearService.list({ page: 1, limit: REFERENCE_LIMIT }),
          gradeService.list({ page: 1, limit: REFERENCE_LIMIT }),
          includeEducationLevels
            ? educationLevelService.list({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
          includeSchoolClasses
            ? schoolClassService.list({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
          includeSubjects
            ? subjectService.list({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
          includeTeachers
            ? employeeService.list({ page: 1, limit: REFERENCE_LIMIT, jobTitle: employeeJobTitle })
            : Promise.resolve({ data: [], meta: undefined }),
          includeTeacherSubjects
            ? teacherSubjectService.list({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
        ]);

        if (!isMounted) {
          return;
        }

        setAcademicYearOptions(academicYearsResponse.data.map(toAcademicYearOption));
        setGradeOptions(gradesResponse.data.map(toCatalogOption));
        setEducationLevelOptions(
          includeEducationLevels
            ? [EMPTY_OPTION, ...educationLevelsResponse.data.map(toCatalogOption)]
            : [EMPTY_OPTION],
        );
        setSchoolClassOptions(
          includeSchoolClasses ? schoolClassesResponse.data.map(toSchoolClassOption) : [],
        );
        setSubjectOptions(includeSubjects ? subjectsResponse.data.map(toCatalogOption) : []);
        setTeacherOptions(includeTeachers ? teachersResponse.data.map(toTeacherOption) : []);
        setTeacherSubjectOptions(
          includeTeacherSubjects ? teacherSubjectsResponse.data.map(toTeacherSubjectOption) : [],
        );
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar as opções acadêmicas.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadOptions();

    return () => {
      isMounted = false;
    };
  }, [
    includeEducationLevels,
    includeSchoolClasses,
    includeSubjects,
    includeTeacherSubjects,
    includeTeachers,
    employeeJobTitle,
  ]);

  return {
    academicYearOptions,
    gradeOptions,
    educationLevelOptions,
    schoolClassOptions,
    subjectOptions,
    teacherOptions,
    teacherSubjectOptions,
    loading,
    errorMessage,
  };
};
