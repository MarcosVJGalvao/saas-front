import { z } from 'zod';

export const accountsReceivableCreateFormSchema = z.object({
  description: z.string().min(1, 'Informe a descrição.'),
  amount: z.string().min(1, 'Informe o valor.'),
  dueDate: z.string().min(1, 'Informe o vencimento.'),
  status: z.enum(
    ['open', 'partially_paid', 'paid', 'received', 'overdue', 'cancelled', 'reversed'],
    {
      required_error: 'Selecione o status.',
    },
  ),
  categoryId: z.string().optional(),
  costCenterId: z.string().optional(),
  studentId: z.string().optional(),
});

export type AccountsReceivableCreateFormValues = z.infer<typeof accountsReceivableCreateFormSchema>;
