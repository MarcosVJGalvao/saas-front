import { afterAll, describe, expect, it, vi } from 'vitest';
import { fetchAddressByCep } from '@shared/services/addressService';

const originalFetch = global.fetch;

describe('addressService', () => {
  it('should resolve via cep', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            cep: '01001-000',
            logradouro: 'Praca da Se',
            complemento: '',
            bairro: 'Se',
            localidade: 'Sao Paulo',
            uf: 'SP',
            ibge: '3550308',
            gia: '1004',
            ddd: '11',
            siafi: '7107',
          }),
          { status: 200 },
        ),
      ),
    );

    const result = await fetchAddressByCep('01001-000');
    expect(result.uf).toBe('SP');
    expect(result.ibge).toBe('3550308');
  });

  it('should throw on invalid cep length', async () => {
    await expect(fetchAddressByCep('123')).rejects.toThrow('CEP inválido');
  });
});

afterAll(() => {
  global.fetch = originalFetch;
});
