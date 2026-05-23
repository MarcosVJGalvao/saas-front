import type { ReactNode } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { MetricCardIconTone, MetricCardVariationType } from './MetricCard';

interface SparklineMetricCardProps {
  loading: boolean;
  title: string;
  value: string;
  icon: ReactNode;
  iconTone: MetricCardIconTone;
  variationText: string;
  variationType: MetricCardVariationType;
  sparklineData: number[];
}

export const SparklineMetricCard = ({
  loading,
  title,
  value,
  icon,
  iconTone,
  variationText,
  variationType,
  sparklineData,
}: SparklineMetricCardProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const iconColor = theme.palette[iconTone].main;
  const sparkColor =
    variationType === 'positive'
      ? theme.palette.success.main
      : variationType === 'negative'
        ? theme.palette.error.main
        : theme.palette.text.secondary;

  const sparkData = sparklineData.map((dataPoint) => ({ dataPoint }));

  return (
    <Paper
      elevation={1}
      sx={{
        maxWidth: theme.spacing(35),
        p: theme.spacing(2),
        borderRadius: theme.spacing(1.5),
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, isDarkMode ? 0.9 : 1)}`,
        boxShadow: isDarkMode
          ? `0 ${theme.spacing(1)} ${theme.spacing(4)} ${alpha('#000000', 0.26)}`
          : `0 ${theme.spacing(0.5)} ${theme.spacing(2)} ${alpha('#0F172A', 0.08)}`,
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
                bgcolor: alpha(iconColor, isDarkMode ? 0.16 : 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconColor,
                border: `1px solid ${alpha(iconColor, isDarkMode ? 0.12 : 0.08)}`,
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
            ) : variationType === 'negative' ? (
              <ArrowDownwardIcon fontSize="small" color="error" />
            ) : (
              <RemoveIcon fontSize="small" color="action" />
            )}
            <Typography
              variant="caption"
              color={
                variationType === 'positive'
                  ? theme.palette.success.main
                  : variationType === 'negative'
                    ? theme.palette.error.main
                    : theme.palette.text.secondary
              }
            >
              {variationText}
            </Typography>
          </Stack>
        )}

        {!loading && sparkData.length > 0 ? (
          <Box sx={{ height: 40, mt: 0.5 }}>
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="dataPoint"
                  stroke={sparkColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  strokeOpacity={isDarkMode ? 0.92 : 1}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
};
