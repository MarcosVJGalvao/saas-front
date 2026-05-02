import Grid from '@mui/material/Grid';
import type { ReactNode } from 'react';
import { MetricCard } from '../display/MetricCard';

export interface ListMetricItem {
  key: string;
  title: string;
  value: string;
  icon: ReactNode;
  iconColor: string;
  variationText: string;
  variationType: 'positive' | 'neutral';
}

interface ListMetricsGridProps {
  loading: boolean;
  items: ReadonlyArray<ListMetricItem>;
}

export const ListMetricsGrid = ({ loading, items }: ListMetricsGridProps) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    {items.map((item) => (
      <Grid key={item.key} size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          loading={loading}
          title={item.title}
          value={item.value}
          icon={item.icon}
          iconColor={item.iconColor}
          variationText={item.variationText}
          variationType={item.variationType}
        />
      </Grid>
    ))}
  </Grid>
);
