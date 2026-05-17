import { PlanDetailsState } from '@features/platform/plans/components/PlanDetailsState';
import { usePlanDetailsPageViewModel } from '@features/platform/plans/hooks/usePlanDetailsPageViewModel';

const PlanDetailsPage = () => {
  const model = usePlanDetailsPageViewModel();

  return (
    <PlanDetailsState
      viewState={model.viewState}
      data={model.data}
      errorMessage={model.errorMessage}
      onRetry={() => void model.refresh()}
    />
  );
};

export default PlanDetailsPage;
