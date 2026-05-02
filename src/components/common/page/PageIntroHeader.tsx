import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { PermissionGate } from '../access/PermissionGate';

interface PageIntroHeaderProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  canShowAction?: boolean;
  actionIcon?: ReactNode;
}

export const PageIntroHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  canShowAction = true,
  actionIcon,
}: PageIntroHeaderProps) => (
  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
    <Stack>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography color="text.secondary">{subtitle}</Typography>
    </Stack>
    <PermissionGate allowed={canShowAction}>
      <Button startIcon={actionIcon} variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    </PermissionGate>
  </Stack>
);
