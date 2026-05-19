import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
import { AppButton } from '@shared/components/inputs/AppButton';

const i18n = sharedComponentsI18n.confirmDialog;

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = i18n.confirmLabel,
  cancelLabel = i18n.cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{description}</DialogContent>
    <DialogActions>
      <AppButton onClick={onCancel}>{cancelLabel}</AppButton>
      <AppButton onClick={onConfirm} variant="contained" color="error">
        {confirmLabel}
      </AppButton>
    </DialogActions>
  </Dialog>
);
