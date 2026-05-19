import { useState } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  attendanceRecordFormSchema,
  type AttendanceRecordFormValues,
} from '@features/client/attendance/schemas/attendanceFormSchemas';
import {
  buildAttendanceRecordInitialValues,
  normalizeAttendanceRecordPayload,
} from '@features/client/attendance/normalizers/attendanceFormNormalizers';
import { attendanceService } from '@features/client/attendance/services/attendanceServices';

export const useAttendanceRecordFormPageViewModel = () => {
  const form = useAppForm<AttendanceRecordFormValues>(
    attendanceRecordFormSchema,
    buildAttendanceRecordInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const submit = async (values: AttendanceRecordFormValues): Promise<void> => {
    setSubmitting(true);
    setSuccessMessage(undefined);
    setErrorMessage(undefined);

    try {
      await attendanceService.markAttendance(normalizeAttendanceRecordPayload(values));
      setSuccessMessage('Frequência lançada com sucesso.');
      form.reset(buildAttendanceRecordInitialValues());
    } catch {
      setErrorMessage('Não foi possível lançar a frequência.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    successMessage,
    errorMessage,
    onSubmit: submit,
  };
};
