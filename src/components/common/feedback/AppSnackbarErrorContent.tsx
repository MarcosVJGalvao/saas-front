import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { AppError } from '../../../models/types';

interface AppSnackbarErrorContentProps {
  error: AppError;
}

export const AppSnackbarErrorContent = ({ error }: AppSnackbarErrorContentProps) => (
  <Stack direction="column" spacing={0.5}>
    <Typography variant="body2" sx={{ lineHeight: 1.3, fontSize: '0.9rem' }}>
      {error.message}
    </Typography>
    {error.messages !== undefined && error.messages.length > 1 ? (
      <List dense disablePadding>
        {error.messages.map((item) => (
          <ListItem key={item} sx={{ display: 'list-item', py: 0 }}>
            <Typography variant="caption">{item}</Typography>
          </ListItem>
        ))}
      </List>
    ) : null}
    {error.correlationId !== undefined ? (
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
          Codigo: {error.correlationId}
        </Typography>
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
);
