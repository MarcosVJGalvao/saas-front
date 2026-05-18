import { z } from 'zod';

export const enrollmentDocumentTypeSchema = z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']);
export const enrollmentGenderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);
export const enrollmentMaritalStatusSchema = z.enum([
  'single',
  'married',
  'divorced',
  'widowed',
  'other',
]);
export const enrollmentNationalitySchema = z.enum(['brazilian', 'foreign', 'other']);
export const guardianRelationshipTypeSchema = z.enum([
  'mother',
  'father',
  'legal_guardian',
  'grandparent',
  'other',
]);
export const enrollmentContactTypeSchema = z.enum([
  'email',
  'phone',
  'whatsapp',
  'linkedin',
  'other',
]);
export const enrollmentStatusSchema = z.enum(['active', 'cancelled', 'transferred']);

export const enrollmentPersonSchema = z.object({
  fullName: z.string().min(1, 'Informe o nome completo.'),
  documentNumber: z.string().min(3, 'Informe o documento.'),
  documentType: enrollmentDocumentTypeSchema,
  dateOfBirth: z.string().optional(),
  gender: enrollmentGenderSchema.optional(),
  maritalStatus: enrollmentMaritalStatusSchema.optional(),
  nationality: enrollmentNationalitySchema.optional(),
  monthlyIncome: z.string().optional(),
});

export const enrollmentAddressSchema = z.object({
  street: z.string().min(1, 'Informe a rua.'),
  number: z.string().min(1, 'Informe o número.'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Informe o bairro.'),
  city: z.string().min(1, 'Informe a cidade.'),
  state: z.string().min(1, 'Informe o estado.'),
  zipCode: z.string().min(1, 'Informe o CEP.'),
  country: z.string().min(1, 'Informe o país.'),
});

export const enrollmentContactSchema = z.object({
  type: enrollmentContactTypeSchema,
  value: z.string().min(1, 'Informe o contato.'),
});

export const enrollmentMedicalInfoSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  medications: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  notes: z.string().optional(),
});

export const enrollmentLegalGuardianSchema = z.object({
  legalGuardianId: z.string().optional(),
  relationshipType: guardianRelationshipTypeSchema,
  isPrimary: z.boolean(),
  person: enrollmentPersonSchema.optional(),
  addresses: z.array(enrollmentAddressSchema).optional(),
  contacts: z.array(enrollmentContactSchema).optional(),
});

export const createStudentEnrollmentSchema = z
  .object({
    studentId: z.string().optional(),
    student: z
      .object({
        registrationCode: z.string().optional(),
        person: enrollmentPersonSchema,
        addresses: z.array(enrollmentAddressSchema),
        contacts: z.array(enrollmentContactSchema),
        medicalInfo: enrollmentMedicalInfoSchema.optional(),
        legalGuardians: z.array(enrollmentLegalGuardianSchema).min(1),
      })
      .optional(),
    academic: z.object({
      academicYearId: z.string().min(1, 'Selecione o ano letivo.'),
      schoolClassId: z.string().optional(),
      enrollmentDate: z.string().min(1, 'Informe a data da matrícula.'),
    }),
    enrollmentCode: z.string().optional(),
    observations: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.studentId && !data.student) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['student'],
        message: 'Selecione um aluno existente ou informe os dados do novo aluno.',
      });
    }

    if (data.student?.legalGuardians.every((guardian) => !guardian.isPrimary)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['student', 'legalGuardians'],
        message: 'Informe um responsável principal.',
      });
    }
  });

export const studentEnrollmentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
  status: enrollmentStatusSchema.optional(),
  enrollmentCode: z.string().optional(),
  name: z.string().optional(),
  documentNumber: z.string().optional(),
  academicYearId: z.string().optional(),
  schoolClassId: z.string().optional(),
});

export const updateStudentEnrollmentFormSchema = z.object({
  academicYearId: z.string().min(1, 'Informe o ano letivo.'),
  schoolClassId: z.string().optional(),
  enrollmentDate: z.string().min(1, 'Informe a data da matrícula.'),
  enrollmentCode: z.string().optional(),
  observations: z.string().optional(),
});

export type UpdateStudentEnrollmentFormValues = z.infer<typeof updateStudentEnrollmentFormSchema>;

export const studentEnrollmentStudentStepSchema = z.object({
  studentId: z.string().optional(),
  student: z
    .object({
      person: enrollmentPersonSchema,
    })
    .optional(),
});

export const isStudentStepValid = (value: unknown): boolean =>
  studentEnrollmentStudentStepSchema.safeParse(value).success;
