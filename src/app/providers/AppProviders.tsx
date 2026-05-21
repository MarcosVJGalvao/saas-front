import { type ReactNode } from 'react';
import { ErrorBoundary } from '@app/error-boundary/AppErrorBoundary';
import { PwaProvider } from '@app/pwa/PwaProvider';
import { AuthProvider } from '@app/providers/AuthProvider';
import { ErrorProvider } from '@app/providers/ErrorProvider';
import { AppThemeProvider } from '@theme/ThemeProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <AppThemeProvider>
    <ErrorBoundary>
      <PwaProvider>
        <AuthProvider>
          <ErrorProvider>{children}</ErrorProvider>
        </AuthProvider>
      </PwaProvider>
    </ErrorBoundary>
  </AppThemeProvider>
);
