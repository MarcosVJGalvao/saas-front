import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { FileUpload } from '@shared/components/upload/FileUpload';
import { usePersonDocumentsPageViewModel } from '@features/client/person-documents/hooks/usePersonDocumentsPageViewModel';

const PersonDocumentsPage = () => {
  const model = usePersonDocumentsPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Documentos da pessoa"
        subtitle="Envie, consulte, baixe e remova documentos vinculados a pessoas."
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      <AppPaper sx={{ p: 3 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Enviar documento</AppText>
          <AppStack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <AppTextField
              label="Pessoa"
              placeholder="ID da pessoa"
              value={model.personId}
              onChange={(event) => model.setPersonId(event.target.value)}
            />
            <AppTextField
              label="Título"
              placeholder="Título do documento"
              value={model.title}
              onChange={(event) => model.setTitle(event.target.value)}
            />
            <FileUpload
              accept=".pdf,.png,.jpg,.jpeg"
              selectedFileName={model.selectedFile === null ? undefined : model.selectedFile.name}
              onFileSelected={model.setSelectedFile}
            />
            <AppButton
              variant="contained"
              disabled={model.actionLoading}
              onClick={() => {
                void model.upload();
              }}
            >
              {model.actionLoading ? 'Enviando...' : 'Enviar'}
            </AppButton>
          </AppStack>
        </AppStack>
      </AppPaper>
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Título ou arquivo',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'personId',
            label: 'Pessoa',
            placeholder: 'ID da pessoa',
            mobileOrder: 2,
          },
        ]}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.loading || model.actionLoading}
      />
      <QueryDataTable
        rows={model.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        meta={model.meta}
        loading={model.loading}
        errorMessage={model.errorMessage}
        onRetry={() => {
          void model.reload();
        }}
        query={model.query.search ?? ''}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
        emptyTitle="Nenhum documento encontrado"
        emptyDescription="Informe a pessoa nos filtros para consultar os documentos vinculados."
        toolbarContent={
          <AppText color="text.secondary">
            A listagem segue o endpoint da pessoa informada no filtro.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={model.deleteDialogOpen}
        title="Remover documento"
        description="Confirma a remoção deste documento de pessoa?"
        confirmLabel={model.actionLoading ? 'Removendo...' : 'Remover'}
        onCancel={model.closeDeleteDialog}
        onConfirm={() => {
          void model.confirmDelete();
        }}
      />
    </AppStack>
  );
};

export default PersonDocumentsPage;
