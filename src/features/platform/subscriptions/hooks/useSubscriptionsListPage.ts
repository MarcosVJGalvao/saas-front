import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubscriptionPlanHistory } from '@features/platform/subscriptions/types/subscriptions';
import { useSubscriptionsList } from '@features/platform/subscriptions/hooks/useSubscriptionsList';
import { useSubscriptionsMutations } from '@features/platform/subscriptions/hooks/useSubscriptionsMutations';

export interface SelectedSubscriptionRef {
  id: string;
  tenantId: string;
}

export const useSubscriptionsListPage = () => {
  const navigate = useNavigate();
  const list = useSubscriptionsList();
  const mutations = useSubscriptionsMutations();
  const [selected, setSelected] = useState<SelectedSubscriptionRef | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [historyRows, setHistoryRows] = useState<SubscriptionPlanHistory[]>([]);

  return useMemo(
    () => ({
      navigate,
      list,
      mutations,
      selected,
      setSelected,
      historyOpen,
      setHistoryOpen,
      cancelOpen,
      setCancelOpen,
      historyRows,
      setHistoryRows,
    }),
    [navigate, list, mutations, selected, historyOpen, cancelOpen, historyRows],
  );
};
