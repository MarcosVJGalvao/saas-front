import { describe, expect, it } from 'vitest';
import { useClientLoginFlow } from '@features/client/auth/hooks/useClientLoginFlow';
import { useClientLogout } from '@features/client/auth/hooks/useClientLogout';
import { usePlatformLoginFlow } from '@features/platform/auth/hooks/usePlatformLoginFlow';
import { usePlatformMfaFlow } from '@features/platform/auth/hooks/usePlatformMfaFlow';
import { usePlatformMfaSetupFlow } from '@features/platform/auth/hooks/usePlatformMfaSetupFlow';
import { usePlatformProfile } from '@features/platform/auth/hooks/usePlatformProfile';
import { useAsync } from '@shared/hooks/useAsync/useAsync';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useColorMode } from '@shared/hooks/useColorMode/useColorMode';
import { useDebounce } from '@shared/hooks/useDebounce/useDebounce';
import { useDebouncedCallback } from '@shared/hooks/useDebounce/useDebouncedCallback';
import { useError } from '@shared/hooks/useError/useError';
import { useAppLayoutState } from '@shared/hooks/useAppLayoutState';
import { CLIENT_HOME_MESSAGES } from '@features/client/auth/hooks/useClientHomeData';

describe('hooks smoke', () => {
  it('exports hooks not individually covered yet', () => {
    expect(useClientLoginFlow).toBeTypeOf('function');
    expect(useClientLogout).toBeTypeOf('function');
    expect(usePlatformLoginFlow).toBeTypeOf('function');
    expect(usePlatformMfaFlow).toBeTypeOf('function');
    expect(usePlatformMfaSetupFlow).toBeTypeOf('function');
    expect(usePlatformProfile).toBeTypeOf('function');
    expect(useAsync).toBeTypeOf('function');
    expect(useAuth).toBeTypeOf('function');
    expect(useColorMode).toBeTypeOf('function');
    expect(useDebounce).toBeTypeOf('function');
    expect(useDebouncedCallback).toBeTypeOf('function');
    expect(useError).toBeTypeOf('function');
    expect(useAppLayoutState).toBeTypeOf('function');
    expect(() => CLIENT_HOME_MESSAGES).not.toThrow();
  });
});
