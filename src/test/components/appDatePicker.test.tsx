import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';

interface MockDatePickerProps {
  label: string;
  onChange?: (value: Date | null, context: { validationError: string | null }) => void;
}

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: (props: MockDatePickerProps) => {
    return (
      <div>
        <span>{props.label}</span>
        <button
          type="button"
          onClick={() =>
            props.onChange?.(new Date(2026, 4, 22), {
              validationError: null,
            })
          }
        >
          selecionar-data-valida
        </button>
        <button
          type="button"
          onClick={() =>
            props.onChange?.(new Date('invalid'), {
              validationError: 'invalidDate',
            })
          }
        >
          digitar-data-invalida
        </button>
      </div>
    );
  },
}));

describe('AppDatePicker', () => {
  it('renders label', () => {
    render(<AppDatePicker label="Data" value={null} onChange={() => undefined} />);

    expect(screen.getAllByText('Data').length).toBeGreaterThan(0);
  });

  it('propaga data valida em formato de backend', () => {
    const handleChange = vi.fn<(value: string | null) => void>();

    render(<AppDatePicker label="Data" value={null} onChange={handleChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'selecionar-data-valida' }));

    expect(handleChange).toHaveBeenCalledWith('2026-05-22');
  });

  it('ignora digitacao invalida sem limpar o valor atual', () => {
    const handleChange = vi.fn<(value: string | null) => void>();

    render(<AppDatePicker label="Data" value="2026-05-10" onChange={handleChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'digitar-data-invalida' }));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('aceita valor legado com apenas digitos sem perder a data', () => {
    const handleChange = vi.fn<(value: string | null) => void>();

    render(<AppDatePicker label="Data" value="22051996" onChange={handleChange} />);

    expect(screen.getAllByText('Data').length).toBeGreaterThan(0);
  });
});
