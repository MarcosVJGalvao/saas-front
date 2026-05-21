import { useEffect, useState } from 'react';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import {
  academicYearService,
  schoolClassService,
} from '@features/client/academic/services/service';
import { studentService } from '@features/client/students/services/service';
import type { AcademicYear, SchoolClass } from '@features/client/academic/types/academic.types';
import type { Student } from '@features/client/students/types/student.types';

const REFERENCE_LIMIT = 100;
const EMPTY_OPTION: AppSelectOption = { value: '', label: 'Não vincular' };

const toAcademicYearOption = (academicYear: AcademicYear): AppSelectOption => ({
  value: academicYear.id,
  label: academicYear.code ? `${academicYear.name} (${academicYear.code})` : academicYear.name,
});

const toSchoolClassOption = (schoolClass: SchoolClass): AppSelectOption => ({
  value: schoolClass.id,
  label: schoolClass.code ? `${schoolClass.name} (${schoolClass.code})` : schoolClass.name,
});

const toStudentOption = (student: Student): AppSelectOption => ({
  value: student.id,
  label:
    student.person?.fullName ??
    student.registrationCode ??
    student.person?.documentNumber ??
    student.id,
});

export const useStudentEnrollmentReferenceOptions = () => {
  const [academicYearOptions, setAcademicYearOptions] = useState<AppSelectOption[]>([]);
  const [schoolClassOptions, setSchoolClassOptions] = useState<AppSelectOption[]>([]);
  const [studentOptions, setStudentOptions] = useState<AppSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async (): Promise<void> => {
      setLoading(true);
      setErrorMessage(undefined);

      try {
        const [academicYearsResponse, schoolClassesResponse, studentsResponse] = await Promise.all([
          academicYearService.list({ page: 1, limit: REFERENCE_LIMIT }),
          schoolClassService.list({ page: 1, limit: REFERENCE_LIMIT }),
          studentService.list({ page: 1, limit: REFERENCE_LIMIT }),
        ]);

        if (!isMounted) {
          return;
        }

        setAcademicYearOptions(academicYearsResponse.data.map(toAcademicYearOption));
        setSchoolClassOptions([
          EMPTY_OPTION,
          ...schoolClassesResponse.data.map(toSchoolClassOption),
        ]);
        setStudentOptions(studentsResponse.data.map(toStudentOption));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar as referências de matrícula.');
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
  }, []);

  return {
    academicYearOptions,
    schoolClassOptions,
    studentOptions,
    loading,
    errorMessage,
  };
};
