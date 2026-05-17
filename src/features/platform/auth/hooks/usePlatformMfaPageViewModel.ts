import { usePlatformMfaFlow } from '@features/platform/auth/hooks/usePlatformMfaFlow';

export const usePlatformMfaPageViewModel = () => {
  const { challengeToken, form, loading, handleSubmit } = usePlatformMfaFlow();
  return {
    challengeToken,
    form,
    loading,
    handleSubmit,
    shouldRedirectToLogin: challengeToken === null,
  };
};
