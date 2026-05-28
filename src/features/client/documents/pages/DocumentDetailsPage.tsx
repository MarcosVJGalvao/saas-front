import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { KeyValueGrid } from '@shared/components/data-display/KeyValueGrid';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { DocumentPreviewModal } from '@features/client/documents/components/DocumentPreviewModal';
import { useDocumentPreview } from '@features/client/documents/hooks/useDocumentPreview';
import { toDocumentDetailsItems } from '@features/client/documents/normalizers/documentDetails.normalizer';
import { useDocumentDetailsPage } from '@features/client/documents/hooks/useDocumentDetailsPage';

const DocumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentDetailsPage = useDocumentDetailsPage(id ?? '');
  const preview = useDocumentPreview();

  if (documentDetailsPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando documento" />;
  }

  if (documentDetailsPage.errorMessage) {
    return (
      <AppErrorState
        message={documentDetailsPage.errorMessage}
        onRetry={() => {
          void documentDetailsPage.onRetry();
        }}
      />
    );
  }

  if (!documentDetailsPage.entity) {
    return (
      <EmptyState
        title="Documento não encontrado"
        description="Não encontramos o documento solicitado."
        actionLabel="Voltar"
        onAction={documentDetailsPage.onBack}
      />
    );
  }

  const entity = documentDetailsPage.entity;
  const documentDetailsItems = toDocumentDetailsItems(entity);
  const isCompleted = entity.status === 'completed';

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={entity.title}
        subtitle="Consulte os dados de geração e visualize ou baixe o arquivo quando estiver disponível."
        actions={
          <AppStack direction="row" spacing={1}>
            <AppButton
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              disabled={!isCompleted}
              onClick={() => {
                void preview.openPreview(entity);
              }}
            >
              Pré-visualizar
            </AppButton>
            <AppButton
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              disabled={!isCompleted || documentDetailsPage.downloadLoading}
              onClick={() => {
                void documentDetailsPage.onDownload();
              }}
            >
              {documentDetailsPage.downloadLoading ? 'Baixando...' : 'Baixar'}
            </AppButton>
          </AppStack>
        }
        actionLabel="Voltar"
        onAction={documentDetailsPage.onBack}
      />
      <SectionCard title="Dados do documento">
        <KeyValueGrid items={documentDetailsItems.document} />
      </SectionCard>
      <SectionCard title="Processamento">
        <KeyValueGrid items={documentDetailsItems.processing} />
      </SectionCard>
      <AppButton
        variant="text"
        onClick={() => {
          void navigate('/client/documents');
        }}
        sx={{ alignSelf: 'flex-start' }}
      >
        Voltar para a listagem
      </AppButton>

      <DocumentPreviewModal
        open={preview.previewState.type !== 'idle'}
        previewState={preview.previewState}
        downloadLoading={preview.downloadLoading}
        onClose={preview.closePreview}
        onDownload={preview.downloadFromPreview}
      />
    </AppStack>
  );
};

export default DocumentDetailsPage;
