import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type InfoItemProps = {
  label: string;
  value?: ReactNode | undefined;
  noWrap?: boolean | undefined;
};

export const InfoItem = ({ label, value, noWrap = false }: InfoItemProps) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: 'block', mb: 0.5, fontWeight: 500, lineHeight: 1.35 }}
    >
      {label}
    </Typography>
    <Typography
      component="div"
      variant="body2"
      color="text.primary"
      noWrap={noWrap}
      title={typeof value === 'string' ? value : undefined}
      sx={{ fontWeight: 700, lineHeight: 1.45, overflowWrap: noWrap ? 'normal' : 'anywhere' }}
    >
      {value ?? '-'}
    </Typography>
  </Box>
);
