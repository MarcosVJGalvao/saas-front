import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import type { ReactNode } from 'react';
import type { PlatformMeResponse } from '@features/platform/auth/services/types';
import type { AppQuickLinkItem } from '@shared/components/home/AppQuickLinksPanel';

export interface HomeMetricItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}

export interface HomeActionItem {
  id: string;
  title: string;
  description: string;
}

const platformQuickLinks: AppQuickLinkItem[] = [
  {
    id: 'clients',
    label: 'Clientes',
    description: 'Acompanhe tenants, cadastros e status da base.',
    to: '/platform/clients',
    icon: <PeopleOutlineOutlinedIcon fontSize="small" />,
  },
  {
    id: 'plans',
    label: 'Planos',
    description: 'Revise ofertas, benefícios e vigência comercial.',
    to: '/platform/plans',
    icon: <ListAltOutlinedIcon fontSize="small" />,
  },
  {
    id: 'subscriptions',
    label: 'Assinaturas',
    description: 'Monitore renovações, trial e possíveis bloqueios.',
    to: '/platform/subscriptions',
    icon: <PaidOutlinedIcon fontSize="small" />,
  },
  {
    id: 'profile',
    label: 'Meu perfil',
    description: 'Confira seus papéis, permissões e dados de acesso.',
    to: '/platform/me',
    icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
  },
];

export const buildPlatformHomeMetrics = (profile: PlatformMeResponse): HomeMetricItem[] => [
  {
    id: 'status',
    label: 'Status da conta',
    value: profile.status,
    helper: 'Situação atual do acesso administrativo.',
    icon: <ShieldOutlinedIcon fontSize="small" />,
  },
  {
    id: 'roles',
    label: 'Papéis ativos',
    value: String(profile.roles.length),
    helper: profile.roles.length > 0 ? profile.roles.join(', ') : 'Nenhum papel vinculado.',
    icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
  },
  {
    id: 'permissions',
    label: 'Permissões',
    value: String(profile.permissions.length),
    helper: 'Conjunto de acessos disponíveis nesta sessão.',
    icon: <ShieldOutlinedIcon fontSize="small" />,
  },
  {
    id: 'identity',
    label: 'Conta atual',
    value: profile.email,
    helper: 'Usuário autenticado na plataforma.',
    icon: <PeopleOutlineOutlinedIcon fontSize="small" />,
  },
];

export const platformRecommendedActions: HomeActionItem[] = [
  {
    id: 'review-clients',
    title: 'Revisar clientes prioritários',
    description: 'Valide status, onboarding pendente e tenants que exigem acompanhamento.',
  },
  {
    id: 'review-plans',
    title: 'Checar oferta comercial',
    description: 'Garanta que planos e assinaturas reflitam a estratégia vigente da plataforma.',
  },
  {
    id: 'review-security',
    title: 'Conferir acessos administrativos',
    description: 'Use Meu Perfil para revisar permissões antes de iniciar ajustes sensíveis.',
  },
];

export const getPlatformQuickLinks = (): ReadonlyArray<AppQuickLinkItem> => platformQuickLinks;
