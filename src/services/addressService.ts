import type { ViaCepAddress } from '../models/address';
import { onlyDigits } from '../utils/parse';

const isViaCepAddress = (value: unknown): value is ViaCepAddress => {
  if (typeof value !== 'object' || value === null || 'erro' in value) {
    return false;
  }

  if (
    !('cep' in value) ||
    !('logradouro' in value) ||
    !('complemento' in value) ||
    !('bairro' in value) ||
    !('localidade' in value) ||
    !('uf' in value) ||
    !('ibge' in value) ||
    !('gia' in value) ||
    !('ddd' in value) ||
    !('siafi' in value)
  ) {
    return false;
  }

  return true;
};

export const fetchAddressByCep = async (cep: string): Promise<ViaCepAddress> => {
  const normalizedCep = onlyDigits(cep);

  if (normalizedCep.length !== 8) {
    throw new Error('CEP inválido para consulta.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Falha ao consultar CEP.');
  }

  const data: unknown = await response.json();

  if (!isViaCepAddress(data)) {
    throw new Error('Resposta inválida do serviço de CEP.');
  }

  return data;
};
