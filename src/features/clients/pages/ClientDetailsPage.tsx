import { EntityDetailsDrawer } from '@shared/components/data-display/details/EntityDetailsDrawer';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientDetailsPageViewModel } from '@features/clients/hooks/useClientDetailsPageViewModel';

const ClientDetailsPage = () => {
  const model = useClientDetailsPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader title="Detalhes do Cliente" />
      <EntityDetailsDrawer
        open
        loading={model.loading}
        error={model.errorMessage ?? null}
        onClose={model.onClose}
        headerData={model.headerData}
        tabs={model.tabs}
        footerActions={model.footerActions}
        emptyTitle="Cliente não encontrado."
        emptyMessage="Não foi possível carregar os detalhes do cliente selecionado."
      />
    </AppStack>
  );
};

export default ClientDetailsPage;
