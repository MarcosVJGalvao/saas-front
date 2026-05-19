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
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[1],
          }}
        >
          <Box
            sx={{
              height: 72,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          />

          <Box sx={{ px: { xs: 2.5, sm: 3.5 }, pb: { xs: 2.5, sm: 3 }, mt: '-40px' }}>
            <Box
              sx={{
                display: 'inline-flex',
                borderRadius: '50%',
                border: `3px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[3],
                mb: 1.5,
              }}
            >
              <AppAvatar
                src={headerData.avatarUrl ?? undefined}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              >
                {headerData.avatarFallback ?? headerData.title.slice(0, 1).toUpperCase()}
              </AppAvatar>
            </Box>

            <AppStack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ alignItems: { sm: 'center' }, flexWrap: 'wrap' }}
            >
              <AppText variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {headerData.title}
              </AppText>

              {headerData.statusLabel ? (
                <Chip
                  label={headerData.statusLabel}
                  size="small"
                  sx={{
                    alignSelf: 'flex-start',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 24,
                    bgcolor:
                      headerData.statusColor === 'success'
                        ? alpha(theme.palette.success.main, 0.14)
                        : alpha(theme.palette.text.primary, 0.1),
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
              <AppText variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
