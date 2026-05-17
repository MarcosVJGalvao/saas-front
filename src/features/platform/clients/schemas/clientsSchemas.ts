import { z } from 'zod';
import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';
import { addressSchema } from '@shared/schemas/addressSchema';
import { documentTypeSchema } from '@shared/schemas/commonEnums';
import { personSchema } from '@shared/schemas/personSchema';

export const clientStatusSchema = z.enum(['active', 'inactive']);
export const contactTypeSchema = z.enum(['email', 'phone', 'whatsapp', 'linkedin', 'other']);

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
      person: personSchema,
      contacts: z.array(onboardingContactSchema).min(1),
      department: z.string().optional(),
    }),
    clientAddress: addressSchema,
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

export const clientOnboardingClientDataStepSchema = z.object({
  legalName: z.string().min(1),
  tradeName: z.string().min(1),
  documentNumber: z.string().min(8).max(30),
  documentType: documentTypeSchema,
  clientEmail: z.string().email(),
  phone: z.string().min(1),
  clientAddress: addressSchema,
});

export const isClientOnboardingClientDataStepValid = (
  value: CreateClientOnboardingRequest,
): boolean => clientOnboardingClientDataStepSchema.safeParse(value).success;
