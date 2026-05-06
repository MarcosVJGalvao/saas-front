import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type InfoItemProps = {
  label: string;
  value?: ReactNode;
};

export const InfoItem = ({ label, value }: InfoItemProps) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>
      {value ?? '-'}
    </Typography>
  </Box>
);
