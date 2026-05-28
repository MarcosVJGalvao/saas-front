import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SystemUpdateOutlinedIcon from '@mui/icons-material/SystemUpdateOutlined';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useNetworkStatus } from '@app/pwa/hooks/useNetworkStatus';
import { usePwaInstall } from '@app/pwa/hooks/usePwaInstall';
import { usePwaUpdate } from '@app/pwa/hooks/usePwaUpdate';
import { responsive } from '@app/theme/utils/responsive';
import { AppSnackbar } from '@shared/components/feedback/AppSnackbar';
import { AppButton } from '@shared/components/inputs/AppButton';
import { connectivityMessages, pwaMessages } from '@shared/i18n/pt-BR/messages';

const shouldShowInstallPromptForPath = (pathname: string): boolean =>
  pathname === '/' || pathname === '/platform/login' || pathname === '/client/login';

const ActionRow = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
    {children}
  </Box>
);

const SnackbarBody = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode | undefined;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: alpha('#fff', 0.15),
          color: 'common.white',
          flexShrink: 0,
        }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          component="span"
          sx={{ fontWeight: 700, lineHeight: 1.2, color: 'common.white' }}
        >
          {title}
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: '0.875rem', lineHeight: 1.45, color: alpha('#fff', 0.85) }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
    {children}
  </Box>
);

export const PwaFeedbackBridge = () => {
  const location = useLocation();
  const { isOnline, lastConnectionChangeAt } = useNetworkStatus();
  const {
    dismissInstallPrompt,
    installApp,
    isInstallAvailable,
    isInstalled,
    isIosInstallAvailable,
  } = usePwaInstall();
  const { applyUpdate, isUpdateAvailable, isUpdating, updateErrorMessage } = usePwaUpdate();

  const canShowInstallPrompt = useMemo(
    () =>
      shouldShowInstallPromptForPath(location.pathname) &&
      !isInstalled &&
      (isInstallAvailable || isIosInstallAvailable),
    [isInstallAvailable, isInstalled, isIosInstallAvailable, location.pathname],
  );

  const installDescription = isIosInstallAvailable
    ? pwaMessages.installIosDescription
    : pwaMessages.installDescription;

  return (
    <>
      <AppSnackbar
        open={!isOnline}
        severity="warning"
        autoHideDuration={null}
        onClose={() => undefined}
        hideCloseAction
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarBody
          title={connectivityMessages.offlineTitle}
          description={connectivityMessages.offlineDescription}
        />
      </AppSnackbar>

      {isOnline && lastConnectionChangeAt !== null ? (
        <ReconnectFeedbackSnackbar key={lastConnectionChangeAt} />
      ) : null}

      <AppSnackbar
        open={canShowInstallPrompt}
        severity="info"
        autoHideDuration={null}
        onClose={dismissInstallPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <SnackbarBody title={pwaMessages.installTitle} description={installDescription}>
          <ActionRow>
            {!isIosInstallAvailable ? (
              <AppButton
                size="small"
                startIcon={<DownloadOutlinedIcon />}
                onClick={() => void installApp()}
              >
                {pwaMessages.installAction}
              </AppButton>
            ) : null}
            <AppButton size="small" variant="text" onClick={dismissInstallPrompt}>
              {pwaMessages.dismissAction}
            </AppButton>
          </ActionRow>
        </SnackbarBody>
      </AppSnackbar>

      <AppSnackbar
        open={isUpdateAvailable}
        severity="info"
        autoHideDuration={null}
        onClose={() => undefined}
        hideCloseAction
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        snackbarSx={{
          right: responsive({ xs: '16px', sm: '24px' }),
          left: responsive({ xs: '16px', sm: 'auto' }),
          bottom: responsive({ xs: '16px', sm: '24px' }),
          width: 'auto',
          maxWidth: responsive({ xs: '360px', sm: '400px' }),
        }}
        alertSx={(theme) => ({
          borderRadius: 99,
          px: 1.5,
          py: 1,
          alignItems: 'center',
          boxShadow: theme.shadows[8],
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
          border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
          '& .MuiAlert-icon': { display: 'none' },
          '& .MuiAlert-message': { p: 0, width: '100%' },
          '& .MuiAlert-action': { display: 'none' },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.15),
              color: 'common.white',
              flexShrink: 0,
            }}
          >
            <SystemUpdateOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>

          <Typography
            component="span"
            sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'common.white', flex: 1 }}
          >
            {pwaMessages.updateTitle}
          </Typography>

          <AppButton
            size="small"
            onClick={() => void applyUpdate()}
            disabled={isUpdating}
            sx={(theme) => ({
              minWidth: 0,
              px: 1.75,
              py: 0.5,
              borderRadius: 99,
              bgcolor: theme.palette.common.white,
              color: theme.palette.primary.dark,
              fontWeight: 700,
              fontSize: '0.8125rem',
              boxShadow: 'none',
              flexShrink: 0,
              '&:hover': { bgcolor: theme.palette.grey[100] },
              '&.Mui-disabled': { bgcolor: alpha(theme.palette.common.white, 0.4) },
            })}
          >
            {isUpdating ? (
              <CircularProgress size={14} sx={{ color: 'inherit' }} />
            ) : (
              pwaMessages.updateAction
            )}
          </AppButton>

          {updateErrorMessage ? (
            <Typography
              component="span"
              sx={{ fontSize: '0.75rem', color: alpha('#fff', 0.85), mt: 0.5 }}
            >
              {updateErrorMessage}
            </Typography>
          ) : null}
        </Box>
      </AppSnackbar>
    </>
  );
};

const ReconnectFeedbackSnackbar = () => {
  const [open, setOpen] = useState(true);

  return (
    <AppSnackbar open={open} severity="success" onClose={() => setOpen(false)}>
      <SnackbarBody
        title={connectivityMessages.onlineTitle}
        description={connectivityMessages.onlineDescription}
      />
    </AppSnackbar>
  );
};
