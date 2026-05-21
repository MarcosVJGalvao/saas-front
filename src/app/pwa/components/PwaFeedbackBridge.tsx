import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import SystemUpdateOutlinedIcon from '@mui/icons-material/SystemUpdateOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useNetworkStatus } from '@app/pwa/hooks/useNetworkStatus';
import { usePwaInstall } from '@app/pwa/hooks/usePwaInstall';
import { usePwaUpdate } from '@app/pwa/hooks/usePwaUpdate';
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
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode | undefined;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
    <Typography component="span" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    <Typography component="span" sx={{ fontSize: '0.875rem' }}>
      {description}
    </Typography>
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
  const { applyUpdate, isUpdateAvailable, isUpdating } = usePwaUpdate();

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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <SnackbarBody title={pwaMessages.updateTitle} description={pwaMessages.updateDescription}>
          <ActionRow>
            <AppButton
              size="small"
              startIcon={<SystemUpdateOutlinedIcon />}
              onClick={() => void applyUpdate()}
              disabled={isUpdating}
            >
              {isUpdating ? pwaMessages.updatingAction : pwaMessages.updateAction}
            </AppButton>
          </ActionRow>
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
