import { z } from 'zod';

const isBlank = (value: string | undefined): boolean => (value?.trim() ?? '').length === 0;

export const employeeCreateFormSchema = z
  .object({
    creationMode: z.enum(['existing_person', 'new_person']),
    personId: z.string(),
    fullName: z.string(),
    documentType: z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']),
    documentNumber: z.string(),
    jobTitle: z.string().min(1, 'Selecione o cargo.'),
    department: z.string().optional(),
    zipCode: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.creationMode === 'existing_person') {
      if (isBlank(values.personId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o identificador da pessoa existente.',
          path: ['personId'],
        });
      }
      return;
    }

    if (isBlank(values.fullName)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o nome completo.',
        path: ['fullName'],
      });
    }

    if (isBlank(values.documentNumber)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o documento.',
        path: ['documentNumber'],
      });
    }

    if (isBlank(values.zipCode)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o CEP.',
        path: ['zipCode'],
      });
    }

    if (isBlank(values.street)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o logradouro.',
        path: ['street'],
      });
    }

    if (isBlank(values.number)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o número.',
        path: ['number'],
      });
    }

    if (isBlank(values.neighborhood)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o bairro.',
        path: ['neighborhood'],
      });
    }

    if (isBlank(values.city)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe a cidade.',
        path: ['city'],
      });
    }

    if (isBlank(values.state)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o estado.',
        path: ['state'],
      });
    }

    if (isBlank(values.country)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o país.',
        path: ['country'],
      });
    }

    if (isBlank(values.email) && isBlank(values.phone)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe ao menos um contato.',
        path: ['email'],
      });
    }
  });

export type EmployeeCreateFormValues = z.infer<typeof employeeCreateFormSchema>;
