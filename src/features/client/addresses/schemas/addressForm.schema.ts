import { z } from 'zod';

export const addressFormSchema = z.object({
  personId: z.string().optional(),
  street: z.string().min(1, 'Informe o logradouro.'),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(1, 'Informe a cidade.'),
  state: z.string().min(2, 'Informe o estado.'),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
