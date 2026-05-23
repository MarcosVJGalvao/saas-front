import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { formatIsoDate } from '@shared/formatters';
import {
  translateAcademicYearStatus,
  translateActiveInactiveStatus,
  translateReportCardCalculationType,
  translateReportCardFinalStatusStrategy,
  translateReportCardRecoveryStrategy,
} from '@shared/i18n/pt-BR/enums';
import type { DetailSection } from '@shared/types/detailsDrawer';
import type {
  AcademicPeriod,
  AcademicYear,
  ReportCardPolicy,
} from '@features/client/academic/types/academic.types';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatNumber = (value: number | undefined): string =>
  value === undefined ? '-' : value.toLocaleString('pt-BR');

const formatPercentage = (value: number | undefined): string =>
  value === undefined ? '-' : `${value.toLocaleString('pt-BR')}%`;

const formatBoolean = (value: boolean | number | undefined): string => {
  if (value === true || value === 1) return 'Sim';
  if (value === false || value === 0) return 'Não';
  return '-';
};

const renderAcademicYearStatus = (status: AcademicYear['status']) =>
  createOptionalLocalizedStatusBadge(
    translateAcademicYearStatus(status),
    status === 'active' ? 'active' : 'neutral',
  );

const renderAcademicPeriodStatus = (status: AcademicPeriod['status']) =>
  createOptionalLocalizedStatusBadge(
    status ? translateActiveInactiveStatus(status) : undefined,
    status === 'active' ? 'active' : 'neutral',
  );

const buildAcademicPeriodSection = (academicPeriod: AcademicPeriod): DetailSection => ({
  id: `period-${academicPeriod.id}`,
  title: academicPeriod.name,
  items: [
    { label: 'Código', value: academicPeriod.code ?? '-' },
    { label: 'Sequência', value: formatNumber(academicPeriod.sequence) },
    { label: 'Início', value: formatDate(academicPeriod.startDate) },
    { label: 'Término', value: formatDate(academicPeriod.endDate) },
    { label: 'Peso', value: formatNumber(academicPeriod.weight) },
    { label: 'Período final', value: formatBoolean(academicPeriod.isFinalPeriod) },
    { label: 'Status', value: renderAcademicPeriodStatus(academicPeriod.status) },
  ],
});

const buildAcademicPeriodSections = (
  academicPeriods: AcademicPeriod[] | undefined,
): DetailSection[] => {
  const availableAcademicPeriods = academicPeriods ?? [];

  if (availableAcademicPeriods.length === 0) {
    return [
      {
        id: 'periods-empty',
        title: 'Períodos acadêmicos',
        items: [{ label: 'Períodos', value: 'Nenhum período acadêmico informado.' }],
      },
    ];
  }

  return availableAcademicPeriods.map(buildAcademicPeriodSection);
};

const buildReportCardPolicyItems = (reportCardPolicy: ReportCardPolicy | null | undefined) => {
  if (!reportCardPolicy) {
    return [{ label: 'Política', value: 'Nenhuma política de boletim informada.' }];
  }

  return [
    {
      label: 'Tipo de cálculo',
      value: translateReportCardCalculationType(reportCardPolicy.calculationType),
    },
    { label: 'Nota mínima', value: formatNumber(reportCardPolicy.passingGrade) },
    {
      label: 'Frequência mínima',
      value: formatPercentage(reportCardPolicy.minimumAttendancePercentage),
    },
    {
      label: 'Estratégia de recuperação',
      value: translateReportCardRecoveryStrategy(reportCardPolicy.recoveryStrategy),
    },
    {
      label: 'Status final',
      value: translateReportCardFinalStatusStrategy(reportCardPolicy.finalStatusStrategy),
    },
  ];
};

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
            { label: 'Status', value: renderAcademicYearStatus(academicYear.status) },
            { label: 'Início', value: formatDate(academicYear.startDate) },
            { label: 'Término', value: formatDate(academicYear.endDate) },
            { label: 'Encerrado', value: formatBoolean(academicYear.isClosed) },
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
    {
      id: 'periods',
      label: 'Períodos',
      sections: buildAcademicPeriodSections(academicYear.academicPeriods),
    },
    {
      id: 'report-card-policy',
      label: 'Boletim',
      sections: [
        {
          id: 'report-card-policy',
          title: 'Política de boletim',
          items: buildReportCardPolicyItems(academicYear.reportCardPolicy),
        },
      ],
    },
  ],
});
