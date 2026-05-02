import Typography from '@mui/material/Typography';
import { DetailsInfoCards } from '../../../components/common/display/DetailsInfoCards';
import { CircularLoader } from '../../../components/common/loading/CircularLoader';
import { ErrorState } from '../../../components/common/state/ErrorState';
import { useSubscriptionDetailsPageViewModel } from '../../../hooks/subscriptions/useSubscriptionDetailsPageViewModel';

const SubscriptionDetailsPage = () => {
  const model = useSubscriptionDetailsPageViewModel();
  const viewByState = {
    loading: <CircularLoader ariaLabel="Carregando detalhes da assinatura" />,
    error: (
      <ErrorState
        message={model.errorMessage ?? 'Erro ao carregar assinatura.'}
        onRetry={() => void model.refresh()}
      />
    ),
    empty: <Typography>{model.emptyMessage}</Typography>,
    ready: <DetailsInfoCards pageTitle="Detalhes da Assinatura" sections={model.sections} />,
  };

  return viewByState[model.viewState];
};

export default SubscriptionDetailsPage;
