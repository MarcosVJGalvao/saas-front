import AddIcon from '@mui/icons-material/Add';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo } from 'react';
import type { DataListMobileConfig } from '../../components/common/data/dataList.types';
import type { DataTableColumn } from '../../components/common/data/DataTable';
import { RowActionsMenu } from '../../components/common/data/RowActionsMenu';
import { LocalizedStatusBadge } from '../../components/common/display/LocalizedStatusBadge';
import type { Client } from '../../models/clients';
import { maskCnpj, maskCpf } from '../../utils/mask';
import { useClientsListPage } from './useClientsListPage';

const detectDocumentType = (documentNumber: string): 'CPF' | 'CNPJ' | 'OTHER' => {
  const digitsOnly = documentNumber.replace(/\D/g, '');
  if (digitsOnly.length === 11) return 'CPF';
  if (digitsOnly.length === 14) return 'CNPJ';
  return 'OTHER';
};

const formatClientDocument = (row: Client): string => {
  const detectedType = detectDocumentType(row.documentNumber);
  const documentType = row.documentType ?? detectedType;
  if (documentType === 'CPF') return maskCpf(row.documentNumber);
  if (documentType === 'CNPJ') return maskCnpj(row.documentNumber);
  return row.documentNumber;
};

export const useClientsListPageViewModel = () => {
  const view = useClientsListPage();
  const buildClientActions = useCallback(
    (row: Client) => [
      {
        key: 'view',
        label: 'Ver detalhes',
        onClick: () => view.setSelectedClientId(row.id),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void view.navigate(`/platform/clients/${row.id}/edit`),
      },
      { key: 'delete', label: 'Excluir', onClick: () => view.setDeleteClientId(row.id) },
    ],
    [view],
  );
  const rows = view.list.rows;
  const total = view.list.meta.total;
  const activeCount = rows.filter((item) => item.status === 'active').length;
  const inactiveCount = rows.filter((item) => item.status === 'inactive').length;
  const trialCount = Math.max(0, total - activeCount - inactiveCount);

  const columns = useMemo<DataTableColumn<Client>[]>(
    () => [
      {
        key: 'client',
        header: 'Cliente',
        width: '1.35fr',
        render: (row) => (
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
              {row.tradeName?.charAt(0) ?? row.legalName.charAt(0)}
            </Avatar>
            <Stack>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {row.legalName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        key: 'document',
        header: 'Documento',
        width: '1.25fr',
        render: (row) => formatClientDocument(row),
      },
      {
        key: 'tenant',
        header: 'Tenant',
        width: '1.35fr',
        render: (row) => row.tenant?.name ?? row.tenantSlug ?? '-',
      },
      {
        key: 'plan',
        header: 'Plano',
        width: '1fr',
        render: (row) => row.tenant?.subscriptions?.[0]?.plan?.name ?? row.planName ?? '-',
      },
      {
        key: 'status',
        header: 'Status',
        width: '96px',
        render: (row) => (
          <LocalizedStatusBadge
            label={row.status === 'active' ? 'Ativa' : 'Inativa'}
            tone={row.status === 'active' ? 'active' : 'neutral'}
          />
        ),
      },
      {
        key: 'createdAt',
        header: 'Criado em',
        width: '120px',
        render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
      },
      {
        key: 'actions',
        header: 'Ações',
        align: 'right',
        width: '44px',
        render: (row) => (
          <RowActionsMenu
            triggerAriaLabel={`Abrir ações de ${row.legalName}`}
            actions={buildClientActions(row)}
          />
        ),
      },
    ],
    [buildClientActions],
  );

  const mobileConfig: DataListMobileConfig<Client> = {
    renderTitle: (row) => row.legalName,
    renderAvatar: (row) => (
      <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
        {row.tradeName?.charAt(0) ?? row.legalName.charAt(0)}
      </Avatar>
    ),
    renderStatus: (row) => (
      <LocalizedStatusBadge
        label={row.status === 'active' ? 'Ativa' : 'Inativa'}
        tone={row.status === 'active' ? 'active' : 'neutral'}
      />
    ),
    renderActions: (row) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações de ${row.legalName}`}
        actions={buildClientActions(row)}
      />
    ),
    renderDetails: (row) => (
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Documento
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatClientDocument(row)}
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Plano
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.tenant?.subscriptions?.[0]?.plan?.name ?? row.planName ?? '-'}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Criado em
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {new Date(row.createdAt).toLocaleDateString('pt-BR')}
          </Typography>
        </Stack>
      </Stack>
    ),
  };

  return {
    view,
    pageHeader: {
      title: 'Listagem de Clientes',
      subtitle: 'Gerencie todos os clientes cadastrados na plataforma.',
      actionLabel: 'Novo Cliente',
      actionIcon: <AddIcon />,
      canShowAction: view.can('platform:clients:create'),
      onAction: () => void view.navigate('/platform/clients/onboarding'),
    },
    cards: [
      {
        key: 'total',
        title: 'Total de Clientes',
        value: total,
        delta: '+12 este mês',
        icon: <GroupOutlinedIcon color="primary" />,
        color: 'success.main',
      },
      {
        key: 'active',
        title: 'Clientes Ativos',
        value: activeCount,
        delta: '+9 este mês',
        icon: <GroupOutlinedIcon color="success" />,
        color: 'success.main',
      },
      {
        key: 'trial',
        title: 'Em Trial',
        value: trialCount,
        delta: '0 este mês',
        icon: <ScheduleOutlinedIcon color="warning" />,
        color: 'success.main',
      },
      {
        key: 'canceled',
        title: 'Cancelados',
        value: inactiveCount,
        delta: '+3 este mês',
        icon: <HighlightOffOutlinedIcon color="error" />,
        color: 'error.main',
      },
    ],
    exportActionIcon: <DownloadOutlinedIcon />,
    query: view.list.query.search ?? '',
    onQueryChange: (search: string) => view.list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => view.list.updateQuery({ page }),
    onLimitChange: (limit: number) => view.list.updateQuery({ limit, page: 1 }),
    onEdit: (id: string) => void view.navigate(`/platform/clients/${id}/edit`),
    columns,
    mobileConfig,
  };
};
