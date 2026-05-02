import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryDataTable } from '../../components/common/data/QueryDataTable';
import type { PaginationMeta } from '../../models/pagination';

interface TestRow {
  id: string;
  name: string;
}

const meta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const columns = [
  {
    key: 'name',
    header: 'Nome',
    render: (row: TestRow) => row.name,
    mobileRender: (row: TestRow) => row.name,
  },
];

describe('QueryDataTable', () => {
  it('renders rows and search interaction', async () => {
    const handleQueryChange = vi.fn();

    const { getByText, getByPlaceholderText } = render(
      <QueryDataTable
        rows={[{ id: '1', name: 'Alice' }]}
        columns={columns}
        meta={meta}
        query=""
        queryDebounceInMilliseconds={0}
        onQueryChange={handleQueryChange}
        loading={false}
        onPageChange={() => undefined}
        onRowsPerPageChange={() => undefined}
      />,
    );

    expect(getByText('Nome')).toBeInTheDocument();
    fireEvent.change(getByPlaceholderText('Buscar...'), { target: { value: 'Al' } });
    await waitFor(() => {
      expect(handleQueryChange).toHaveBeenCalledWith('Al');
    });
  });

  it('renders error state and triggers retry', () => {
    const onRetry = vi.fn();
    const { getByText } = render(
      <QueryDataTable
        rows={[]}
        columns={columns}
        meta={meta}
        query=""
        onQueryChange={() => undefined}
        loading={false}
        errorMessage="Falha ao carregar"
        onRetry={onRetry}
        onPageChange={() => undefined}
        onRowsPerPageChange={() => undefined}
      />,
    );

    expect(getByText('Falha ao carregar')).toBeInTheDocument();
    fireEvent.click(getByText('Tentar novamente'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when there are no rows', () => {
    const { getByText } = render(
      <QueryDataTable
        rows={[]}
        columns={columns}
        meta={meta}
        query=""
        onQueryChange={() => undefined}
        loading={false}
        onPageChange={() => undefined}
        onRowsPerPageChange={() => undefined}
      />,
    );

    expect(getByText('Nenhum registro encontrado')).toBeInTheDocument();
    expect(getByText('Ajuste os filtros e tente novamente.')).toBeInTheDocument();
  });

  it('renders inline toolbar content', () => {
    const { getByText } = render(
      <QueryDataTable
        rows={[{ id: '1', name: 'Alice' }]}
        columns={columns}
        meta={meta}
        query=""
        onQueryChange={() => undefined}
        loading={false}
        onPageChange={() => undefined}
        onRowsPerPageChange={() => undefined}
        toolbarContent={<div>Filtro inline</div>}
      />,
    );

    expect(getByText('Filtro inline')).toBeInTheDocument();
  });
});
