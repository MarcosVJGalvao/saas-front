import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from '../../components/common/data/DataTable';

describe('DataTable', () => {
  it('renders headers and row data', () => {
    const { getByText } = render(
      <DataTable
        rows={[{ name: 'Item A' }]}
        columns={[
          {
            key: 'name',
            header: 'Nome',
            render: (item) => item.name,
            mobileRender: (item) => item.name,
          },
        ]}
        meta={{
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }}
        onPageChange={() => undefined}
        onRowsPerPageChange={() => undefined}
      />,
    );
    expect(getByText('Nome')).toBeInTheDocument();
    expect(getByText('Item A')).toBeInTheDocument();
  });
});
