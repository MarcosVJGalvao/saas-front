import Box from '@mui/material/Box';
import { AppText } from '@shared/components/data-display/AppText';
import type { ReactNode } from 'react';

type InfoItemProps = {
  label: string;
  value?: ReactNode | undefined;
  noWrap?: boolean | undefined;
};

export const InfoItem = ({ label, value, noWrap = false }: InfoItemProps) => (
  <Box sx={{ minWidth: 0 }}>
    <AppText
      variant="caption"
      color="text.secondary"
      sx={{
        display: 'block',
        mb: 0.5,
        fontWeight: 500,
        fontSize: '0.72rem',
        lineHeight: 1.4,
      }}
    >
      {label}
    </AppText>
    <AppText
      component="div"
      variant="body2"
      color="text.primary"
      noWrap={noWrap}
      title={typeof value === 'string' ? value : undefined}
      sx={{
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.55,
        overflowWrap: noWrap ? 'normal' : 'anywhere',
      }}
    >
      {value ?? (
        <AppText
          component="span"
          variant="body2"
          color="text.disabled"
          sx={{ fontStyle: 'italic' }}
        >
          Não informado
        </AppText>
      )}
    </AppText>
  </Box>
);
