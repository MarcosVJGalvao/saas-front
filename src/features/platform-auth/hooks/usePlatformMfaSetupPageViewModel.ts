import { usePlatformMfaSetupFlow } from '@features/platform-auth/hooks/usePlatformMfaSetupFlow';

export const usePlatformMfaSetupPageViewModel = () => {
  const { totpSetup, challengeToken, form, loading, manualCode, qrCodeUrl, handleSubmit } =
    usePlatformMfaSetupFlow();
  const shouldRedirectToLogin = totpSetup === null || challengeToken === null;

  return {
    form,
    loading,
    isSubmitDisabled: loading || !form.formState.isValid,
    manualCode,
    qrCodeUrl,
    handleSubmit,
    shouldRedirectToLogin,
  };
};
