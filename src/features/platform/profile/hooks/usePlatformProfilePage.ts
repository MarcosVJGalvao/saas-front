import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { usePlatformProfile } from '@features/platform/auth/hooks/usePlatformProfile';
import { toPlatformProfileDetailsData } from '@features/platform/profile/normalizers/platformProfileDetails.normalizer';

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

export const usePlatformProfilePage = () => {
  const navigate = useNavigate();
  const { authDomain, session } = useAuth();
  const { loading, profile, errorMessage, refetch } = usePlatformProfile({
    enabled: authDomain === 'platform' && session !== null,
  });

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : profile
        ? 'ready'
        : 'empty';

  return {
    data: profile
      ? toPlatformProfileDetailsData(profile, () => {
          void navigate('/platform/change-password');
        })
      : emptyDetailsData,
    viewState,
    errorMessage,
    onBack: () => {
      void navigate('/platform/home');
    },
    onRetry: refetch,
  };
};
