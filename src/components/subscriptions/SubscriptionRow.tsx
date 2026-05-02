import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { subscriptionStatusLabelByValue } from '../../models/subscriptionStatusLabels';
import type { Subscription } from '../../models/subscriptions';

const statusColorByValue: Record<Subscription['status'], 'success' | 'error' | 'warning'> = {
  active: 'success',
  canceled: 'error',
  past_due: 'warning',
  trialing: 'warning',
  blocked: 'error',
};
const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

interface SubscriptionRowProps {
  row: Subscription;
  onView: (id: string, tenantId: string) => void;
  onEdit: (id: string, tenantId: string) => void;
  onHistory: (id: string, tenantId: string) => void;
  onCancel: (id: string, tenantId: string) => void;
  onDelete: (id: string, tenantId: string) => void;
}

export const SubscriptionRowActions = ({
  row,
  onView,
  onEdit,
  onHistory,
  onCancel,
  onDelete,
}: SubscriptionRowProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onView(row.id, row.tenantId);
          }}
        >
          Ver detalhes
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onEdit(row.id, row.tenantId);
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onHistory(row.id, row.tenantId);
          }}
        >
          Histórico
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onCancel(row.id, row.tenantId);
          }}
        >
          Cancelar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onDelete(row.id, row.tenantId);
          }}
        >
          Remover
        </MenuItem>
      </Menu>
    </>
  );
};

export const SubscriptionTenantCell = ({ row }: { row: Subscription }) => {
  const theme = useTheme();
  const tenantName = row.tenant?.name ?? row.tenantId;
  const avatarPalette = [
    theme.palette.secondary.main,
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];
  const avatarIndex = tenantName.length % avatarPalette.length;
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: avatarPalette[avatarIndex], width: 40, height: 40, fontSize: '1rem' }}>
        {getInitials(tenantName)}
      </Avatar>
      <Typography variant="body2">{tenantName}</Typography>
    </Stack>
  );
};

export const SubscriptionStatusCell = ({ row }: { row: Subscription }) => (
  <Chip
    size="small"
    color={statusColorByValue[row.status]}
    label={`• ${subscriptionStatusLabelByValue[row.status]}`}
    variant="filled"
  />
);
