import { createElement, Fragment } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  buildClientListColumns,
  resolveClientPlanName,
} from '@features/platform/clients/components/clientListColumns';
import type { Client } from '@features/platform/clients/types/clients';

const createClient = (overrides?: Partial<Client>): Client => ({
  id: 'client-1',
  createdAt: '2026-05-22T23:43:57.320Z',
  updatedAt: '2026-05-22T23:43:58.000Z',
  legalName: 'Escola Doutrina Infantil',
  tradeName: 'Escola Doutrina Infantil LTDA',
  documentNumber: '90508042000120',
  documentType: 'CNPJ',
  email: 'contato@escola.com',
  phone: '71983418880',
  status: 'active',
  ...overrides,
});

describe('clientListColumns', () => {
  it('resolve o plano a partir da assinatura do tenant na listagem', () => {
    const client = createClient({
      tenant: {
        id: 'tenant-1',
        createdAt: '2026-05-22T23:43:57.508Z',
        updatedAt: '2026-05-22T23:43:57.508Z',
        clientId: 'client-1',
        name: 'Escola Doutrina Infantil',
        status: 'active',
        subscriptions: [
          {
            id: 'subscription-1',
            createdAt: '2026-05-22T23:43:57.808Z',
            updatedAt: '2026-05-22T23:43:57.808Z',
            tenantId: 'tenant-1',
            planId: 'plan-1',
            status: 'trialing',
            plan: {
              id: 'plan-1',
              createdAt: '2026-05-22T21:02:59.287Z',
              updatedAt: '2026-05-22T21:02:59.287Z',
              name: 'Premium',
            },
          },
        ],
      },
    });

    const columns = buildClientListColumns({
      onDetails: () => undefined,
      onEdit: () => undefined,
      onDelete: () => undefined,
    });
    const planColumn = columns.find((column) => column.key === 'plan');

    expect(resolveClientPlanName(client)).toBe('Premium');
    expect(planColumn?.header).toBe('Plano');
    expect(planColumn?.render(client)).toBe('Premium');
  });

  it('renderiza o status com badge na listagem', () => {
    const client = createClient({ status: 'active' });
    const columns = buildClientListColumns({
      onDetails: () => undefined,
      onEdit: () => undefined,
      onDelete: () => undefined,
    });
    const statusColumn = columns.find((column) => column.key === 'status');

    render(createElement(Fragment, null, statusColumn?.render(client)));

    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('exibe fallback quando o cliente não possui plano', () => {
    const client = createClient({
      tenant: {
        id: 'tenant-1',
        createdAt: '2026-05-22T23:43:57.508Z',
        updatedAt: '2026-05-22T23:43:57.508Z',
        clientId: 'client-1',
        name: 'Escola Doutrina Infantil',
        status: 'active',
        subscriptions: [],
      },
    });

    expect(resolveClientPlanName(client)).toBe('Sem plano');
  });
});
