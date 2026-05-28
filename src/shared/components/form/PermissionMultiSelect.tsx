import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppText } from '@shared/components/data-display/AppText';
import Autocomplete from '@mui/material/Autocomplete';

export interface PermissionOption {
  id: string;
  name: string;
  description?: string;
}

interface PermissionMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  error?: string | undefined;
  options: PermissionOption[];
  loading?: boolean;
  disabled?: boolean;
}

export const PermissionMultiSelect = ({
  value,
  onChange,
  error,
  options,
  loading = false,
  disabled = false,
}: PermissionMultiSelectProps) => {
  const selectedOptions = options.filter((option) => value.includes(option.id));

  return (
    <Autocomplete<PermissionOption, true>
      multiple
      options={options}
      value={selectedOptions}
      loading={loading}
      disabled={disabled}
      disableCloseOnSelect
      limitTags={6}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onChange={(_, newValue) => {
        onChange(newValue.map((option) => option.id));
      }}
      slotProps={{
        chip: {
          size: 'small',
          variant: 'outlined',
          sx: { fontFamily: 'monospace', fontSize: '0.72rem' },
        },
      }}
      renderInput={(params) => (
        <AppTextField
          {...params}
          label="Permissões"
          placeholder={selectedOptions.length === 0 ? 'Selecione as permissões' : ''}
          error={error !== undefined}
          helperText={error ?? `${selectedOptions.length} permissão(ões) selecionada(s)`}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <AppBox>
              <AppText variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {option.name}
              </AppText>
              <AppText variant="caption" color="text.secondary">
                {option.description}
              </AppText>
            </AppBox>
          </li>
        );
      }}
      noOptionsText={loading ? 'Carregando...' : 'Nenhuma permissão encontrada'}
    />
  );
};
