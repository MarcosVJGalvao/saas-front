import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { translateAttendanceStatus } from '@shared/i18n/pt-BR/enums';

export const attendanceStatusOptions: AppSelectOption[] = [
  { value: 'present', label: translateAttendanceStatus('present') },
  { value: 'absent', label: translateAttendanceStatus('absent') },
  { value: 'justified', label: translateAttendanceStatus('justified') },
];

export const attendanceWeekdayOptions: AppSelectOption[] = [
  { value: 'Segunda-feira', label: 'Segunda-feira' },
  { value: 'Terça-feira', label: 'Terça-feira' },
  { value: 'Quarta-feira', label: 'Quarta-feira' },
  { value: 'Quinta-feira', label: 'Quinta-feira' },
  { value: 'Sexta-feira', label: 'Sexta-feira' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' },
];
