import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { spacingScale } from '../../../theme/spacing';

type DetailsSectionProps = {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

export const DetailsSection = ({ title, icon, action, children }: DetailsSectionProps) => (
  <Card
    variant="outlined"
    sx={(theme) => ({
      borderColor: alpha(theme.palette.divider, 0.55),
      borderRadius: 2,
      boxShadow: 0,
      p: { xs: spacingScale.sm, sm: 2.5 },
      '&:hover': {
        borderColor: alpha(theme.palette.divider, 0.75),
        boxShadow: theme.shadows[1],
      },
    })}
  >
    <Stack spacing={spacingScale.sm}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {icon ? <Box sx={{ color: 'primary.main', display: 'inline-flex' }}>{icon}</Box> : null}
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Stack>
        {action ?? <ChevronRightRounded color="action" fontSize="small" sx={{ opacity: 0 }} />}
      </Stack>
      {children}
    </Stack>
  </Card>
);
