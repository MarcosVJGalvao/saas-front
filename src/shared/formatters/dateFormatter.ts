import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date, pattern = 'dd/MM/yyyy'): string =>
  format(date, pattern, { locale: ptBR });

export const formatDateTime = (date: Date): string =>
  format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });

export const formatIsoDate = (isoDate: string, pattern = 'dd/MM/yyyy'): string => {
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) {
    return '';
  }
  return format(parsed, pattern, { locale: ptBR });
};
