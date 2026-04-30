import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './errors/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth/useAuth';
import { AppThemeProvider } from './hooks/useColorMode/useColorMode';
import { ErrorProvider } from './hooks/useError/useError';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Elemento root não encontrado.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ErrorProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ErrorProvider>
        </AuthProvider>
      </ErrorBoundary>
    </AppThemeProvider>
  </StrictMode>,
);
