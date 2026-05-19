import { describe, expect, it, vi } from 'vitest';
import {
  normalizeAccountsPayableSettlementPayload,
  normalizeAccountsReceivableSettlementPayload,
} from '@features/client/financial/normalizers/financialSettlementNormalizer';

describe('financialSettlementNormalizer', () => {
  it('normaliza payload de pagamento com valor e data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 19, 12));

    expect(
      normalizeAccountsPayableSettlementPayload({
        id: 'payable-1',
        status: 'open',
        amount: 150.5,
        paymentMethod: 'pix',
      }),
    ).toEqual({
      paidAmount: 150.5,
      paymentDate: '2026-05-19',
      paymentMethod: 'pix',
    });

    vi.useRealTimers();
  });

  it('normaliza payload de recebimento com valor e data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 19, 12));

    expect(
      normalizeAccountsReceivableSettlementPayload({
        id: 'receivable-1',
        status: 'open',
        amount: 200,
      }),
    ).toEqual({
      receivedAmount: 200,
      receivedDate: '2026-05-19',
      paymentMethod: undefined,
    });

    vi.useRealTimers();
  });
});
