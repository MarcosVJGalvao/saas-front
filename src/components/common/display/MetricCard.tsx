import type { ReactNode } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

export type MetricCardVariationType = 'positive' | 'neutral';

interface MetricCardProps {
  loading: boolean;
  title: string;
  value: string;
  icon: ReactNode;
  iconColor: string;
  variationText: string;
  variationType: MetricCardVariationType;
}

export const MetricCard = ({
  loading,
  title,
  value,
  icon,
  iconColor,
  variationText,
  variationType,
}: MetricCardProps) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        maxWidth: theme.spacing(35),
        p: theme.spacing(2),
        borderRadius: theme.spacing(1.5),
        bgcolor: theme.palette.background.paper,
        boxShadow: `0 ${theme.spacing(0.5)} ${theme.spacing(2)} ${theme.palette.divider}`,
        minHeight: theme.spacing(16),
      }}
    >
      <Stack spacing={theme.spacing(1)}>
        <Stack direction="row" spacing={theme.spacing(1)} sx={{ alignItems: 'center' }}>
          {loading ? (
            <Skeleton variant="rounded" width={44} height={44} />
          ) : (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: theme.spacing(1.5),
                bgcolor: alpha(iconColor, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconColor,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Stack>

        {loading ? (
          <Skeleton width="45%" height={34} />
        ) : (
          <Typography variant="h4">{value}</Typography>
        )}

        {loading ? (
          <Skeleton width="60%" />
        ) : (
          <Stack direction="row" spacing={theme.spacing(1)} sx={{ alignItems: 'center' }}>
            {variationType === 'positive' ? (
              <ArrowUpwardIcon fontSize="small" color="success" />
            ) : (
              <RemoveIcon fontSize="small" color="action" />
            )}
            <Typography
              variant="caption"
              color={
                variationType === 'positive'
                  ? theme.palette.success.main
                  : theme.palette.text.secondary
              }
            >
              {variationText}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
