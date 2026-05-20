import { describe, expect, it } from 'vitest';

import { toSubscriptionCreatePayload } from '@features/platform/subscriptions/normalizers/subscriptionForm.normalizer';

describe('subscriptionForm.normalizer', () => {
  it('normaliza payload de assinatura', () => {
    expect(
      toSubscriptionCreatePayload({
        tenantId: ' tenant-1 ',
        planId: ' plan-1 ',
        status: 'active',
        startDate: '25/09/2026',
        endDate: '',
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
