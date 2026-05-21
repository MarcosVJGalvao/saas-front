import { useSchoolClassEditPage } from '@features/client/academic/hooks/useSchoolClassEditPage';
import type { SchoolClassEditFormValues } from '@features/client/academic/schemas/schoolClassEditForm.schema';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { schoolClassShiftOptions, schoolClassStatusOptions } from '@shared/constants/selectOptions';
import { useLocation, useParams } from 'react-router-dom';

const SchoolClassEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const schoolClassEditPage = useSchoolClassEditPage(id ?? '', location.state);

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar turma"
        subtitle="Defina ano letivo, série, turno, capacidade e status da turma."
        actionLabel="Voltar"
        onAction={schoolClassEditPage.onBack}
      />
      {schoolClassEditPage.errorMessage ? (
        <AppAlert severity="error">{schoolClassEditPage.errorMessage}</AppAlert>
      ) : null}
      {schoolClassEditPage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{schoolClassEditPage.referenceOptions.errorMessage}</AppAlert>
      ) : null}
      {schoolClassEditPage.loading ? (
        <AppCircularProgress ariaLabel="Carregando formulário" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={schoolClassEditPage.form}
            onSubmit={schoolClassEditPage.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<SchoolClassEditFormValues> name="name" label="Nome" />
            <FormTextField<SchoolClassEditFormValues> name="code" label="Código" />
            <FormSelect<SchoolClassEditFormValues>
              name="status"
              label="Status"
              options={schoolClassStatusOptions}
            />
            <FormSelect<SchoolClassEditFormValues>
              name="shift"
              label="Turno"
              options={schoolClassShiftOptions}
            />
            <FormTextField<SchoolClassEditFormValues>
              name="capacity"
              label="Capacidade"
              placeholder="Quantidade de vagas"
            />
            <FormSelect<SchoolClassEditFormValues>
              name="academicYearId"
              label="Ano letivo"
              options={schoolClassEditPage.referenceOptions.academicYearOptions}
              disabled={schoolClassEditPage.referenceOptions.loading}
            />
            <FormSelect<SchoolClassEditFormValues>
              name="gradeId"
              label="Série"
              options={schoolClassEditPage.referenceOptions.gradeOptions}
              disabled={schoolClassEditPage.referenceOptions.loading}
            />
            <FormSelect<SchoolClassEditFormValues>
              name="educationLevelId"
              label="Nível de ensino"
              options={schoolClassEditPage.referenceOptions.educationLevelOptions}
              disabled={schoolClassEditPage.referenceOptions.loading}
            />
            <FormTextField<SchoolClassEditFormValues>
              name="description"
              label="Descrição"
              placeholder="Descrição opcional"
            />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: schoolClassEditPage.onBack,
                disabled: schoolClassEditPage.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: 'Salvar alterações',
                onClick: () => {
                  void schoolClassEditPage.form.handleSubmit(schoolClassEditPage.onSubmit)();
                },
                loading: schoolClassEditPage.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};

export default SchoolClassEditPage;
