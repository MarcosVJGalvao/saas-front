import { describe, expect, it } from 'vitest';
import { onlyDigits } from '../../utils/parse';
import { isValidCep, isValidCnpj, isValidCpf, isValidPhoneBr } from '../../utils/validation';
import { maskCep, maskCnpj, maskCpf, maskCurrency, maskPhone } from '../../utils/mask';

describe('utils mask/parse/validation', () => {
  it('should normalize digits', () => {
    expect(onlyDigits('(11) 99999-0000')).toBe('11999990000');
  });

  it('should mask values', () => {
    expect(maskCpf('12345678901')).toBe('123.456.789-01');
    expect(maskCnpj('12345678000199')).toBe('12.345.678/0001-99');
    expect(maskCep('01310930')).toBe('01310-930');
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
    expect(maskCurrency('12345')).toBe('R$ 123,45');
  });

  it('should validate brazilian docs', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCnpj('45.723.174/0001-10')).toBe(true);
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
    expect(isValidCep('01310-930')).toBe(true);
    expect(isValidPhoneBr('(11) 98765-4321')).toBe(true);
  });
});
