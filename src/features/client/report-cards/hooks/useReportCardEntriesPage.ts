import { useAppForm } from '@shared/hooks/useAppForm';
import { useFeedback } from '@shared/hooks/useFeedback';
import { useReportCardReferenceOptions } from '@features/client/report-cards/hooks/useReportCardReferenceOptions';
import { reportCardService } from '@features/client/report-cards/services/service';
import {
  reportCardEntryFormSchema,
  type ReportCardEntryFormValues,
} from '@features/client/report-cards/schemas/reportCardEntryFormSchema';
import {
  buildReportCardEntryInitialValues,
  normalizeReportCardEntryPayload,
} from '@features/client/report-cards/normalizers/reportCardEntryFormNormalizer';

export const useReportCardEntriesPage = () => {
  const referenceOptions = useReportCardReferenceOptions({
    includeAcademicPeriods: true,
    includeSchoolClasses: true,
    includeStudentEnrollments: true,
  });

  const feedback = useFeedback();
  const form = useAppForm<ReportCardEntryFormValues>(
    reportCardEntryFormSchema,
    buildReportCardEntryInitialValues(),
  );

  const createEntry = async (formValues: ReportCardEntryFormValues): Promise<void> => {
    feedback.clear();
    try {
      await reportCardService.createEntry(normalizeReportCardEntryPayload(formValues));
      form.reset(buildReportCardEntryInitialValues());
      feedback.setSuccess('Lançamento cadastrado com sucesso.');
    } catch {
      feedback.setError('Não foi possível cadastrar o lançamento.');
    }
  };

  return {
    form,
    referenceOptions,
    feedback,
    createEntry,
  };
};
