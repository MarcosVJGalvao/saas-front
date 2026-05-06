import { useNavigate } from 'react-router-dom';
import { EntityDetailsDrawer } from '../../../components/common/details/EntityDetailsDrawer';
import { useClientDetailsPageViewModel } from '../../../hooks/clients/useClientDetailsPageViewModel';

const ClientDetailsPage = () => {
  const navigate = useNavigate();
  const model = useClientDetailsPageViewModel();

  return (
    <EntityDetailsDrawer
      open
      loading={model.loading}
      error={model.errorMessage ?? null}
      onClose={() => void navigate(-1)}
      headerData={model.headerData}
      tabs={model.tabs}
      footerActions={model.footerActions}
      emptyTitle="Cliente não encontrado."
      emptyMessage="Não foi possível carregar os detalhes do cliente selecionado."
    />
  );
};

export default ClientDetailsPage;
