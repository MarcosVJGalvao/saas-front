import { useFieldArray } from 'react-hook-form';
import { useAppForm } from '@shared/hooks/useAppForm';
import { useFeedback } from '@shared/hooks/useFeedback';
import { reportCardService } from '@features/client/report-cards/services/service';
import {
  bulkUpdateFormSchema,
  buildBulkUpdateInitialValues,
  type BulkUpdateFormValues,
} from '@features/client/report-cards/schemas/bulkUpdateFormSchema';
import { reportCardAssessmentTypeOptions } from '@shared/constants/selectOptions';

export const useReportCardBulkUpdateForm = () => {
  const feedback = useFeedback();
  const form = useAppForm<BulkUpdateFormValues>(
    bulkUpdateFormSchema,
    buildBulkUpdateInitialValues(),
  );
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'entries' });

  const assessmentTypeOptions = reportCardAssessmentTypeOptions;

  const addRow = () =>
    append({ studentEnrollmentId: '', assessmentType: '', gradeValue: '', observations: '' });

  const removeRow = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const submit = async (values: BulkUpdateFormValues): Promise<void> => {
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
      await reportCardService.updateClassEntriesBulk(values.schoolClassId, payload);
      feedback.setSuccess('Lançamentos atualizados com sucesso.');
      form.reset(buildBulkUpdateInitialValues());
    } catch {
      feedback.setError('Não foi possível atualizar os lançamentos.');
    }
  };

  return { form, fields, addRow, removeRow, assessmentTypeOptions, feedback, submit };
};
