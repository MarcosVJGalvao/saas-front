import type { ReactNode } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppText } from '@shared/components/data-display/AppText';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';

interface AppHomeMetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}

export const AppHomeMetricCard = ({ label, value, helper, icon }: AppHomeMetricCardProps) => {
  const theme = useTheme();

  return (
    <AppCard
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <AppStack spacing={1.5}>
        <AppBox
          sx={{
            width: 44,
            height: 44,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2.5,
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
          }}
        >
          {icon}
        </AppBox>
        <AppText variant="body2" color="text.secondary">
          {label}
        </AppText>
        <AppText variant="h5" sx={{ fontWeight: 800 }}>
          {value}
        </AppText>
        <AppText variant="body2" color="text.secondary">
          {helper}
        </AppText>
      </AppStack>
    </AppCard>
  );
};
