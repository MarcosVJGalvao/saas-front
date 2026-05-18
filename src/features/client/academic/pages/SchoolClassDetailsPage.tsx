import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useSchoolClassDetailsPageViewModel } from '@features/client/academic/hooks/useSchoolClassDetailsPageViewModel';

const SchoolClassDetailsPage = () => {
  const model = useSchoolClassDetailsPageViewModel();

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

export default SchoolClassDetailsPage;
