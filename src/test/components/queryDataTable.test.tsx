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

describe('QueryDataTable', () => {
  it('renders rows and search interaction', async () => {
    const handleQueryChange = vi.fn();

    const { getByText, getByPlaceholderText } = render(
      <QueryDataTable<TestRow>
        rows={[{ id: '1', name: 'Alice' }]}
        columns={[
          {
            key: 'name',
            header: 'Nome',
            render: (row) => row.name,
            mobileRender: (row) => row.name,
          },
        ]}
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
});
