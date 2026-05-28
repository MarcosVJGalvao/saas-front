import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';

const i18n = sharedComponentsI18n.sessionExpired;

interface SessionExpiredDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SessionExpiredDialog = ({ open, onClose }: SessionExpiredDialogProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.12)} 0%, ${alpha(theme.palette.warning.light, 0.06)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
          px: 3,
          pt: 3.5,
          pb: 2.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.warning.main, 0.14),
            border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.warning.dark,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
          {i18n.title}
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Stack spacing={3}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', lineHeight: 1.65 }}
          >
            {i18n.message}
          </Typography>
          <Button variant="contained" fullWidth onClick={onClose} size="large">
            {i18n.loginLabel}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
