import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLocationStateSearch } from '@shared/utils/getLocationStateSearch';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import {
  buildAdminEntityColumns,
  buildAdminEntityMobileConfig,
} from '@features/client/admin/components/adminEntityListColumns';
import { useAdminEntitiesList } from '@features/client/admin/hooks/useAdminEntitiesList';
import type {
  ClientAdminEntity,
  ClientAdminQueryParams,
  ClientAdminStatus,
} from '@features/client/admin/types/admin.types';

type AdminEntityListService<TItem extends ClientAdminEntity> = {
  list: (params: ClientAdminQueryParams) => Promise<{
    data: TItem[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>;
  remove?: ((id: string) => Promise<void>) | undefined;
};

type AdminEntityFilterValues = {
  query: string;
  status: string;
};

type UseAdminEntityListBaseParams<TItem extends ClientAdminEntity> = {
  routeBase: string;
  service: AdminEntityListService<TItem>;
  errorMessageFallback: string;
  showRole: boolean;
  showPermissions: boolean;
  showDescription?: boolean;
  showEmail?: boolean;
  showStatus?: boolean;
};

const initialFilterValues: AdminEntityFilterValues = {
  query: '',
  status: '',
};

const isAdminStatus = (value: string): value is ClientAdminStatus =>
  value === 'active' || value === 'inactive';

const getOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

export const useAdminEntityListBase = <TItem extends ClientAdminEntity>({
  routeBase,
  service,
  errorMessageFallback,
  showRole,
  showPermissions,
  showDescription = false,
  showEmail = true,
  showStatus = true,
}: UseAdminEntityListBaseParams<TItem>): {
  adminEntityList: ReturnType<typeof useAdminEntitiesList<TItem>>;
  filterValues: AdminEntityFilterValues;
  onFilterChange: (fieldName: string, fieldValue: unknown) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  tableColumns: DataTableColumn<ClientAdminEntity>[];
  mobileConfig: DataListMobileConfig<ClientAdminEntity>;
  deleteModal: {
    entityPendingDelete: ClientAdminEntity | undefined;
    close: () => void;
    confirm: () => Promise<void>;
    deleting: boolean;
  };
} => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = getLocationStateSearch(location.state);
  const adminEntityList = useAdminEntitiesList(service, errorMessageFallback);
  const [filterValues, setFilterValues] = useState<AdminEntityFilterValues>({
    ...initialFilterValues,
    query: initialSearch,
  });
  const [entityPendingDelete, setEntityPendingDelete] = useState<ClientAdminEntity | undefined>();
  const [deleting, setDeleting] = useState(false);

  const onFilterChange = (fieldName: string, fieldValue: unknown): void => {
    setFilterValues((currentValues) => ({
      ...currentValues,
      [fieldName]: typeof fieldValue === 'string' ? fieldValue : '',
    }));
  };

  const applyFilters = (): void => {
    adminEntityList.updateQuery({
      search: getOptionalText(filterValues.query),
      status: isAdminStatus(filterValues.status) ? filterValues.status : undefined,
      page: 1,
    });
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    adminEntityList.updateQuery({
      search: undefined,
      status: undefined,
      page: 1,
    });
  };

  const actions = {
    onDetails: (entity: ClientAdminEntity) => {
      void navigate(`${routeBase}/${entity.id}`);
    },
    onEdit: (entity: ClientAdminEntity) => {
      void navigate(`${routeBase}/${entity.id}/edit`, { state: { entity } });
    },
    onDelete: service.remove
      ? (entity: ClientAdminEntity) => setEntityPendingDelete(entity)
      : undefined,
  };

  const confirmDelete = async (): Promise<void> => {
    if (!entityPendingDelete || !service.remove) {
      return;
    }

    setDeleting(true);
    try {
      await service.remove(entityPendingDelete.id);
      setEntityPendingDelete(undefined);
      await adminEntityList.reload();
    } finally {
      setDeleting(false);
    }
  };

  return {
    adminEntityList,
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    tableColumns: buildAdminEntityColumns(
      actions,
      showRole,
      showPermissions,
      showDescription,
      showEmail,
      showStatus,
    ),
    mobileConfig: buildAdminEntityMobileConfig(actions, showRole, showPermissions),
    deleteModal: {
      entityPendingDelete,
      close: () => setEntityPendingDelete(undefined),
      confirm: confirmDelete,
      deleting,
    },
  };
};
