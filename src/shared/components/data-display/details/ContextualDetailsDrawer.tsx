import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, type Theme, useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import type { DetailTab, DetailsFooterAction, DetailsHeaderData } from '@models/detailsDrawer';
import { EntityDetailsDrawer } from '@shared/components/data-display/details/EntityDetailsDrawer';

const containerSx = {
  position: 'relative',
  minHeight: '100%',
  isolation: 'isolate',
};

type ContextualDetailsDrawerProps = {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  headerData?: DetailsHeaderData | null;
  tabs?: ReadonlyArray<DetailTab>;
  emptyTitle?: string;
  emptyMessage?: string;
  footerActions?: ReadonlyArray<DetailsFooterAction>;
  children: ReactNode;
};

export const ContextualDetailsDrawer = ({
  open,
  loading = false,
  error,
  onClose,
  headerData,
  tabs,
  emptyTitle,
  emptyMessage,
  footerActions,
  children,
}: ContextualDetailsDrawerProps) => {
  const theme = useTheme();

  return (
    <Stack spacing={2.5} sx={containerSx}>
      <Box onClick={onClose} data-open={open} sx={buildOverlaySx(theme)} />
      {children}
      <EntityDetailsDrawer
        open={open}
        loading={loading}
        error={error}
        onClose={onClose}
        headerData={headerData}
        tabs={tabs}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        footerActions={footerActions}
      />
    </Stack>
  );
};

const buildOverlaySx = (theme: Theme) => ({
  position: 'absolute',
  top: { xs: -16, lg: -24 },
  right: -32,
  bottom: { xs: -16, lg: -24 },
  left: { xs: -16, lg: -24 },
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.black, 0.5)
      : `linear-gradient(270deg, ${alpha(theme.palette.common.black, 0.24)} 0%, ${alpha(theme.palette.common.black, 0.18)} 30%, ${alpha(theme.palette.common.black, 0.12)} 100%)`,
  backdropFilter: 'saturate(90%) blur(0.5px)',
  zIndex: 2,
  transition: 'opacity 180ms ease',
  '&[data-open="false"]': {
    opacity: 0,
    pointerEvents: 'none',
  },
});
