import { Controller, useFormContext } from 'react-hook-form';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { attendanceStatusOptions } from '@shared/constants/selectOptions';
import type { AttendanceRecordCreateFormValues } from '@features/client/attendance/schemas/attendanceRecordCreateForm.schema';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';

type AttendanceRecordItemsFieldsProps = {
  enrollments: StudentEnrollment[];
  disabled?: boolean | undefined;
};

const getEnrollmentTitle = (enrollment: StudentEnrollment): string =>
  enrollment.student?.person?.fullName ??
  enrollment.enrollmentCode ??
  enrollment.student?.registrationCode ??
  enrollment.id;

const getEnrollmentSubtitle = (enrollment: StudentEnrollment): string => {
  const secondaryParts = [
    enrollment.enrollmentCode ?? undefined,
    enrollment.student?.registrationCode ?? undefined,
  ].filter((value) => Boolean(value));

  return secondaryParts.join(' • ');
};

export const AttendanceRecordItemsFields = ({
  enrollments,
  disabled = false,
}: AttendanceRecordItemsFieldsProps) => {
  const form = useFormContext<AttendanceRecordCreateFormValues>();

  return (
    <AppStack spacing={2}>
      {enrollments.map((enrollment, itemIndex) => {
        const enrollmentSubtitle = getEnrollmentSubtitle(enrollment);

        return (
          <AppPaper key={enrollment.id} sx={{ p: 2 }}>
            <AppStack spacing={2}>
              <AppStack spacing={0.5}>
                <AppText variant="h6">{getEnrollmentTitle(enrollment)}</AppText>
                {enrollmentSubtitle ? (
                  <AppText variant="body2" color="text.secondary">
                    {enrollmentSubtitle}
                  </AppText>
                ) : null}
              </AppStack>

              <AppGrid container spacing={2}>
                <AppGrid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name={`items.${itemIndex}.status`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <AppTextField
                        {...field}
                        select
                        label="Status"
                        disabled={disabled}
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      >
                        {attendanceStatusOptions.map((statusOption) => (
                          <AppMenuItem key={statusOption.value} value={statusOption.value}>
                            {statusOption.label}
                          </AppMenuItem>
                        ))}
                      </AppTextField>
                    )}
                  />
                </AppGrid>

                <AppGrid size={{ xs: 12, md: 8 }}>
                  <Controller
                    name={`items.${itemIndex}.observations`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <AppTextField
                        {...field}
                        label="Observações"
                        placeholder="Observações opcionais"
                        disabled={disabled}
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </AppGrid>
              </AppGrid>
            </AppStack>
          </AppPaper>
        );
      })}
    </AppStack>
  );
};
