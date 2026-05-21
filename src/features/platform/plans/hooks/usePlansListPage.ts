import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildPlanColumns,
  buildPlanMobileConfig,
} from '@features/platform/plans/components/planListColumns';
import { plansService } from '@features/platform/plans/services/service';
import type { Plan } from '@features/platform/plans/types/plans';
import { usePlansList } from '@features/platform/plans/hooks/usePlansList';

export const usePlansListPage = () => {
  const navigate = useNavigate();
  const plansList = usePlansList();
  const [planPendingDelete, setPlanPendingDelete] = useState<Plan | undefined>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!planPendingDelete) {
      return;
    }

    setDeleteLoading(true);
    setActionErrorMessage(undefined);
    try {
      await plansService.remove(planPendingDelete.id);
      setPlanPendingDelete(undefined);
      await plansList.reload();
    } catch {
      setActionErrorMessage('Não foi possível excluir o plano.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    plansList,
    actionErrorMessage,
    tableColumns: buildPlanColumns({
      onDetails: (plan) => {
        void navigate(`/platform/plans/${plan.id}`);
      },
      onEdit: (plan) => {
        void navigate(`/platform/plans/${plan.id}/edit`, { state: { entity: plan } });
      },
      onDelete: setPlanPendingDelete,
    }),
    mobileConfig: buildPlanMobileConfig({
      onDetails: (plan) => {
        void navigate(`/platform/plans/${plan.id}`);
      },
      onEdit: (plan) => {
        void navigate(`/platform/plans/${plan.id}/edit`, { state: { entity: plan } });
      },
      onDelete: setPlanPendingDelete,
    }),
    deleteModal: {
      planPendingDelete,
      close: () => {
        setPlanPendingDelete(undefined);
      },
      confirm: handleDeleteConfirm,
      loading: deleteLoading,
    },
    onCreate: () => {
      void navigate('/platform/plans/new');
    },
  };
};
