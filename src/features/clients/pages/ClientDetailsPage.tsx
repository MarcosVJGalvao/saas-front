import { EntityDetailsDrawer } from '@shared/components/data-display/details/EntityDetailsDrawer';
import { useClientDetailsPageViewModel } from '@features/clients/hooks/useClientDetailsPageViewModel';

const ClientDetailsPage = () => {
  const model = useClientDetailsPageViewModel();

  return (
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
  );
};

export default ClientDetailsPage;
