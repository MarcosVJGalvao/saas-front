import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { localPermissionResolver } from '../../components/layout/admin-navigation/permissions';
import { useClientDetails } from './useClientDetails';
import { useClientsList } from './useClientsList';
import { useClientsMutations } from './useClientsMutations';

const getPlatformPermissions = () => localPermissionResolver.getPermissions('platform');

export const useClientsListPageView = () => {
  const navigate = useNavigate();
  const list = useClientsList();
  const mutations = useClientsMutations();

  const can = (permission: string): boolean => {
    const permissions = getPlatformPermissions();
    return permissions.includes(permission) || permissions.includes('platform:clients:*');
  };

  const selected = useClientDetails(list.query.search);

  return useMemo(
    () => ({ navigate, list, mutations, can, selected }),
    [navigate, list, mutations, selected],
  );
};
