import { describe, expect, it } from 'vitest';

import {
  toPlanCreatePayload,
  toPlanEditPayload,
} from '@features/platform/plans/normalizers/planForm.normalizer';

describe('planForm.normalizer', () => {
  it('normaliza payload de criação de plano', () => {
    expect(
      toPlanCreatePayload({
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
      toPlanEditPayload({
        name: ' Plano Enterprise ',
        description: ' plano anual ',
        price: '99.90',
        currency: ' usd ',
        billingCycle: 'yearly',
        trialDays: 7,
        isActive: true,
      }),
    ).toEqual({
      name: 'Plano Enterprise',
      description: 'plano anual',
      price: '99.90',
      currency: 'USD',
      billingCycle: 'yearly',
      trialDays: 7,
      isActive: true,
    });
  });
});
