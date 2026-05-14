import type { ChipProps } from '@mui/material/Chip';
import type { ReactElement, ReactNode } from 'react';

export type DetailItem = {
  label: string;
  value?: ReactNode;
  noWrap?: boolean;
};

export type DetailSection = {
  id: string;
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  items?: ReadonlyArray<DetailItem>;
  content?: ReactNode;
};

export type DetailTab = {
  id: string;
  label: string;
  icon?: ReactElement;
  sections: ReadonlyArray<DetailSection>;
};

export type DetailsHeaderData = {
  title: string;
  subtitle?: string;
  avatarUrl?: string | null;
  avatarFallback?: string;
  statusLabel?: string;
  statusColor?: ChipProps['color'];
};

export type DetailsFooterAction = {
  id: string;
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  color?: 'primary' | 'error' | 'inherit';
  disabled?: boolean;
};
