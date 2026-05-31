import { AppAlert } from '@shared/components/feedback/AppAlert';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useNotificationsListPage } from '@features/client/notifications/hooks/useNotificationsListPage';

const NotificationsPage = () => {
  const page = useNotificationsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Notificações"
        subtitle="Acompanhe mensagens recebidas e marque itens como lidos."
        actionLabel="Enviar notificação"
        canShowAction
        onAction={page.onOpenSendPage}
      />
      {page.actionErrorMessage ? (
        <AppAlert severity="error">{page.actionErrorMessage}</AppAlert>
      ) : null}
      {page.actionSuccessMessage ? (
        <AppAlert severity="success">{page.actionSuccessMessage}</AppAlert>
      ) : null}
      {page.notificationsList.isUnauthorized ? (
        <AppAlert severity="warning">Sua sessão expirou. Faça login novamente.</AppAlert>
      ) : null}
      {page.notificationsList.isForbidden ? (
        <AppAlert severity="warning">Você não tem permissão para acessar as notificações.</AppAlert>
      ) : null}
      <QueryDataTable
        rows={page.notificationsList.rows}
        columns={page.tableColumns}
        meta={page.notificationsList.pagination}
        query=""
        onQueryChange={page.onQueryChange}
        loading={page.notificationsList.loading}
        errorMessage={page.notificationsList.errorMessage}
        onRetry={() => {
          void page.notificationsList.reload();
        }}
        onPageChange={page.onPageChange}
        onRowsPerPageChange={page.onRowsPerPageChange}
        emptyTitle="Nenhuma notificação encontrada"
        emptyDescription="As notificações recebidas aparecerão aqui."
        hideToolbar
      />
    </AppStack>
  );
};

export default NotificationsPage;
