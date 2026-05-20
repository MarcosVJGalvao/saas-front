import { Controller } from 'react-hook-form';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useLegalGuardianCreatePage } from '@features/client/students/hooks/useLegalGuardianCreatePage';

const LegalGuardianCreatePage = () => {
  const legalGuardianCreatePage = useLegalGuardianCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo responsável"
        subtitle="Cadastre dados principais do responsável legal."
        actionLabel="Voltar"
        onAction={legalGuardianCreatePage.onBack}
      />
      {legalGuardianCreatePage.errorMessage ? (
        <AppAlert severity="error">{legalGuardianCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={legalGuardianCreatePage.form}
          onSubmit={legalGuardianCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <Controller
            name="fullName"
            control={legalGuardianCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppTextField
                {...field}
                label="Nome completo"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="documentNumber"
            control={legalGuardianCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppTextField
                {...field}
                label="Documento"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="documentType"
            control={legalGuardianCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppSelect
                {...field}
                label="Tipo de documento"
                options={[
                  { value: 'CPF', label: 'CPF' },
                  { value: 'CNPJ', label: 'CNPJ' },
                  { value: 'RG', label: 'RG' },
                  { value: 'PASSPORT', label: 'Passaporte' },
                  { value: 'OTHER', label: 'Outro' },
                ]}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="relationshipType"
            control={legalGuardianCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppSelect
                {...field}
                label="Vínculo"
                options={[
                  { value: 'mother', label: 'Mãe' },
                  { value: 'father', label: 'Pai' },
                  { value: 'legal_guardian', label: 'Responsável legal' },
                  { value: 'grandparent', label: 'Avô/avó' },
                  { value: 'other', label: 'Outro' },
                ]}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: legalGuardianCreatePage.onBack,
              disabled: legalGuardianCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void legalGuardianCreatePage.form.handleSubmit(legalGuardianCreatePage.onSubmit)();
              },
              loading: legalGuardianCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default LegalGuardianCreatePage;
