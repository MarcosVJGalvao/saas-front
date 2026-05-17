import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localPermissionResolver } from '@app/layout/admin-navigation/permissions';
import { useClientDetails } from '@features/platform/clients/hooks/useClientDetails';
import { useClientsList } from '@features/platform/clients/hooks/useClientsList';
import { useClientsMutations } from '@features/platform/clients/hooks/useClientsMutations';

export const useClientsListPage = () => {
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [deleteClientId, setDeleteClientId] = useState<string | undefined>(undefined);
  const list = useClientsList();
  const details = useClientDetails(selectedClientId);
  const mutations = useClientsMutations();

  const can = (permission: string): boolean => {
    const permissions = localPermissionResolver.getPermissions('platform');
    return permissions.includes(permission) || permissions.includes('platform:clients:*');
  };

  const deleteClientName = useMemo(
    () => list.rows.find((item) => item.id === deleteClientId)?.legalName,
    [list.rows, deleteClientId],
  );

  const confirmDelete = async (): Promise<void> => {
    if (!deleteClientId) return;
    await mutations.remove(deleteClientId);
    setDeleteClientId(undefined);
    setSelectedClientId(undefined);
    await list.refresh();
  };

  return {
    navigate,
    list,
    details,
    mutations,
    selectedClientId,
    setSelectedClientId,
    deleteClientId,
    setDeleteClientId,
    deleteClientName,
    can,
    confirmDelete,
  };
};
