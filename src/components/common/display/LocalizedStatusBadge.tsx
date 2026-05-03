import { StatusChip } from './StatusChip';
import { alpha, useTheme } from '@mui/material/styles';

type LocalizedStatusTone = 'active' | 'neutral';

interface LocalizedStatusBadgeProps {
  label: string;
  tone: LocalizedStatusTone;
}

export const LocalizedStatusBadge = ({ label, tone }: LocalizedStatusBadgeProps) => {
  const theme = useTheme();

  return (
    <StatusChip
      label={label}
      status={tone === 'active' ? 'success' : 'default'}
      sx={{
        bgcolor:
          tone === 'active'
            ? alpha(theme.palette.success.main, 0.16)
            : alpha(theme.palette.text.primary, 0.12),
        color: tone === 'active' ? theme.palette.success.dark : theme.palette.text.secondary,
        fontWeight: 600,
        border: 'none',
      }}
    />
  );
};
