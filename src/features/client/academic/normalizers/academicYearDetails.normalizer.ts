import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { translateAcademicYearStatus } from '@shared/i18n/pt-BR/enums';
import type { AcademicYear } from '@features/client/academic/types/academic.types';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

export const toAcademicYearDetailsData = (academicYear: AcademicYear): EntityDetailsPageData => ({
  headerData: {
    title: academicYear.name,
    subtitle: academicYear.code ?? 'Ano letivo',
    avatarFallback: academicYear.name.slice(0, 1).toUpperCase(),
    statusLabel: translateAcademicYearStatus(academicYear.status),
    statusColor: academicYear.status === 'active' ? 'success' : 'default',
  },
  tabs: [
    {
      id: 'summary',
      label: 'Resumo',
      sections: [
        {
          id: 'main',
          title: 'Dados do ano letivo',
          items: [
            { label: 'Nome', value: academicYear.name },
            { label: 'Código', value: academicYear.code ?? '-' },
            { label: 'Status', value: translateAcademicYearStatus(academicYear.status) },
            { label: 'Início', value: formatDate(academicYear.startDate) },
            { label: 'Término', value: formatDate(academicYear.endDate) },
            { label: 'Descrição', value: academicYear.description ?? '-' },
          ],
        },
        {
          id: 'control',
          title: 'Controle',
          items: [
            { label: 'Criado em', value: formatDate(academicYear.createdAt) },
            { label: 'Atualizado em', value: formatDate(academicYear.updatedAt) },
          ],
        },
      ],
    },
  ],
});
