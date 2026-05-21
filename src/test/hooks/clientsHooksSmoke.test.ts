import { describe, expect, it } from 'vitest';
import { useClientCreatePage } from '@features/platform/clients/hooks/useClientCreatePage';
import { useClientDetailsPage } from '@features/platform/clients/hooks/useClientDetailsPage';
import { useClientEditPage } from '@features/platform/clients/hooks/useClientEditPage';
import { useClientOnboardingPage } from '@features/platform/clients/hooks/useClientOnboardingPage';
import { useClientsList } from '@features/platform/clients/hooks/useClientsList';
import { useClientsListPage } from '@features/platform/clients/hooks/useClientsListPage';

describe('clients hooks smoke', () => {
  it('exports canonical clients hooks', () => {
    expect(useClientsList).toBeTypeOf('function');
    expect(useClientsListPage).toBeTypeOf('function');
    expect(useClientDetailsPage).toBeTypeOf('function');
    expect(useClientCreatePage).toBeTypeOf('function');
    expect(useClientEditPage).toBeTypeOf('function');
    expect(useClientOnboardingPage).toBeTypeOf('function');
  });
});
