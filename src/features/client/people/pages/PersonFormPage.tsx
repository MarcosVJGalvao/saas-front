import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { usePersonFormPageViewModel } from '@features/client/people/hooks/usePersonFormPageViewModel';
import type { PersonFormValues } from '@features/client/people/schemas/personFormSchema';

const PersonFormPage = () => {
  const model = usePersonFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? 'Editar pessoa' : 'Cadastrar pessoa'}
        subtitle="Informe dados pessoais, documento e dados complementares."
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando pessoa" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<PersonFormValues> name="fullName" label="Nome completo" />
            <FormTextField<PersonFormValues>
              name="documentType"
              label="Tipo de documento"
              placeholder="CPF, CNPJ, RG, PASSPORT ou OTHER"
            />
            <FormTextField<PersonFormValues> name="documentNumber" label="Documento" />
            <FormTextField<PersonFormValues> name="dateOfBirth" label="Nascimento" type="date" />
            <FormTextField<PersonFormValues>
              name="gender"
              label="Gênero"
              placeholder="male, female, other ou prefer_not_to_say"
            />
            <FormTextField<PersonFormValues>
              name="maritalStatus"
              label="Estado civil"
              placeholder="single, married, divorced, widowed ou other"
            />
            <FormTextField<PersonFormValues>
              name="nationality"
              label="Nacionalidade"
              placeholder="brazilian, foreign ou other"
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
                label: model.isEdit ? 'Salvar alterações' : 'Cadastrar',
                onClick: () => {
                  void model.form.handleSubmit(model.onSubmit)();
                },
                loading: model.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};

export default PersonFormPage;
