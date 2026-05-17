import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import { AUTH_DOMAIN, type AuthDomain } from '@shared/types/auth/auth';
import type { LayoutBrandConfig, NavigationItem } from '@shared/types/navigation';
import { buildDomainNavigation } from '@app/layout/admin-navigation/navigationBuilder';
import { clientNavigationGroups } from '@app/layout/admin-navigation/navigationGroups/clientNavigationGroups';
import { platformNavigationGroups } from '@app/layout/admin-navigation/navigationGroups/platformNavigationGroups';

export const navigationByDomain: Record<AuthDomain, NavigationItem[]> = {
  platform: buildDomainNavigation(platformNavigationGroups, '/platform', AUTH_DOMAIN.PLATFORM),
  client: buildDomainNavigation(clientNavigationGroups, '/client', AUTH_DOMAIN.CLIENT),
};

export const brandByDomain: Record<AuthDomain, LayoutBrandConfig> = {
  platform: { logo: HexagonOutlinedIcon, label: 'Plataforma', compactLabel: 'PLT' },
  client: { logo: HexagonOutlinedIcon, label: 'Cliente', compactLabel: 'CLT' },
};
