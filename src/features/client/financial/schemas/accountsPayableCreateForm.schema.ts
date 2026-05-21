import { z } from 'zod';

export const accountsPayableCreateFormSchema = z.object({
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
});

export type AccountsPayableCreateFormValues = z.infer<typeof accountsPayableCreateFormSchema>;
