import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileMenu } from '@app/layout/admin-navigation/ProfileMenu';

describe('ProfileMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aciona a navegação de meu perfil ao clicar no item do menu', () => {
    const onProfile = vi.fn();
    const anchorElement = document.createElement('button');
    document.body.appendChild(anchorElement);

    render(
      <ProfileMenu
        anchorEl={anchorElement}
        open
        onClose={() => undefined}
        onProfile={onProfile}
        userName="Maria"
        userInitials="MA"
        userEmail="maria@sistema.com"
        theme="light"
        density="normal"
        onSetTheme={() => undefined}
        onSetDensity={() => undefined}
        onLogout={() => undefined}
      />,
    );

    fireEvent.click(screen.getByText('Meu perfil'));

    expect(onProfile).toHaveBeenCalledTimes(1);
  });
});
