import ConfirmDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface DeleteClientDialogProps {
  open: boolean;
  clientName?: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteClientDialog = ({
  open,
  clientName,
  loading,
  onCancel,
  onConfirm,
}: DeleteClientDialogProps) => (
  <ConfirmDialog open={open} onClose={onCancel}>
    <DialogTitle>Excluir cliente</DialogTitle>
    <DialogContent>Confirma a exclus�o de {clientName ?? 'este cliente'}?</DialogContent>
    <DialogActions>
      <Button onClick={onCancel} disabled={loading}>
        Cancelar
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
        Excluir
      </Button>
    </DialogActions>
  </ConfirmDialog>
);
