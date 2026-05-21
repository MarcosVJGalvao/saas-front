import { AttendanceRecordItemsFields } from '@features/client/attendance/components/AttendanceRecordItemsFields';
import { useAttendanceRecordCreatePage } from '@features/client/attendance/hooks/useAttendanceRecordCreatePage';
import type { AttendanceRecordCreateFormValues } from '@features/client/attendance/schemas/attendanceRecordCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormDatePicker } from '@shared/components/form/FormDatePicker';
import { FormSelect } from '@shared/components/form/FormSelect';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

const AttendanceRecordsPage = () => {
  const attendanceRecordCreatePage = useAttendanceRecordCreatePage();
  const hasSelectedSchedule = Boolean(attendanceRecordCreatePage.selectedSchedule);
  const hasAvailableEnrollments = attendanceRecordCreatePage.availableEnrollments.length > 0;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Lançamentos de frequência"
        subtitle="Selecione a aula e marque a presença da turma em lote."
      />
      <AppAlert severity="info">
        Escolha um horário e a data da aula para carregar automaticamente os alunos matriculados da
        turma.
      </AppAlert>
      {attendanceRecordCreatePage.successMessage ? (
        <AppAlert severity="success">{attendanceRecordCreatePage.successMessage}</AppAlert>
      ) : null}
      {attendanceRecordCreatePage.errorMessage ? (
        <AppAlert severity="error">{attendanceRecordCreatePage.errorMessage}</AppAlert>
      ) : null}
      {attendanceRecordCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {attendanceRecordCreatePage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}

      <AppPaper sx={{ p: 3 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Lançamento em lote</AppText>
          <AppForm
            form={attendanceRecordCreatePage.form}
            onSubmit={attendanceRecordCreatePage.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormSelect<AttendanceRecordCreateFormValues>
              name="scheduleId"
              label="Horário"
              options={attendanceRecordCreatePage.referenceOptions.scheduleOptions}
              disabled={attendanceRecordCreatePage.referenceOptions.loading}
            />
            <FormDatePicker<AttendanceRecordCreateFormValues>
              name="attendanceDate"
              label="Data da aula"
            />

            {!hasSelectedSchedule ? (
              <AppAlert severity="info">
                Selecione um horário para listar os alunos da turma e registrar a frequência.
              </AppAlert>
            ) : null}

            {hasSelectedSchedule && !hasAvailableEnrollments ? (
              <AppAlert severity="warning">
                Não há matrículas vinculadas à turma deste horário. Verifique a turma selecionada ou
                cadastre os alunos antes de lançar a frequência.
              </AppAlert>
            ) : null}

            {hasAvailableEnrollments ? (
              <>
                <AttendanceRecordItemsFields
                  enrollments={attendanceRecordCreatePage.availableEnrollments}
                  disabled={attendanceRecordCreatePage.submitting}
                />

                <FormActions
                  primaryAction={{
                    type: 'confirm',
                    label: 'Lançar frequência em lote',
                    onClick: () => {
                      void attendanceRecordCreatePage.form.handleSubmit(
                        attendanceRecordCreatePage.onSubmit,
                      )();
                    },
                    loading: attendanceRecordCreatePage.submitting,
                    disabled: !attendanceRecordCreatePage.canSubmit,
                  }}
                />
              </>
            ) : null}
          </AppForm>
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default AttendanceRecordsPage;
