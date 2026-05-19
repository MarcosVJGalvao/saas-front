import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { DetailsSection } from '@shared/components/data-display/details/DetailsSection';
import { InfoItem } from '@shared/components/data-display/details/InfoItem';
import type { ReactNode } from 'react';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
import type {
  DetailSection,
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '@shared/types/detailsDrawer';
import type {
  EntityDetailsPageContent,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';

const DEFAULT_CONTENT = sharedComponentsI18n.entityDetails;

type EntityDetailsContentProps = {
  viewState: EntityDetailsViewState;
  content?: Partial<EntityDetailsPageContent>;
  errorMessage?: string | undefined;
  headerData: DetailsHeaderData | null;
  tabs: ReadonlyArray<DetailTab>;
  footerActions?: ReadonlyArray<DetailsFooterAction> | undefined;
  selectedTabId: string;
  onSelectTab: (tabId: string) => void;
  onRetry?: (() => void) | undefined;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
};

const renderSectionContent = (section: DetailSection) =>
  section.content ?? (
    <AppBox
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
        columnGap: 3,
        rowGap: 2.5,
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
    </AppBox>
  );

const EmptyMessage = ({ title, message }: { title: string; message: string }) => (
  <AppStack spacing={0.5} sx={{ py: 4, alignItems: 'center', textAlign: 'center' }}>
    <AppText variant="h6">{title}</AppText>
    <AppText color="text.secondary">{message}</AppText>
  </AppStack>
);

export const EntityDetailsContent = ({
  viewState,
  content = {},
  errorMessage,
  headerData,
  tabs,
  footerActions = [],
  selectedTabId,
  onSelectTab,
  onRetry,
  loadingFallback,
  errorFallback,
}: EntityDetailsContentProps) => {
  const c = { ...DEFAULT_CONTENT, ...content } as typeof DEFAULT_CONTENT;

  if (viewState === 'loading') {
    return <>{loadingFallback ?? <AppCircularProgress ariaLabel={c.loadingLabel} />}</>;
  }

  if (viewState === 'error') {
    return (
      <>
        {errorFallback ?? (
          <AppStack spacing={1.5}>
            <AppAlert severity="error">{errorMessage ?? c.errorFallback}</AppAlert>
            {onRetry ? <AppButton onClick={onRetry}>Tentar novamente</AppButton> : null}
          </AppStack>
        )}
      </>
    );
  }

  if (viewState === 'unauthorized') {
    return <EmptyMessage title={c.unauthorizedTitle} message={c.unauthorizedMessage} />;
  }

  if (viewState === 'forbidden') {
    return <EmptyMessage title={c.forbiddenTitle} message={c.forbiddenMessage} />;
  }

  if (viewState === 'empty' || headerData === null) {
    return <EmptyMessage title={c.emptyTitle} message={c.emptyMessage} />;
  }

  const selectedTab = tabs.find((tab) => tab.id === selectedTabId) ?? tabs[0];

  if (!selectedTab) {
    return <EmptyMessage title={c.emptyTitle} message={c.emptyMessage} />;
  }

  const tabIndex = tabs.findIndex((tab) => tab.id === selectedTabId);

  return (
    <AppStack spacing={2.5}>
      {tabs.length > 1 ? (
        <Tabs
          value={tabIndex === -1 ? 0 : tabIndex}
          onChange={(_, idx: number) => {
            const tab = tabs[idx];
            if (tab) onSelectTab(tab.id);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
              px: 2.5,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} icon={tab.icon ?? undefined} iconPosition="start" />
          ))}
        </Tabs>
      ) : null}

      <AppStack spacing={1.5}>
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
      </AppStack>

      {footerActions.length > 0 ? (
        <AppStack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          {footerActions.map((action) => (
            <AppButton
              key={action.id}
              variant="outlined"
              color={action.color ?? 'primary'}
              startIcon={action.icon}
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label}
            </AppButton>
          ))}
        </AppStack>
      ) : null}
    </AppStack>
  );
};
