export type FilterField =
  | {
      type: 'select';
      name: string;
      label: string;
      placeholder?: string;
      options: Array<{ label: string; value: string | number }>;
      disabled?: boolean;
      error?: boolean;
      helperText?: string;
      mobileOrder?: number;
    }
  | {
      type: 'text';
      name: string;
      label: string;
      placeholder?: string;
      disabled?: boolean;
      error?: boolean;
      helperText?: string;
      mobileOrder?: number;
    }
  | {
      type: 'date';
      name: string;
      label: string;
      placeholder?: string;
      disabled?: boolean;
      error?: boolean;
      helperText?: string;
      mobileOrder?: number;
    }
  | {
      type: 'dateRange';
      name: string;
      label: string;
      startName: string;
      endName: string;
      placeholder?: string;
      disabled?: boolean;
      error?: boolean;
      helperText?: string;
      mobileOrder?: number;
    };

export interface ListFiltersProps {
  title?: string;
  subtitle?: string;
  fields: FilterField[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  onApply: () => void;
  onClear: () => void;
  loading?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  applyLabel?: string;
  clearLabel?: string;
}
