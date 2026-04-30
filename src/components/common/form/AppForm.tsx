import { type ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { FormProvider } from 'react-hook-form';
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { layoutSpacing } from '../../../theme/spacing';

interface AppFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  children: ReactNode;
  spacing?: number;
  noValidate?: boolean;
  useResponsiveGrid?: boolean;
  columnsByBreakpoint?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

export const AppForm = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  spacing = layoutSpacing.formGap,
  noValidate = true,
  useResponsiveGrid = false,
  columnsByBreakpoint = { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
}: AppFormProps<TFieldValues>) => (
  <FormProvider {...form}>
    <Stack
      component="form"
      spacing={spacing}
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit(onSubmit)(event);
      }}
      noValidate={noValidate}
      sx={{ width: '100%' }}
    >
      {useResponsiveGrid ? (
        <Box
          sx={{
            display: 'grid',
            gap: spacing,
            gridTemplateColumns: {
              xs: `repeat(${columnsByBreakpoint.xs ?? 1}, minmax(0, 1fr))`,
              sm: `repeat(${columnsByBreakpoint.sm ?? 1}, minmax(0, 1fr))`,
              md: `repeat(${columnsByBreakpoint.md ?? 2}, minmax(0, 1fr))`,
              lg: `repeat(${columnsByBreakpoint.lg ?? 2}, minmax(0, 1fr))`,
              xl: `repeat(${columnsByBreakpoint.xl ?? 2}, minmax(0, 1fr))`,
            },
          }}
        >
          {children}
        </Box>
      ) : (
        children
      )}
    </Stack>
  </FormProvider>
);
