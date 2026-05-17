import CloseRounded from '@mui/icons-material/CloseRounded';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import type {
  DetailSection,
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '@shared/types/detailsDrawer';
import { layoutSpacing } from '@theme/spacing';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { DetailsSection } from '@shared/components/data-display/details/DetailsSection';
import { InfoItem } from '@shared/components/data-display/details/InfoItem';

type EntityDetailsDrawerProps = {
  open: boolean;
  loading?: boolean | undefined;
  error?: string | null | undefined;
  onClose: () => void;
  headerData?: DetailsHeaderData | null | undefined;
  tabs?: ReadonlyArray<DetailTab> | undefined;
  emptyTitle?: string | undefined;
  emptyMessage?: string | undefined;
  footerActions?: ReadonlyArray<DetailsFooterAction> | undefined;
};

type HeaderProps = {
  loading: boolean;
  headerData?: DetailsHeaderData | null | undefined;
  onClose: () => void;
};

const HeaderIdentity = ({ headerData }: { headerData?: DetailsHeaderData | null | undefined }) => (
  <>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
      <Typography id="entity-details-title" variant="h6" noWrap sx={{ fontWeight: 700 }}>
        {headerData?.title ?? '-'}
      </Typography>
      {headerData?.statusLabel ? (
        <LocalizedStatusBadge
          label={headerData.statusLabel}
          tone={headerData.statusColor === 'success' ? 'active' : 'neutral'}
        />
      ) : null}
    </Stack>
    <Typography variant="body2" color="text.secondary" noWrap title={headerData?.subtitle ?? '-'}>
      {headerData?.subtitle ?? '-'}
    </Typography>
  </>
);

const DrawerHeader = ({ loading, headerData, onClose }: HeaderProps) => (
  <Box
    sx={{
      p: layoutSpacing.cardPadding,
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}
  >
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
        {loading ? (
          <Skeleton variant="circular" width={48} height={48} />
        ) : (
          <Avatar
            src={headerData?.avatarUrl ?? undefined}
            sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
          >
            {headerData?.avatarFallback ?? '?'}
          </Avatar>
        )}
        <Box sx={{ minWidth: 0 }}>
          {loading ? (
            <>
              <Skeleton width={160} />
              <Skeleton width={120} />
            </>
          ) : (
            <HeaderIdentity headerData={headerData} />
          )}
        </Box>
      </Stack>
      <IconButton aria-label="Fechar detalhes" onClick={onClose} sx={{ mt: 0.25, mr: -0.5 }}>
        <CloseRounded />
      </IconButton>
    </Stack>
  </Box>
);

type ContentProps = {
  loading: boolean;
  error?: string | null | undefined;
  headerData?: DetailsHeaderData | null | undefined;
  selectedTab?: DetailTab | undefined;
  emptyTitle: string;
  emptyMessage: string;
};

const renderSectionContent = (section: DetailSection) =>
  section.content ?? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        columnGap: 3,
        rowGap: 2.25,
      }}
    >
      {(section.items ?? []).map((item) => (
        <InfoItem
          key={`${section.id}-${item.label}`}
          label={item.label}
          value={item.value}
          noWrap={item.noWrap}
        />
      ))}
    </Box>
  );

