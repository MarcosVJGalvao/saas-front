import { Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useLegalGuardianEditPage } from '@features/client/students/hooks/useLegalGuardianEditPage';

const LegalGuardianEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const legalGuardianEditPage = useLegalGuardianEditPage(id ?? '');

  if (!id) return null;

  if (legalGuardianEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando responsável" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar responsável"
        subtitle="Atualize os dados principais do responsável legal."
        actionLabel="Voltar"
        onAction={legalGuardianEditPage.onBack}
      />
      {legalGuardianEditPage.errorMessage ? (
        <AppAlert severity="error">{legalGuardianEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppTextField
        label="Nome completo"
        value={legalGuardianEditPage.entity?.person?.fullName ?? ''}
        disabled
      />
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={legalGuardianEditPage.form}
          onSubmit={legalGuardianEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <Controller
            name="documentNumber"
            control={legalGuardianEditPage.form.control}
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
            control={legalGuardianEditPage.form.control}
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
            control={legalGuardianEditPage.form.control}
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
              onClick: legalGuardianEditPage.onBack,
              disabled: legalGuardianEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void legalGuardianEditPage.form.handleSubmit(legalGuardianEditPage.onSubmit)();
              },
              loading: legalGuardianEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default LegalGuardianEditPage;
