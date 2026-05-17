import { useCallback, useState } from 'react';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import type { AddressFormFields, ViaCepAddress } from '@shared/types/address';
import { fetchAddressByCep } from '@shared/services/addressService';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { useError } from '@shared/hooks/useError/useError';

interface UseAddressAutoFillOptions {
  onResolved: (fields: Partial<AddressFormFields>) => void;
}

interface UseAddressAutoFillResult {
  loading: boolean;
  resolveByCep: (cep: string) => Promise<ViaCepAddress | null>;
}

const mapViaCepToFormFields = (address: ViaCepAddress): Partial<AddressFormFields> => ({
  zipCode: onlyDigits(address.cep),
  street: address.logradouro,
  complement: address.complemento,
  neighborhood: address.bairro,
  city: address.localidade,
  state: address.uf,
  cityIbgeCode: address.ibge,
});

export const useAddressAutoFill = ({
  onResolved,
}: UseAddressAutoFillOptions): UseAddressAutoFillResult => {
  const [loading, setLoading] = useState(false);
  const { pushError } = useError();

  const resolveByCep = useCallback(
    async (cep: string): Promise<ViaCepAddress | null> => {
      setLoading(true);
      try {
        const address = await fetchAddressByCep(cep);
        onResolved(mapViaCepToFormFields(address));
        return address;
      } catch (error) {
        pushError(ErrorHandler.normalize(error));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [onResolved, pushError],
  );

  return { loading, resolveByCep };
};
