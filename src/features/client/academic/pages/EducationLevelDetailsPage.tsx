import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { educationLevelCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogDetailsPage } from '@features/client/academic/hooks/useAcademicCatalogDetailsPage';

const EducationLevelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const educationLevelDetailsPage = useAcademicCatalogDetailsPage({
    id: id ?? '',
    service: educationLevelCatalogConfig.service,
    backPath: educationLevelCatalogConfig.routeBase,
    errorMessageFallback: educationLevelCatalogConfig.errorMessageFallback,
  });

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={educationLevelCatalogConfig.detailsTitle}
        subtitle={educationLevelCatalogConfig.detailsSubtitle}
        actionLabel="Voltar"
        onAction={educationLevelDetailsPage.onBack}
      />
      <EntityDetailsPage
        viewState={educationLevelDetailsPage.viewState}
        data={educationLevelDetailsPage.data}
        errorMessage={educationLevelDetailsPage.errorMessage}
        onRetry={() => {
          void educationLevelDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default EducationLevelDetailsPage;
