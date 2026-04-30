import type { SxProps, Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface KeyValueGridItem {
  keyLabel: string;
  value: string;
}
interface KeyValueGridProps {
  items: KeyValueGridItem[];
  sx?: SxProps<Theme>;
}

export const KeyValueGrid = ({ items, sx }: KeyValueGridProps) => (
  <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={sx}>
    {items.map((item) => (
      <Grid key={item.keyLabel} size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="caption" color="text.secondary">
          {item.keyLabel}
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
          {item.value}
        </Typography>
      </Grid>
    ))}
  </Grid>
);
