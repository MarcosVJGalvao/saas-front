import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';

export const useAppForm = <TFieldValues extends FieldValues>(
  schema: z.ZodSchema<TFieldValues>,
  defaultValues: DefaultValues<TFieldValues>,
) =>
  useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });
