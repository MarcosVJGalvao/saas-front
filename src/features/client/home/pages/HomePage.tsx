import { useClientHomePageViewModel } from '@features/client/home/hooks/useClientHomePageViewModel';
import { ClientHomeContent } from '@features/client/home/components/ClientHomeContent';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppBox } from '@shared/components/layout/AppBox';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { radiusTokens } from '@theme/tokens/radius';
import { spacingScale } from '@theme/tokens/spacing';

const ClientHomePage = () => {
  const model = useClientHomePageViewModel();

  return (
    <AppBox>
      <PageHeader title={model.messages.title} subtitle={model.messages.success} />
      <AppPaper sx={{ p: spacingScale.lg, borderRadius: radiusTokens.lg }}>
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
