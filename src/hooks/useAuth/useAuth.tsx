import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const value = useMemo(() => ({ token, setToken }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
};
