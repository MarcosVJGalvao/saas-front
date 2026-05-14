import { useContext } from 'react';
import { AuthProvider } from '@app/providers/AuthProvider';
import { AuthContext, type AuthContextValue } from '@app/providers/authContext';

export { AuthProvider };

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
};
