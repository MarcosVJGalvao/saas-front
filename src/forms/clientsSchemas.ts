import { z } from 'zod';

export const clientStatusSchema = z.enum(['active', 'inactive']);
export const documentTypeSchema = z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']);
export const contactTypeSchema = z.enum(['email', 'phone', 'whatsapp', 'linkedin', 'other']);
export const genderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);
export const maritalStatusSchema = z.enum(['single', 'married', 'divorced', 'widowed', 'other']);

export const createClientSchema = z.object({
  legalName: z.string(),
  tradeName: z.string(),
  documentNumber: z.string().min(8).max(30),
  documentType: documentTypeSchema,
  email: z.string().email(),
  phone: z.string(),
  status: clientStatusSchema.optional(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
    status: clientStatusSchema.optional(),
    plan: z.string().optional(),
    segment: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if ((data.startDate && !data.endDate) || (!data.startDate && data.endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'Informe startDate e endDate juntos.',
      });
    }
  });

const onboardingContactSchema = z.object({ type: contactTypeSchema, value: z.string().min(1) });
const onboardingPersonSchema = z.object({
  fullName: z.string().min(1),
  documentNumber: z.string().min(3).max(30),
  documentType: documentTypeSchema,
  dateOfBirth: z.string().optional(),
  gender: genderSchema.optional(),
  maritalStatus: maritalStatusSchema.optional(),
  monthlyIncome: z.string().optional(),
});

export const createClientOnboardingSchema = z
  .object({
    legalName: z.string(),
    tradeName: z.string(),
    documentNumber: z.string().min(8).max(30),
    documentType: documentTypeSchema,
    clientEmail: z.string().email(),
    phone: z.string(),
    tenantName: z.string(),
    tenantSlug: z.string(),
    timezone: z.string().optional(),
    locale: z.string().optional(),
    currency: z.string().optional(),
    planId: z.string(),
    adminPassword: z.string().min(8).max(255),
    employee: z.object({
      person: onboardingPersonSchema,
      contacts: z.array(onboardingContactSchema).min(1),
      department: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.employee.contacts.some((contact) => contact.type === 'email')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['employee', 'contacts'],
        message: 'Informe pelo menos um contato de e-mail para o administrador.',
      });
    }
  });
