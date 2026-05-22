import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type AppBarChartBar = {
  key: string;
  label: string;
  color: string;
};

interface AppBarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  bars: AppBarChartBar[];
  loading?: boolean;
  height?: number;
  horizontal?: boolean;
  tickFormatter?: (value: unknown) => string;
}

export const AppBarChart = ({
  data,
  xKey,
  bars,
  loading = false,
  height = 300,
  horizontal = false,
  tickFormatter,
}: AppBarChartProps) => {
  const theme = useTheme();

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={height} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              {...(tickFormatter ? { tickFormatter } : {})}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              width={100}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
            <YAxis
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              {...(tickFormatter ? { tickFormatter } : {})}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
          }}
          {...(tickFormatter ? { formatter: (value: unknown) => tickFormatter(value) } : {})}
        />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
