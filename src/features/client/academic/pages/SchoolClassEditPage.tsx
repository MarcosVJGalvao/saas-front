import { useLocation, useParams } from 'react-router-dom';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassEditPage } from '@features/client/academic/hooks/useSchoolClassEditPage';
import type { SchoolClassEditFormValues } from '@features/client/academic/schemas/schoolClassEditForm.schema';

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
            <FormTextField<SchoolClassEditFormValues>
              name="status"
              label="Status"
              placeholder="active, inactive ou cancelled"
            />
            <FormTextField<SchoolClassEditFormValues>
              name="shift"
              label="Turno"
              placeholder="morning, afternoon, evening ou full_time"
            />
            <FormTextField<SchoolClassEditFormValues>
              name="capacity"
              label="Capacidade"
              placeholder="Quantidade de vagas"
            />
            <FormTextField<SchoolClassEditFormValues>
              name="academicYearId"
              label="Ano letivo"
              placeholder="ID do ano letivo"
            />
            <FormTextField<SchoolClassEditFormValues>
              name="gradeId"
              label="Série"
              placeholder="ID da série"
            />
            <FormTextField<SchoolClassEditFormValues>
              name="educationLevelId"
              label="Nível de ensino"
              placeholder="ID do nível de ensino"
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
