import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LayoutViewOutlinedIcon from '@mui/icons-material/ViewQuiltOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { AUTH_DOMAIN, type AuthDomain } from '../../../models/auth/auth';
import type { LayoutBrandConfig, NavigationItem } from '../../../models/navigation';

const navigationBase: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    permission: 'dashboard:read',
    icon: HomeOutlinedIcon,
  },
  {
    id: 'painel',
    label: 'Painel',
    href: '/painel',
    permission: 'panel:read',
    icon: LayoutViewOutlinedIcon,
  },
  {
    id: 'usuarios',
    label: 'Usuários',
    permission: 'users:read',
    icon: PeopleOutlineOutlinedIcon,
    children: [
      {
        id: 'usuarios-todos',
        label: 'Todos os usuários',
        href: '/usuarios',
        permission: 'users:read',
      },
      {
        id: 'usuarios-perfis',
        label: 'Perfis de acesso',
        href: '/usuarios/perfis',
        permission: 'roles:read',
      },
      {
        id: 'usuarios-grupos',
        label: 'Grupos',
        href: '/usuarios/grupos',
        permission: 'groups:read',
      },
      {
        id: 'usuarios-convites',
        label: 'Convites pendentes',
        href: '/usuarios/convites',
        permission: 'invites:read',
      },
      {
        id: 'usuarios-logs',
        label: 'Logs de acesso',
        href: '/usuarios/logs',
        permission: 'access-logs:read',
      },
    ],
    searchScopes: [{ id: 'usuarios', label: 'Usuários', route: '/usuarios' }],
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    href: '/cadastros',
    permission: 'registry:read',
    icon: ListAltOutlinedIcon,
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    href: '/financeiro',
    permission: 'finance:read',
    icon: PaidOutlinedIcon,
    searchScopes: [{ id: 'financeiro', label: 'Financeiro', route: '/financeiro' }],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    href: '/relatorios',
    permission: 'reports:read',
    icon: BarChartOutlinedIcon,
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    href: '/configuracoes',
    permission: 'settings:read',
    icon: SettingsOutlinedIcon,
  },
  {
    id: 'auditoria',
    label: 'Auditoria',
    href: '/auditoria',
    permission: 'audit:read',
    icon: ShieldOutlinedIcon,
  },
];

const buildPermissionForDomain = (domain: AuthDomain, permission: string): string =>
  `${domain}:${permission}`;

const mapItemWithPrefix = (
  item: NavigationItem,
  prefix: string,
  domain: AuthDomain,
): NavigationItem => ({
  ...item,
  href: item.href ? `${prefix}${item.href}` : undefined,
  permission: buildPermissionForDomain(domain, item.permission),
  children: item.children?.map((child) => ({
    ...child,
    href: child.href ? `${prefix}${child.href}` : undefined,
    permission: buildPermissionForDomain(domain, child.permission),
  })),
});

export const navigationByDomain: Record<AuthDomain, NavigationItem[]> = {
  platform: navigationBase.map((item) =>
    mapItemWithPrefix(item, '/platform', AUTH_DOMAIN.PLATFORM),
  ),
  client: navigationBase.map((item) => mapItemWithPrefix(item, '/client', AUTH_DOMAIN.CLIENT)),
};

export const brandByDomain: Record<AuthDomain, LayoutBrandConfig> = {
  platform: { logo: HexagonOutlinedIcon, label: 'Plataforma', compactLabel: 'PLT' },
  client: { logo: HexagonOutlinedIcon, label: 'Cliente', compactLabel: 'CLT' },
};
