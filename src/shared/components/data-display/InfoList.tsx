import type { SxProps, Theme } from '@mui/material/styles';
import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';

export interface InfoListItem {
  label: string;
  value: string;
}
interface InfoListProps {
  items: InfoListItem[];
  sx?: SxProps<Theme>;
}

export const InfoList = ({ items, sx }: InfoListProps) => (
  <AppStack spacing={1} sx={sx}>
    {items.map((item) => (
      <AppStack key={item.label} direction="row" spacing={1}>
        <AppText variant="body2" color="text.secondary">
          {item.label}:
        </AppText>
        <AppText variant="body2">{item.value}</AppText>
      </AppStack>
    ))}
  </AppStack>
);
