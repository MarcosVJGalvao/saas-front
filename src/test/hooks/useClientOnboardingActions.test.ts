import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useClientOnboardingActions } from '@features/platform/clients/hooks/useClientOnboardingActions';
import {
  initialClientOnboardingUiExtras,
  initialClientOnboardingValue,
} from '@features/platform/clients/normalizers/clientOnboardingInitialState';
import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';
import type { ClientOnboardingUiExtras } from '@features/platform/clients/types/clientOnboarding';

vi.mock('@shared/hooks/useAddressAutoFill/useAddressAutoFill', () => ({
  useAddressAutoFill: () => ({
    loading: false,
    resolveByCep: vi.fn(() => Promise.resolve(undefined)),
  }),
}));

const isStateUpdater = <TValue>(
  nextValue: TValue | ((previousValue: TValue) => TValue),
): nextValue is (previousValue: TValue) => TValue => typeof nextValue === 'function';

const applyStateUpdate = <TValue>(
  currentValue: TValue,
  nextValue: TValue | ((previousValue: TValue) => TValue),
): TValue => {
  if (isStateUpdater(nextValue)) {
    return nextValue(currentValue);
  }

  return nextValue;
};

describe('useClientOnboardingActions', () => {
  it('mantem a data do administrador em formato de data', () => {
    let onboardingValue: CreateClientOnboardingRequest = initialClientOnboardingValue;
    let onboardingUiExtras: ClientOnboardingUiExtras = initialClientOnboardingUiExtras;

    const setValue = vi.fn(
      (
        nextValue:
          | CreateClientOnboardingRequest
          | ((previousValue: CreateClientOnboardingRequest) => CreateClientOnboardingRequest),
      ) => {
        onboardingValue = applyStateUpdate(onboardingValue, nextValue);
      },
    );

    const setUiExtras = vi.fn(
      (
        nextValue:
          | ClientOnboardingUiExtras
          | ((previousValue: ClientOnboardingUiExtras) => ClientOnboardingUiExtras),
      ) => {
        onboardingUiExtras = applyStateUpdate(onboardingUiExtras, nextValue);
      },
    );

    const { result, rerender } = renderHook(
      ({ currentUiExtras }) =>
        useClientOnboardingActions({
          uiExtras: currentUiExtras,
          setValue,
          setUiExtras,
        }),
      { initialProps: { currentUiExtras: onboardingUiExtras } },
    );

    act(() => {
      result.current.actions.updateAdminDateOfBirth('1996-05-22');
    });

    rerender({ currentUiExtras: onboardingUiExtras });

    expect(onboardingValue.employee.person.dateOfBirth).toBe('1996-05-22');
  });
});
