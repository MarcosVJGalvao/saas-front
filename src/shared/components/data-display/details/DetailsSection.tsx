import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { CardProps } from '@mui/material/Card';
import type { ReactNode } from 'react';
import { spacingScale } from '@theme/spacing';

type DetailsSectionProps = Pick<CardProps, 'sx' | 'className'> & {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

export const DetailsSection = ({ title, icon, action, children, sx, className }: DetailsSectionProps) => (
  <Card
    variant="outlined"
    className={className}
    sx={[
      (theme) => ({
        borderColor: alpha(theme.palette.divider, 0.55),
        borderRadius: 2,
        boxShadow: 0,
        p: { xs: spacingScale.sm, sm: 2.5 },
        transition: theme.transitions.create(['border-color', 'box-shadow'], {
          duration: theme.transitions.duration.shortest,
        }),
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.24),
          boxShadow: theme.shadows[1],
        },
      }),
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    <Stack spacing={spacingScale.sm}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {icon ? <Box sx={{ color: 'primary.main', display: 'inline-flex' }}>{icon}</Box> : null}
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Stack>
        {action ? <Box>{action}</Box> : null}
      </Stack>
      {children}
    </Stack>
  </Card>
);
