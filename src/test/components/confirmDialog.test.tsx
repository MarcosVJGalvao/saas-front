import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('triggers confirm callback', () => {
    const onConfirm = vi.fn();
    const { getByRole } = render(
      <ConfirmDialog
        open
        title="Confirmar"
        description="Deseja continuar?"
        onConfirm={onConfirm}
        onCancel={() => undefined}
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Confirmar' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
