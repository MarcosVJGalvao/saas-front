import { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useAppForm } from '@shared/hooks/useAppForm';
import { useFeedback } from '@shared/hooks/useFeedback';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { reportCardAssessmentTypeOptions } from '@shared/constants/selectOptions';
import { schoolClassService } from '@features/client/academic/services/service';
import { reportCardService } from '@features/client/report-cards/services/service';
import { useClientProfile } from '@features/client/auth/hooks/useClientProfile';
import type { SchoolClass } from '@features/client/academic/types/academic.types';
import type { ReportCardAcademicPeriod } from '@features/client/report-cards/types/reportCard.types';
import {
  buildClassGradeEntryInitialValues,
  classGradeEntryFormSchema,
  type ClassGradeEntryFormValues,
} from '@features/client/report-cards/schemas/classGradeEntry/classGradeEntryFormSchema';
import { toClassGradeEntryPayload } from '@features/client/report-cards/normalizers/classGradeEntryFormNormalizer';

const REFERENCE_LIMIT = 100;

type ClassState = {
  currentSchoolClass: SchoolClass | null;
  teacherSubjectOptions: AppSelectOption[];
  studentNames: Record<string, string>;
};

const EMPTY_CLASS_STATE: ClassState = {
  currentSchoolClass: null,
  teacherSubjectOptions: [],
  studentNames: {},
};

const toSchoolClassOption = (item: SchoolClass): AppSelectOption => ({
  value: item.id,
  label: item.code ? `${item.name} (${item.code})` : item.name,
});

const toAcademicPeriodOption = (period: ReportCardAcademicPeriod): AppSelectOption => ({
  value: period.id,
  label: period.name,
});

const toTeacherSubjectOption = (
  entry: NonNullable<SchoolClass['teacherSubjects']>[number],
): AppSelectOption => {
  const { teacherSubject } = entry;
  const teacherName = teacherSubject.teacher?.fullName ?? 'Professor';
  const subjectName = teacherSubject.subject?.name ?? 'Disciplina';
  const subjectCode = teacherSubject.subject?.code;
  const label = subjectCode
    ? `${teacherName} - ${subjectName} (${subjectCode})`
    : `${teacherName} - ${subjectName}`;
  return { value: teacherSubject.id, label };
};

export const useClassGradeEntryForm = () => {
  const { profile, loading: profileLoading } = useClientProfile({ enabled: true });

  const [schoolClassOptions, setSchoolClassOptions] = useState<AppSelectOption[]>([]);
  const [academicPeriodOptions, setAcademicPeriodOptions] = useState<AppSelectOption[]>([]);
  const [classState, setClassState] = useState<ClassState>(EMPTY_CLASS_STATE);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | undefined>();

  const isTeacher = profile?.client?.role === 'teacher';
  const feedback = useFeedback();

  const form = useAppForm<ClassGradeEntryFormValues>(
    classGradeEntryFormSchema,
    buildClassGradeEntryInitialValues(),
  );

  const { fields, replace, remove } = useFieldArray({ control: form.control, name: 'entries' });

  const schoolClassId = form.watch('schoolClassId');

  useEffect(() => {
    let isMounted = true;
    const load = async (): Promise<void> => {
      setOptionsLoading(true);
      setOptionsError(undefined);
      try {
        const [classesRes, periodsRes] = await Promise.all([
          schoolClassService.list({ page: 1, limit: REFERENCE_LIMIT }),
          reportCardService.listAcademicPeriods({ page: 1, limit: REFERENCE_LIMIT }),
        ]);
        if (!isMounted) return;
        setSchoolClassOptions(classesRes.data.map(toSchoolClassOption));
        setAcademicPeriodOptions(periodsRes.data.map(toAcademicPeriodOption));
      } catch {
        if (!isMounted) return;
        setOptionsError('Não foi possível carregar as opções de turma e período.');
      } finally {
        if (isMounted) setOptionsLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async (): Promise<void> => {
      if (!schoolClassId) {
        setClassState(EMPTY_CLASS_STATE);
        replace([]);
        return;
      }
      setClassLoading(true);
      try {
        const schoolClass = await schoolClassService.getById(schoolClassId);
        if (!isMounted) return;

        const teacherSubjectOptions = (schoolClass.teacherSubjects ?? []).map(
          toTeacherSubjectOption,
        );

        const students = schoolClass.students ?? [];
        const studentNames: Record<string, string> = {};
        const entries = students
          .filter((student) => student.enrollmentId !== undefined)
          .map((student) => {
            const enrollmentId = student.enrollmentId ?? '';
            studentNames[enrollmentId] = student.fullName;
            return { studentEnrollmentId: enrollmentId, gradeValue: '', observations: '' };
          });

        setClassState({ currentSchoolClass: schoolClass, teacherSubjectOptions, studentNames });
        replace(entries);
        form.setValue('teacherSubjectId', '');
      } catch {
        if (!isMounted) return;
      } finally {
        if (isMounted) setClassLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [schoolClassId, replace, form]);

  useEffect(() => {
    if (!isTeacher || !profile || !classState.currentSchoolClass) return;
    const match = (classState.currentSchoolClass.teacherSubjects ?? []).find(
      (entry) => entry.teacherSubject.teacher?.fullName === profile.name,
    );
    if (match) {
      form.setValue('teacherSubjectId', match.teacherSubject.id);
    }
  }, [isTeacher, profile, classState.currentSchoolClass, form]);

  const removeRow = (index: number): void => {
    if (fields.length > 1) remove(index);
  };

  const submit = async (values: ClassGradeEntryFormValues): Promise<void> => {
    feedback.clear();
    try {
      const payload = toClassGradeEntryPayload(values);
      await reportCardService.createClassGradeEntries(values.schoolClassId, payload);
      feedback.setSuccess('Notas lançadas com sucesso.');
      form.reset(buildClassGradeEntryInitialValues());
      setClassState(EMPTY_CLASS_STATE);
      replace([]);
    } catch {
      feedback.setError('Não foi possível lançar as notas.');
    }
  };

  return {
    form,
    fields,
    removeRow,
    submit,
    feedback,
    isTeacher,
    profileLoading,
    optionsLoading,
    classLoading,
    optionsError,
    schoolClassOptions,
    teacherSubjectOptions: classState.teacherSubjectOptions,
    academicPeriodOptions,
    assessmentTypeOptions: reportCardAssessmentTypeOptions,
    studentNames: classState.studentNames,
  };
};
