import { format, isValid, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseApiDate = (value: string): Date => {
  if (DATE_ONLY_PATTERN.test(value)) {
    return parse(value, 'yyyy-MM-dd', new Date());
  }

  return parseISO(value);
};

export const formatDate = (date: Date, pattern = 'dd/MM/yyyy'): string =>
  format(date, pattern, { locale: ptBR });

export const formatDateTime = (date: Date): string =>
  format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });

export const formatIsoDate = (isoDate: string, pattern = 'dd/MM/yyyy'): string => {
  const parsed = parseApiDate(isoDate);
  if (!isValid(parsed)) {
    return '';
  }
  return format(parsed, pattern, { locale: ptBR });
};
