import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { DocumentPreviewModal } from '@features/client/documents/components/DocumentPreviewModal';
import { useDocumentsListPage } from '@features/client/documents/hooks/useDocumentsListPage';

const DocumentsPage = () => {
  const documentsListPage = useDocumentsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Documentos gerados"
        subtitle="Consulte, baixe e remova documentos gerados pelo backend."
      />
      {documentsListPage.actionErrorMessage ? (
        <AppAlert severity="error">{documentsListPage.actionErrorMessage}</AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Título do documento',
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'format',
            label: 'Formato',
            placeholder: 'Todos os formatos',
            options: [
              { value: '', label: 'Todos os formatos' },
              { value: 'pdf', label: 'PDF' },
              { value: 'csv', label: 'CSV' },
              { value: 'xlsx', label: 'XLSX' },
            ],
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'pending', label: 'Pendente' },
              { value: 'processing', label: 'Processando' },
              { value: 'completed', label: 'Concluído' },
              { value: 'failed', label: 'Falhou' },
            ],
            mobileOrder: 3,
          },
          {
            type: 'text',
            name: 'templateKey',
            label: 'Template',
            placeholder: 'Chave do template',
            mobileOrder: 4,
          },
          {
            type: 'dateRange',
            name: 'period',
            label: 'Período',
            startName: 'startDate',
            endName: 'endDate',
            mobileOrder: 5,
          },
        ]}
        values={documentsListPage.filterValues}
        onChange={documentsListPage.onFilterChange}
        onApply={documentsListPage.onApplyFilters}
        onClear={documentsListPage.onClearFilters}
        loading={documentsListPage.documentsList.loading || documentsListPage.actionLoading}
      />
      <QueryDataTable
        rows={documentsListPage.documentsList.rows}
        columns={documentsListPage.tableColumns}
        mobileConfig={documentsListPage.mobileConfig}
        meta={documentsListPage.documentsList.pagination}
        loading={documentsListPage.documentsList.loading}
        errorMessage={documentsListPage.documentsList.errorMessage}
        onRetry={() => {
          void documentsListPage.documentsList.reload();
        }}
        query={documentsListPage.documentsList.queryParams.search ?? ''}
        onQueryChange={documentsListPage.onQueryChange}
        onPageChange={documentsListPage.onPageChange}
        onRowsPerPageChange={documentsListPage.onRowsPerPageChange}
        emptyTitle="Nenhum documento encontrado"
        emptyDescription="Os documentos gerados aparecerão aqui."
        toolbarContent={
          <AppText color="text.secondary">
            Downloads ficam disponíveis somente quando o processamento é concluído.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={documentsListPage.deleteModal.open}
        title={documentsListPage.deleteModal.title}
        description={documentsListPage.deleteModal.description}
        confirmLabel={documentsListPage.deleteModal.confirmLabel}
        onCancel={documentsListPage.deleteModal.onClose}
        onConfirm={() => {
          void documentsListPage.deleteModal.onConfirm();
        }}
      />
      <DocumentPreviewModal
        open={documentsListPage.previewModal.open}
        previewState={documentsListPage.previewModal.previewState}
        downloadLoading={documentsListPage.previewModal.downloadLoading}
        onClose={documentsListPage.previewModal.onClose}
        onDownload={documentsListPage.previewModal.onDownload}
      />
    </AppStack>
  );
};

export default DocumentsPage;
