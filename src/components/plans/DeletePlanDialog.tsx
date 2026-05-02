import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export const DeletePlanDialog = ({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Remover plano</DialogTitle>
    <DialogContent>Confirma a remoção?</DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancelar</Button>
      <Button color="error" onClick={onConfirm}>
        Remover
      </Button>
    </DialogActions>
  </Dialog>
);
