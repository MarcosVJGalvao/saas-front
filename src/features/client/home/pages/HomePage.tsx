import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientHomePage } from '@features/client/home/hooks/useClientHomePage';
import { radiusTokens } from '@theme/tokens/radius';
import { spacingScale } from '@theme/tokens/spacing';

const ClientHomePage = () => {
  const clientHomePage = useClientHomePage();

  const pageContent = clientHomePage.loading ? (
    <AppCircularProgress ariaLabel="Carregando dados do cliente" />
  ) : clientHomePage.errorMessage ? (
    <AppAlert severity="warning" action={undefined}>
      {clientHomePage.errorMessage}
    </AppAlert>
  ) : !clientHomePage.profile ? (
    <AppText>{clientHomePage.messages.empty}</AppText>
  ) : (
    <AppStack spacing={spacingScale.xs}>
      <AppText>Email: {clientHomePage.profile.email}</AppText>
      <AppText>Tenant: {clientHomePage.profile.tenantId}</AppText>
      <AppText>Status: {clientHomePage.profile.status}</AppText>
      <AppText>Usuário: {clientHomePage.profile.id}</AppText>
    </AppStack>
  );

  return (
    <AppBox>
      <PageHeader
        title={clientHomePage.messages.title}
        subtitle={clientHomePage.messages.subtitle}
      />
      <AppPaper sx={{ p: spacingScale.lg, borderRadius: radiusTokens.lg }}>{pageContent}</AppPaper>
    </AppBox>
  );
};

export default ClientHomePage;
