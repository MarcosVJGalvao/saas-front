import type { ReactNode } from 'react';
import { useClientHomePageViewModel } from '@features/client-auth/hooks/useClientHomePageViewModel';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import type { ClientMeResponse } from '@features/client-auth/services/types';
import { radiusTokens } from '@theme/tokens/radius';
import { spacingScale } from '@theme/tokens/spacing';

type ClientHomeContentState = 'loading' | 'error' | 'empty' | 'profile';

interface ClientHomeContentProps {
  loading: boolean;
  errorMessage: string;
  profile: ClientMeResponse | null;
}

const resolveClientHomeContentState = ({
  loading,
  errorMessage,
  profile,
}: ClientHomeContentProps): ClientHomeContentState => {
  const states: ReadonlyArray<{ state: ClientHomeContentState; active: boolean }> = [
    { state: 'loading', active: loading },
    { state: 'error', active: errorMessage.length > 0 },
    { state: 'empty', active: profile === null },
  ];
  return states.find((item) => item.active)?.state ?? 'profile';
};

const ClientHomeContent = ({ loading, errorMessage, profile }: ClientHomeContentProps) => {
  const contentState = resolveClientHomeContentState({ loading, errorMessage, profile });
  const contentByState: Record<ClientHomeContentState, ReactNode> = {
    loading: <AppCircularProgress size={24} />,
    error: (
      <AppStack spacing={spacingScale.xs}>
        <AppAlert severity="warning">{errorMessage}</AppAlert>
      </AppStack>
    ),
    empty: null,
    profile: profile ? (
      <AppStack spacing={spacingScale.xs}>
        <AppText>Email: {profile.email}</AppText>
        <AppText>Tenant: {profile.tenantId}</AppText>
        <AppText>Status: {profile.status}</AppText>
        <AppText>User ID: {profile.id}</AppText>
      </AppStack>
    ) : null,
  };
  return contentByState[contentState];
};

const ClientHomePage = () => {
  const model = useClientHomePageViewModel();

  return (
    <AppBox sx={{ p: spacingScale.md }}>
      <AppPaper sx={{ p: spacingScale.lg, borderRadius: radiusTokens.lg }}>
        <AppText
          sx={{
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {model.messages.title}
        </AppText>
        <AppText variant="body1" sx={{ color: 'text.secondary', mb: spacingScale.md }}>
          {model.messages.success}
        </AppText>

        <ClientHomeContent
          loading={model.loading}
          errorMessage={model.errorMessage}
          profile={model.profile}
        />
      </AppPaper>
    </AppBox>
  );
};

export default ClientHomePage;
