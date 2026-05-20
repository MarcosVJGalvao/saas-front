import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildReportCardGradeSubjectInitialValues,
  toReportCardGradeSubjectCreatePayload,
} from '@features/client/report-cards/normalizers/reportCardCatalogForm.normalizer';
import {
  reportCardGradeSubjectCreateFormSchema,
  type ReportCardGradeSubjectCreateFormValues,
} from '@features/client/report-cards/schemas/reportCardGradeSubjectCreateForm.schema';
import { reportCardService } from '@features/client/report-cards/services/service';

export const useReportCardGradeSubjectCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<ReportCardGradeSubjectCreateFormValues>(
    reportCardGradeSubjectCreateFormSchema,
    buildReportCardGradeSubjectInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: ReportCardGradeSubjectCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await reportCardService.createGradeSubject(toReportCardGradeSubjectCreatePayload(values));
      void navigate('/client/report-cards/grade-subjects');
    } catch {
      setErrorMessage('Não foi possível salvar a matriz curricular.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/report-cards/grade-subjects');
    },
  };
};
