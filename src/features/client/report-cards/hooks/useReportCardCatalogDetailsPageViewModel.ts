import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import type {
  ReportCardAcademicPeriod,
  ReportCardCatalogEntity,
  ReportCardGradeSubject,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

type ReportCardCatalogDetailsService = {
  getById: (id: string) => Promise<ReportCardCatalogEntity>;
};

type ReportCardCatalogDetailsPageViewModelParams = {
  mode: ReportCardCatalogMode;
  service: ReportCardCatalogDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  fallbackSubtitle: string;
};

type ReportCardPeriodStatus = 'open' | 'closed' | 'active' | 'inactive';

const reportCardPeriodStatusLabels: Record<ReportCardPeriodStatus, string> = {
  open: 'Aberto',
  closed: 'Fechado',
  active: 'Ativo',
  inactive: 'Inativo',
};

const isAcademicPeriod = (row: ReportCardCatalogEntity): row is ReportCardAcademicPeriod =>
  'startDate' in row || 'endDate' in row;

const isGradeSubject = (row: ReportCardCatalogEntity): row is ReportCardGradeSubject =>
  'subject' in row || 'grade' in row;

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const getPeriodStatus = (status: ReportCardAcademicPeriod['status']): string =>
  status ? reportCardPeriodStatusLabels[status] : '-';

const getTitle = (mode: ReportCardCatalogMode, item: ReportCardCatalogEntity): string => {
  if (mode === 'periods' && isAcademicPeriod(item)) return item.name;
  if (mode === 'gradeSubjects' && isGradeSubject(item)) return item.subject?.name ?? 'Disciplina';
  return 'Registro';
};

const getSubtitle = (item: ReportCardCatalogEntity, fallbackSubtitle: string): string =>
  item.academicYear?.name ?? fallbackSubtitle;

const buildPeriodData = (item: ReportCardAcademicPeriod): EntityDetailsPageData['tabs'] => [
  {
    id: 'summary',
    label: 'Resumo',
    sections: [
      {
        id: 'main',
        title: 'Dados do período',
        items: [
          { label: 'Nome', value: item.name },
          { label: 'Código', value: item.code ?? '-' },
          { label: 'Ano letivo', value: item.academicYear?.name ?? '-' },
          { label: 'Status', value: getPeriodStatus(item.status) },
          { label: 'Início', value: formatDate(item.startDate) },
          { label: 'Fim', value: formatDate(item.endDate) },
        ],
      },
    ],
  },
];

const buildGradeSubjectData = (item: ReportCardGradeSubject): EntityDetailsPageData['tabs'] => [
  {
    id: 'summary',
    label: 'Resumo',
    sections: [
      {
        id: 'main',
        title: 'Dados da matriz',
        items: [
          { label: 'Disciplina', value: item.subject?.name ?? '-' },
          { label: 'Série', value: item.grade?.name ?? '-' },
          { label: 'Ano letivo', value: item.academicYear?.name ?? '-' },
          { label: 'Carga horária', value: item.workload === undefined ? '-' : item.workload },
          { label: 'Ordem', value: item.order === undefined ? '-' : item.order },
          { label: 'Obrigatória', value: item.required ? 'Sim' : 'Não' },
        ],
      },
    ],
  },
];

export const useReportCardCatalogDetailsPageViewModel = ({
  mode,
  service,
  backPath,
  content,
  fallbackSubtitle,
}: ReportCardCatalogDetailsPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<ReportCardCatalogEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setItem(null);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await service.getById(id);
      setItem(response);
    } catch {
      setErrorMessage(content.errorFallback);
    } finally {
      setLoading(false);
    }
  }, [content.errorFallback, id, service]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : item
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: item
        ? {
            title: getTitle(mode, item),
            subtitle: getSubtitle(item, fallbackSubtitle),
            avatarFallback: mode === 'periods' ? 'P' : 'M',
            statusLabel:
              mode === 'periods' && isAcademicPeriod(item)
                ? getPeriodStatus(item.status)
                : undefined,
            statusColor:
              mode === 'periods' && isAcademicPeriod(item) && item.status === 'active'
                ? 'success'
                : 'default',
          }
        : null,
      tabs:
        item && mode === 'periods' && isAcademicPeriod(item)
          ? buildPeriodData(item)
          : item && mode === 'gradeSubjects' && isGradeSubject(item)
            ? buildGradeSubjectData(item)
            : [],
    }),
    [fallbackSubtitle, item, mode],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate(backPath),
    onRetry: load,
  };
};
