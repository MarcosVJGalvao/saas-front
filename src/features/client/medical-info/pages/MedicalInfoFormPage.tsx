import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useMedicalInfoFormPageViewModel } from '@features/client/medical-info/hooks/useMedicalInfoFormPageViewModel';
import type { MedicalInfoFormValues } from '@features/client/medical-info/schemas/medicalInfoFormSchema';

const MedicalInfoFormPage = () => {
  const model = useMedicalInfoFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? 'Editar informações médicas' : 'Cadastrar informações médicas'}
        subtitle="Informe dados médicos opcionais e contato de emergência."
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando informações médicas" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<MedicalInfoFormValues>
              name="personId"
              label="Pessoa"
              placeholder="ID da pessoa"
            />
            <FormTextField<MedicalInfoFormValues>
              name="bloodType"
              label="Tipo sanguíneo"
              placeholder="O+, A-, AB+"
            />
            <FormTextField<MedicalInfoFormValues> name="allergies" label="Alergias" />
            <FormTextField<MedicalInfoFormValues> name="chronicDiseases" label="Doenças crônicas" />
            <FormTextField<MedicalInfoFormValues> name="medications" label="Medicamentos" />
            <FormTextField<MedicalInfoFormValues>
              name="emergencyContactName"
              label="Contato de emergência"
            />
            <FormTextField<MedicalInfoFormValues>
              name="emergencyContactPhone"
              label="Telefone de emergência"
            />
            <FormTextField<MedicalInfoFormValues> name="notes" label="Observações" />
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

export default MedicalInfoFormPage;
