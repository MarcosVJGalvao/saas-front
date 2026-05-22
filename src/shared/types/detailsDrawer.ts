import type { ChipProps } from '@mui/material/Chip';
import type { ReactElement, ReactNode } from 'react';

export type DetailItem = {
  label: string;
  value?: ReactNode | undefined;
  noWrap?: boolean | undefined;
};

export type DetailSection = {
  id: string;
  title: string;
  icon?: ReactNode | undefined;
  action?: ReactNode | undefined;
  items?: ReadonlyArray<DetailItem> | undefined;
  content?: ReactNode | undefined;
};

export type DetailTab = {
  id: string;
  label: string;
  icon?: ReactElement | undefined;
  sections: ReadonlyArray<DetailSection>;
};

export type DetailsHeaderData = {
  title: string;
  subtitle?: string | undefined;
  avatarUrl?: string | null | undefined;
  avatarFallback?: string | undefined;
  statusLabel?: string | undefined;
  statusColor?: ChipProps['color'] | undefined;
};

export type DetailsFooterAction = {
  id: string;
  label: string;
  onClick: () => void;
  icon?: ReactNode | undefined;
  color?: 'primary' | 'error' | 'inherit' | undefined;
  disabled?: boolean | undefined;
  /** Se informado, a ação só é exibida quando o tab com este id estiver selecionado. */
  tabId?: string | undefined;
};