const DrawerContent = ({
  loading,
  error,
  headerData,
  selectedTab,
  emptyTitle,
  emptyMessage,
}: ContentProps) => {
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </Stack>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!headerData) {
    return (
      <Stack spacing={0.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {emptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Stack>
    );
  }

  if (!selectedTab) return null;

  return (
    <Stack spacing={1.5}>
      {selectedTab.sections.map((section) => (
        <DetailsSection
          key={section.id}
          title={section.title}
          icon={section.icon}
          action={section.action}
        >
          {renderSectionContent(section)}
        </DetailsSection>
      ))}
    </Stack>
  );
};

const DrawerFooter = ({ footerActions }: { footerActions: ReadonlyArray<DetailsFooterAction> }) => (
  <Box
    sx={{
      px: { xs: 1.25, sm: 1.5 },
      py: { xs: 0.75, sm: 1 },
      borderTop: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      columnGap: { xs: 1, sm: 1.25 },
      rowGap: 0.75,
      flexDirection: { xs: 'column', sm: 'row' },
    }}
  >
    {footerActions.map((action) => (
      <Button
        key={action.id}
        fullWidth
        variant="outlined"
        color={action.color ?? 'primary'}
        startIcon={action.icon}
        onClick={action.onClick}
        disabled={action.disabled}
        aria-label={action.label}
        sx={{
          height: { xs: 32, sm: 34 },
          borderRadius: 1.25,
          fontWeight: 600,
          textTransform: 'none',
          fontSize: 13,
        }}
      >
        {action.label}
      </Button>
    ))}
  </Box>
);

export const EntityDetailsDrawer = ({
  open,
  loading = false,
  error,
  onClose,
  headerData,
  tabs = [],
  emptyTitle = 'Nenhum item selecionado.',
  emptyMessage = 'Selecione um item na listagem para visualizar os detalhes.',
  footerActions = [],
}: EntityDetailsDrawerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabId, setTabId] = useState('');
  const effectiveTabId = tabId || tabs[0]?.id || '';
  const selectedTab = useMemo(
    () => tabs.find((tab) => tab.id === effectiveTabId) ?? tabs[0],
    [tabs, effectiveTabId],
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      variant={isMobile ? 'temporary' : 'persistent'}
      onClose={onClose}
      aria-labelledby="entity-details-title"
      hideBackdrop={!isMobile}
      ModalProps={{ disableScrollLock: true }}
      slotProps={{
        paper: {
          sx: (theme) => ({
            top: { xs: 0, sm: theme.spacing(11) },
            right: { xs: 0, sm: theme.spacing(2) },
            bottom: { xs: 0, sm: theme.spacing(3) },
            height: { xs: '100%', sm: 'auto' },
            width: { xs: '100vw', sm: 420, md: 440, lg: 460 },
            maxWidth: '100vw',
            bgcolor: 'background.paper',
            borderRadius: { xs: 0, sm: 2 },
            border: 0,
            boxShadow: theme.shadows[3],
            overflow: 'hidden',
          }),
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DrawerHeader loading={loading} headerData={headerData} onClose={onClose} />

        {loading ? (
          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, overflow: 'hidden' }}>
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rounded" height={40} width={88} />
              ))}
            </Box>
          </Box>
        ) : (
          <Tabs
            value={effectiveTabId}
            onChange={(_event, value: string) => setTabId(value)}
            variant="fullWidth"
            scrollButtons={false}
            allowScrollButtonsMobile={false}
            sx={{
              px: { xs: 2, sm: 2.5 },
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.max(tabs.length, 1)}, minmax(0, 1fr))`,
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                icon={tab.icon ?? undefined}
                iconPosition="top"
                wrapped={isMobile}
                sx={{
                  minWidth: { xs: 0, sm: 96 },
                  px: { xs: 1, sm: 1.5 },
                  flex: { xs: 1, sm: '0 0 auto' },
                  maxWidth: { xs: 'none', sm: 140 },
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 58,
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  '& .MuiSvgIcon-root': {
                    fontSize: 18,
                  },
                  '& .MuiTab-iconWrapper': {
                    mb: 0.5,
                  },
                  '& .MuiTab-wrapper': {
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  },
                }}
              />
            ))}
          </Tabs>
        )}

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 2, sm: 2.5 },
            py: 2,
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'divider',
              borderRadius: 8,
            },
          }}
        >
          <DrawerContent
            loading={loading}
            error={error}
            headerData={headerData}
            selectedTab={selectedTab}
            emptyTitle={emptyTitle}
            emptyMessage={emptyMessage}
          />
        </Box>

        <DrawerFooter footerActions={footerActions} />
      </Box>
    </Drawer>
  );
};
