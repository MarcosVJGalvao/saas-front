import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
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
    id: 'clientes',
    label: 'Clientes',
    href: '/clients',
    permission: 'clients:read',
    icon: PeopleOutlineOutlinedIcon,
  },
  {
    id: 'planos',
    label: 'Planos',
    href: '/plans',
    permission: 'plans:read',
    icon: ListAltOutlinedIcon,
  },
  {
    id: 'assinaturas',
    label: 'Assinaturas',
    href: '/subscriptions',
    permission: 'subscriptions:read',
    icon: PaidOutlinedIcon,
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
