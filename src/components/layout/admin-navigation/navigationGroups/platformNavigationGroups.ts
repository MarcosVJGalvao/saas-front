import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import type { NavigationGroup } from '../navigationBuilder';

export const platformNavigationGroups: NavigationGroup[] = [
  {
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
