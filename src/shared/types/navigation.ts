import type { SvgIconComponent } from '@mui/icons-material';

export interface SearchScope {
  id: string;
  label: string;
  route: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  permission: string;
  icon?: SvgIconComponent;
  children?: NavigationItem[];
  searchScopes?: SearchScope[];
  keywords?: string[];
  type?: 'item' | 'section';
}

export type NavigationSectionItem = NavigationItem & { type: 'section' };

export interface LayoutBrandConfig {
  logo: SvgIconComponent;
  label?: string;
  compactLabel?: string;
}

export interface UserProfileSummary {
  name: string;
  email: string;
  role: string;
}
