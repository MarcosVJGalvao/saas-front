import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadBlob } from '@shared/utils/downloadBlob';
import { documentsService } from '@features/client/documents/services/service';
import type { GeneratedDocument } from '@features/client/documents/types/document.types';

const resolveDownloadFileName = (
  document: GeneratedDocument,
  headerFileName: string | undefined,
): string => headerFileName ?? document.fileName ?? `documento-${document.id}.${document.format}`;

export const useDocumentDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState<GeneratedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState<string | undefined>();

  const fetchDocument = useCallback(async () => {
    if (!id) {
      setEntity(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const document = await documentsService.getById(id);
      setEntity(document);
    } catch {
      setErrorMessage('Não foi possível carregar o documento.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDocument();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchDocument]);

  const handleDownload = useCallback(async (): Promise<void> => {
    if (!entity) {
      return;
    }

    setDownloadLoading(true);
    setDownloadErrorMessage(undefined);
    try {
      const download = await documentsService.download(entity.id);
      downloadBlob(download.blob, resolveDownloadFileName(entity, download.fileName));
    } catch {
      setDownloadErrorMessage('Não foi possível baixar o documento.');
    } finally {
      setDownloadLoading(false);
    }
  }, [entity]);

  return {
    entity,
    loading,
    errorMessage: downloadErrorMessage ?? errorMessage,
    downloadLoading,
    onDownload: handleDownload,
    onBack: () => {
      void navigate('/client/documents');
    },
    onRetry: fetchDocument,
  };
};
