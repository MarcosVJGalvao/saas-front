import { onlyDigits } from './parse';

export const maskCpf = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskCnpj = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const maskCep = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
};

export const maskPhone = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

export const maskCurrency = (value: string | number): string => {
  const numericValue = typeof value === 'number' ? value : Number(onlyDigits(value)) / 100;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(Number.isNaN(numericValue) ? 0 : numericValue);
};
