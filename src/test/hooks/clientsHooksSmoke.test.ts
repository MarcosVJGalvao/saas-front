import { describe, expect, it } from 'vitest';
import { useClientDetails } from '@features/clients/hooks/useClientDetails';
import { useClientsList } from '@features/clients/hooks/useClientsList';
import { useClientsMutations } from '@features/clients/hooks/useClientsMutations';

describe('clients hooks smoke', () => {
  it('exports clients hooks', () => {
    expect(useClientsList).toBeTypeOf('function');
    expect(useClientDetails).toBeTypeOf('function');
    expect(useClientsMutations).toBeTypeOf('function');
  });
});
