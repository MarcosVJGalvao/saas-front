import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useContactsListPageViewModel } from '@features/client/contacts/hooks/useContactsListPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const ContactsPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = useContactsListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Contatos"
        subtitle="Gerencie contatos vinculados a pessoas, alunos e responsáveis."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('client:contact:create')}
        onAction={() => void navigate('/client/contacts/new')}
      />
      <ListFilters
        fields={[
          { type: 'text', name: 'query', label: 'Buscar', placeholder: 'Contato', mobileOrder: 1 },
          {
            type: 'select',
            name: 'type',
            label: 'Tipo',
            placeholder: 'Todos os tipos',
            options: [
              { value: '', label: 'Todos os tipos' },
              { value: 'email', label: 'E-mail' },
              { value: 'phone', label: 'Telefone' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'other', label: 'Outro' },
            ],
            mobileOrder: 2,
          },
          {
            type: 'text',
            name: 'personId',
            label: 'Pessoa',
            placeholder: 'ID da pessoa',
            mobileOrder: 3,
          },
        ]}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.loading}
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
        emptyTitle="Nenhum contato encontrado"
        emptyDescription="Cadastre contatos para complementar os dados das pessoas."
        toolbarContent={
          <AppText color="text.secondary">
            A busca textual é enviada apenas pelo parâmetro search.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default ContactsPage;
