import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlanForm } from '../../../components/plans/PlanForm';
import { usePlanEditPage } from '../../../hooks/plans/usePlanEditPage';

const PlanEditPage = () => {
  const view = usePlanEditPage();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Editar Plano</Typography>
      <PlanForm
        value={view.value}
        onChange={view.setValue}
        loading={view.loading}
        onSubmit={() => void view.handleSubmit()}
      />
    </Stack>
  );
};
export default PlanEditPage;
