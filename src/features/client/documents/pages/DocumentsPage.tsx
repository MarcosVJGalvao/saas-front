import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { useDocumentsListPageViewModel } from '@features/client/documents/hooks/useDocumentsListPageViewModel';

const DocumentsPage = () => {
  const model = useDocumentsListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Documentos gerados"
        subtitle="Consulte, baixe e remova documentos gerados pelo backend."
      />
      {model.actionErrorMessage ? (
        <AppAlert severity="error">{model.actionErrorMessage}</AppAlert>
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
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.list.loading || model.actionLoading}
      />
      <QueryDataTable
        rows={model.list.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        meta={model.list.meta}
        loading={model.list.loading}
        errorMessage={model.list.errorMessage}
        onRetry={() => {
          void model.list.reload();
        }}
        query={model.query}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
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
        open={model.deleteDialogOpen}
        title={model.deleteDialogTitle}
        description={model.deleteDialogDescription}
        confirmLabel={model.actionLoading ? 'Removendo...' : 'Remover'}
        onCancel={model.closeDeleteDialog}
        onConfirm={() => {
          void model.confirmDelete();
        }}
      />
    </AppStack>
  );
};

export default DocumentsPage;
