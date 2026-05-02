import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlanForm } from '../../../components/plans/PlanForm';
import { usePlanCreatePage } from '../../../hooks/plans/usePlanCreatePage';

const PlanCreatePage = () => {
  const view = usePlanCreatePage();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Novo Plano</Typography>
      <PlanForm
        value={view.value}
        onChange={view.setValue}
        loading={view.loading}
        onSubmit={() => void view.handleSubmit()}
      />
    </Stack>
  );
};
export default PlanCreatePage;
