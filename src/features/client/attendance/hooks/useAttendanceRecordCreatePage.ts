import { useEffect, useState } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  attendanceRecordCreateInitialValues,
  toAttendanceRecordCreatePayload,
  toAttendanceRecordItemsFormValues,
} from '@features/client/attendance/normalizers/attendanceRecordForm.normalizer';
import {
  attendanceRecordCreateFormSchema,
  type AttendanceRecordCreateFormValues,
} from '@features/client/attendance/schemas/attendanceRecordCreateForm.schema';
import { attendanceRecordsService } from '@features/client/attendance/services/service';
import { useAttendanceReferenceOptions } from '@features/client/attendance/hooks/useAttendanceReferenceOptions';
import type { AttendanceSchedule } from '@features/client/attendance/types/attendance.types';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';

const findScheduleById = (
  schedules: AttendanceSchedule[],
  scheduleId: string,
): AttendanceSchedule | undefined => schedules.find((schedule) => schedule.id === scheduleId);

const filterEnrollmentsBySchedule = (
  enrollments: StudentEnrollment[],
  selectedSchedule: AttendanceSchedule | undefined,
): StudentEnrollment[] => {
  const schoolClassId = selectedSchedule?.schoolClass?.id;

  if (!schoolClassId) {
    return [];
  }

  return enrollments.filter((enrollment) => enrollment.schoolClass?.id === schoolClassId);
};

export const useAttendanceRecordCreatePage = () => {
  const referenceOptions = useAttendanceReferenceOptions({
    includeSchedules: true,
    includeStudentEnrollments: true,
  });
  const form = useAppForm<AttendanceRecordCreateFormValues>(
    attendanceRecordCreateFormSchema,
    attendanceRecordCreateInitialValues,
  );
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const selectedScheduleId = form.watch('scheduleId');
  const selectedSchedule = findScheduleById(referenceOptions.schedules, selectedScheduleId);
  const availableEnrollments = filterEnrollmentsBySchedule(
    referenceOptions.studentEnrollments,
    selectedSchedule,
  );

  useEffect(() => {
    const currentAttendanceDate = form.getValues('attendanceDate');
    const enrollmentsForSelectedSchedule = filterEnrollmentsBySchedule(
      referenceOptions.studentEnrollments,
      selectedSchedule,
    );

    form.reset({
      scheduleId: selectedScheduleId,
      attendanceDate: currentAttendanceDate,
      items: toAttendanceRecordItemsFormValues(enrollmentsForSelectedSchedule),
    });
  }, [form, referenceOptions.studentEnrollments, selectedSchedule, selectedScheduleId]);

  return {
    form,
    referenceOptions,
    availableEnrollments,
    selectedSchedule,
    submitting: form.formState.isSubmitting,
    successMessage,
    errorMessage,
    canSubmit: availableEnrollments.length > 0 && !referenceOptions.loading,
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
