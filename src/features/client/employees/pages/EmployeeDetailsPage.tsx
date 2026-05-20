import { useParams } from 'react-router-dom';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useEmployeeDetailsPage } from '@features/client/employees/hooks/useEmployeeDetailsPage';

const EmployeeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const employeeDetailsPage = useEmployeeDetailsPage(id ?? '');

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes do funcionário"
        subtitle="Consulte dados profissionais e vínculo pessoal."
        actionLabel="Voltar"
        onAction={() => {
          employeeDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        viewState={employeeDetailsPage.viewState}
        data={employeeDetailsPage.data}
        errorMessage={employeeDetailsPage.errorMessage}
        onRetry={() => {
          void employeeDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default EmployeeDetailsPage;
