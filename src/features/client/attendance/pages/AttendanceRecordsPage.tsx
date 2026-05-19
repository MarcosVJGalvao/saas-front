import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAttendanceRecordFormPageViewModel } from '@features/client/attendance/hooks/useAttendanceRecordFormPageViewModel';
import type { AttendanceRecordFormValues } from '@features/client/attendance/schemas/attendanceFormSchemas';

const AttendanceRecordsPage = () => {
  const model = useAttendanceRecordFormPageViewModel();

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
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      <AppPaper sx={{ p: 3 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Novo lançamento</AppText>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<AttendanceRecordFormValues>
              name="scheduleId"
              label="Horário"
              placeholder="ID do horário"
            />
            <FormTextField<AttendanceRecordFormValues>
              name="attendanceDate"
              label="Data da aula"
              type="date"
            />
            <FormTextField<AttendanceRecordFormValues>
              name="studentEnrollmentId"
              label="Matrícula"
              placeholder="ID da matrícula"
            />
            <FormTextField<AttendanceRecordFormValues>
              name="status"
              label="Status"
              placeholder="present, absent ou justified"
            />
            <FormTextField<AttendanceRecordFormValues>
              name="observations"
              label="Observações"
              placeholder="Observações opcionais"
            />
            <FormActions
              primaryAction={{
                type: 'confirm',
                label: 'Lançar frequência',
                onClick: () => {
                  void model.form.handleSubmit(model.onSubmit)();
                },
                loading: model.submitting,
              }}
            />
          </AppForm>
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default AttendanceRecordsPage;
