import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppTextField } from '@shared/components/inputs/AppTextField';

type OnboardingFieldGridSize = {
  xs: number;
  md?: number;
};

type OnboardingFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  gridSize?: OnboardingFieldGridSize;
  disabled?: boolean;
  onBlur?: () => void;
  helperText?: ReactNode;
  type?: HTMLInputTypeAttribute;
  select?: boolean;
  children?: ReactNode;
};

export const OnboardingField = ({
  label,
  value,
  onChange,
  gridSize,
  disabled = false,
  onBlur,
  helperText,
  type,
  select = false,
  children,
}: OnboardingFieldProps) => (
  <AppGrid size={gridSize ?? { xs: 12, md: 6 }}>
    <AppTextField
      fullWidth
      size="small"
      select={select}
      type={type}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      onBlur={onBlur}
      helperText={helperText}
    >
      {children}
    </AppTextField>
  </AppGrid>
);
