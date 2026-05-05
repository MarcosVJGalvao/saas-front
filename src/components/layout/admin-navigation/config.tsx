import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import { AUTH_DOMAIN, type AuthDomain } from '../../../models/auth/auth';
import type { LayoutBrandConfig, NavigationItem } from '../../../models/navigation';
import { buildDomainNavigation } from './navigationBuilder';
import { clientNavigationGroups } from './navigationGroups/clientNavigationGroups';
import { platformNavigationGroups } from './navigationGroups/platformNavigationGroups';

export const navigationByDomain: Record<AuthDomain, NavigationItem[]> = {
  platform: buildDomainNavigation(platformNavigationGroups, '/platform', AUTH_DOMAIN.PLATFORM),
  client: buildDomainNavigation(clientNavigationGroups, '/client', AUTH_DOMAIN.CLIENT),
};

export const brandByDomain: Record<AuthDomain, LayoutBrandConfig> = {
  platform: { logo: HexagonOutlinedIcon, label: 'Plataforma', compactLabel: 'PLT' },
  client: { logo: HexagonOutlinedIcon, label: 'Cliente', compactLabel: 'CLT' },
};
