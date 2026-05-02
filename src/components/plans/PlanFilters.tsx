import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { PlansQueryParams } from '../../models/plans';

export const PlanFilters = ({
  value,
  onChange,
}: {
  value: PlansQueryParams;
  onChange: (patch: Partial<PlansQueryParams>) => void;
}) => (
  <Stack direction="row" spacing={1}>
    <TextField
      label="Busca"
      value={value.search ?? ''}
      onChange={(event) => onChange({ search: event.target.value, page: 1 })}
    />
    <Button onClick={() => onChange({ page: 1 })}>Aplicar</Button>
  </Stack>
);
