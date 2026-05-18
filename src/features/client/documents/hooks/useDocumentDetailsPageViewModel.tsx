import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { downloadBlob } from '@shared/utils/downloadBlob';
import { formatIsoDate } from '@shared/formatters';
import {
  translateDocumentFormat,
  translateDocumentGenerationStatus,
} from '@shared/i18n/pt-BR/enums';
import { documentService } from '@features/client/documents/services/documentServices';
import type { GeneratedDocument } from '@features/client/documents/types/document.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes do documento',
  pageSubtitle: 'Consulte os dados de geração e baixe o arquivo quando estiver disponível.',
  loadingLabel: 'Carregando documento...',
  emptyTitle: 'Documento não encontrado',
  emptyMessage: 'Não encontramos o documento solicitado.',
  errorFallback: 'Erro ao carregar documento.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este documento.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este documento.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const resolveDownloadFileName = (
  document: GeneratedDocument,
  headerFileName: string | undefined,
): string => headerFileName ?? document.fileName ?? `documento-${document.id}.${document.format}`;

export const useDocumentDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setDocument(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await documentService.getById(id);
      setDocument(response);
    } catch {
      setErrorMessage('Erro ao carregar documento.');
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

  const downloadDocument = useCallback(async (): Promise<void> => {
    if (!document) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      const download = await documentService.download(document.id);
      downloadBlob(download.blob, resolveDownloadFileName(document, download.fileName));
    } catch {
      setActionErrorMessage('Não foi possível baixar o documento.');
    } finally {
      setActionLoading(false);
    }
  }, [document]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : document
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: document
        ? {
            title: document.title,
            subtitle: document.templateKey ?? document.fileName ?? 'Documento gerado',
            avatarFallback: document.title.slice(0, 1).toUpperCase(),
            statusLabel: translateDocumentGenerationStatus(document.status),
            statusColor: document.status === 'completed' ? 'success' : 'default',
          }
        : null,
      tabs: document
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados do documento',
                  items: [
                    { label: 'Título', value: document.title },
                    { label: 'Formato', value: translateDocumentFormat(document.format) },
                    { label: 'Status', value: translateDocumentGenerationStatus(document.status) },
                    { label: 'Template', value: document.templateKey ?? '-' },
                    { label: 'Arquivo', value: document.fileName ?? '-' },
                    { label: 'Tipo MIME', value: document.mimeType ?? '-' },
                  ],
                },
                {
                  id: 'dates',
                  title: 'Datas',
                  items: [
                    { label: 'Criado em', value: formatDate(document.createdAt) },
                    { label: 'Atualizado em', value: formatDate(document.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
      footerActions: document
        ? [
            {
              id: 'download',
              label: actionLoading ? 'Baixando...' : 'Baixar documento',
              icon: <DownloadOutlinedIcon />,
              disabled: actionLoading || document.status !== 'completed',
              onClick: () => {
                void downloadDocument();
              },
            },
          ]
        : undefined,
    }),
    [actionLoading, document, downloadDocument],
  );

  return {
    content,
    data,
    viewState,
    errorMessage: actionErrorMessage ?? errorMessage,
    onBack: () => void navigate('/client/documents'),
    onRetry: load,
  };
};

export const DocumentDetailsPageContent = () => {
  const model = useDocumentDetailsPageViewModel();
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
