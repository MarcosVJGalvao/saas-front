import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import type { NavigationGroup } from '../navigationBuilder';

export const clientNavigationGroups: NavigationGroup[] = [
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
];
