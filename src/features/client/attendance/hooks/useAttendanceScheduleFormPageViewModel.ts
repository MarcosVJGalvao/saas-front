import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  attendanceScheduleFormSchema,
  type AttendanceScheduleFormValues,
} from '@features/client/attendance/schemas/attendanceFormSchemas';
import {
  buildAttendanceScheduleInitialValues,
  normalizeAttendanceSchedulePayload,
} from '@features/client/attendance/normalizers/attendanceFormNormalizers';
import { attendanceService } from '@features/client/attendance/services/attendanceServices';

const backPath = '/client/attendance/schedules';

export const useAttendanceScheduleFormPageViewModel = () => {
  const navigate = useNavigate();
  const form = useAppForm<AttendanceScheduleFormValues>(
    attendanceScheduleFormSchema,
    buildAttendanceScheduleInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const submit = async (values: AttendanceScheduleFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);

    try {
      await attendanceService.createSchedule(normalizeAttendanceSchedulePayload(values));
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível cadastrar o horário de frequência.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    errorMessage,
    onBack: () => void navigate(backPath),
    onSubmit: submit,
  };
};
