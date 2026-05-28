import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PwaFeedbackBridge } from '@app/pwa/components/PwaFeedbackBridge';

vi.mock('@app/pwa/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => ({
    isOnline: false,
    lastConnectionChangeAt: null,
  }),
}));

vi.mock('@app/pwa/hooks/usePwaInstall', () => ({
  usePwaInstall: () => ({
    dismissInstallPrompt: vi.fn(),
    installApp: vi.fn(),
    isInstallAvailable: true,
    isInstalled: false,
    isIosInstallAvailable: false,
  }),
}));

vi.mock('@app/pwa/hooks/usePwaUpdate', () => ({
  usePwaUpdate: () => ({
    applyUpdate: vi.fn(),
    isUpdateAvailable: true,
    isUpdating: false,
    updateErrorMessage: null,
  }),
}));

describe('PwaFeedbackBridge', () => {
  it('renderiza feedbacks globais de conexão, instalação e atualização', () => {
    render(
      <MemoryRouter initialEntries={['/platform/login']}>
        <PwaFeedbackBridge />
      </MemoryRouter>,
    );

    expect(screen.getByText('Sem conexão com a internet')).toBeInTheDocument();
    expect(screen.getByText('Instale o aplicativo')).toBeInTheDocument();
    expect(screen.getByText('Nova versão disponível')).toBeInTheDocument();
    expect(screen.getByText('Atualizar agora')).toBeInTheDocument();
  });
});
