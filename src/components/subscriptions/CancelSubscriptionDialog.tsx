import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export const CancelSubscriptionDialog = ({
  open,
  onCancel,
  onConfirmImmediate,
  onConfirmPeriodEnd,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirmImmediate: () => void;
  onConfirmPeriodEnd: () => void;
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Cancelar assinatura</DialogTitle>
    <DialogContent>Escolha como cancelar.</DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Fechar</Button>
      <Button onClick={onConfirmPeriodEnd}>Fim do ciclo</Button>
      <Button color="error" onClick={onConfirmImmediate}>
        Imediato
      </Button>
    </DialogActions>
  </Dialog>
);
