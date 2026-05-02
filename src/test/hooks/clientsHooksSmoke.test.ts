import { describe, expect, it } from 'vitest';
import { useClientDetails } from '../../hooks/clients/useClientDetails';
import { useClientsList } from '../../hooks/clients/useClientsList';
import { useClientsMutations } from '../../hooks/clients/useClientsMutations';

describe('clients hooks smoke', () => {
  it('exports clients hooks', () => {
    expect(useClientsList).toBeTypeOf('function');
    expect(useClientDetails).toBeTypeOf('function');
    expect(useClientsMutations).toBeTypeOf('function');
  });
});
