import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAttendanceScheduleCreatePage } from '@features/client/attendance/hooks/useAttendanceScheduleCreatePage';
import type { AttendanceScheduleCreateFormValues } from '@features/client/attendance/schemas/attendanceScheduleCreateForm.schema';

const AttendanceScheduleCreatePage = () => {
  const attendanceScheduleCreatePage = useAttendanceScheduleCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar horário"
        subtitle="Configure turma, disciplina, vínculo professor-disciplina e período do horário de frequência."
        actionLabel="Voltar"
        onAction={attendanceScheduleCreatePage.onBack}
      />
      {attendanceScheduleCreatePage.errorMessage ? (
        <AppAlert severity="error">{attendanceScheduleCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={attendanceScheduleCreatePage.form}
          onSubmit={attendanceScheduleCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="academicYearId"
            label="Ano letivo"
            placeholder="ID do ano letivo"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="schoolClassId"
            label="Turma"
            placeholder="ID da turma"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="subjectId"
            label="Disciplina"
            placeholder="ID da disciplina"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="teacherSubjectId"
            label="Professor-disciplina"
            placeholder="ID do vínculo professor-disciplina"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="weekday"
            label="Dia da semana"
            placeholder="Segunda-feira"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="startTime"
            label="Horário inicial"
            type="time"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="endTime"
            label="Horário final"
            type="time"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="startDate"
            label="Data inicial"
            type="date"
          />
          <FormTextField<AttendanceScheduleCreateFormValues>
            name="endDate"
            label="Data final"
            type="date"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: attendanceScheduleCreatePage.onBack,
              disabled: attendanceScheduleCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void attendanceScheduleCreatePage.form.handleSubmit(
                  attendanceScheduleCreatePage.onSubmit,
                )();
              },
              loading: attendanceScheduleCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default AttendanceScheduleCreatePage;
