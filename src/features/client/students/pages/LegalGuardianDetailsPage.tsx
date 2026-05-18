import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useLegalGuardianDetailsPageViewModel } from '@features/client/students/hooks/useLegalGuardianDetailsPageViewModel';

const LegalGuardianDetailsPage = () => {
  const model = useLegalGuardianDetailsPageViewModel();

  return (
    <EntityDetailsPage
      viewState={model.viewState}
      content={model.content}
      data={model.data}
      errorMessage={model.errorMessage}
      onBack={model.onBack}
      onRetry={() => {
        void model.onRetry();
      }}
    />
  );
};

export default LegalGuardianDetailsPage;
