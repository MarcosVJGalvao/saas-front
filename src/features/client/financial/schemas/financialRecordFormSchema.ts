import { z } from 'zod';

export const financialRecordFormSchema = z.object({
  description: z.string().min(1, 'Informe a descrição.'),
  amount: z.string().min(1, 'Informe o valor.'),
  dueDate: z.string().min(1, 'Informe o vencimento.'),
  status: z.enum([
    'open',
    'partially_paid',
    'paid',
    'received',
    'overdue',
    'cancelled',
    'reversed',
  ]),
  categoryId: z.string().optional(),
  costCenterId: z.string().optional(),
  studentId: z.string().optional(),
});

export type FinancialRecordFormValues = z.infer<typeof financialRecordFormSchema>;
