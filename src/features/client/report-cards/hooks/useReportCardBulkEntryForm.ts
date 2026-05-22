import { useFieldArray } from 'react-hook-form';
import { useAppForm } from '@shared/hooks/useAppForm';
import { useFeedback } from '@shared/hooks/useFeedback';
import { reportCardService } from '@features/client/report-cards/services/service';
import {
  bulkEntryFormSchema,
  buildBulkEntryInitialValues,
  type BulkEntryFormValues,
} from '@features/client/report-cards/schemas/bulkEntryFormSchema';
import { reportCardAssessmentTypeOptions } from '@shared/constants/selectOptions';

export const useReportCardBulkEntryForm = () => {
  const feedback = useFeedback();
  const form = useAppForm<BulkEntryFormValues>(bulkEntryFormSchema, buildBulkEntryInitialValues());
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'entries' });

  const assessmentTypeOptions = reportCardAssessmentTypeOptions;

  const addRow = () =>
    append({ studentEnrollmentId: '', assessmentType: '', gradeValue: '', observations: '' });

  const removeRow = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const submit = async (values: BulkEntryFormValues): Promise<void> => {
    feedback.clear();
    const payload = {
      subjectId: values.subjectId,
      academicPeriodId: values.academicPeriodId,
      entries: values.entries.map((entry) => ({
        studentEnrollmentId: entry.studentEnrollmentId,
        assessmentType: entry.assessmentType,
        gradeValue: Number(entry.gradeValue.replace(',', '.')),
        observations: entry.observations ?? undefined,
      })),
    };
    try {
      await reportCardService.createClassEntriesBulk(values.schoolClassId, payload);
      feedback.setSuccess('Lançamentos cadastrados com sucesso.');
      form.reset(buildBulkEntryInitialValues());
    } catch {
      feedback.setError('Não foi possível cadastrar os lançamentos.');
    }
  };

  return { form, fields, addRow, removeRow, assessmentTypeOptions, feedback, submit };
};
