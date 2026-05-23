import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppLoadingIndicator } from '@shared/components/data-display/AppLoadingIndicator';
import { AppText } from '@shared/components/data-display/AppText';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { AppHomeHero } from '@shared/components/home/AppHomeHero';
import { AppHomeMetricCard } from '@shared/components/home/AppHomeMetricCard';
import { AppQuickLinksPanel } from '@shared/components/home/AppQuickLinksPanel';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientHomePage } from '@features/client/home/hooks/useClientHomePage';
import { responsive } from '@theme/utils/responsive';

const ClientHomePage = () => {
  const clientHomePage = useClientHomePage();

  if (clientHomePage.loading) {
    return <AppLoadingIndicator aria-label="Carregando home do cliente" />;
  }

  if (clientHomePage.errorMessage) {
    return (
      <AppErrorState
        message={clientHomePage.errorMessage}
        onRetry={() => {
          void clientHomePage.onRetry();
        }}
      />
    );
  }

  if (!clientHomePage.profile) {
    return <AppText>{clientHomePage.messages.empty}</AppText>;
  }

  return (
    <AppStack spacing={3}>
      <PageHeader
        title={clientHomePage.messages.title}
        subtitle={clientHomePage.messages.subtitle}
      />

      <AppHomeHero
        eyebrow="Operação do cliente"
        title={`Bom trabalho, ${clientHomePage.profile.name}.`}
        description="Seu ponto de partida reúne o tenant ativo, os atalhos mais úteis da rotina e os blocos que ajudam a manter a operação organizada."
        badgeLabel={clientHomePage.profile.tenant.name}
        aside={
          <AppCard
            sx={{
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <AppStack spacing={1.25}>
              <ApartmentOutlinedIcon color="primary" />
              <AppText variant="subtitle1" sx={{ fontWeight: 700 }}>
                Contexto do tenant
              </AppText>
              <AppText variant="body2" color="text.secondary">
                Perfil atual: {clientHomePage.profile.client.role}. Status da conta:{' '}
                {clientHomePage.profile.status}.
              </AppText>
            </AppStack>
          </AppCard>
        }
      />

      <AppBox
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: responsive({
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          }),
        }}
      >
        {clientHomePage.metricItems.map((metricItem) => (
          <AppHomeMetricCard
            key={metricItem.id}
            label={metricItem.label}
            value={metricItem.value}
            helper={metricItem.helper}
            icon={metricItem.icon}
          />
        ))}
      </AppBox>

      <AppBox
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: responsive({ xs: '1fr', xl: '1.3fr 0.9fr' }),
        }}
      >
        <AppQuickLinksPanel
          title="Atalhos rápidos"
          description="Acesse os módulos que mais ajudam a destravar a operação do cliente."
          links={clientHomePage.quickLinks}
        />

        <AppCard sx={{ borderRadius: 3 }}>
          <AppStack spacing={1.5}>
            <AppText variant="h6" sx={{ fontWeight: 700 }}>
              Próximos passos recomendados
            </AppText>
            {clientHomePage.recommendedActions.map((recommendedAction) => (
              <AppBox
                key={recommendedAction.id}
                sx={{
                  p: 1.75,
                  borderRadius: 2.5,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <AppText variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {recommendedAction.title}
                </AppText>
                <AppText variant="body2" color="text.secondary">
                  {recommendedAction.description}
                </AppText>
              </AppBox>
            ))}
          </AppStack>
        </AppCard>
      </AppBox>
    </AppStack>
  );
};

export default ClientHomePage;
