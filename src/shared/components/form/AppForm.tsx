import { type ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { FormProvider } from 'react-hook-form';
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { responsive } from '@theme/utils/responsive';
import { layoutSpacing } from '@theme/spacing';

interface AppFormGridColumns {
  mobile: number;
  tablet?: number;
  desktop?: number;
}

interface AppFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  children: ReactNode;
  spacing?: number;
  noValidate?: boolean;
  useResponsiveGrid?: boolean;
  columnsByDevice?: AppFormGridColumns;
}

export const AppForm = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  spacing = layoutSpacing.formGap,
  noValidate = true,
  useResponsiveGrid = false,
  columnsByDevice = { mobile: 1, tablet: 2, desktop: 2 },
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
            gridTemplateColumns: responsive({
              xs: `repeat(${columnsByDevice.mobile}, minmax(0, 1fr))`,
              md: `repeat(${columnsByDevice.tablet ?? columnsByDevice.mobile}, minmax(0, 1fr))`,
              lg: `repeat(${columnsByDevice.desktop ?? columnsByDevice.tablet ?? columnsByDevice.mobile}, minmax(0, 1fr))`,
            }),
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
