import { onlyDigits } from '@shared/parsers/stringParsers';

const isRepeatedDigits = (value: string): boolean => /^([0-9])\1+$/.test(value);

export const isValidCpf = (value: string): boolean => {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || isRepeatedDigits(cpf)) {
    return false;
  }

  const calcCheck = (base: string, factor: number): number => {
    const total = base.split('').reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const mod = (total * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const firstCheck = calcCheck(cpf.slice(0, 9), 10);
  const secondCheck = calcCheck(cpf.slice(0, 10), 11);

  return firstCheck === Number(cpf[9]) && secondCheck === Number(cpf[10]);
};

export const isValidCnpj = (value: string): boolean => {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || isRepeatedDigits(cnpj)) {
    return false;
  }

  const calc = (base: string, factors: number[]): number => {
    const total = base
      .split('')
      .reduce((sum, digit, index) => sum + Number(digit) * (factors[index] ?? 0), 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const first = calc(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calc(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return first === Number(cnpj[12]) && second === Number(cnpj[13]);
};

export const isValidCep = (value: string): boolean => onlyDigits(value).length === 8;

export const isValidPhoneBr = (value: string): boolean => {
  const phone = onlyDigits(value);
  return phone.length === 10 || phone.length === 11;
};
