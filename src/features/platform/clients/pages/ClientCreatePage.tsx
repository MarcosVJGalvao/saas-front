import { Controller } from 'react-hook-form';
import { activeInactiveStatusLabels, documentTypeLabels } from '@shared/i18n/pt-BR/enums';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { useClientCreatePage } from '@features/platform/clients/hooks/useClientCreatePage';

const ClientCreatePage = () => {
  const clientCreatePage = useClientCreatePage();
  const documentTypeOptions = Object.entries(documentTypeLabels).map(([value, label]) => ({
    value,
    label,
  }));
  const clientStatusOptions = Object.entries(activeInactiveStatusLabels).map(([value, label]) => ({
    value,
    label,
  }));
  const documentType = clientCreatePage.form.watch('documentType');

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo cliente"
        subtitle="Cadastre os dados principais antes de seguir com contratos e assinatura."
        actionLabel="Voltar"
        onAction={() => {
          clientCreatePage.onBack();
        }}
      />
      {clientCreatePage.errorMessage ? (
        <AppAlert severity="error">{clientCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={clientCreatePage.form}
          onSubmit={clientCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <Controller
            name="tradeName"
            control={clientCreatePage.form.control}
            render={({ field }) => <AppTextField {...field} label="Nome fantasia" />}
          />
          <Controller
            name="legalName"
            control={clientCreatePage.form.control}
            render={({ field }) => <AppTextField {...field} label="Razão social" />}
          />
          <Controller
            name="documentType"
            control={clientCreatePage.form.control}
            render={({ field }) => (
              <AppSelect {...field} label="Tipo de documento" options={documentTypeOptions} />
            )}
          />
          <Controller
            name="documentNumber"
            control={clientCreatePage.form.control}
            render={({ field }) => (
              <AppTextField
                label="Documento"
                value={documentType === 'CPF' ? maskCpf(field.value) : maskCnpj(field.value)}
                onChange={(event) => field.onChange(onlyDigits(event.target.value))}
              />
            )}
          />
          <Controller
            name="email"
            control={clientCreatePage.form.control}
            render={({ field }) => <AppTextField {...field} label="E-mail" />}
          />
          <Controller
            name="phone"
            control={clientCreatePage.form.control}
            render={({ field }) => (
              <AppTextField
                label="Telefone"
                value={maskPhone(field.value)}
                onChange={(event) => field.onChange(onlyDigits(event.target.value))}
              />
            )}
          />
          <Controller
            name="status"
            control={clientCreatePage.form.control}
            render={({ field }) => (
              <AppSelect {...field} label="Status" options={clientStatusOptions} />
            )}
          />
          <Controller
            name="website"
            control={clientCreatePage.form.control}
            render={({ field }) => <AppTextField {...field} label="Website" />}
          />
          <Controller
            name="industry"
            control={clientCreatePage.form.control}
            render={({ field }) => <AppTextField {...field} label="Segmento" />}
          />
          <Controller
            name="notes"
            control={clientCreatePage.form.control}
            render={({ field }) => (
              <AppTextField {...field} label="Observações" multiline minRows={3} />
            )}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: () => {
                clientCreatePage.onBack();
              },
              disabled: clientCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar cliente',
              onClick: () => {
                void clientCreatePage.form.handleSubmit(clientCreatePage.onSubmit)();
              },
              loading: clientCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientCreatePage;
