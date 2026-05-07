import { describe, expect, it } from 'vitest';
import { useClientLoginFlow } from '../../hooks/client-auth/useClientLoginFlow';
import { useClientLogout } from '../../hooks/client-auth/useClientLogout';
import { usePlatformLoginFlow } from '../../hooks/platform-auth/usePlatformLoginFlow';
import { usePlatformMfaFlow } from '../../hooks/platform-auth/usePlatformMfaFlow';
import { usePlatformMfaSetupFlow } from '../../hooks/platform-auth/usePlatformMfaSetupFlow';
import { usePlatformProfile } from '../../hooks/platform-auth/usePlatformProfile';
import { useAsync } from '../../hooks/useAsync/useAsync';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { useColorMode } from '../../hooks/useColorMode/useColorMode';
import { useDebounce } from '../../hooks/useDebounce/useDebounce';
import { useDebouncedCallback } from '../../hooks/useDebounce/useDebouncedCallback';
import { useError } from '../../hooks/useError/useError';
import { useAppLayoutState } from '../../hooks/useAppLayoutState';
import { CLIENT_HOME_MESSAGES } from '../../hooks/client-auth/useClientHomeData';

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
