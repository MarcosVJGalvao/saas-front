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
import { useMemo, useState } from 'react';
import type {
  DetailSection,
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '../../../models/detailsDrawer';
import { layoutSpacing, spacingScale } from '../../../theme/spacing';
import { LocalizedStatusBadge } from '../display/LocalizedStatusBadge';
import { DetailsSection as SectionCard } from './DetailsSection';
import { InfoItem } from './InfoItem';

type EntityDetailsDrawerProps = {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  headerData?: DetailsHeaderData | null;
  tabs?: ReadonlyArray<DetailTab>;
  emptyTitle?: string;
  emptyMessage?: string;
  footerActions?: ReadonlyArray<DetailsFooterAction>;
};

type HeaderProps = {
  loading: boolean;
  headerData?: DetailsHeaderData | null;
  onClose: () => void;
};

const HeaderIdentity = ({ headerData }: { headerData?: DetailsHeaderData | null }) => (
  <>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
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
    <Typography variant="body2" color="text.secondary">
      {headerData?.subtitle ?? '-'}
    </Typography>
  </>
);

const DrawerHeader = ({ loading, headerData, onClose }: HeaderProps) => (
  <Box sx={{ p: layoutSpacing.cardPadding, borderBottom: 1, borderColor: 'divider' }}>
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
        {loading ? (
          <Skeleton variant="circular" width={56} height={56} />
        ) : (
          <Avatar
            src={headerData?.avatarUrl ?? undefined}
            sx={{ width: { xs: 44, md: 56 }, height: { xs: 44, md: 56 } }}
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
      <IconButton aria-label="Fechar detalhes" onClick={onClose}>
        <CloseRounded />
      </IconButton>
    </Stack>
  </Box>
);

type ContentProps = {
  loading: boolean;
  error?: string | null;
  headerData?: DetailsHeaderData | null;
  selectedTab?: DetailTab;
  emptyTitle: string;
  emptyMessage: string;
};

const renderSectionContent = (section: DetailSection) =>
  section.content ?? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: spacingScale.sm,
      }}
    >
      {(section.items ?? []).map((item) => (
        <InfoItem key={`${section.id}-${item.label}`} label={item.label} value={item.value} />
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
        <SectionCard
          key={section.id}
          title={section.title}
          icon={section.icon}
          action={section.action}
        >
          {renderSectionContent(section)}
        </SectionCard>
      ))}
    </Stack>
  );
};

const DrawerFooter = ({ footerActions }: { footerActions: ReadonlyArray<DetailsFooterAction> }) => (
  <Box
    sx={{
      p: layoutSpacing.cardPadding,
      borderTop: 1,
      borderColor: 'divider',
      display: 'flex',
      gap: spacingScale.sm,
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
      onClose={onClose}
      aria-labelledby="entity-details-title"
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100vw', sm: 420, md: 440, lg: 460 },
            maxWidth: '100vw',
            bgcolor: 'background.paper',
            borderTopLeftRadius: { xs: 0, sm: 2 },
            borderBottomLeftRadius: { xs: 0, sm: 2 },
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DrawerHeader loading={loading} headerData={headerData} onClose={onClose} />

        <Tabs
          value={effectiveTabId}
          onChange={(_event, value: string) => setTabId(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: { xs: 1.5, sm: 2 },
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': {
              justifyContent: 'flex-start',
              gap: { xs: 0.25, sm: 0.5 },
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
              sx={{
                minWidth: 0,
                px: { xs: 0.5, sm: 0.75 },
                alignItems: 'center',
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
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
