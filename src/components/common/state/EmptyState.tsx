import type { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
}
export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  sx,
}: EmptyStateProps) => (
  <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 6, ...sx }}>
    {icon}
    <Typography variant="h5">{title}</Typography>
    {description !== undefined ? (
      <Typography color="text.secondary">{description}</Typography>
    ) : null}
    {actionLabel !== undefined && onAction !== undefined ? (
      <Button onClick={onAction} variant="contained">
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);
