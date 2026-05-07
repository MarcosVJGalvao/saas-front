import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import type {
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '../../../models/detailsDrawer';
import { EntityDetailsDrawer } from './EntityDetailsDrawer';

const containerSx = {
  position: 'relative',
  minHeight: '100%',
  isolation: 'isolate',
} as const;

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
      <Box onClick={onClose} data-open={open} sx={buildOverlaySx(theme.palette.mode)} />
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

const buildOverlaySx = (mode: 'light' | 'dark') => ({
  position: 'absolute',
  top: { xs: -16, lg: -24 },
  right: -32,
  bottom: { xs: -16, lg: -24 },
  left: { xs: -16, lg: -24 },
  background:
    mode === 'dark'
      ? alpha('#000000', 0.5)
      : `linear-gradient(270deg, ${alpha('#000000', 0.24)} 0%, ${alpha('#000000', 0.18)} 30%, ${alpha('#000000', 0.12)} 100%)`,
  backdropFilter: 'saturate(90%) blur(0.5px)',
  zIndex: 2,
  transition: 'opacity 180ms ease',
  '&[data-open="false"]': {
    opacity: 0,
    pointerEvents: 'none',
  },
});
