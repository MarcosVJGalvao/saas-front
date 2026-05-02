import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubscriptionPlanHistory } from '../../models/subscriptions';
import { plansService } from '../../services/platform/plans/service';
import { useSubscriptionsList } from './useSubscriptionsList';
import { useSubscriptionsMutations } from './useSubscriptionsMutations';

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
  const [plans, setPlans] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    void plansService
      .list({ page: 1, limit: 100 })
      .then((response) => setPlans(response.data.map((plan) => ({ id: plan.id, name: plan.name }))))
      .catch(() => setPlans([]));
  }, []);

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
      plans,
    }),
    [navigate, list, mutations, selected, historyOpen, cancelOpen, historyRows, plans],
  );
};
