import { useMemo, useState } from 'react';
import { AppAvatar } from '@shared/components/data-display/AppAvatar';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EntityDetailsContent } from '@shared/components/data-display/details/EntityDetailsContent';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { PageHeader } from '@shared/components/layout/PageHeader';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';

type EntityDetailsPageProps = {
  viewState: EntityDetailsViewState;
  content: EntityDetailsPageContent;
  data: EntityDetailsPageData;
  errorMessage?: string | undefined;
  onBack?: (() => void) | undefined;
  onRetry?: (() => void) | undefined;
};

const resolveInitialTab = (data: EntityDetailsPageData): string => data.tabs[0]?.id ?? '';

export const EntityDetailsPage = ({
  viewState,
  content,
  data,
  errorMessage,
  onBack,
  onRetry,
}: EntityDetailsPageProps) => {
  const [selectedTabId, setSelectedTabId] = useState(resolveInitialTab(data));
  const effectiveSelectedTabId = useMemo(
    () => selectedTabId || resolveInitialTab(data),
    [data, selectedTabId],
  );

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={content.pageTitle}
        subtitle={content.pageSubtitle}
        actions={
          onBack ? (
            <AppButton variant="outlined" onClick={onBack}>
              Voltar
            </AppButton>
          ) : null
        }
      />

      {data.headerData ? (
        <AppCard>
          <AppStack direction="row" spacing={1.5} sx={{ alignItems: 'center', p: 2 }}>
            <AppAvatar src={data.headerData.avatarUrl ?? undefined}>
              {data.headerData.avatarFallback ?? data.headerData.title.slice(0, 1).toUpperCase()}
            </AppAvatar>
            <AppStack spacing={0.25} sx={{ minWidth: 0 }}>
              <AppStack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <AppText variant="h6" noWrap>
                  {data.headerData.title}
                </AppText>
                {data.headerData.statusLabel ? (
                  <LocalizedStatusBadge
                    label={data.headerData.statusLabel}
                    tone={data.headerData.statusColor === 'success' ? 'active' : 'neutral'}
                  />
                ) : null}
              </AppStack>
              <AppText color="text.secondary" noWrap>
                {data.headerData.subtitle ?? '-'}
              </AppText>
            </AppStack>
          </AppStack>
        </AppCard>
      ) : null}

      <EntityDetailsContent
        viewState={viewState}
        content={content}
        errorMessage={errorMessage}
        headerData={data.headerData}
        tabs={data.tabs}
        footerActions={data.footerActions}
        selectedTabId={effectiveSelectedTabId}
        onSelectTab={setSelectedTabId}
        onRetry={onRetry}
      />
    </AppStack>
  );
};
