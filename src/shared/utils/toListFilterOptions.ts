import type { AppSelectOption } from '@shared/components/inputs/AppSelect';

type ListFilterOption = {
  label: string;
  value: string;
};

export const toListFilterOptions = (options: AppSelectOption[]): ListFilterOption[] =>
  options.map((option) => ({
    label: option.label,
    value: String(option.value),
  }));
