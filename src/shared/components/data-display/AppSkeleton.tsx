import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import type { SxProps, Theme } from '@mui/material/styles';
import { spacingScale } from '@theme/spacing';

interface AppSkeletonProps {
  lines?: number;
  height?: number;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

export const AppSkeleton = ({
  lines = 3,
  height = 24,
  ariaLabel = 'Carregando conteúdo',
  sx,
}: AppSkeletonProps) => (
  <Box sx={{ width: '100%', ...sx }} aria-label={ariaLabel}>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton key={index} variant="rounded" height={height} sx={{ mb: spacingScale.xxs }} />
    ))}
  </Box>
);
