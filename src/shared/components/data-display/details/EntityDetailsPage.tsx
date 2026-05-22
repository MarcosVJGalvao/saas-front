import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AppAvatar } from '@shared/components/data-display/AppAvatar';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EntityDetailsContent } from '@shared/components/data-display/details/EntityDetailsContent';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';

type EntityDetailsPageProps = {
  viewState: EntityDetailsViewState;
  content?: EntityDetailsPageContent;
  data: EntityDetailsPageData;
  errorMessage?: string | undefined;
  /** @deprecated Mover o botão Voltar para PageHeader na page. */
  onBack?: (() => void) | undefined;
  onRetry?: (() => void) | undefined;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
};

const resolveInitialTab = (data: EntityDetailsPageData): string => data.tabs[0]?.id ?? '';

export const EntityDetailsPage = ({
  viewState,
  content,
  data,
  errorMessage,
  onRetry,
  loadingFallback,
  errorFallback,
}: EntityDetailsPageProps) => {
  const theme = useTheme();
  const [selectedTabId, setSelectedTabId] = useState(resolveInitialTab(data));
  const effectiveSelectedTabId = useMemo(
    () => selectedTabId || resolveInitialTab(data),
    [data, selectedTabId],
  );

  const { headerData } = data;

  return (
    <AppStack spacing={3}>
      {headerData ? (
        <Box
          sx={{
            borderRadius: 2.5,
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[1],
            px: { xs: 2.5, sm: 3 },
            py: { xs: 2, sm: 2.5 },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 2, sm: 2.5 },
          }}
        >
          <AppAvatar
            src={headerData.avatarUrl ?? undefined}
            sx={{
              width: { xs: 52, sm: 60 },
              height: { xs: 52, sm: 60 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 700,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              flexShrink: 0,
              boxShadow: theme.shadows[2],
            }}
          >
            {headerData.avatarFallback ?? headerData.title.slice(0, 1).toUpperCase()}
          </AppAvatar>

          <Box sx={{ minWidth: 0 }}>
            <AppStack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap', mb: headerData.subtitle ? 0.25 : 0 }}
            >
              <AppText
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.25, fontSize: { xs: '1rem', sm: '1.125rem' } }}
              >
                {headerData.title}
              </AppText>
              {headerData.statusLabel ? (
                <Chip
                  label={headerData.statusLabel}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 22,
                    bgcolor:
                      headerData.statusColor === 'success'
                        ? alpha(theme.palette.success.main, 0.12)
                        : alpha(theme.palette.text.primary, 0.08),
                    color:
                      headerData.statusColor === 'success'
                        ? theme.palette.success.dark
                        : theme.palette.text.secondary,
                    border: 'none',
                    borderRadius: 1,
                  }}
                />
              ) : null}
            </AppStack>
            {headerData.subtitle ? (
              <AppText variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                {headerData.subtitle}
              </AppText>
            ) : null}
          </Box>
        </Box>
      ) : null}

      <EntityDetailsContent
        viewState={viewState}
        content={content ?? {}}
        errorMessage={errorMessage}
        headerData={data.headerData}
        tabs={data.tabs}
        footerActions={data.footerActions}
        selectedTabId={effectiveSelectedTabId}
        onSelectTab={setSelectedTabId}
        onRetry={onRetry}
        loadingFallback={loadingFallback}
        errorFallback={errorFallback}
      />
    </AppStack>
  );
};
