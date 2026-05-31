import { z } from 'zod';
import { documentTypeSchema, genderSchema, maritalStatusSchema } from '@shared/schemas/commonEnums';

const onboardingContactSchema = z.object({
  type: z.enum(['email', 'phone', 'whatsapp', 'linkedin', 'other']),
  value: z.string().min(1, 'Informe o contato do administrador.'),
});

const clientAddressSchema = z.object({
  street: z.string().min(1, 'Informe a rua.'),
  number: z.string().min(1, 'Informe o número.'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Informe o bairro.'),
  city: z.string().min(1, 'Informe a cidade.'),
  state: z.string().min(1, 'Informe o estado.'),
  zipCode: z.string().min(8, 'Informe um CEP válido.'),
  country: z.string().min(1, 'Informe o país.'),
});

export const clientOnboardingClientStepSchema = z.object({
  legalName: z.string().min(1, 'Informe a razão social.'),
  tradeName: z.string().min(1, 'Informe o nome fantasia.'),
  documentNumber: z.string().min(8, 'Informe um documento válido.').max(30),
  documentType: documentTypeSchema,
  clientEmail: z.string().email('Informe um e-mail válido.'),
  phone: z.string().min(10, 'Informe um telefone válido.'),
  clientAddress: clientAddressSchema,
});

export const clientOnboardingTenantStepSchema = z.object({
  tenantName: z.string().min(1, 'Informe o nome do tenant.'),
  tenantSlug: z.string().min(1, 'Informe o slug do tenant.'),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  currency: z.string().optional(),
});

export const clientOnboardingPlanStepSchema = z.object({
  planId: z.string().min(1, 'Selecione um plano.'),
});

export const clientOnboardingAdminStepSchema = z.object({
  adminPassword: z.string().min(8, 'A senha inicial deve ter no mínimo 8 caracteres.'),
  employee: z.object({
    person: z.object({
      fullName: z.string().min(1, 'Informe o nome do administrador.'),
      documentNumber: z.string().min(8, 'Informe um documento válido.').max(30),
      documentType: documentTypeSchema,
      dateOfBirth: z.string().optional(),
      naturality: z
        .string()
        .max(110, 'A naturalidade deve ter no máximo 110 caracteres.')
        .optional(),
      gender: genderSchema.optional(),
      maritalStatus: maritalStatusSchema.optional(),
      monthlyIncome: z.string().optional(),
    }),
    contacts: z.array(onboardingContactSchema).min(1, 'Informe um contato do administrador.'),
    department: z.string().optional(),
  }),
});

export const clientOnboardingSchema = clientOnboardingClientStepSchema
  .merge(clientOnboardingTenantStepSchema)
  .merge(clientOnboardingPlanStepSchema)
  .merge(clientOnboardingAdminStepSchema)
  .superRefine((data, context) => {
    if (!data.employee.contacts.some((contact) => contact.type === 'email')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['employee', 'contacts'],
        message: 'Informe um e-mail do administrador.',
      });
    }
  });

export type ClientOnboardingClientStepValues = z.infer<typeof clientOnboardingClientStepSchema>;
export type ClientOnboardingTenantStepValues = z.infer<typeof clientOnboardingTenantStepSchema>;
export type ClientOnboardingPlanStepValues = z.infer<typeof clientOnboardingPlanStepSchema>;
export type ClientOnboardingAdminStepValues = z.infer<typeof clientOnboardingAdminStepSchema>;
export type ClientOnboardingValues = z.infer<typeof clientOnboardingSchema>;
