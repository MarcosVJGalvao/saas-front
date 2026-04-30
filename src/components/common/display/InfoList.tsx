import type { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface InfoListItem {
  label: string;
  value: string;
}
interface InfoListProps {
  items: InfoListItem[];
  sx?: SxProps<Theme>;
}

export const InfoList = ({ items, sx }: InfoListProps) => (
  <Stack spacing={1} sx={sx}>
    {items.map((item) => (
      <Stack key={item.label} direction="row" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {item.label}:
        </Typography>
        <Typography variant="body2">{item.value}</Typography>
      </Stack>
    ))}
  </Stack>
);
