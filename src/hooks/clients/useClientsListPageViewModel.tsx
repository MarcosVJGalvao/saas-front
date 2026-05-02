import AddIcon from '@mui/icons-material/Add';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import type { DataTableColumn } from '../../components/common/data/DataTable';
import { RowActionsMenu } from '../../components/common/data/RowActionsMenu';
import { StatusChip } from '../../components/common/display/StatusChip';
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
      { key: 'document', header: 'Documento', render: (row) => formatClientDocument(row) },
      {
        key: 'tenant',
        header: 'Tenant',
        render: (row) => row.tenant?.name ?? row.tenantSlug ?? '-',
      },
      {
        key: 'plan',
        header: 'Plano',
        render: (row) => row.tenant?.subscriptions?.[0]?.plan?.name ?? row.planName ?? '-',
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <StatusChip
            label={row.status === 'active' ? 'Ativa' : 'Inativa'}
            status={row.status === 'active' ? 'success' : 'default'}
            sx={
              row.status === 'active'
                ? {
                    bgcolor: '#DFF3E5',
                    color: '#1B7F3A',
                    fontWeight: 600,
                    border: 'none',
                  }
                : {
                    bgcolor: '#EEF1F4',
                    color: '#5B6570',
                    fontWeight: 600,
                    border: 'none',
                  }
            }
          />
        ),
      },
      {
        key: 'createdAt',
        header: 'Criado em',
        render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
      },
      {
        key: 'actions',
        header: 'Ações',
        align: 'right',
        render: (row) => (
          <RowActionsMenu
            actions={[
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
            ]}
          />
        ),
      },
    ],
    [view],
  );

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
        icon: <NorthEastIcon fontSize="inherit" color="success" />,
        color: 'success.main',
      },
      {
        key: 'active',
        title: 'Clientes Ativos',
        value: activeCount,
        delta: '+9 este mês',
        icon: <NorthEastIcon fontSize="inherit" color="success" />,
        color: 'success.main',
      },
      {
        key: 'trial',
        title: 'Em Trial',
        value: trialCount,
        delta: '0 este mês',
        icon: <NorthEastIcon fontSize="inherit" color="success" />,
        color: 'success.main',
      },
      {
        key: 'canceled',
        title: 'Cancelados',
        value: inactiveCount,
        delta: '+3 este mês',
        icon: <SouthEastIcon fontSize="inherit" color="error" />,
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
  };
};
