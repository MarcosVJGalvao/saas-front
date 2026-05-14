import { describe, expect, it } from 'vitest';

import {
  normalizePlanPayload,
  normalizePlanUpdatePayload,
} from '@features/plans/normalizers/planPayloadNormalizer';

describe('planPayloadNormalizer', () => {
  it('normaliza payload de criação de plano', () => {
    expect(
      normalizePlanPayload({
        name: ' Plano Pro ',
        description: ' ',
        price: 'R$ 1.250,90',
        currency: 'brl',
        billingCycle: 'monthly',
        trialDays: 14,
        isActive: true,
      }),
    ).toEqual({
      name: 'Plano Pro',
      description: undefined,
      price: '1250.90',
      currency: 'BRL',
      billingCycle: 'monthly',
      trialDays: 14,
      isActive: true,
    });
  });

  it('normaliza payload parcial de edição de plano', () => {
    expect(
      normalizePlanUpdatePayload({
        price: '99.90',
        currency: ' usd ',
      }),
    ).toEqual({
      price: '99.90',
      currency: 'USD',
    });
  });
});
