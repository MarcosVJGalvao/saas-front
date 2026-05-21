import { z } from 'zod';

const isValidDecimal = (value: string): boolean => {
  const normalizedValue = value.trim().replace(',', '.');

  if (normalizedValue.length === 0) {
    return false;
  }

  return !Number.isNaN(Number(normalizedValue));
};

const buildNumberStringSchema = (
  requiredMessage: string,
  minimumValue: number,
  maximumValue: number,
  minimumMessage: string,
  maximumMessage: string,
) =>
  z
    .string()
    .min(1, requiredMessage)
    .refine(isValidDecimal, 'Informe um número válido.')
    .refine((value) => Number(value.trim().replace(',', '.')) >= minimumValue, minimumMessage)
    .refine((value) => Number(value.trim().replace(',', '.')) <= maximumValue, maximumMessage);

export const academicYearPeriodFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Informe o nome do período.')
      .max(100, 'Use até 100 caracteres.'),
    code: z
      .string()
      .trim()
      .min(1, 'Informe o código do período.')
      .max(30, 'Use até 30 caracteres.'),
    sequence: z
      .string()
      .min(1, 'Informe a sequência do período.')
      .refine((value) => /^\d+$/.test(value.trim()), 'Informe um número inteiro válido.')
      .refine((value) => Number(value.trim()) >= 1, 'A sequência deve ser maior ou igual a 1.'),
    startDate: z.string().min(1, 'Informe a data inicial do período.'),
    endDate: z.string().min(1, 'Informe a data final do período.'),
    weight: z
      .string()
      .optional()
      .refine(
        (value) => value === undefined || value.trim().length === 0 || isValidDecimal(value),
        {
          message: 'Informe um peso válido.',
        },
      ),
    isFinalPeriod: z.boolean(),
  })
  .refine((period) => period.endDate >= period.startDate, {
    message: 'A data final do período deve ser maior ou igual à data inicial.',
    path: ['endDate'],
  });

export const academicYearFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Informe o nome do ano letivo.')
      .max(120, 'Use até 120 caracteres.'),
    status: z.enum(['scheduled', 'active', 'closed']),
    startDate: z.string().min(1, 'Informe a data inicial.'),
    endDate: z.string().min(1, 'Informe a data final.'),
    academicPeriods: z
      .array(academicYearPeriodFormSchema)
      .min(1, 'Informe ao menos um período acadêmico.'),
    calculationType: z.union([z.literal('arithmetic'), z.literal('weighted')]),
    passingGrade: buildNumberStringSchema(
      'Informe a nota mínima.',
      0,
      10,
      'A nota mínima deve ser maior ou igual a 0.',
      'A nota mínima deve ser menor ou igual a 10.',
    ),
    minimumAttendancePercentage: buildNumberStringSchema(
      'Informe a frequência mínima.',
      0,
      100,
      'A frequência mínima deve ser maior ou igual a 0.',
      'A frequência mínima deve ser menor ou igual a 100.',
    ),
    recoveryStrategy: z.union([
      z.literal('none'),
      z.literal('replace_lowest'),
      z.literal('replace_average'),
    ]),
    finalStatusStrategy: z.union([
      z.literal('approval_or_recovery'),
      z.literal('approval_recovery_or_failure'),
    ]),
  })
  .refine((academicYear) => academicYear.endDate >= academicYear.startDate, {
    message: 'A data final deve ser maior ou igual à data inicial.',
    path: ['endDate'],
  });

export type AcademicYearFormValues = z.infer<typeof academicYearFormSchema>;
