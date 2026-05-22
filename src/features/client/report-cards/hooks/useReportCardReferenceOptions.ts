import { useEffect, useState } from 'react';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import { studentService } from '@features/client/students/services/service';
import {
  academicYearService,
  gradeService,
  schoolClassService,
  subjectService,
} from '@features/client/academic/services/service';
import { reportCardService } from '@features/client/report-cards/services/service';
import type {
  AcademicYear,
  AcademicCatalogItem,
  SchoolClass,
} from '@features/client/academic/types/academic.types';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { ReportCardAcademicPeriod } from '@features/client/report-cards/types/reportCard.types';
import type { Student } from '@features/client/students/types/student.types';

const REFERENCE_LIMIT = 100;

const toAcademicYearOption = (academicYear: AcademicYear): AppSelectOption => ({
  value: academicYear.id,
  label: academicYear.code ? `${academicYear.name} (${academicYear.code})` : academicYear.name,
});

const toCatalogOption = (item: AcademicCatalogItem): AppSelectOption => ({
  value: item.id,
  label: item.code ? `${item.name} (${item.code})` : item.name,
});

const toAcademicPeriodOption = (period: ReportCardAcademicPeriod): AppSelectOption => ({
  value: period.id,
  label: period.code
    ? `${period.name} (${period.code}) - ${period.academicYear?.name ?? 'Ano letivo'}`
    : `${period.name} - ${period.academicYear?.name ?? 'Ano letivo'}`,
});

const toSchoolClassOption = (schoolClass: SchoolClass): AppSelectOption => ({
  value: schoolClass.id,
  label: schoolClass.code ? `${schoolClass.name} (${schoolClass.code})` : schoolClass.name,
});

const toEnrollmentOption = (enrollment: StudentEnrollment): AppSelectOption => ({
  value: enrollment.id,
  label:
    enrollment.student?.person?.fullName ??
    enrollment.enrollmentCode ??
    enrollment.student?.registrationCode ??
    enrollment.id,
});

const toStudentOption = (student: Student): AppSelectOption => ({
  value: student.id,
  label:
    student.person?.fullName ??
    student.registrationCode ??
    student.person?.documentNumber ??
    student.id,
});

export interface UseReportCardReferenceOptionsParams {
  includeAcademicPeriods?: boolean | undefined;
  includeSchoolClasses?: boolean | undefined;
  includeStudentEnrollments?: boolean | undefined;
  includeStudents?: boolean | undefined;
}

export const useReportCardReferenceOptions = ({
  includeAcademicPeriods = false,
  includeSchoolClasses = false,
  includeStudentEnrollments = false,
  includeStudents = false,
}: UseReportCardReferenceOptionsParams = {}) => {
  const [academicYearOptions, setAcademicYearOptions] = useState<AppSelectOption[]>([]);
  const [gradeOptions, setGradeOptions] = useState<AppSelectOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<AppSelectOption[]>([]);
  const [academicPeriodOptions, setAcademicPeriodOptions] = useState<AppSelectOption[]>([]);
  const [schoolClassOptions, setSchoolClassOptions] = useState<AppSelectOption[]>([]);
  const [studentEnrollmentOptions, setStudentEnrollmentOptions] = useState<AppSelectOption[]>([]);
  const [studentOptions, setStudentOptions] = useState<AppSelectOption[]>([]);
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
          subjectsResponse,
          academicPeriodsResponse,
          schoolClassesResponse,
          studentEnrollmentsResponse,
          studentsResponse,
        ] = await Promise.all([
          academicYearService.list({ page: 1, limit: REFERENCE_LIMIT }),
          gradeService.list({ page: 1, limit: REFERENCE_LIMIT }),
          subjectService.list({ page: 1, limit: REFERENCE_LIMIT }),
          includeAcademicPeriods
            ? reportCardService.listAcademicPeriods({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
          includeSchoolClasses
            ? schoolClassService.list({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
          includeStudentEnrollments
            ? studentEnrollmentService.list({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
          includeStudents
            ? studentService.list({ page: 1, limit: REFERENCE_LIMIT })
            : Promise.resolve({ data: [], meta: undefined }),
        ]);

        if (!isMounted) {
          return;
        }

        setAcademicYearOptions(academicYearsResponse.data.map(toAcademicYearOption));
        setGradeOptions(gradesResponse.data.map(toCatalogOption));
        setSubjectOptions(subjectsResponse.data.map(toCatalogOption));
        setAcademicPeriodOptions(
          includeAcademicPeriods ? academicPeriodsResponse.data.map(toAcademicPeriodOption) : [],
        );
        setSchoolClassOptions(
          includeSchoolClasses ? schoolClassesResponse.data.map(toSchoolClassOption) : [],
        );
        setStudentEnrollmentOptions(
          includeStudentEnrollments ? studentEnrollmentsResponse.data.map(toEnrollmentOption) : [],
        );
        setStudentOptions(includeStudents ? studentsResponse.data.map(toStudentOption) : []);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar as opções do boletim.');
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
  }, [includeAcademicPeriods, includeSchoolClasses, includeStudentEnrollments, includeStudents]);

  return {
    academicYearOptions,
    gradeOptions,
    subjectOptions,
    academicPeriodOptions,
    schoolClassOptions,
    studentEnrollmentOptions,
    studentOptions,
    loading,
    errorMessage,
  };
};
