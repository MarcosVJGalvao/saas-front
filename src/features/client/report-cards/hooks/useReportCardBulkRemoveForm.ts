import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useAppForm } from '@shared/hooks/useAppForm';
import { useFeedback } from '@shared/hooks/useFeedback';
import { reportCardService } from '@features/client/report-cards/services/service';
import {
  bulkRemoveFormSchema,
  buildBulkRemoveInitialValues,
  type BulkRemoveFormValues,
} from '@features/client/report-cards/schemas/bulkRemoveFormSchema';
import { reportCardAssessmentTypeOptions } from '@shared/constants/selectOptions';

export const useReportCardBulkRemoveForm = () => {
  const feedback = useFeedback();
  const form = useAppForm<BulkRemoveFormValues>(
    bulkRemoveFormSchema,
    buildBulkRemoveInitialValues(),
  );
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'entries' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingValues, setPendingValues] = useState<BulkRemoveFormValues | undefined>(undefined);

  const assessmentTypeOptions = reportCardAssessmentTypeOptions;

  const addRow = () => append({ studentEnrollmentId: '', assessmentType: '' });

  const removeRow = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const requestSubmit = (values: BulkRemoveFormValues): void => {
    feedback.clear();
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const confirmSubmit = async (): Promise<void> => {
    if (!pendingValues) return;
    setLoading(true);
    const payload = {
      subjectId: pendingValues.subjectId,
      academicPeriodId: pendingValues.academicPeriodId,
      entries: pendingValues.entries.map((entry) => ({
        studentEnrollmentId: entry.studentEnrollmentId,
        assessmentType: entry.assessmentType,
      })),
    };
    try {
      await reportCardService.removeClassEntriesBulk(pendingValues.schoolClassId, payload);
      setConfirmOpen(false);
      feedback.setSuccess('Lançamentos removidos com sucesso.');
      form.reset(buildBulkRemoveInitialValues());
    } catch {
      feedback.setError('Não foi possível remover os lançamentos.');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    fields,
    addRow,
    removeRow,
    assessmentTypeOptions,
    feedback,
    confirmOpen,
    loading,
    closeConfirm: () => setConfirmOpen(false),
    requestSubmit,
    confirmSubmit,
  };
};
