import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildSubscriptionColumns,
  buildSubscriptionMobileConfig,
} from '@features/platform/subscriptions/components/subscriptionListColumns';
import { subscriptionsService } from '@features/platform/subscriptions/services/service';
import type {
  Subscription,
  SubscriptionPlanHistory,
} from '@features/platform/subscriptions/types/subscriptions';
import { useSubscriptionsList } from '@features/platform/subscriptions/hooks/useSubscriptionsList';

type SelectedSubscriptionRef = {
  id: string;
  tenantId: string;
};

export const useSubscriptionsListPage = () => {
  const navigate = useNavigate();
  const subscriptionsList = useSubscriptionsList();
  const [selectedSubscription, setSelectedSubscription] = useState<SelectedSubscriptionRef | null>(
    null,
  );
  const [historyRows, setHistoryRows] = useState<SubscriptionPlanHistory[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();

  const openHistory = async (subscription: Subscription): Promise<void> => {
    setSelectedSubscription({ id: subscription.id, tenantId: subscription.tenantId });
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      const response = await subscriptionsService.getPlanHistory(
        subscription.id,
        subscription.tenantId,
      );
      setHistoryRows(response);
      setHistoryOpen(true);
    } catch {
      setActionErrorMessage('Não foi possível carregar o histórico do plano.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmCancel = async (): Promise<void> => {
    if (!selectedSubscription) {
      return;
    }

    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      await subscriptionsService.cancel(selectedSubscription.id, selectedSubscription.tenantId, {
        immediate: true,
      });
      setCancelOpen(false);
      await subscriptionsList.reload();
    } catch {
      setActionErrorMessage('Não foi possível cancelar a assinatura.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!selectedSubscription) {
      return;
    }

    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      await subscriptionsService.remove(selectedSubscription.id, selectedSubscription.tenantId);
      setDeleteOpen(false);
      await subscriptionsList.reload();
    } catch {
      setActionErrorMessage('Não foi possível excluir a assinatura.');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    subscriptionsList,
    actionErrorMessage,
    tableColumns: buildSubscriptionColumns({
      onDetails: (subscription) => {
        void navigate(
          `/platform/subscriptions/${subscription.id}?tenantId=${subscription.tenantId}`,
        );
      },
      onEdit: (subscription) => {
        void navigate(
          `/platform/subscriptions/${subscription.id}/edit?tenantId=${subscription.tenantId}`,
          {
            state: { entity: subscription },
          },
        );
      },
      onHistory: (subscription) => {
        void openHistory(subscription);
      },
      onCancel: (subscription) => {
        setSelectedSubscription({ id: subscription.id, tenantId: subscription.tenantId });
        setCancelOpen(true);
      },
      onDelete: (subscription) => {
        setSelectedSubscription({ id: subscription.id, tenantId: subscription.tenantId });
        setDeleteOpen(true);
      },
    }),
    mobileConfig: buildSubscriptionMobileConfig({
      onDetails: (subscription) => {
        void navigate(
          `/platform/subscriptions/${subscription.id}?tenantId=${subscription.tenantId}`,
        );
      },
      onEdit: (subscription) => {
        void navigate(
          `/platform/subscriptions/${subscription.id}/edit?tenantId=${subscription.tenantId}`,
          {
            state: { entity: subscription },
          },
        );
      },
      onHistory: (subscription) => {
        void openHistory(subscription);
      },
      onCancel: (subscription) => {
        setSelectedSubscription({ id: subscription.id, tenantId: subscription.tenantId });
        setCancelOpen(true);
      },
      onDelete: (subscription) => {
        setSelectedSubscription({ id: subscription.id, tenantId: subscription.tenantId });
        setDeleteOpen(true);
      },
    }),
    historyDialog: {
      open: historyOpen,
      rows: historyRows.map((historyRow) => ({
        id: historyRow.id,
        primary: `${historyRow.fromPlanId ?? '-'} -> ${historyRow.toPlanId} (${historyRow.changedAt})`,
      })),
      close: () => {
        setHistoryOpen(false);
        setHistoryRows([]);
      },
    },
    cancelDialog: {
      open: cancelOpen,
      close: () => {
        setCancelOpen(false);
      },
      confirm: confirmCancel,
    },
    deleteDialog: {
      open: deleteOpen,
      close: () => {
        setDeleteOpen(false);
      },
      confirm: confirmDelete,
    },
    actionLoading,
    onCreate: () => {
      void navigate('/platform/subscriptions/new');
    },
  };
};
