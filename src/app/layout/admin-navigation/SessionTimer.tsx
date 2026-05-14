import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSessionTimer } from '@shared/hooks/useSessionTimer';

interface SessionTimerProps {
  expiresIn: string;
  accessToken?: string;
  compact?: boolean;
  onExpired?: () => void;
}

const toneColor: Record<'success' | 'warning' | 'error', string> = {
  success: 'success.main',
  warning: 'warning.main',
  error: 'error.main',
};

export const SessionTimer = ({
  expiresIn,
  accessToken,
  compact = false,
  onExpired,
}: SessionTimerProps) => {
  const timer = useSessionTimer(expiresIn, compact, onExpired, accessToken);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AccessTimeOutlinedIcon fontSize="small" color="action" />
      {!compact ? <Typography variant="body2">Sessão expira em:</Typography> : null}
      <Typography variant="body2" sx={{ color: toneColor[timer.tone], fontWeight: 600 }}>
        {timer.label}
      </Typography>
    </Box>
  );
};

export const sessionTimerSx: SxProps<Theme> = { minWidth: 160 };
