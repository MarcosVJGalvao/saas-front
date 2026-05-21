import { useParams } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { activeInactiveStatusLabels } from '@shared/i18n/pt-BR/enums';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientEditPage } from '@features/platform/clients/hooks/useClientEditPage';
import { maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';

const ClientEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const clientEditPage = useClientEditPage(id ?? '');
  const clientStatusOptions = Object.entries(activeInactiveStatusLabels).map(([value, label]) => ({
    value,
    label,
  }));

  if (!id) {
    return null;
  }

  if (clientEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando cliente" />;
  }

  const documentDigits = onlyDigits(clientEditPage.client?.documentNumber ?? '');
  const readonlyDocument =
    clientEditPage.client?.documentType === 'CPF' || documentDigits.length === 11
      ? maskCpf(documentDigits)
      : maskCnpj(documentDigits);

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar cliente"
        subtitle="Atualize os dados cadastrais mantendo tenant e assinatura vinculados."
        actionLabel="Voltar"
        onAction={() => {
          clientEditPage.onBack();
        }}
      />
      {clientEditPage.errorMessage ? (
        <AppAlert severity="error">{clientEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppStack spacing={2} sx={{ mb: 2 }}>
          <AppTextField
            label="Tipo de documento"
            value={clientEditPage.client?.documentType ?? ''}
            disabled
          />
          <AppTextField label="Documento" value={readonlyDocument} disabled />
        </AppStack>
        <AppForm
          form={clientEditPage.form}
          onSubmit={clientEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <Controller
            name="tradeName"
            control={clientEditPage.form.control}
            render={({ field }) => <AppTextField {...field} label="Nome fantasia" />}
          />
          <Controller
            name="legalName"
            control={clientEditPage.form.control}
            render={({ field }) => <AppTextField {...field} label="Razão social" />}
          />
          <Controller
            name="email"
            control={clientEditPage.form.control}
            render={({ field }) => <AppTextField {...field} label="E-mail" />}
          />
          <Controller
            name="phone"
            control={clientEditPage.form.control}
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
            control={clientEditPage.form.control}
            render={({ field }) => (
              <AppSelect {...field} label="Status" options={clientStatusOptions} />
            )}
          />
          <Controller
            name="website"
            control={clientEditPage.form.control}
            render={({ field }) => <AppTextField {...field} label="Website" />}
          />
          <Controller
            name="industry"
            control={clientEditPage.form.control}
            render={({ field }) => <AppTextField {...field} label="Segmento" />}
          />
          <Controller
            name="notes"
            control={clientEditPage.form.control}
            render={({ field }) => (
              <AppTextField {...field} label="Observações" multiline minRows={3} />
            )}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: () => {
                clientEditPage.onBack();
              },
              disabled: clientEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void clientEditPage.form.handleSubmit(clientEditPage.onSubmit)();
              },
              loading: clientEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientEditPage;
