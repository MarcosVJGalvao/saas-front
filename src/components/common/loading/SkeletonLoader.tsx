import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { spacingScale } from '../../../theme/spacing';

interface SkeletonLoaderProps {
  lines?: number;
  height?: number;
  sx?: SxProps<Theme>;
}

export const SkeletonLoader = ({ lines = 3, height = 24, sx }: SkeletonLoaderProps) => (
  <Box sx={{ width: '100%', ...sx }} aria-label="Carregando conteúdo">
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton key={index} variant="rounded" height={height} sx={{ mb: spacingScale.xxs }} />
    ))}
  </Box>
);
