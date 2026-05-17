import { SubscriptionDetailsContent } from '@features/platform/subscriptions/components/SubscriptionDetailsContent';
import { useSubscriptionDetailsPageViewModel } from '@features/platform/subscriptions/hooks/useSubscriptionDetailsPageViewModel';

const SubscriptionDetailsPage = () => {
  const model = useSubscriptionDetailsPageViewModel();

  return (
    <SubscriptionDetailsContent
      viewState={model.viewState}
      errorMessage={model.errorMessage}
      emptyMessage={model.emptyMessage}
      sections={model.sections}
      onRetry={() => void model.refresh()}
    />
  );
};

export default SubscriptionDetailsPage;
