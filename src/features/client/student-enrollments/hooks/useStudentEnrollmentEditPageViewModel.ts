import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  updateStudentEnrollmentFormSchema,
  type UpdateStudentEnrollmentFormValues,
} from '@features/client/student-enrollments/schemas/studentEnrollmentSchemas';
import {
  emptyStudentEnrollmentEditValues,
  toStudentEnrollmentEditValues,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentEditInitialState';
import { toStudentEnrollmentUpdatePayload } from '@features/client/student-enrollments/normalizers/studentEnrollmentEditNormalizer';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/studentEnrollmentService';
import { useStudentEnrollmentDetails } from '@features/client/student-enrollments/hooks/useStudentEnrollmentDetails';

export const useStudentEnrollmentEditPageViewModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const details = useStudentEnrollmentDetails(id);
  const form = useAppForm(updateStudentEnrollmentFormSchema, emptyStudentEnrollmentEditValues);
  const [submitting, setSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!details.data) return;
    form.reset(toStudentEnrollmentEditValues(details.data));
  }, [details.data, form]);

  const onSubmit = async (values: UpdateStudentEnrollmentFormValues): Promise<void> => {
    if (!id) return;
    setSubmitting(true);
    setSubmitErrorMessage(undefined);
    try {
      await studentEnrollmentService.update(id, toStudentEnrollmentUpdatePayload(values));
      void navigate(`/client/student-enrollments/${id}`);
    } catch {
      setSubmitErrorMessage('Não foi possível atualizar a matrícula.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    loading: details.loading,
    errorMessage: submitErrorMessage ?? details.errorMessage,
    submitting,
    onSubmit,
    onCancel: () =>
      void navigate(id ? `/client/student-enrollments/${id}` : '/client/student-enrollments'),
  };
};
