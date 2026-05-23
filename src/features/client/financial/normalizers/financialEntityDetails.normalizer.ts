import { formatIsoDate } from '@shared/formatters';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import {
  translateFinancialCategoryType,
  translateFinancialEntityStatus,
} from '@shared/i18n/pt-BR/enums';
import type { DetailsHeaderData, DetailTab } from '@shared/types/detailsDrawer';
import type {
  FinancialCategory,
  FinancialEntity,
} from '@features/client/financial/types/financial.types';

const hasFinancialType = (entity: FinancialEntity): entity is FinancialCategory => 'type' in entity;

const toTypeLabel = (entity: FinancialEntity): string =>
  hasFinancialType(entity) ? translateFinancialCategoryType(entity.type) : '-';

const toDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const renderFinancialEntityStatus = (status: FinancialEntity['status'] | undefined) =>
  createOptionalLocalizedStatusBadge(
    status ? translateFinancialEntityStatus(status) : undefined,
    status === 'active' ? 'active' : 'neutral',
  );

export const toFinancialEntityHeaderData = (
  entity: FinancialEntity,
  fallbackSubtitle: string,
): DetailsHeaderData => ({
  title: entity.name,
  subtitle: entity.code ?? fallbackSubtitle,
  avatarFallback: entity.name.slice(0, 1).toUpperCase(),
  statusLabel: entity.status ? translateFinancialEntityStatus(entity.status) : undefined,
  statusColor: entity.status === 'active' ? 'success' : 'default',
});

export const toFinancialEntityDetailsTabs = (
  entity: FinancialEntity,
  includeType: boolean,
): DetailTab[] => [
  {
    id: 'summary',
    label: 'Resumo',
    sections: [
      {
        id: 'main',
        title: 'Dados principais',
        items: [
          { label: 'Nome', value: entity.name },
          { label: 'Código', value: entity.code ?? '-' },
          ...(includeType ? [{ label: 'Tipo', value: toTypeLabel(entity) }] : []),
          { label: 'Status', value: renderFinancialEntityStatus(entity.status) },
          { label: 'Descrição', value: entity.description ?? '-' },
        ],
      },
      {
        id: 'control',
        title: 'Controle',
        items: [
          { label: 'Criado em', value: toDate(entity.createdAt) },
          { label: 'Atualizado em', value: toDate(entity.updatedAt) },
        ],
      },
    ],
  },
];
