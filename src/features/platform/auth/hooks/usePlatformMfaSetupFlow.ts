import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { useAppForm } from '@shared/hooks/useAppForm';
import { totpCodeSchema, type TotpCodeSchema } from '@shared/schemas/authSchemas';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useError } from '@shared/hooks/useError/useError';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';
import { platformAuthService } from '@features/platform/auth/services/service';

export const usePlatformMfaSetupFlow = () => {
  const navigate = useNavigate();
  const { pushError } = useError();
  const { totpSetup, challengeToken, completeAuthentication } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useAppForm(totpCodeSchema, { totpCode: '' });

  const otpUrl = totpSetup?.otpauthUrl ?? '';
  const manualCode = formatManualCode(totpSetup?.secret ?? '');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(otpUrl)}`;

  const handleSubmit = async (data: TotpCodeSchema) => {
    if (challengeToken === null) {
      return;
    }
    setLoading(true);
    try {
      const session = await platformAuthService.verifyTotp(challengeToken, data.totpCode);
      completeAuthentication(AUTH_DOMAIN.PLATFORM, session);
      void navigate('/platform/home', { replace: true });
    } catch (error) {
      const normalizedError = ErrorHandler.normalize(error);
      pushError(normalizedError);
      if (normalizedError.code === 'MFA_CHALLENGE_EXPIRED') {
        void navigate('/platform/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    totpSetup,
    challengeToken,
    form,
    loading,
    manualCode,
    qrCodeUrl,
    handleSubmit,
  };
};

const formatManualCode = (secret: string): string => {
  const segments = secret.match(/.{1,4}/g);
  if (segments === null) {
    return '';
  }
  return segments.join('  ');
};
