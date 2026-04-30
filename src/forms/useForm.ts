import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useHookForm } from 'react-hook-form';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';

export const useForm = <TFieldValues extends FieldValues>(
  schema: z.ZodSchema<TFieldValues>,
  defaultValues: DefaultValues<TFieldValues>,
) =>
  useHookForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });
