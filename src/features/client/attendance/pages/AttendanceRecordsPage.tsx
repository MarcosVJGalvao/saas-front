import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAttendanceRecordCreatePage } from '@features/client/attendance/hooks/useAttendanceRecordCreatePage';
import type { AttendanceRecordCreateFormValues } from '@features/client/attendance/schemas/attendanceRecordCreateForm.schema';

const AttendanceRecordsPage = () => {
  const attendanceRecordCreatePage = useAttendanceRecordCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Lançamentos de frequência"
        subtitle="Marque presenças, faltas e justificativas por aula."
      />
      <AppAlert severity="info">
        Informe um horário configurado, a data da aula e a matrícula do aluno para registrar a
        frequência.
      </AppAlert>
      {attendanceRecordCreatePage.successMessage ? (
        <AppAlert severity="success">{attendanceRecordCreatePage.successMessage}</AppAlert>
      ) : null}
      {attendanceRecordCreatePage.errorMessage ? (
        <AppAlert severity="error">{attendanceRecordCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Novo lançamento</AppText>
          <AppForm
            form={attendanceRecordCreatePage.form}
            onSubmit={attendanceRecordCreatePage.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<AttendanceRecordCreateFormValues>
              name="scheduleId"
              label="Horário"
              placeholder="ID do horário"
            />
            <FormTextField<AttendanceRecordCreateFormValues>
              name="attendanceDate"
              label="Data da aula"
              type="date"
            />
            <FormTextField<AttendanceRecordCreateFormValues>
              name="studentEnrollmentId"
              label="Matrícula"
              placeholder="ID da matrícula"
            />
            <FormTextField<AttendanceRecordCreateFormValues>
              name="status"
              label="Status"
              placeholder="present, absent ou justified"
            />
            <FormTextField<AttendanceRecordCreateFormValues>
              name="observations"
              label="Observações"
              placeholder="Observações opcionais"
            />
            <FormActions
              primaryAction={{
                type: 'confirm',
                label: 'Lançar frequência',
                onClick: () => {
                  void attendanceRecordCreatePage.form.handleSubmit(
                    attendanceRecordCreatePage.onSubmit,
                  )();
                },
                loading: attendanceRecordCreatePage.submitting,
              }}
            />
          </AppForm>
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default AttendanceRecordsPage;
