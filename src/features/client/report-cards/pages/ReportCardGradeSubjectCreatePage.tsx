import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useReportCardGradeSubjectCreatePage } from '@features/client/report-cards/hooks/useReportCardGradeSubjectCreatePage';
import type { ReportCardGradeSubjectCreateFormValues } from '@features/client/report-cards/schemas/reportCardGradeSubjectCreateForm.schema';

const ReportCardGradeSubjectCreatePage = () => {
  const reportCardGradeSubjectCreatePage = useReportCardGradeSubjectCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Nova matriz curricular"
        subtitle="Cadastre disciplina, série e ano letivo usados no boletim."
        actionLabel="Voltar"
        onAction={reportCardGradeSubjectCreatePage.onBack}
      />
      {reportCardGradeSubjectCreatePage.errorMessage ? (
        <AppAlert severity="error">{reportCardGradeSubjectCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={reportCardGradeSubjectCreatePage.form}
          onSubmit={reportCardGradeSubjectCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<ReportCardGradeSubjectCreateFormValues>
            name="academicYearId"
            label="Ano letivo"
            placeholder="ID do ano letivo"
          />
          <FormTextField<ReportCardGradeSubjectCreateFormValues>
            name="gradeId"
            label="Série"
            placeholder="ID da série"
          />
          <FormTextField<ReportCardGradeSubjectCreateFormValues>
            name="subjectId"
            label="Disciplina"
            placeholder="ID da disciplina"
          />
          <FormTextField<ReportCardGradeSubjectCreateFormValues>
            name="workloadHours"
            label="Carga horária"
            placeholder="80"
          />
          <FormTextField<ReportCardGradeSubjectCreateFormValues>
            name="displayOrder"
            label="Ordem"
            placeholder="1"
          />
          <FormTextField<ReportCardGradeSubjectCreateFormValues>
            name="isMandatory"
            label="Obrigatória"
            placeholder="true ou false"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: reportCardGradeSubjectCreatePage.onBack,
              disabled: reportCardGradeSubjectCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void reportCardGradeSubjectCreatePage.form.handleSubmit(
                  reportCardGradeSubjectCreatePage.onSubmit,
                )();
              },
              loading: reportCardGradeSubjectCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ReportCardGradeSubjectCreatePage;
