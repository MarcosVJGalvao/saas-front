import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { KeyValueGrid } from '@shared/components/data-display/KeyValueGrid';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { toDocumentDetailsItems } from '@features/client/documents/normalizers/documentDetails.normalizer';
import { useDocumentDetailsPage } from '@features/client/documents/hooks/useDocumentDetailsPage';

const DocumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentDetailsPage = useDocumentDetailsPage(id ?? '');

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

  const documentDetailsItems = toDocumentDetailsItems(documentDetailsPage.entity);

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={documentDetailsPage.entity.title}
        subtitle="Consulte os dados de geração e baixe o arquivo quando estiver disponível."
        actions={
          <AppButton
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            disabled={
              documentDetailsPage.entity.status !== 'completed' ||
              documentDetailsPage.downloadLoading
            }
            onClick={() => {
              void documentDetailsPage.onDownload();
            }}
          >
            {documentDetailsPage.downloadLoading ? 'Baixando...' : 'Baixar documento'}
          </AppButton>
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
    </AppStack>
  );
};

export default DocumentDetailsPage;
