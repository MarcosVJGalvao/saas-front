import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { translateAcademicYearStatus } from '@shared/i18n/pt-BR/enums';
import { academicYearService } from '@features/client/academic/services/academicServices';
import type { AcademicYear } from '@features/client/academic/types/academic.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes do ano letivo',
  pageSubtitle: 'Consulte período, status e dados de controle do ano letivo.',
  loadingLabel: 'Carregando ano letivo...',
  emptyTitle: 'Ano letivo não encontrado',
  emptyMessage: 'Não encontramos o ano letivo solicitado.',
  errorFallback: 'Erro ao carregar ano letivo.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este ano letivo.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este ano letivo.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

export const useAcademicYearDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setAcademicYear(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await academicYearService.getById(id);
      setAcademicYear(response);
    } catch {
      setErrorMessage('Erro ao carregar ano letivo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

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
      : academicYear
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: academicYear
        ? {
            title: academicYear.name,
            subtitle: academicYear.code ?? 'Ano letivo',
            avatarFallback: academicYear.name.slice(0, 1).toUpperCase(),
            statusLabel: translateAcademicYearStatus(academicYear.status),
            statusColor: academicYear.status === 'active' ? 'success' : 'default',
          }
        : null,
      tabs: academicYear
        ? [
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
          ]
        : [],
    }),
    [academicYear],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/academic-years'),
    onRetry: load,
  };
};

export const AcademicYearDetailsPageContent = () => {
  const model = useAcademicYearDetailsPageViewModel();
  return (
    <EntityDetailsPage
      viewState={model.viewState}
      content={model.content}
      data={model.data}
      errorMessage={model.errorMessage}
      onBack={model.onBack}
      onRetry={() => {
        void model.onRetry();
      }}
    />
  );
};
