import { onlyDigits } from '@shared/parsers/stringParsers';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const normalizeOptionalDateToIsoDate = (value?: string): string | undefined => {
  if (value === undefined) return undefined;

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) return undefined;

  if (isoDatePattern.test(trimmedValue)) {
    return trimmedValue;
  }

  const digits = onlyDigits(trimmedValue);
  if (digits.length === 8) {
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    return `${year}-${month}-${day}`;
  }

  return trimmedValue;
};
