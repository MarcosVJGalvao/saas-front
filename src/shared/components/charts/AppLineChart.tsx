import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type AppLineChartLine = {
  key: string;
  label: string;
  color: string;
};

interface AppLineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  lines: AppLineChartLine[];
  loading?: boolean;
  height?: number;
}

export const AppLineChart = ({
  data,
  xKey,
  lines,
  loading = false,
  height = 300,
}: AppLineChartProps) => {
  const theme = useTheme();

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={height} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
        <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
          }}
        />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
