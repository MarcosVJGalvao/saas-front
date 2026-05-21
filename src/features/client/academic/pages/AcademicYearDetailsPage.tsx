import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicYearDetailsPage } from '@features/client/academic/hooks/useAcademicYearDetailsPage';

const AcademicYearDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const academicYearDetailsPage = useAcademicYearDetailsPage(id ?? '');

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes do ano letivo"
        subtitle="Consulte período, status, períodos acadêmicos e política de boletim."
        actionLabel="Voltar"
        onAction={() => {
          academicYearDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        viewState={academicYearDetailsPage.viewState}
        data={academicYearDetailsPage.data}
        errorMessage={academicYearDetailsPage.errorMessage}
        onRetry={() => {
          void academicYearDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default AcademicYearDetailsPage;
