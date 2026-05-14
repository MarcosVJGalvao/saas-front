import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { AppButton } from '@shared/components/inputs/AppButton';

interface BaseModalProps {
  open: boolean;
  title: string;
  content: ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  onConfirm?: () => void;
  onClose: () => void;
}

export const BaseModal = ({
  open,
  title,
  content,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  fullWidth = true,
  maxWidth = 'sm',
  onConfirm,
  onClose,
}: BaseModalProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      transitionDuration={{
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <AppButton onClick={onClose} disabled={loading}>
          {cancelText}
        </AppButton>
        {onConfirm !== undefined ? (
          <AppButton onClick={onConfirm} variant="contained" disabled={loading}>
            {confirmText}
          </AppButton>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};
