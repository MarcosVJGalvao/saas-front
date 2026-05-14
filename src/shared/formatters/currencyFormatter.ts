export const formatCurrency = (value: string | number, currency: string): string => {
  const normalizedValue = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(normalizedValue)) {
    return `${value} ${currency}`;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(normalizedValue);
};
