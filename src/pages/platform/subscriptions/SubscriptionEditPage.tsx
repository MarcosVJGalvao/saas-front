import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SubscriptionForm } from '../../../components/subscriptions/SubscriptionForm';
import { useSubscriptionEditPage } from '../../../hooks/subscriptions/useSubscriptionEditPage';

const SubscriptionEditPage = () => {
  const view = useSubscriptionEditPage();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Editar Assinatura</Typography>
      {view.tenantId ? (
        <SubscriptionForm
          value={view.value}
          plans={view.plans}
          onChange={view.setValue}
          loading={view.loading}
          onSubmit={() => {
            void view.handleSubmit();
          }}
        />
      ) : (
        <Typography>tenantId é obrigatório.</Typography>
      )}
    </Stack>
  );
};

export default SubscriptionEditPage;
