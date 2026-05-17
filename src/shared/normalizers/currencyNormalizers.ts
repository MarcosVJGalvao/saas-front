export const normalizeCurrencyValue = (value: string): string => {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) return trimmedValue;

  const valueWithoutCurrency = trimmedValue.replace(/[R$\s]/g, '');
  if (valueWithoutCurrency.includes(',')) {
    return valueWithoutCurrency.replace(/\./g, '').replace(',', '.');
  }

  return valueWithoutCurrency;
};
