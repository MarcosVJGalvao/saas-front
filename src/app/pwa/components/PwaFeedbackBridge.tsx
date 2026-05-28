import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SystemUpdateOutlinedIcon from '@mui/icons-material/SystemUpdateOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
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
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      flexWrap: 'wrap',
      mt: 1,
    }}
  >
    {children}
  </Box>
);

const SnackbarBody = ({
  title,
  description,
  emphasis,
  children,
}: {
  title: string;
  description: string;
  emphasis?: string | undefined;
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
        {emphasis ? (
          <Chip
            size="small"
            label={emphasis}
            sx={{
              alignSelf: 'flex-start',
              bgcolor: alpha('#fff', 0.15),
              color: 'common.white',
              fontWeight: 600,
              border: `1px solid ${alpha('#fff', 0.3)}`,
              '& .MuiChip-label': { color: 'common.white' },
            }}
          />
        ) : null}
      </Box>
    </Box>
    {children ? <Divider sx={{ borderColor: alpha('#fff', 0.2) }} /> : null}
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
          width: responsive({ xs: 'auto', sm: 'auto' }),
          right: responsive({ xs: '16px', sm: '24px' }),
          left: responsive({ xs: '16px', sm: 'auto' }),
          bottom: responsive({ xs: '16px', sm: '24px' }),
          maxWidth: responsive({ xs: '360px', sm: 'none' }),
        }}
        alertSx={(theme) => ({
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          px: 2,
          py: 1.5,
          alignItems: 'stretch',
          boxShadow: theme.shadows[8],
          color: theme.palette.common.white,
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(
                  135deg,
                  ${alpha(theme.palette.background.paper, 0.98)} 0%,
                  ${alpha(theme.palette.primary.dark, 0.82)} 100%
                )`
              : `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
          border: `1px solid ${alpha(
            theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.common.white,
            theme.palette.mode === 'dark' ? 0.18 : 0.12,
          )}`,
          '& .MuiAlert-icon': { display: 'none' },
          '& .MuiAlert-message': { width: '100%', p: 0 },
          '& .MuiAlert-action': { display: 'none' },
        })}
      >
        <SnackbarBody
          title={pwaMessages.updateTitle}
          description={pwaMessages.updateDescription}
          emphasis={pwaMessages.updateHint}
        >
          <ActionRow>
            <AppButton
              size="small"
              startIcon={<SystemUpdateOutlinedIcon />}
              onClick={() => void applyUpdate()}
              disabled={isUpdating}
              aria-label={isUpdating ? pwaMessages.updatingAction : pwaMessages.updateAction}
              sx={(theme) => ({
                minWidth: 0,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: theme.palette.common.white,
                color: theme.palette.info.dark,
                fontWeight: 700,
                boxShadow: theme.shadows[2],
                border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                '&:hover': { bgcolor: theme.palette.grey[100] },
              })}
            >
              {isUpdating ? pwaMessages.updatingAction : pwaMessages.updateAction}
            </AppButton>
          </ActionRow>
          {updateErrorMessage ? (
            <Typography component="span" sx={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
              {updateErrorMessage}
            </Typography>
          ) : null}
        </SnackbarBody>
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
