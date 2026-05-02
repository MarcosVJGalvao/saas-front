import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlansList } from './usePlansList';
import { usePlansMutations } from './usePlansMutations';

export const usePlansListPage = () => {
  const navigate = useNavigate();
  const list = usePlansList();
  const mutations = usePlansMutations();
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);

  const confirmDelete = useCallback(async (): Promise<void> => {
    if (!deleteId) return;
    await mutations.remove(deleteId);
    setDeleteId(undefined);
    await list.refresh();
  }, [deleteId, list, mutations]);

  return useMemo(
    () => ({ navigate, list, deleteId, setDeleteId, confirmDelete }),
    [navigate, list, deleteId, confirmDelete],
  );
};
