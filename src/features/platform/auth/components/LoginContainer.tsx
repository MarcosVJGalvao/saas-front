import { useCallback } from 'react';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { LoginForm } from '@features/platform/auth/components/LoginForm';
import type { LoginSchema } from '@shared/schemas/authSchemas';
import { useAsync } from '@shared/hooks/useAsync/useAsync';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';
import { layoutSpacing } from '@theme/spacing';

export const LoginContainer = () => {
  const { completeAuthentication } = useAuth();
  const { loading, execute } = useAsync(async () => Promise.resolve('fake-token-in-memory'));

  const handleSubmit = useCallback(
    async (data: LoginSchema) => {
      const token = await execute();
      if (token !== null && data.email.length > 0) {
        completeAuthentication(AUTH_DOMAIN.PLATFORM, {
          accessToken: token,
          refreshToken: token,
          expiresIn: '15m',
          sessionId: 'local-session',
        });
      }
    },
    [completeAuthentication, execute],
  );

  return (
    <AppPaper
      elevation={2}
      sx={{
        mx: 'auto',
        p: layoutSpacing.formContainerPadding,
        width: '100%',
        maxWidth: { xs: '100%', sm: 520, md: 640 },
      }}
    >
      <LoginForm onSubmit={handleSubmit} loading={loading} />
    </AppPaper>
  );
};
