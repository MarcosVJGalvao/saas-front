import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';
import { spacingScale } from '../../../theme/spacing';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onApply: () => void;
  onClear: () => void;
}

export const FilterDrawer = ({ open, onClose, children, onApply, onClear }: FilterDrawerProps) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
    <Stack spacing={spacingScale.sm} sx={{ p: spacingScale.md, width: { xs: 280, sm: 360 } }}>
      {children}
      <Stack direction="row" spacing={spacingScale.xxs} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClear}>Limpar</Button>
        <Button variant="contained" onClick={onApply}>
          Aplicar
        </Button>
      </Stack>
    </Stack>
  </Drawer>
);
