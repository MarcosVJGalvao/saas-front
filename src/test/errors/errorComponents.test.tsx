import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalError } from '../../errors/ModalError';
import { SnackbarError } from '../../errors/SnackbarError';
import { ErrorDisplayMode, ErrorSeverity, type AppError } from '../../models/types';

const errorMock: AppError = {
  message: 'Existem campos inválidos. Revise os dados informados.',
  messages: ['o campo não pode estar vazio', 'o e-mail é inválido'],
  code: 'INVALID_INPUT',
  correlationId: 'c113416d-2180-4141-9965-c14f93046977',
  severity: ErrorSeverity.MEDIUM,
  displayMode: ErrorDisplayMode.SNACKBAR,
};

describe('Error components', () => {
  it('renders snackbar list and copies correlation id', () => {
    const writeText = vi.fn();
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    const { getByText, getByLabelText } = render(
      <SnackbarError error={errorMock} onClose={() => undefined} />,
    );

    expect(getByText('o campo não pode estar vazio')).toBeInTheDocument();
    expect(getByText('o e-mail é inválido')).toBeInTheDocument();

    fireEvent.click(getByLabelText('Copiar codigo do erro'));
    expect(writeText).toHaveBeenCalledWith('c113416d-2180-4141-9965-c14f93046977');
  });

  it('renders modal list and correlation id', () => {
    const { getByText } = render(<ModalError error={errorMock} onClose={() => undefined} />);

    expect(getByText('Erro crítico')).toBeInTheDocument();
    expect(getByText('o campo não pode estar vazio')).toBeInTheDocument();
    expect(getByText('o e-mail é inválido')).toBeInTheDocument();
    expect(getByText('Codigo: c113416d-2180-4141-9965-c14f93046977')).toBeInTheDocument();
  });
});
