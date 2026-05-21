import { attendanceWeekdayOptions } from '@features/client/attendance/constants/attendanceFormOptions';
import { useAttendanceScheduleCreatePage } from '@features/client/attendance/hooks/useAttendanceScheduleCreatePage';
import type { AttendanceScheduleCreateFormValues } from '@features/client/attendance/schemas/attendanceScheduleCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormDatePicker } from '@shared/components/form/FormDatePicker';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

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
      {attendanceScheduleCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {attendanceScheduleCreatePage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={attendanceScheduleCreatePage.form}
          onSubmit={attendanceScheduleCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormSelect<AttendanceScheduleCreateFormValues>
            name="academicYearId"
            label="Ano letivo"
            options={attendanceScheduleCreatePage.referenceOptions.academicYearOptions}
            disabled={attendanceScheduleCreatePage.referenceOptions.loading}
          />
          <FormSelect<AttendanceScheduleCreateFormValues>
            name="schoolClassId"
            label="Turma"
            options={attendanceScheduleCreatePage.referenceOptions.schoolClassOptions}
            disabled={attendanceScheduleCreatePage.referenceOptions.loading}
          />
          <FormSelect<AttendanceScheduleCreateFormValues>
            name="subjectId"
            label="Disciplina"
            options={attendanceScheduleCreatePage.referenceOptions.subjectOptions}
            disabled={attendanceScheduleCreatePage.referenceOptions.loading}
          />
          <FormSelect<AttendanceScheduleCreateFormValues>
            name="teacherSubjectId"
            label="Professor-disciplina"
            options={attendanceScheduleCreatePage.referenceOptions.teacherSubjectOptions}
            disabled={attendanceScheduleCreatePage.referenceOptions.loading}
          />
          <FormSelect<AttendanceScheduleCreateFormValues>
            name="weekday"
            label="Dia da semana"
            options={attendanceWeekdayOptions}
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
          <FormDatePicker<AttendanceScheduleCreateFormValues>
            name="startDate"
            label="Data inicial"
          />
          <FormDatePicker<AttendanceScheduleCreateFormValues> name="endDate" label="Data final" />
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
