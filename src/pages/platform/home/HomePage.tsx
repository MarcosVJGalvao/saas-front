import { AppCard } from '@shared/components/data-display/AppCard';
import { AppChip } from '@shared/components/data-display/AppChip';
import { AppText } from '@shared/components/data-display/AppText';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { fontSizes } from '@theme/fontSizes';

const PlatformHomePage = () => (
  <AppBox>
    <PageHeader
      title="Painel Administrativo da Plataforma"
      subtitle="Gerencie tenants, acessos e configurações globais."
    />
    <AppCard sx={{ p: 4, borderRadius: 3 }}>
      <AppStack spacing={2}>
        <AppChip
          label="Ambiente Platform"
          color="primary"
          variant="outlined"
          sx={{ width: 'fit-content' }}
        />
        <AppText sx={{ fontSize: fontSizes.lg, color: 'text.secondary' }}>
          Você está autenticado no domínio de administração.
        </AppText>
        <AppBox
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'action.hover',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <AppText sx={{ fontWeight: 600, mb: 0.5 }}>Próximos passos recomendados</AppText>
          <AppText variant="body2">1. Revisar usuários e permissões de tenants.</AppText>
          <AppText variant="body2">2. Validar políticas de segurança e MFA.</AppText>
          <AppText variant="body2">3. Acompanhar indicadores de operação.</AppText>
        </AppBox>
      </AppStack>
    </AppCard>
  </AppBox>
);

export default PlatformHomePage;
