import { DetailsInfoCards } from '@shared/components/data-display/DetailsInfoCards';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppText } from '@shared/components/data-display/AppText';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { useSubscriptionDetailsPageViewModel } from '@features/subscriptions/hooks/useSubscriptionDetailsPageViewModel';

const SubscriptionDetailsPage = () => {
  const model = useSubscriptionDetailsPageViewModel();
  const viewByState = {
    loading: <AppCircularProgress ariaLabel="Carregando detalhes da assinatura" />,
    error: (
      <AppErrorState
        message={model.errorMessage ?? 'Erro ao carregar assinatura.'}
        onRetry={() => void model.refresh()}
      />
    ),
    empty: <AppText>{model.emptyMessage}</AppText>,
    ready: <DetailsInfoCards pageTitle="Detalhes da Assinatura" sections={model.sections} />,
  };

  return viewByState[model.viewState];
};

export default SubscriptionDetailsPage;
