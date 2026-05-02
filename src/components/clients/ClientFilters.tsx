import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { ClientsQueryParams } from '../../models/clients';

interface ClientFiltersProps {
  value: ClientsQueryParams;
  onChange: (patch: Partial<ClientsQueryParams>) => void;
}

export const ClientFilters = ({ value, onChange }: ClientFiltersProps) => (
  <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
    <TextField
      label="Status"
      select
      value={value.status ?? ''}
      onChange={(event) => {
        const nextStatus = event.target.value;
        onChange({
          status: nextStatus === '' ? undefined : nextStatus === 'active' ? 'active' : 'inactive',
        });
      }}
      sx={{ minWidth: 160 }}
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="active">Ativo</MenuItem>
      <MenuItem value="inactive">Inativo</MenuItem>
    </TextField>

    <TextField
      label="Plano"
      value={value.plan ?? ''}
      onChange={(event) => onChange({ plan: event.target.value || undefined })}
      sx={{ minWidth: 160 }}
    />

    <TextField
      label="Período"
      value={value.startDate && value.endDate ? `${value.startDate} - ${value.endDate}` : ''}
      placeholder="01/05/2024 - 31/05/2024"
      slotProps={{ input: { startAdornment: <CalendarMonthOutlinedIcon fontSize="small" /> } }}
      sx={{ minWidth: 220 }}
      onChange={() => undefined}
    />

    <TextField
      label="Segmento"
      value={value.segment ?? ''}
      onChange={(event) => onChange({ segment: event.target.value || undefined })}
      sx={{ minWidth: 160 }}
    />

    <TextField
      label="Filtros"
      value=""
      placeholder="Configurar"
      slotProps={{ input: { startAdornment: <FilterListOutlinedIcon fontSize="small" /> } }}
      onChange={() => undefined}
      sx={{ minWidth: 140 }}
    />
  </Stack>
);
