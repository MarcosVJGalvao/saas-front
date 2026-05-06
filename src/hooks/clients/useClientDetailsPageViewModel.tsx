import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { ClientStatus } from '../../models/clients';
import type { DetailTab, DetailsFooterAction, DetailsHeaderData } from '../../models/detailsDrawer';
import { useClientDetails } from './useClientDetails';

const getStatusMeta = (
  status: ClientStatus,
): { label: string; color: NonNullable<DetailsHeaderData['statusColor']> } =>
  status === 'active'
    ? { label: 'Ativo', color: 'success' }
    : { label: 'Inativo', color: 'default' };

export const useClientDetailsPageViewModel = () => {
  const { id } = useParams();
  const { data, loading, errorMessage } = useClientDetails(id);

  const headerData = useMemo<DetailsHeaderData | null>(() => {
    if (!data) return null;
    const statusMeta = getStatusMeta(data.status);
    return {
      title: data.legalName,
      subtitle: data.documentNumber,
      avatarUrl: data.logoUrl,
      avatarFallback: data.legalName.slice(0, 1).toUpperCase(),
      statusLabel: statusMeta.label,
      statusColor: statusMeta.color,
    };
  }, [data]);

  const tabs = useMemo<ReadonlyArray<DetailTab>>(() => {
    if (!data) return [];
    return [
      {
        id: 'summary',
        label: 'Resumo',
        icon: <ArticleOutlined fontSize="small" />,
        sections: [
          {
            id: 'client-data',
            title: 'Dados do cliente',
            icon: <ArticleOutlined fontSize="small" />,
            items: [
              { label: 'Razão social', value: data.legalName },
              { label: 'Nome fantasia', value: data.tradeName },
              { label: 'Documento', value: data.documentNumber },
              { label: 'E-mail', value: data.email },
              { label: 'Telefone', value: data.phone },
              { label: 'Status', value: getStatusMeta(data.status).label },
            ],
          },
        ],
      },
      {
        id: 'academic',
        label: 'Acadêmico',
        icon: <SchoolOutlined fontSize="small" />,
        sections: [],
      },
      {
        id: 'financial',
        label: 'Financeiro',
        icon: <AccountBalanceWalletOutlined fontSize="small" />,
        sections: [
          {
            id: 'plan-data',
            title: 'Plano e assinatura',
            icon: <AccountBalanceWalletOutlined fontSize="small" />,
            items: [
              { label: 'Plano atual', value: data.planName ?? '-' },
              { label: 'Tenant', value: data.tenant?.name ?? '-' },
            ],
          },
        ],
      },
      {
        id: 'history',
        label: 'Histórico',
        icon: <HistoryOutlined fontSize="small" />,
        sections: [],
      },
    ];
  }, [data]);

  const footerActions = useMemo<ReadonlyArray<DetailsFooterAction>>(() => {
    if (!data) return [];
    return [
      {
        id: 'edit-client',
        label: 'Editar cliente',
        icon: <EditOutlined fontSize="small" />,
        onClick: () => undefined,
        color: 'primary',
      },
      {
        id: 'deactivate-client',
        label: 'Desativar cliente',
        icon: <BlockOutlined fontSize="small" />,
        onClick: () => undefined,
        color: 'error',
        disabled: data.status === 'inactive',
      },
    ];
  }, [data]);

  return { loading, errorMessage, headerData, tabs, footerActions };
};
