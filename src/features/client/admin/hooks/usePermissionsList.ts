import { useCallback, useEffect, useState } from 'react';
import { clientPermissionsService } from '@features/client/admin/services/service';
import type { ClientPermission } from '@features/client/admin/services/types';

export const usePermissionsList = () => {
  const [permissions, setPermissions] = useState<ClientPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPermissions = useCallback(async () => {
    setError('');
    try {
      const response = await clientPermissionsService.list({ page: 1, limit: 200 });
      setPermissions(response.data);
    } catch {
      setError('Não foi possível carregar as permissões.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPermissions();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchPermissions]);

  return { permissions, loading, error };
};
