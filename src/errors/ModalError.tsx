import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { AppError } from '../models/types';

interface ModalErrorProps {
  error: AppError | null;
  onClose: () => void;
}

export const ModalError = ({ error, onClose }: ModalErrorProps) => (
  <Dialog open={Boolean(error)} onClose={onClose} aria-labelledby="modal-error-title">
    <DialogTitle id="modal-error-title">Erro crítico</DialogTitle>
    <DialogContent>
      <Stack spacing={1}>
        <Typography>{error?.message}</Typography>
        {error?.messages !== undefined && error.messages.length > 1 ? (
          <List dense>
            {error.messages.map((item) => (
              <ListItem key={item} sx={{ display: 'list-item', py: 0 }}>
                <Typography variant="body2">{item}</Typography>
              </ListItem>
            ))}
          </List>
        ) : null}
        {error?.correlationId !== undefined ? (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="body2">Codigo: {error.correlationId}</Typography>
            <Tooltip title="Copiar codigo">
              <IconButton
                size="small"
                aria-label="Copiar codigo do erro"
                onClick={() => void navigator.clipboard.writeText(error.correlationId ?? '')}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : null}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} autoFocus>
        Entendi
      </Button>
    </DialogActions>
  </Dialog>
);
