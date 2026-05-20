import { useState } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  attendanceRecordCreateInitialValues,
  toAttendanceRecordCreatePayload,
} from '@features/client/attendance/normalizers/attendanceRecordForm.normalizer';
import {
  attendanceRecordCreateFormSchema,
  type AttendanceRecordCreateFormValues,
} from '@features/client/attendance/schemas/attendanceRecordCreateForm.schema';
import { attendanceRecordsService } from '@features/client/attendance/services/service';

export const useAttendanceRecordCreatePage = () => {
  const form = useAppForm<AttendanceRecordCreateFormValues>(
    attendanceRecordCreateFormSchema,
    attendanceRecordCreateInitialValues,
  );
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  return {
    form,
    submitting: form.formState.isSubmitting,
    successMessage,
    errorMessage,
    onSubmit: async (values: AttendanceRecordCreateFormValues): Promise<void> => {
      setSuccessMessage(undefined);
      setErrorMessage(undefined);
      try {
        await attendanceRecordsService.create(toAttendanceRecordCreatePayload(values));
        setSuccessMessage('Frequência lançada com sucesso.');
        form.reset(attendanceRecordCreateInitialValues);
      } catch {
        setErrorMessage('Não foi possível lançar a frequência.');
      }
    },
  };
};
