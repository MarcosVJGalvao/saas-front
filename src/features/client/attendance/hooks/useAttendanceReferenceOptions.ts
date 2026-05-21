import { useEffect, useState } from 'react';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import { studentService } from '@features/client/students/services/service';
import {
  academicYearService,
  schoolClassService,
  subjectService,
  teacherSubjectService,
} from '@features/client/academic/services/service';
import { attendanceSchedulesService } from '@features/client/attendance/services/service';
import type {
  AcademicYear,
  AcademicCatalogItem,
  SchoolClass,
  TeacherSubject,
} from '@features/client/academic/types/academic.types';
import type { AttendanceSchedule } from '@features/client/attendance/types/attendance.types';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';
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

const toScheduleOption = (schedule: AttendanceSchedule): AppSelectOption => ({
  value: schedule.id,
  label: `${schedule.schoolClass?.name ?? 'Turma'} - ${schedule.subject?.name ?? 'Disciplina'} - ${
    schedule.weekday ?? 'Dia'
  }`,
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

export interface UseAttendanceReferenceOptionsParams {
  includeSchedules?: boolean | undefined;
  includeStudentEnrollments?: boolean | undefined;
  includeStudents?: boolean | undefined;
}

export const useAttendanceReferenceOptions = ({
  includeSchedules = false,
  includeStudentEnrollments = false,
  includeStudents = false,
}: UseAttendanceReferenceOptionsParams = {}) => {
  const [academicYearOptions, setAcademicYearOptions] = useState<AppSelectOption[]>([]);
  const [schoolClassOptions, setSchoolClassOptions] = useState<AppSelectOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<AppSelectOption[]>([]);
  const [teacherSubjectOptions, setTeacherSubjectOptions] = useState<AppSelectOption[]>([]);
  const [scheduleOptions, setScheduleOptions] = useState<AppSelectOption[]>([]);
  const [studentEnrollmentOptions, setStudentEnrollmentOptions] = useState<AppSelectOption[]>([]);
  const [studentOptions, setStudentOptions] = useState<AppSelectOption[]>([]);
  const [schedules, setSchedules] = useState<AttendanceSchedule[]>([]);
  const [studentEnrollments, setStudentEnrollments] = useState<StudentEnrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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
          schoolClassesResponse,
          subjectsResponse,
          teacherSubjectsResponse,
          schedulesResponse,
          studentEnrollmentsResponse,
          studentsResponse,
        ] = await Promise.all([
          academicYearService.list({ page: 1, limit: REFERENCE_LIMIT }),
          schoolClassService.list({ page: 1, limit: REFERENCE_LIMIT }),
          subjectService.list({ page: 1, limit: REFERENCE_LIMIT }),
          teacherSubjectService.list({ page: 1, limit: REFERENCE_LIMIT }),
          includeSchedules
            ? attendanceSchedulesService.list({ page: 1, limit: REFERENCE_LIMIT })
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
        setSchoolClassOptions(schoolClassesResponse.data.map(toSchoolClassOption));
        setSubjectOptions(subjectsResponse.data.map(toCatalogOption));
        setTeacherSubjectOptions(teacherSubjectsResponse.data.map(toTeacherSubjectOption));
        setSchedules(includeSchedules ? schedulesResponse.data : []);
        setScheduleOptions(includeSchedules ? schedulesResponse.data.map(toScheduleOption) : []);
        setStudentEnrollments(includeStudentEnrollments ? studentEnrollmentsResponse.data : []);
        setStudentEnrollmentOptions(
          includeStudentEnrollments ? studentEnrollmentsResponse.data.map(toEnrollmentOption) : [],
        );
        setStudents(includeStudents ? studentsResponse.data : []);
        setStudentOptions(includeStudents ? studentsResponse.data.map(toStudentOption) : []);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar as opções de frequência.');
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
  }, [includeSchedules, includeStudentEnrollments, includeStudents]);

  return {
    academicYearOptions,
    schoolClassOptions,
    subjectOptions,
    teacherSubjectOptions,
    schedules,
    scheduleOptions,
    studentEnrollments,
    studentEnrollmentOptions,
    students,
    studentOptions,
    loading,
    errorMessage,
  };
};
