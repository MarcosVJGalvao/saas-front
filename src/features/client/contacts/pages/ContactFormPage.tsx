import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useContactFormPageViewModel } from '@features/client/contacts/hooks/useContactFormPageViewModel';
import type { ContactFormValues } from '@features/client/contacts/schemas/contactFormSchema';

const ContactFormPage = () => {
  const model = useContactFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? 'Editar contato' : 'Cadastrar contato'}
        subtitle="Informe tipo, valor e vínculo do contato."
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando contato" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<ContactFormValues>
              name="personId"
              label="Pessoa"
              placeholder="ID da pessoa"
            />
            <FormTextField<ContactFormValues>
              name="type"
              label="Tipo"
              placeholder="email, phone, whatsapp, linkedin ou other"
            />
            <FormTextField<ContactFormValues> name="value" label="Contato" />
            <FormTextField<ContactFormValues> name="label" label="Rótulo" />
            <FormTextField<ContactFormValues>
              name="isPrimary"
              label="Principal"
              placeholder="true para contato principal"
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

export default ContactFormPage;
