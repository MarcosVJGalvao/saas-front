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
      color="text.disabled"
      sx={{
        display: 'block',
        mb: 0.375,
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: 1.35,
      }}
    >
      {label}
    </Typography>
    <Typography
      component="div"
      variant="body2"
      color="text.primary"
      noWrap={noWrap}
      title={typeof value === 'string' ? value : undefined}
      sx={{
        fontWeight: 500,
        fontSize: '0.9rem',
        lineHeight: 1.5,
        overflowWrap: noWrap ? 'normal' : 'anywhere',
      }}
    >
      {value ?? (
        <Typography
          component="span"
          variant="body2"
          color="text.disabled"
          sx={{ fontStyle: 'italic' }}
        >
          Não informado
        </Typography>
      )}
    </Typography>
  </Box>
);
