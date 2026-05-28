import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useClientProfile } from '@features/client/auth/hooks/useClientProfile';
import { toClientProfileDetailsData } from '@features/client/profile/normalizers/clientProfileDetails.normalizer';

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

export const useClientProfilePage = () => {
  const navigate = useNavigate();
  const { authDomain, session } = useAuth();
  const { loading, profile, errorMessage, refetch } = useClientProfile({
    enabled: authDomain === 'client' && session !== null,
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
      ? toClientProfileDetailsData(profile, () => {
          void navigate('/client/change-password');
        })
      : emptyDetailsData,
    viewState,
    errorMessage,
    onBack: () => {
      void navigate('/client/home');
    },
    onRetry: refetch,
  };
};
