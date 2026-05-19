import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAttendanceScheduleFormPageViewModel } from '@features/client/attendance/hooks/useAttendanceScheduleFormPageViewModel';
import type { AttendanceScheduleFormValues } from '@features/client/attendance/schemas/attendanceFormSchemas';

const AttendanceScheduleCreatePage = () => {
  const model = useAttendanceScheduleFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar horário"
        subtitle="Configure turma, disciplina, vínculo professor-disciplina e período do horário de frequência."
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={model.form}
          onSubmit={model.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AttendanceScheduleFormValues>
            name="academicYearId"
            label="Ano letivo"
            placeholder="ID do ano letivo"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="schoolClassId"
            label="Turma"
            placeholder="ID da turma"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="subjectId"
            label="Disciplina"
            placeholder="ID da disciplina"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="teacherSubjectId"
            label="Professor-disciplina"
            placeholder="ID do vínculo professor-disciplina"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="weekday"
            label="Dia da semana"
            placeholder="Segunda-feira"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="startTime"
            label="Horário inicial"
            type="time"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="endTime"
            label="Horário final"
            type="time"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="startDate"
            label="Data inicial"
            type="date"
          />
          <FormTextField<AttendanceScheduleFormValues>
            name="endDate"
            label="Data final"
            type="date"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: model.onBack,
              disabled: model.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void model.form.handleSubmit(model.onSubmit)();
              },
              loading: model.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default AttendanceScheduleCreatePage;
