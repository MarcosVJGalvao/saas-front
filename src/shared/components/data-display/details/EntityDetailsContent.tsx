import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { DetailsSection } from '@shared/components/data-display/details/DetailsSection';
import { InfoItem } from '@shared/components/data-display/details/InfoItem';
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

type EntityDetailsContentProps = {
  viewState: EntityDetailsViewState;
  content: EntityDetailsPageContent;
  errorMessage?: string | undefined;
  headerData: DetailsHeaderData | null;
  tabs: ReadonlyArray<DetailTab>;
  footerActions?: ReadonlyArray<DetailsFooterAction> | undefined;
  selectedTabId: string;
  onSelectTab: (tabId: string) => void;
  onRetry?: (() => void) | undefined;
};

const renderSectionContent = (section: DetailSection) =>
  section.content ?? (
    <AppBox
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
    </AppBox>
  );

const EmptyMessage = ({ title, message }: { title: string; message: string }) => (
  <AppStack spacing={0.5}>
    <AppText variant="h6">{title}</AppText>
    <AppText color="text.secondary">{message}</AppText>
  </AppStack>
);

export const EntityDetailsContent = ({
  viewState,
  content,
  errorMessage,
  headerData,
  tabs,
  footerActions = [],
  selectedTabId,
  onSelectTab,
  onRetry,
}: EntityDetailsContentProps) => {
  if (viewState === 'loading') {
    return <AppCircularProgress ariaLabel={content.loadingLabel} />;
  }

  if (viewState === 'error') {
    return (
      <AppStack spacing={1.5}>
        <AppAlert severity="error">{errorMessage ?? content.errorFallback}</AppAlert>
        {onRetry ? <AppButton onClick={onRetry}>Tentar novamente</AppButton> : null}
      </AppStack>
    );
  }

  if (viewState === 'unauthorized') {
    return <EmptyMessage title={content.unauthorizedTitle} message={content.unauthorizedMessage} />;
  }

  if (viewState === 'forbidden') {
    return <EmptyMessage title={content.forbiddenTitle} message={content.forbiddenMessage} />;
  }

  if (viewState === 'empty' || headerData === null) {
    return <EmptyMessage title={content.emptyTitle} message={content.emptyMessage} />;
  }

  const selectedTab = tabs.find((tab) => tab.id === selectedTabId) ?? tabs[0];

  if (!selectedTab) {
    return <EmptyMessage title={content.emptyTitle} message={content.emptyMessage} />;
  }

  return (
    <AppStack spacing={2}>
      <AppStack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        {tabs.map((tab) => (
          <AppButton
            key={tab.id}
            variant={tab.id === selectedTab.id ? 'contained' : 'outlined'}
            startIcon={tab.icon}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.label}
          </AppButton>
        ))}
      </AppStack>

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
