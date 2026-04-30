import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActionButtons } from '../../components/common/actions/ActionButtons';

describe('ActionButtons', () => {
  it('should render action labels and trigger callback', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(
      <ActionButtons
        actions={[
          { type: 'back', onClick: vi.fn() },
          { type: 'confirm', onClick: onConfirm },
        ]}
      />,
    );

    expect(getByText('Voltar')).toBeInTheDocument();
    const confirmButton = getByText('Confirmar');
    confirmButton.click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
