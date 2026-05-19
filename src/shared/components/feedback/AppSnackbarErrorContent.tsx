import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
import type { AppError } from '@shared/types/appError';

const i18n = sharedComponentsI18n.snackbarError;

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
          {i18n.correlationIdLabel} {error.correlationId}
        </Typography>
        <Tooltip title={i18n.copyTooltip}>
          <IconButton
            size="small"
            color="inherit"
            aria-label={i18n.copyAriaLabel}
            onClick={() => void navigator.clipboard.writeText(error.correlationId ?? '')}
          >
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Stack>
    ) : null}
  </Stack>
);
