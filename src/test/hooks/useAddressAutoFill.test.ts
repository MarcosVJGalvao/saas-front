import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAddressAutoFill } from '../../hooks/useAddressAutoFill/useAddressAutoFill';

vi.mock('../../services/addressService', () => ({
  fetchAddressByCep: vi.fn(() =>
    Promise.resolve({
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107',
    }),
  ),
}));

const pushErrorMock = vi.fn();

vi.mock('../../hooks/useError/useError', () => ({
  useError: () => ({ pushError: pushErrorMock }),
}));

const hasUfField = (value: unknown): value is { uf: string } =>
  typeof value === 'object' && value !== null && 'uf' in value;

describe('useAddressAutoFill', () => {
  it('should resolve address and call onResolved with mapped fields', async () => {
    const onResolved = vi.fn();

    const { result } = renderHook(() => useAddressAutoFill({ onResolved }));

    let addressResult: unknown = null;

    await act(async () => {
      addressResult = await result.current.resolveByCep('01001-000');
    });

    await waitFor(() => {
      expect(onResolved).toHaveBeenCalledWith({
        zipCode: '01001000',
        street: 'Praça da Sé',
        complement: 'lado ímpar',
        neighborhood: 'Sé',
        city: 'São Paulo',
        state: 'SP',
        cityIbgeCode: '3550308',
      });
    });

    expect(hasUfField(addressResult)).toBe(true);
    if (hasUfField(addressResult)) {
      expect(addressResult.uf).toBe('SP');
    }
    expect(pushErrorMock).not.toHaveBeenCalled();
  });
});
