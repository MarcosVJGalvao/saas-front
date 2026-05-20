import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildReportCardAcademicPeriodInitialValues,
  toReportCardAcademicPeriodCreatePayload,
} from '@features/client/report-cards/normalizers/reportCardCatalogForm.normalizer';
import {
  reportCardAcademicPeriodCreateFormSchema,
  type ReportCardAcademicPeriodCreateFormValues,
} from '@features/client/report-cards/schemas/reportCardAcademicPeriodCreateForm.schema';
import { reportCardService } from '@features/client/report-cards/services/service';

export const useReportCardAcademicPeriodCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<ReportCardAcademicPeriodCreateFormValues>(
    reportCardAcademicPeriodCreateFormSchema,
    buildReportCardAcademicPeriodInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: ReportCardAcademicPeriodCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await reportCardService.createAcademicPeriod(toReportCardAcademicPeriodCreatePayload(values));
      void navigate('/client/report-cards/academic-periods');
    } catch {
      setErrorMessage('Não foi possível salvar o período do boletim.');
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
      void navigate('/client/report-cards/academic-periods');
    },
  };
};
