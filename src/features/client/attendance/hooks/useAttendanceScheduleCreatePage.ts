import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  attendanceScheduleCreateInitialValues,
  toAttendanceScheduleCreatePayload,
} from '@features/client/attendance/normalizers/attendanceScheduleForm.normalizer';
import {
  attendanceScheduleCreateFormSchema,
  type AttendanceScheduleCreateFormValues,
} from '@features/client/attendance/schemas/attendanceScheduleCreateForm.schema';
import { attendanceSchedulesService } from '@features/client/attendance/services/service';
import { useAttendanceReferenceOptions } from '@features/client/attendance/hooks/useAttendanceReferenceOptions';

const backPath = '/client/attendance/schedules';

export const useAttendanceScheduleCreatePage = () => {
  const navigate = useNavigate();
  const referenceOptions = useAttendanceReferenceOptions();
  const form = useAppForm<AttendanceScheduleCreateFormValues>(
    attendanceScheduleCreateFormSchema,
    attendanceScheduleCreateInitialValues,
  );

  return {
    form,
    referenceOptions,
    submitting: form.formState.isSubmitting,
    errorMessage: undefined,
    onBack: () => {
      void navigate(backPath);
    },
    onSubmit: async (values: AttendanceScheduleCreateFormValues): Promise<void> => {
      await attendanceSchedulesService.create(toAttendanceScheduleCreatePayload(values));
      void navigate(backPath);
    },
  };
};
