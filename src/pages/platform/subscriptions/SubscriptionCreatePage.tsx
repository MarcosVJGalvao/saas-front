import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SubscriptionForm } from '../../../components/subscriptions/SubscriptionForm';
import { useSubscriptionCreatePage } from '../../../hooks/subscriptions/useSubscriptionCreatePage';

const SubscriptionCreatePage = () => {
  const view = useSubscriptionCreatePage();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Nova Assinatura</Typography>
      <SubscriptionForm
        value={view.value}
        plans={view.plans}
        onChange={view.setValue}
        loading={view.loading}
        onSubmit={() => void view.handleSubmit()}
      />
    </Stack>
  );
};
export default SubscriptionCreatePage;
