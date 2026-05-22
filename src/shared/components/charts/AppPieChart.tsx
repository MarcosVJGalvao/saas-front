import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export type AppPieChartItem = {
  label: string;
  value: number;
  color: string;
};

interface AppPieChartProps {
  data: AppPieChartItem[];
  loading?: boolean;
  height?: number;
  donut?: boolean;
}

export const AppPieChart = ({
  data,
  loading = false,
  height = 300,
  donut = false,
}: AppPieChartProps) => {
  const theme = useTheme();

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={height} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={donut ? '55%' : 0}
          outerRadius="75%"
        >
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
