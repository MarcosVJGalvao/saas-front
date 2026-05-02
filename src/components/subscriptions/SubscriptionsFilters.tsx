import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import type { SubscriptionStatus, SubscriptionsQueryParams } from '../../models/subscriptions';
import { subscriptionStatusLabelByValue } from '../../models/subscriptionStatusLabels';
import { DateRangePicker } from '../common/form/DateRangePicker';

interface SubscriptionPlanOption {
  id: string;
  name: string;
}

interface SubscriptionsFiltersProps {
  value: SubscriptionsQueryParams;
  plans: SubscriptionPlanOption[];
  onChange: (patch: Partial<SubscriptionsQueryParams>) => void;
}

const statuses: SubscriptionStatus[] = ['active', 'trialing', 'canceled', 'past_due', 'blocked'];
const isSubscriptionStatus = (value: string): value is SubscriptionStatus =>
  value === 'active' ||
  value === 'trialing' ||
  value === 'canceled' ||
  value === 'past_due' ||
  value === 'blocked';

export const SubscriptionsFilters = ({ value, plans, onChange }: SubscriptionsFiltersProps) => {
  const theme = useTheme();
  const [periodAnchor, setPeriodAnchor] = useState<HTMLElement | null>(null);

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.background.paper,
      borderRadius: theme.spacing(1.25),
    },
  };

  const periodLabel =
    value.startDate && value.endDate
      ? `${new Date(value.startDate).toLocaleDateString('pt-BR')} - ${new Date(value.endDate).toLocaleDateString('pt-BR')}`
      : '';

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            placeholder="Buscar por cliente..."
            value={value.search ?? ''}
            onChange={(event) => onChange({ search: event.target.value, page: 1 })}
            fullWidth
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            select
            label="Status"
            value={value.status ?? ''}
            onChange={(event) => {
              const nextStatus = event.target.value;
              if (nextStatus === '') {
                onChange({ status: undefined, page: 1 });
                return;
              }
              if (isSubscriptionStatus(nextStatus)) {
                onChange({ status: nextStatus, page: 1 });
              }
            }}
            fullWidth
            sx={fieldSx}
          >
            <MenuItem value="">Todos</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {subscriptionStatusLabelByValue[status]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            select
            label="Plano"
            value={value.planId ?? ''}
            onChange={(event) => onChange({ planId: event.target.value || undefined, page: 1 })}
            fullWidth
            sx={fieldSx}
          >
            <MenuItem value="">Todos</MenuItem>
            {plans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {plan.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 8, md: 2 }}>
          <TextField
            label="Período"
            value={periodLabel}
            placeholder="01/04/2026 - 02/06/2026"
            fullWidth
            sx={fieldSx}
            onClick={(event) => setPeriodAnchor(event.currentTarget)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListOutlinedIcon fontSize="small" />}
            onClick={() =>
              onChange({
                search: '',
                status: undefined,
                planId: undefined,
                startDate: undefined,
                endDate: undefined,
                page: 1,
              })
            }
            fullWidth
            sx={{
              height: theme.spacing(7),
              minWidth: theme.spacing(16),
              borderRadius: theme.spacing(1.25),
              bgcolor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
            }}
          >
            Limpar filtros
          </Button>
        </Grid>
      </Grid>

      <Popover
        open={Boolean(periodAnchor)}
        anchorEl={periodAnchor}
        onClose={() => setPeriodAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: theme.spacing(2), minWidth: theme.spacing(72) }}>
          <DateRangePicker
            startLabel="Data inicial"
            endLabel="Data final"
            startValue={value.startDate ?? null}
            endValue={value.endDate ?? null}
            onStartChange={(startDate) => onChange({ startDate: startDate ?? undefined, page: 1 })}
            onEndChange={(endDate) => onChange({ endDate: endDate ?? undefined, page: 1 })}
          />
        </Box>
      </Popover>
    </>
  );
};
