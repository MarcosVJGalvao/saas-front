import { createElement } from 'react';
import type { ReactNode } from 'react';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';

export type LocalizedStatusTone = 'active' | 'neutral';

export const createLocalizedStatusBadge = (label: string, tone: LocalizedStatusTone): ReactNode =>
  createElement(LocalizedStatusBadge, { label, tone });

export const createOptionalLocalizedStatusBadge = (
  label: string | null | undefined,
  tone: LocalizedStatusTone,
  fallback = '-',
): ReactNode => (label ? createLocalizedStatusBadge(label, tone) : fallback);
