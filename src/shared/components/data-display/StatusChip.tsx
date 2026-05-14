import type { SxProps, Theme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

interface StatusChipProps {
  label: string;
  status: 'default' | 'success' | 'warning' | 'error' | 'info';
  sx?: SxProps<Theme>;
}

export const StatusChip = ({ label, status, sx }: StatusChipProps) =>
  status === 'default' ? (
    <Chip label={label} variant="outlined" sx={sx} />
  ) : (
    <Chip label={label} color={status} variant="filled" sx={sx} />
  );
