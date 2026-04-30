import { useCallback } from 'react';
import Paper from '@mui/material/Paper';
import { LoginForm } from '../auth/LoginForm';
import type { LoginSchema } from '../../forms/validators';
import { useAsync } from '../../hooks/useAsync/useAsync';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { layoutSpacing } from '../../theme/spacing';

export const LoginContainer = () => {
  const { setToken } = useAuth();
  const { loading, execute } = useAsync(async () => Promise.resolve('fake-token-in-memory'));

  const handleSubmit = useCallback(
    async (data: LoginSchema) => {
      const token = await execute();
      if (token !== null && data.email.length > 0) {
        setToken(token);
      }
    },
    [execute, setToken],
  );

  return (
    <Paper
      elevation={2}
      sx={{
        mx: 'auto',
        p: layoutSpacing.formContainerPadding,
        width: '100%',
        maxWidth: { xs: '100%', sm: 520, md: 640 },
      }}
    >
      <LoginForm onSubmit={handleSubmit} loading={loading} />
    </Paper>
  );
};
