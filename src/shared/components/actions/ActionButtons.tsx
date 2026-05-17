import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';
import { spacingScale } from '@theme/spacing';

export type ActionButtonType = 'back' | 'cancel' | 'next' | 'confirm' | 'custom';
export interface ActionButtonConfig {
  type: ActionButtonType;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  sx?: SxProps<Theme>;
}
interface ActionButtonsProps {
  actions: ActionButtonConfig[];
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  fullWidthOnMobile?: boolean;
}
interface ActionButtonPreset {
  label: string;
  color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant: 'text' | 'outlined' | 'contained';
}
const ACTION_BUTTON_PRESETS: Record<Exclude<ActionButtonType, 'custom'>, ActionButtonPreset> = {
  back: { label: 'Voltar', color: 'secondary', variant: 'outlined' },
  cancel: { label: 'Cancelar', color: 'error', variant: 'text' },
  next: { label: 'Avançar', color: 'primary', variant: 'contained' },
  confirm: { label: 'Confirmar', color: 'success', variant: 'contained' },
};
const getPreset = (type: ActionButtonType): ActionButtonPreset =>
  type === 'custom'
    ? { label: 'Ação', color: 'primary', variant: 'contained' }
    : ACTION_BUTTON_PRESETS[type];
export const ActionButtons = ({
  actions,
  direction = 'row',
  align = 'flex-end',
  fullWidthOnMobile = true,
}: ActionButtonsProps) => (
  <Stack
    direction={{ xs: 'column', sm: direction }}
    spacing={spacingScale.sm}
    sx={{ justifyContent: align, alignItems: { xs: 'stretch', sm: 'center' }, width: '100%' }}
  >
    {actions.map((action, index) => {
      const preset = getPreset(action.type);
      const buttonLabel = action.label ?? preset.label;
      const widthSx: SxProps<Theme> = {
        width: fullWidthOnMobile ? { xs: '100%', sm: 'auto' } : 'auto',
      };
      return (
        <Box key={`${action.type}-${index}`} sx={action.sx}>
          <Button
            onClick={action.onClick}
            disabled={action.disabled ?? action.loading}
            variant={action.variant ?? preset.variant}
            size={action.size}
            color={action.color ?? preset.color}
            startIcon={action.startIcon}
            endIcon={action.endIcon}
            sx={widthSx}
          >
            {buttonLabel}
          </Button>
        </Box>
      );
    })}
  </Stack>
);
