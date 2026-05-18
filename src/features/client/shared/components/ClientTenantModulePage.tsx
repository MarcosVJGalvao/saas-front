import type { ReactNode } from 'react';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { PageHeader } from '@shared/components/layout/PageHeader';

type ClientTenantModulePageProps = {
  title: string;
  subtitle: string;
  moduleName: string;
  endpoints: ReadonlyArray<string>;
  states: ReadonlyArray<string>;
  nextStep: string;
  icon?: ReactNode | undefined;
};

export const ClientTenantModulePage = ({
  title,
  subtitle,
  moduleName,
  endpoints,
  states,
  nextStep,
  icon,
}: ClientTenantModulePageProps) => (
  <AppStack spacing={2}>
    <PageHeader title={title} subtitle={subtitle} />
    <AppCard>
      <AppStack spacing={1.5}>
        <AppStack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {icon}
          <AppText variant="h6">{moduleName}</AppText>
        </AppStack>
        <AppText color="text.secondary">
          Esta tela já está reservada na navegação do tenant e conectada ao desenho de integração do
          backend. A próxima etapa é trocar este painel por lista, formulário e detalhes completos.
        </AppText>
      </AppStack>
    </AppCard>
    <AppCard>
      <AppStack spacing={1}>
        <AppText variant="h6">Endpoints planejados</AppText>
        {endpoints.map((endpoint) => (
          <AppText key={endpoint} color="text.secondary">
            {endpoint}
          </AppText>
        ))}
      </AppStack>
    </AppCard>
    <AppCard>
      <AppStack spacing={1}>
        <AppText variant="h6">Estados obrigatórios</AppText>
        <AppText color="text.secondary">{states.join(', ')}</AppText>
      </AppStack>
    </AppCard>
    <AppCard>
      <AppStack spacing={1}>
        <AppText variant="h6">Próximo passo</AppText>
        <AppText color="text.secondary">{nextStep}</AppText>
      </AppStack>
    </AppCard>
  </AppStack>
);
