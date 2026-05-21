import { useReportCardGradeSubjectCreatePage } from '@features/client/report-cards/hooks/useReportCardGradeSubjectCreatePage';
import type { ReportCardGradeSubjectCreateFormValues } from '@features/client/report-cards/schemas/reportCardGradeSubjectCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { yesNoOptions } from '@shared/constants/selectOptions';

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
      {reportCardGradeSubjectCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {reportCardGradeSubjectCreatePage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={reportCardGradeSubjectCreatePage.form}
          onSubmit={reportCardGradeSubjectCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormSelect<ReportCardGradeSubjectCreateFormValues>
            name="academicYearId"
            label="Ano letivo"
            options={reportCardGradeSubjectCreatePage.referenceOptions.academicYearOptions}
            disabled={reportCardGradeSubjectCreatePage.referenceOptions.loading}
          />
          <FormSelect<ReportCardGradeSubjectCreateFormValues>
            name="gradeId"
            label="Série"
            options={reportCardGradeSubjectCreatePage.referenceOptions.gradeOptions}
            disabled={reportCardGradeSubjectCreatePage.referenceOptions.loading}
          />
          <FormSelect<ReportCardGradeSubjectCreateFormValues>
            name="subjectId"
            label="Disciplina"
            options={reportCardGradeSubjectCreatePage.referenceOptions.subjectOptions}
            disabled={reportCardGradeSubjectCreatePage.referenceOptions.loading}
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
          <FormSelect<ReportCardGradeSubjectCreateFormValues>
            name="isMandatory"
            label="Obrigatória"
            options={yesNoOptions}
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
