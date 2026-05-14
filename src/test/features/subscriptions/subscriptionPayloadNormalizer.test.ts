import { describe, expect, it } from 'vitest';

import { normalizeSubscriptionPayload } from '@features/subscriptions/normalizers/subscriptionPayloadNormalizer';

describe('subscriptionPayloadNormalizer', () => {
  it('normaliza payload de assinatura', () => {
    expect(
      normalizeSubscriptionPayload({
        tenantId: ' tenant-1 ',
        planId: ' plan-1 ',
        status: 'active',
        startDate: '25/09/2026',
        endDate: '',
        trialEndsAt: undefined,
        renewalDate: '2026-10-25',
        priceAtSubscription: 'R$ 1.250,90',
        blockedReason: ' ',
      }),
    ).toEqual({
      tenantId: 'tenant-1',
      planId: 'plan-1',
      status: 'active',
      startDate: '2026-09-25',
      endDate: undefined,
      trialEndsAt: undefined,
      renewalDate: '2026-10-25',
      priceAtSubscription: '1250.90',
      blockedReason: undefined,
    });
  });
});
