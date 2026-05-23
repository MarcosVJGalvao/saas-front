import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { formatIsoDate } from '@shared/formatters';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { AcademicCatalogItem } from '@features/client/academic/types/academic.types';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const renderAcademicCatalogStatus = (status: AcademicCatalogItem['status']) =>
  createOptionalLocalizedStatusBadge(
    status ? translateActiveInactiveStatus(status) : undefined,
    status === 'active' ? 'active' : 'neutral',
  );

export const toAcademicCatalogDetailsData = (item: AcademicCatalogItem): EntityDetailsPageData => ({
  headerData: {
    title: item.name,
    subtitle: item.code ?? 'Cadastro acadêmico',
    avatarFallback: item.name.slice(0, 1).toUpperCase(),
    statusLabel: item.status ? translateActiveInactiveStatus(item.status) : undefined,
    statusColor: item.status === 'active' ? 'success' : 'default',
  },
  tabs: [
    {
      id: 'summary',
      label: 'Resumo',
      sections: [
        {
          id: 'main',
          title: 'Dados principais',
          items: [
            { label: 'Nome', value: item.name },
            { label: 'Código', value: item.code ?? '-' },
            { label: 'Status', value: renderAcademicCatalogStatus(item.status) },
            { label: 'Nível de ensino', value: item.educationLevel?.name ?? '-' },
            { label: 'Descrição', value: item.description ?? '-' },
          ],
        },
        {
          id: 'control',
          title: 'Controle',
          items: [
            { label: 'Criado em', value: formatDate(item.createdAt) },
            { label: 'Atualizado em', value: formatDate(item.updatedAt) },
          ],
        },
      ],
    },
  ],
});
