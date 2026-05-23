import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
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
import { usePlatformHomePage } from '@features/platform/home/hooks/usePlatformHomePage';
import { responsive } from '@theme/utils/responsive';

const PlatformHomePage = () => {
  const platformHomePage = usePlatformHomePage();

  if (platformHomePage.loading) {
    return <AppLoadingIndicator aria-label="Carregando home da plataforma" />;
  }

  if (platformHomePage.errorMessage) {
    return (
      <AppErrorState
        message={platformHomePage.errorMessage}
        onRetry={() => {
          void platformHomePage.onRetry();
        }}
      />
    );
  }

  if (!platformHomePage.profile) {
    return <AppText>{platformHomePage.messages.empty}</AppText>;
  }

  return (
    <AppStack spacing={3}>
      <PageHeader
        title={platformHomePage.messages.title}
        subtitle={platformHomePage.messages.subtitle}
      />

      <AppHomeHero
        eyebrow="Operação da plataforma"
        title={`Boas-vindas, ${platformHomePage.profile.name}.`}
        description="Comece o dia com visão clara do seu contexto administrativo, dos acessos disponíveis e dos pontos que merecem atenção imediata."
        badgeLabel={platformHomePage.profile.status}
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
              <ShieldOutlinedIcon color="primary" />
              <AppText variant="subtitle1" sx={{ fontWeight: 700 }}>
                Ambiente administrativo ativo
              </AppText>
              <AppText variant="body2" color="text.secondary">
                Use esta entrada para revisar clientes, planos e permissões antes de executar
                mudanças estruturais.
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
        {platformHomePage.metricItems.map((metricItem) => (
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
          title="Atalhos principais"
          description="Abra rapidamente os módulos mais usados na administração da plataforma."
          links={platformHomePage.quickLinks}
        />

        <AppCard sx={{ borderRadius: 3 }}>
          <AppStack spacing={1.5}>
            <AppText variant="h6" sx={{ fontWeight: 700 }}>
              Ações recomendadas
            </AppText>
            {platformHomePage.recommendedActions.map((recommendedAction) => (
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

export default PlatformHomePage;
