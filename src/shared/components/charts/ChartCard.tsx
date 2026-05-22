import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { layoutSpacing, radiusScale } from '@theme/spacing';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const ChartCard = ({ title, subtitle, children, action }: ChartCardProps) => (
  <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: radiusScale.md }}>
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
        {action ?? null}
      </Stack>
      {children}
    </Stack>
  </AppPaper>
);
