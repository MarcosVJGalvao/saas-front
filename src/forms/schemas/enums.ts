import { z } from 'zod';

export const documentTypeSchema = z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']);
export const genderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);
export const maritalStatusSchema = z.enum(['single', 'married', 'divorced', 'widowed', 'other']);
