import { useEffect, useState } from 'react';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { schoolClassService } from '@features/client/academic/services/service';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import { studentService } from '@features/client/students/services/service';
import {
  financialCategoriesService,
  financialCostCentersService,
} from '@features/client/financial/services/service';
import type {
  FinancialCategory,
  FinancialCostCenter,
} from '@features/client/financial/types/financial.types';
import type { Student } from '@features/client/students/types/student.types';
import type { SchoolClass } from '@features/client/academic/types/academic.types';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';

const REFERENCE_LIMIT = 100;
const EMPTY_OPTION: AppSelectOption = {
  value: '',
  label: 'Não vincular',
};

const toCategoryOption = (category: FinancialCategory): AppSelectOption => ({
  value: category.id,
  label: category.code ? `${category.name} (${category.code})` : category.name,
});

const toCostCenterOption = (costCenter: FinancialCostCenter): AppSelectOption => ({
  value: costCenter.id,
  label: costCenter.code ? `${costCenter.name} (${costCenter.code})` : costCenter.name,
});

const toStudentOption = (student: Student): AppSelectOption => ({
  value: student.id,
  label: student.person?.fullName ?? student.registrationCode ?? student.id,
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

export interface UseFinancialReferenceOptionsParams {
  includeStudents?: boolean | undefined;
  includeStudentEnrollments?: boolean | undefined;
  includeSchoolClasses?: boolean | undefined;
}

export interface UseFinancialReferenceOptionsResult {
  categoryOptions: AppSelectOption[];
  costCenterOptions: AppSelectOption[];
  studentOptions: AppSelectOption[];
  studentEnrollmentOptions: AppSelectOption[];
  schoolClassOptions: AppSelectOption[];
  loading: boolean;
  errorMessage: string | undefined;
}

export const useFinancialReferenceOptions = ({
  includeStudents = false,
  includeStudentEnrollments = false,
  includeSchoolClasses = false,
}: UseFinancialReferenceOptionsParams = {}): UseFinancialReferenceOptionsResult => {
  const [categoryOptions, setCategoryOptions] = useState<AppSelectOption[]>([]);
  const [costCenterOptions, setCostCenterOptions] = useState<AppSelectOption[]>([]);
  const [studentOptions, setStudentOptions] = useState<AppSelectOption[]>([]);
  const [studentEnrollmentOptions, setStudentEnrollmentOptions] = useState<AppSelectOption[]>([]);
  const [schoolClassOptions, setSchoolClassOptions] = useState<AppSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async (): Promise<void> => {
      setLoading(true);
      setErrorMessage(undefined);

      try {
        if (includeStudents || includeStudentEnrollments || includeSchoolClasses) {
          const [
            categoriesResponse,
            costCentersResponse,
            studentsResponse,
            enrollmentsResponse,
            schoolClassesResponse,
          ] = await Promise.all([
            financialCategoriesService.list({ page: 1, limit: REFERENCE_LIMIT }),
            financialCostCentersService.list({ page: 1, limit: REFERENCE_LIMIT }),
            includeStudents
              ? studentService.list({ page: 1, limit: REFERENCE_LIMIT })
              : Promise.resolve({ data: [], meta: undefined }),
            includeStudentEnrollments
              ? studentEnrollmentService.list({ page: 1, limit: REFERENCE_LIMIT })
              : Promise.resolve({ data: [], meta: undefined }),
            includeSchoolClasses
              ? schoolClassService.list({ page: 1, limit: REFERENCE_LIMIT })
              : Promise.resolve({ data: [], meta: undefined }),
          ]);

          if (!isMounted) {
            return;
          }

          setCategoryOptions([EMPTY_OPTION, ...categoriesResponse.data.map(toCategoryOption)]);
          setCostCenterOptions([EMPTY_OPTION, ...costCentersResponse.data.map(toCostCenterOption)]);
          setStudentOptions(
            includeStudents
              ? [EMPTY_OPTION, ...studentsResponse.data.map(toStudentOption)]
              : [EMPTY_OPTION],
          );
          setStudentEnrollmentOptions(
            includeStudentEnrollments
              ? [EMPTY_OPTION, ...enrollmentsResponse.data.map(toEnrollmentOption)]
              : [EMPTY_OPTION],
          );
          setSchoolClassOptions(
            includeSchoolClasses
              ? [EMPTY_OPTION, ...schoolClassesResponse.data.map(toSchoolClassOption)]
              : [EMPTY_OPTION],
          );
          return;
        }

        const [categoriesResponse, costCentersResponse] = await Promise.all([
          financialCategoriesService.list({ page: 1, limit: REFERENCE_LIMIT }),
          financialCostCentersService.list({ page: 1, limit: REFERENCE_LIMIT }),
        ]);

        if (!isMounted) {
          return;
        }

        setCategoryOptions([EMPTY_OPTION, ...categoriesResponse.data.map(toCategoryOption)]);
        setCostCenterOptions([EMPTY_OPTION, ...costCentersResponse.data.map(toCostCenterOption)]);
        setStudentOptions([EMPTY_OPTION]);
        setStudentEnrollmentOptions([EMPTY_OPTION]);
        setSchoolClassOptions([EMPTY_OPTION]);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar as opções do formulário.');
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
  }, [includeSchoolClasses, includeStudentEnrollments, includeStudents]);

  return {
    categoryOptions,
    costCenterOptions,
    studentOptions,
    studentEnrollmentOptions,
    schoolClassOptions,
    loading,
    errorMessage,
  };
};
