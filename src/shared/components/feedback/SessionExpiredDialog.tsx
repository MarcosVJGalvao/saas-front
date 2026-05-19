import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
import { ActionButtons } from '@shared/components/actions/ActionButtons';

const i18n = sharedComponentsI18n.sessionExpired;

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
          {i18n.title}
        </Typography>
      </Stack>
    </DialogTitle>
    <DialogContent sx={{ pt: 0.5 }}>
      <Typography variant="body1" color="text.secondary">
        {i18n.message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <ActionButtons
        fullWidthOnMobile={false}
        actions={[{ type: 'confirm', label: i18n.loginLabel, onClick: onClose }]}
      />
    </DialogActions>
  </Dialog>
);
