import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { subjectCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogDetailsPage } from '@features/client/academic/hooks/useAcademicCatalogDetailsPage';

const SubjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const subjectDetailsPage = useAcademicCatalogDetailsPage({
    id: id ?? '',
    service: subjectCatalogConfig.service,
    backPath: subjectCatalogConfig.routeBase,
    errorMessageFallback: subjectCatalogConfig.errorMessageFallback,
  });

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={subjectCatalogConfig.detailsTitle}
        subtitle={subjectCatalogConfig.detailsSubtitle}
        actionLabel="Voltar"
        onAction={subjectDetailsPage.onBack}
      />
      <EntityDetailsPage
        viewState={subjectDetailsPage.viewState}
        data={subjectDetailsPage.data}
        errorMessage={subjectDetailsPage.errorMessage}
        onRetry={() => {
          void subjectDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default SubjectDetailsPage;
