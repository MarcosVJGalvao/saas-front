import { StatusChip } from '@shared/components/data-display/StatusChip';
import { alpha, useTheme } from '@mui/material/styles';

type LocalizedStatusTone = 'active' | 'neutral';

interface LocalizedStatusBadgeProps {
  label: string;
  tone: LocalizedStatusTone;
}

export const LocalizedStatusBadge = ({ label, tone }: LocalizedStatusBadgeProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <StatusChip
      label={label}
      status={tone === 'active' ? 'success' : 'default'}
      sx={{
        bgcolor:
          tone === 'active'
            ? alpha(theme.palette.success.main, isDarkMode ? 0.18 : 0.16)
            : alpha(theme.palette.text.primary, isDarkMode ? 0.08 : 0.12),
        color:
          tone === 'active'
            ? isDarkMode
              ? theme.palette.success.light
              : theme.palette.success.dark
            : theme.palette.text.secondary,
        fontWeight: 600,
        border: `1px solid ${
          tone === 'active'
            ? alpha(theme.palette.success.main, isDarkMode ? 0.2 : 0.14)
            : alpha(theme.palette.common.white, isDarkMode ? 0.08 : 0)
        }`,
        borderRadius: 1.25,
        '& .MuiChip-label': {
          px: 1.1,
        },
      }}
    />
  );
};
