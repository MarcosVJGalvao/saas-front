import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';

describe('ListFilters', () => {
  it('renders title and fields', () => {
    render(
      <ListFilters
        title="Filtros"
        subtitle="Sub"
        fields={[{ type: 'text', name: 'search', label: 'Buscar' }]}
        values={{ search: '' }}
        onChange={() => undefined}
        onApply={() => undefined}
        onClear={() => undefined}
      />,
    );
    expect(screen.getByText('Filtros')).toBeTruthy();
    expect(screen.getByText('Buscar')).toBeTruthy();
  });

  it('calls onChange, onApply and onClear', () => {
    const onChange = vi.fn();
    const onApply = vi.fn();
    const onClear = vi.fn();
    render(
      <ListFilters
        fields={[
          { type: 'text', name: 'search', label: 'Buscar' },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            options: [{ label: 'Ativo', value: 'active' }],
          },
        ]}
        values={{ search: '', status: '' }}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Buscar...'), { target: { value: 'abc' } });
    const combobox = screen.getAllByRole('combobox')[0];
    if (combobox === undefined) {
      throw new Error('Combobox de status não encontrado.');
    }
    fireEvent.mouseDown(combobox);
    fireEvent.click(screen.getByText('Ativo'));
    fireEvent.click(screen.getByText('Aplicar filtros'));
    fireEvent.click(screen.getByText('Limpar filtros'));
    expect(onChange).toHaveBeenCalled();
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('supports collapsed and loading states', () => {
    render(
      <ListFilters
        fields={[{ type: 'text', name: 'search', label: 'Buscar' }]}
        values={{ search: '' }}
        onChange={() => undefined}
        onApply={() => undefined}
        onClear={() => undefined}
        defaultExpanded={false}
        loading
      />,
    );
    expect(screen.getByLabelText('Expandir filtros')).toBeTruthy();
  });
});
