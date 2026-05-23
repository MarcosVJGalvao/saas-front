import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import type { ReactNode } from 'react';
import type { ClientMeResponse } from '@features/client/auth/services/types';
import type { NavigationItem } from '@shared/types/navigation';
import type { AppQuickLinkItem } from '@shared/components/home/AppQuickLinksPanel';

export interface ClientHomeMetricItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}

export interface ClientHomeActionItem {
  id: string;
  title: string;
  description: string;
}

interface QuickLinkCandidate {
  id: string;
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
}

const preferredQuickLinkCandidates: QuickLinkCandidate[] = [
  {
    id: 'students',
    href: '/client/students',
    label: 'Alunos',
    description: 'Gerencie cadastros e acompanhe a base acadêmica.',
    icon: <PeopleOutlinedIcon fontSize="small" />,
  },
  {
    id: 'enrollments',
    href: '/client/student-enrollments',
    label: 'Matrículas',
    description: 'Acesse vínculos ativos, jornadas de onboarding e acompanhamento.',
    icon: <GroupAddOutlinedIcon fontSize="small" />,
  },
  {
    id: 'academic-years',
    href: '/client/academic-years',
    label: 'Anos letivos',
    description: 'Revise o calendário principal e mantenha a estrutura acadêmica em dia.',
    icon: <SchoolOutlinedIcon fontSize="small" />,
  },
  {
    id: 'documents',
    href: '/client/documents',
    label: 'Documentos',
    description: 'Consulte documentos gerados e o histórico operacional do tenant.',
    icon: <DescriptionOutlinedIcon fontSize="small" />,
  },
];

const flattenNavigationItems = (navigationItems: ReadonlyArray<NavigationItem>): NavigationItem[] =>
  navigationItems.reduce<NavigationItem[]>((accumulator, navigationItem) => {
    const currentItems = navigationItem.children
      ? flattenNavigationItems(navigationItem.children)
      : navigationItem.href
        ? [navigationItem]
        : [];

    return accumulator.concat(currentItems);
  }, []);

export const buildClientHomeMetrics = (profile: ClientMeResponse): ClientHomeMetricItem[] => [
  {
    id: 'tenant',
    label: 'Tenant ativo',
    value: profile.tenant.name,
    helper: 'Contexto operacional da sessão atual.',
    icon: <SchoolOutlinedIcon fontSize="small" />,
  },
  {
    id: 'role',
    label: 'Perfil no cliente',
    value: profile.client.role,
    helper: 'Papel principal usado para liberar suas ações.',
    icon: <BadgeOutlinedIcon fontSize="small" />,
  },
  {
    id: 'permissions',
    label: 'Permissões',
    value: String(profile.permissions.length),
    helper: 'Acessos atualmente associados ao seu usuário.',
    icon: <TaskAltOutlinedIcon fontSize="small" />,
  },
  {
    id: 'status',
    label: 'Status da conta',
    value: profile.status,
    helper: 'Situação atual do seu acesso neste tenant.',
    icon: <BadgeOutlinedIcon fontSize="small" />,
  },
];

export const buildClientQuickLinks = (
  navigationItems: ReadonlyArray<NavigationItem>,
): ReadonlyArray<AppQuickLinkItem> => {
  const availablePaths = new Set(
    flattenNavigationItems(navigationItems).map((navigationItem) => navigationItem.href ?? ''),
  );

  return preferredQuickLinkCandidates
    .filter((quickLinkCandidate) => availablePaths.has(quickLinkCandidate.href))
    .map((quickLinkCandidate) => ({
      id: quickLinkCandidate.id,
      label: quickLinkCandidate.label,
      description: quickLinkCandidate.description,
      to: quickLinkCandidate.href,
      icon: quickLinkCandidate.icon,
    }));
};

export const clientRecommendedActions: ClientHomeActionItem[] = [
  {
    id: 'review-profile',
    title: 'Revisar dados de acesso',
    description: 'Use Meu Perfil para confirmar papel, tenant ativo e permissões disponíveis.',
  },
  {
    id: 'organize-routine',
    title: 'Organizar a rotina acadêmica',
    description: 'Priorize matrículas, alunos e estrutura letiva no início da operação.',
  },
  {
    id: 'check-documents',
    title: 'Acompanhar documentos e pendências',
    description: 'Centralize consultas operacionais sem sair do contexto do cliente.',
  },
];
