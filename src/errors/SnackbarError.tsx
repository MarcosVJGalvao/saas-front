import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { AppError } from '../models/types';

interface SnackbarErrorProps {
  error: AppError | null;
  onClose: () => void;
}

export const SnackbarError = ({ error, onClose }: SnackbarErrorProps) => (
  <Snackbar
    open={Boolean(error)}
    autoHideDuration={5000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity="error" variant="filled" sx={{ width: '100%' }}>
      <Stack direction="column" spacing={0.5}>
        <Typography variant="body2">{error?.message}</Typography>
        {error?.messages !== undefined && error.messages.length > 1 ? (
          <List dense disablePadding>
            {error.messages.map((item) => (
              <ListItem key={item} sx={{ display: 'list-item', py: 0 }}>
                <Typography variant="caption">{item}</Typography>
              </ListItem>
            ))}
          </List>
        ) : null}
        {error?.correlationId !== undefined ? (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="caption">Codigo: {error.correlationId}</Typography>
            <Tooltip title="Copiar codigo">
              <IconButton
                size="small"
                color="inherit"
                aria-label="Copiar codigo do erro"
                onClick={() => void navigator.clipboard.writeText(error.correlationId ?? '')}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : null}
      </Stack>
    </Alert>
  </Snackbar>
);
