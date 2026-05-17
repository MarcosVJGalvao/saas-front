import type { SvgIconComponent } from '@mui/icons-material';

export interface SearchScope {
  id: string;
  label: string;
  route: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string | undefined;
  permission: string;
  icon?: SvgIconComponent | undefined;
  children?: NavigationItem[] | undefined;
  searchScopes?: SearchScope[] | undefined;
  keywords?: string[] | undefined;
  type?: 'item' | 'section' | undefined;
}

export type NavigationSectionItem = NavigationItem & { type: 'section' };

export interface LayoutBrandConfig {
  logo: SvgIconComponent;
  label?: string | undefined;
  compactLabel?: string | undefined;
}

export interface UserProfileSummary {
  name: string;
  email: string;
  role: string;
}
