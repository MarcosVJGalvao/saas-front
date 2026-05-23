import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localPermissionResolver } from '@app/layout/admin-navigation/permissions';
import {
  buildClientListColumns,
  buildClientListMobileConfig,
  buildClientSummaryCards,
  resolveClientPlanName,
} from '@features/platform/clients/components/clientListColumns';
import { clientsService } from '@features/platform/clients/services/service';
import { useClientsList } from '@features/platform/clients/hooks/useClientsList';
import type { Client } from '@features/platform/clients/types/clients';

export const useClientsListPage = () => {
  const navigate = useNavigate();
  const clientsList = useClientsList();
  const [deleteClient, setDeleteClient] = useState<Client | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState(clientsList.queryParams.search ?? '');
  const [statusValue, setStatusValue] = useState(clientsList.queryParams.status ?? '');
  const [startDateValue, setStartDateValue] = useState(clientsList.queryParams.startDate ?? null);
  const [endDateValue, setEndDateValue] = useState(clientsList.queryParams.endDate ?? null);

  const can = (permission: string): boolean => {
    const permissions = localPermissionResolver.getPermissions('platform');
    return permissions.includes(permission) || permissions.includes('platform:clients:*');
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteClient) {
      return;
    }
    setIsDeleting(true);
    try {
      await clientsService.remove(deleteClient.id);
      setDeleteClient(undefined);
      await clientsList.reload();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    clientsList,
    cards: buildClientSummaryCards({
      total: clientsList.pagination.total,
      activeCount: clientsList.rows.filter((client) => client.status === 'active').length,
      inactiveCount: clientsList.rows.filter((client) => client.status === 'inactive').length,
      onboardingCount: clientsList.rows.filter(
        (client) => resolveClientPlanName(client) === 'Sem plano',
      ).length,
    }),
    tableColumns: buildClientListColumns({
      onDetails: (client) => {
        void navigate(`/platform/clients/${client.id}`);
      },
      onEdit: (client) => {
        void navigate(`/platform/clients/${client.id}/edit`, { state: { entity: client } });
      },
      onDelete: setDeleteClient,
    }),
    mobileConfig: buildClientListMobileConfig({
      onDetails: (client) => {
        void navigate(`/platform/clients/${client.id}`);
      },
      onEdit: (client) => {
        void navigate(`/platform/clients/${client.id}/edit`, { state: { entity: client } });
      },
      onDelete: setDeleteClient,
    }),
    filterValues: {
      query: searchValue,
      status: statusValue,
      startDate: startDateValue,
      endDate: endDateValue,
    },
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      if (filterKey === 'query') {
        setSearchValue(typeof filterValue === 'string' ? filterValue : '');
      }
      if (filterKey === 'status') {
        setStatusValue(typeof filterValue === 'string' ? filterValue : '');
      }
      if (filterKey === 'startDate') {
        setStartDateValue(typeof filterValue === 'string' ? filterValue : null);
      }
      if (filterKey === 'endDate') {
        setEndDateValue(typeof filterValue === 'string' ? filterValue : null);
      }
    },
    applyFilters: () => {
      clientsList.updateQueryParams({
        search: searchValue || undefined,
        status: statusValue === 'active' || statusValue === 'inactive' ? statusValue : undefined,
        startDate: startDateValue ?? undefined,
        endDate: endDateValue ?? undefined,
        page: 1,
      });
    },
    clearFilters: () => {
      setSearchValue('');
      setStatusValue('');
      setStartDateValue(null);
      setEndDateValue(null);
      clientsList.updateQueryParams({
        search: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      });
    },
    can,
    deleteModal: {
      client: deleteClient,
      isDeleting,
      close: () => setDeleteClient(undefined),
      confirm: handleDeleteConfirm,
    },
  };
};
