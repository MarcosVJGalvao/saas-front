import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';

describe('State components', () => {
  it('should render empty state', () => {
    const { getByText } = render(<EmptyState title="Sem dados" description="Nada encontrado" />);
    expect(getByText('Sem dados')).toBeInTheDocument();
    expect(getByText('Nada encontrado')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const { getByText } = render(<AppErrorState message="Falha ao carregar" />);
    expect(getByText('Erro ao carregar')).toBeInTheDocument();
    expect(getByText('Falha ao carregar')).toBeInTheDocument();
  });
});
