import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { gradeCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogDetailsPage } from '@features/client/academic/hooks/useAcademicCatalogDetailsPage';

const GradeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const gradeDetailsPage = useAcademicCatalogDetailsPage({
    id: id ?? '',
    service: gradeCatalogConfig.service,
    backPath: gradeCatalogConfig.routeBase,
    errorMessageFallback: gradeCatalogConfig.errorMessageFallback,
  });

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={gradeCatalogConfig.detailsTitle}
        subtitle={gradeCatalogConfig.detailsSubtitle}
        actionLabel="Voltar"
        onAction={gradeDetailsPage.onBack}
      />
      <EntityDetailsPage
        viewState={gradeDetailsPage.viewState}
        data={gradeDetailsPage.data}
        errorMessage={gradeDetailsPage.errorMessage}
        onRetry={() => {
          void gradeDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default GradeDetailsPage;
