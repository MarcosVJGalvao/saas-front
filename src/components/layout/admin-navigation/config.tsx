import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { AUTH_DOMAIN, type AuthDomain } from '../../../models/auth/auth';
import type {
  LayoutBrandConfig,
  NavigationItem,
  NavigationSectionItem,
} from '../../../models/navigation';

// ---------------------------------------------------------------------------
// Estrutura de grupos com seções opcionais
// Para criar uma seção: defina `section` com id e label.
// Os `items` dentro de cada grupo pertencem àquela seção.
// ---------------------------------------------------------------------------

interface NavigationGroup {
  section?: { id: string; label: string };
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    // Itens sem seção (sem section = sem label de categoria)
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/home',
        permission: 'dashboard:read',
        icon: HomeOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'gestao-section', label: 'Gestão' },
    items: [
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
    ],
  },
];

// ---------------------------------------------------------------------------
// Utilitários internos (não editar)
// ---------------------------------------------------------------------------

const makeSectionItem = (id: string, label: string): NavigationSectionItem => ({
  id,
  label,
  permission: '',
  type: 'section',
});

const flattenGroups = (groups: NavigationGroup[]): NavigationItem[] =>
  groups.flatMap(({ section, items }) =>
    section ? [makeSectionItem(section.id, section.label), ...items] : items,
  );

const buildPermission = (domain: AuthDomain, permission: string): string =>
  permission === '' ? '' : `${domain}:${permission}`;

const mapItemWithPrefix = (
  item: NavigationItem,
  prefix: string,
  domain: AuthDomain,
): NavigationItem => ({
  ...item,
  href: item.href ? `${prefix}${item.href}` : undefined,
  permission: buildPermission(domain, item.permission),
  children: item.children?.map((child) => ({
    ...child,
    href: child.href ? `${prefix}${child.href}` : undefined,
    permission: buildPermission(domain, child.permission),
    children: child.children?.map((grandchild) => ({
      ...grandchild,
      href: grandchild.href ? `${prefix}${grandchild.href}` : undefined,
      permission: buildPermission(domain, grandchild.permission),
    })),
  })),
});

const navigationBase = flattenGroups(navigationGroups);

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
