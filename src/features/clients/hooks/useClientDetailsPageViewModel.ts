import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  buildClientDetailsFooterActions,
  buildClientDetailsHeaderData,
  buildClientDetailsTabs,
} from '@features/clients/components/clientDetailsPresentation';
import type { DetailTab, DetailsFooterAction, DetailsHeaderData } from '@models/detailsDrawer';
import { useClientDetails } from '@features/clients/hooks/useClientDetails';

export const useClientDetailsPageViewModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, errorMessage } = useClientDetails(id);

  const headerData = useMemo<DetailsHeaderData | null>(() => {
    if (!data) return null;
    return buildClientDetailsHeaderData(data);
  }, [data]);

  const tabs = useMemo<ReadonlyArray<DetailTab>>(() => {
    if (!data) return [];
    return buildClientDetailsTabs(data);
  }, [data]);

  const footerActions = useMemo<ReadonlyArray<DetailsFooterAction>>(() => {
    if (!data) return [];
    return buildClientDetailsFooterActions(data, {
      onEditClient: (client) => {
        void navigate(`/platform/clients/${client.id}/edit`);
      },
    });
  }, [data, navigate]);

  return {
    loading,
    errorMessage,
    headerData,
    tabs,
    footerActions,
    onClose: () => void navigate(-1),
  };
};
