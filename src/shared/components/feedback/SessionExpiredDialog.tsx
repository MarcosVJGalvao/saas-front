import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ActionButtons } from '@shared/components/actions/ActionButtons';

interface SessionExpiredDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SessionExpiredDialog = ({ open, onClose }: SessionExpiredDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ pb: 1.25 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <WarningAmberRoundedIcon color="warning" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Sessão expirada
        </Typography>
      </Stack>
    </DialogTitle>
    <DialogContent sx={{ pt: 0.5 }}>
      <Typography variant="body1" color="text.secondary">
        Sua sessão expirou por segurança. Faça login novamente para continuar.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <ActionButtons
        fullWidthOnMobile={false}
        actions={[{ type: 'confirm', label: 'Fazer login', onClick: onClose }]}
      />
    </DialogActions>
  </Dialog>
);
