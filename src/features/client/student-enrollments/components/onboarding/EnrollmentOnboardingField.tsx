import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppTextField } from '@shared/components/inputs/AppTextField';

type EnrollmentOnboardingFieldGridSize = {
  xs: number;
  md?: number;
};

type EnrollmentOnboardingFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  gridSize?: EnrollmentOnboardingFieldGridSize | undefined;
  disabled?: boolean | undefined;
  helperText?: ReactNode | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  select?: boolean | undefined;
  multiline?: boolean | undefined;
  options?: AppSelectOption[] | undefined;
  children?: ReactNode | undefined;
};

export const EnrollmentOnboardingField = ({
  label,
  value,
  onChange,
  gridSize,
  disabled = false,
  helperText,
  type,
  select = false,
  multiline = false,
  options,
  children,
}: EnrollmentOnboardingFieldProps) => (
  <AppGrid size={gridSize ?? { xs: 12, md: 6 }}>
    <AppTextField
      fullWidth
      size="small"
      select={select}
      type={type}
      label={label}
      value={value}
      disabled={disabled}
      helperText={helperText}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      onChange={(event) => onChange(event.target.value)}
    >
      {options?.map((option) => (
        <AppMenuItem key={option.value} value={option.value}>
          {option.label}
        </AppMenuItem>
      )) ?? children}
    </AppTextField>
  </AppGrid>
);
