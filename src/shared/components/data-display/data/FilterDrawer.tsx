import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';
import { spacingScale } from '@theme/spacing';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onApply: () => void;
  onClear: () => void;
}

export const FilterDrawer = ({ open, onClose, children, onApply, onClear }: FilterDrawerProps) => (
  <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ transition: { timeout: 220 } }}>
    <Stack spacing={spacingScale.sm} sx={{ p: spacingScale.md, width: { xs: 280, sm: 360 } }}>
      {children}
      <Stack direction="row" spacing={spacingScale.xxs} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClear}>{sharedComponentsI18n.filters.filterClear}</Button>
        <Button variant="contained" onClick={onApply}>
          {sharedComponentsI18n.filters.filterApply}
        </Button>
      </Stack>
    </Stack>
  </Drawer>
);
