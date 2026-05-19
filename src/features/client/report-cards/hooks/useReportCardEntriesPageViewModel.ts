import { useState } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';
import {
  reportCardEntryFormSchema,
  type ReportCardEntryFormValues,
} from '@features/client/report-cards/schemas/reportCardEntryFormSchema';
import {
  buildReportCardEntryInitialValues,
  normalizeReportCardEntryPayload,
} from '@features/client/report-cards/normalizers/reportCardEntryFormNormalizer';

type EntryValues = Record<string, unknown>;

const initialValues: EntryValues = {
  entryId: '',
  updateEntryId: '',
  schoolClassId: '',
  subjectId: '',
  academicPeriodId: '',
  firstEntryId: '',
  secondEntryId: '',
  thirdEntryId: '',
  bulkEntryIds: '',
  studentEnrollmentId: '',
  updateStudentEnrollmentId: '',
  secondStudentEnrollmentId: '',
  thirdStudentEnrollmentId: '',
  assessmentType: '',
  updateAssessmentType: '',
  secondAssessmentType: '',
  thirdAssessmentType: '',
  gradeValue: '',
  updateGradeValue: '',
  secondGradeValue: '',
  thirdGradeValue: '',
  observations: '',
  updateObservations: '',
  secondObservations: '',
  thirdObservations: '',
  updateSubjectId: '',
  updateAcademicPeriodId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const buildBulkCreateItem = (
  studentEnrollmentId: unknown,
  assessmentType: unknown,
  gradeValue: unknown,
  observations: unknown,
): Record<string, unknown> | undefined => {
  const enrollment = getStringValue(studentEnrollmentId);
  const type = getStringValue(assessmentType);
  const grade = getStringValue(gradeValue);
  if (!enrollment || !type || !grade) return undefined;
  return {
    studentEnrollmentId: enrollment,
    assessmentType: type,
    gradeValue: Number(grade.replace(',', '.')),
    observations: getStringValue(observations) || undefined,
  };
};

const buildBulkUpdateItem = (
  entryId: unknown,
  assessmentType: unknown,
  gradeValue: unknown,
  observations: unknown,
): Record<string, unknown> | undefined => {
  const id = getStringValue(entryId);
  const grade = getStringValue(gradeValue);
  if (!id || !grade) return undefined;
  return {
    id,
    assessmentType: getStringValue(assessmentType) || undefined,
    gradeValue: Number(grade.replace(',', '.')),
    observations: getStringValue(observations) || undefined,
  };
};

const isBulkEntry = (
  entry: Record<string, unknown> | undefined,
): entry is Record<string, unknown> => entry !== undefined;

const buildBulkEntryPayload = (values: EntryValues): Record<string, unknown> => ({
  subjectId: getStringValue(values.subjectId),
  academicPeriodId: getStringValue(values.academicPeriodId),
  entries: [
    buildBulkCreateItem(
      values.studentEnrollmentId,
      values.assessmentType,
      values.gradeValue,
      values.observations,
    ),
    buildBulkCreateItem(
      values.secondStudentEnrollmentId,
      values.secondAssessmentType,
      values.secondGradeValue,
      values.secondObservations,
    ),
    buildBulkCreateItem(
      values.thirdStudentEnrollmentId,
      values.thirdAssessmentType,
      values.thirdGradeValue,
      values.thirdObservations,
    ),
  ].filter(isBulkEntry),
});

const buildBulkUpdatePayload = (values: EntryValues): Record<string, unknown> => ({
  entries: [
    buildBulkUpdateItem(
      values.firstEntryId,
      values.assessmentType,
      values.gradeValue,
      values.observations,
    ),
    buildBulkUpdateItem(
      values.secondEntryId,
      values.secondAssessmentType,
      values.secondGradeValue,
      values.secondObservations,
    ),
    buildBulkUpdateItem(
      values.thirdEntryId,
      values.thirdAssessmentType,
      values.thirdGradeValue,
      values.thirdObservations,
    ),
  ].filter(isBulkEntry),
});

const buildUpdateEntryPayload = (values: EntryValues): Record<string, unknown> => {
  const assessmentType = getStringValue(values.updateAssessmentType);
  const gradeValue = getStringValue(values.updateGradeValue);
  const observations = getStringValue(values.updateObservations);
  const payload: Record<string, unknown> = {
    gradeValue: Number(gradeValue.replace(',', '.')),
  };
  if (assessmentType) payload.assessmentType = assessmentType;
  if (observations) payload.observations = observations;
  return payload;
};

const parseIds = (value: unknown): string[] =>
  getStringValue(value)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

export const useReportCardEntriesPageViewModel = () => {
  const form = useAppForm<ReportCardEntryFormValues>(
    reportCardEntryFormSchema,
    buildReportCardEntryInitialValues(),
  );
  const [values, setValues] = useState<EntryValues>(initialValues);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const onChange = (name: string, value: unknown): void => {
    setValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const clear = (): void => {
    setValues(initialValues);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
  };

  const createEntry = async (formValues: ReportCardEntryFormValues): Promise<void> => {
    setLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.createEntry(normalizeReportCardEntryPayload(formValues));
      form.reset(buildReportCardEntryInitialValues());
      setSuccessMessage('Lançamento cadastrado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível cadastrar o lançamento.');
    } finally {
      setLoading(false);
    }
  };

  const createBulkEntry = async (): Promise<void> => {
    const schoolClassId = getStringValue(values.schoolClassId);
    if (!schoolClassId) {
      setErrorMessage('Informe a turma para lançamento em lote.');
      return;
    }
    const payload = buildBulkEntryPayload(values);
    const entries = payload.entries;
    if (!Array.isArray(entries) || entries.length === 0) {
      setErrorMessage('Informe ao menos uma matrícula com tipo de avaliação e nota.');
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.createClassEntriesBulk(schoolClassId, payload);
      setSuccessMessage('Lançamento em lote cadastrado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível cadastrar o lançamento em lote.');
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (): Promise<void> => {
    const entryId = getStringValue(values.updateEntryId);
    if (!entryId) {
      setErrorMessage('Informe o lançamento para atualizar.');
      return;
    }
    if (!getStringValue(values.updateGradeValue)) {
      setErrorMessage('Informe a nota para atualizar o lançamento.');
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.updateEntry(entryId, buildUpdateEntryPayload(values));
      setSuccessMessage('Lançamento atualizado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível atualizar o lançamento.');
    } finally {
      setLoading(false);
    }
  };

  const updateBulkEntry = async (): Promise<void> => {
    const schoolClassId = getStringValue(values.schoolClassId);
    if (!schoolClassId) {
      setErrorMessage('Informe a turma para atualizar lançamentos em lote.');
      return;
    }
    const payload = buildBulkUpdatePayload(values);
    const entries = payload.entries;
    if (!Array.isArray(entries) || entries.length === 0) {
      setErrorMessage('Informe ao menos um lançamento com ID, matrícula, tipo e nota.');
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.updateClassEntriesBulk(schoolClassId, payload);
      setSuccessMessage('Lançamentos em lote atualizados com sucesso.');
    } catch {
      setErrorMessage('Não foi possível atualizar os lançamentos em lote.');
    } finally {
      setLoading(false);
    }
  };

  const removeBulkEntries = async (): Promise<void> => {
    const schoolClassId = getStringValue(values.schoolClassId);
    const entryIds = parseIds(values.bulkEntryIds);
    if (!schoolClassId || entryIds.length === 0) {
      setErrorMessage('Informe a turma e ao menos um lançamento para remover em lote.');
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.removeClassEntriesBulk(schoolClassId, { ids: entryIds });
      setSuccessMessage('Lançamentos em lote removidos com sucesso.');
    } catch {
      setErrorMessage('Não foi possível remover os lançamentos em lote.');
    } finally {
      setLoading(false);
    }
  };

  const requestRemove = (): void => {
    const entryId = getStringValue(values.entryId);
    if (!entryId) {
      setErrorMessage('Informe o lançamento para remover.');
      return;
    }
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    setConfirmOpen(true);
  };

  const confirmRemove = async (): Promise<void> => {
    const entryId = getStringValue(values.entryId);
    if (!entryId) return;
    setLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.removeEntry(entryId);
      setConfirmOpen(false);
      setSuccessMessage('Lançamento removido com sucesso.');
    } catch {
      setErrorMessage('Não foi possível remover o lançamento.');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    values,
    loading,
    confirmOpen,
    errorMessage,
    successMessage,
    onChange,
    clear,
    createEntry,
    createBulkEntry,
    updateEntry,
    updateBulkEntry,
    removeBulkEntries,
    requestRemove,
    closeConfirm: () => setConfirmOpen(false),
    confirmRemove,
  };
};
