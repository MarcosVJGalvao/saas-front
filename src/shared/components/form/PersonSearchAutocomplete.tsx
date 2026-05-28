import { useCallback, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { httpClient } from '@shared/services/httpClient';
import { useDebouncedCallback } from '@shared/hooks/useDebounce/useDebouncedCallback';

type PersonOption = {
  id: string;
  name: string;
  document?: string | undefined;
};

const isPersonOption = (value: unknown): value is PersonOption => {
  if (typeof value !== 'object' || value === null) return false;
  if (!('id' in value) || !('name' in value)) return false;
  return typeof value.id === 'string' && typeof value.name === 'string';
};

const hasDataArray = (value: unknown): value is { data: unknown[] } => {
  if (typeof value !== 'object' || value === null) return false;
  if (!('data' in value)) return false;
  return Array.isArray(value.data);
};

const searchPersons = async (query: string): Promise<PersonOption[]> => {
  const response = await httpClient.get<unknown>('/api/persons', {
    params: { search: query, limit: 20, page: 1 },
  });
  if (!hasDataArray(response.data)) return [];
  return response.data.data.filter(isPersonOption);
};

interface PersonSearchAutocompleteProps {
  value: string;
  onChange: (personId: string) => void;
  error?: string | undefined;
  label?: string;
  disabled?: boolean;
}

export const PersonSearchAutocomplete = ({
  value,
  onChange,
  error,
  label = 'Pessoa',
  disabled = false,
}: PersonSearchAutocompleteProps) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<PersonOption[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const results = await searchPersons(query);
      setOptions(results);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useDebouncedCallback((query: string) => void performSearch(query), 350);

  const selectedOption = options.find((option) => option.id === value) ?? null;

  return (
    <Autocomplete<PersonOption>
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      filterOptions={(allOptions) => allOptions}
      onInputChange={(_, newInput) => {
        setInputValue(newInput);
        debouncedSearch(newInput);
      }}
      onChange={(_, newValue) => {
        onChange(newValue?.id ?? '');
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Digite para buscar..."
          error={error !== undefined}
          helperText={error ?? 'Digite ao menos 2 caracteres para buscar'}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.name}
              </Typography>
              {option.document ? (
                <Typography variant="caption" color="text.secondary">
                  {option.document}
                </Typography>
              ) : null}
            </Box>
          </li>
        );
      }}
      noOptionsText={
        inputValue.length < 2 ? 'Digite ao menos 2 caracteres' : 'Nenhuma pessoa encontrada'
      }
    />
  );
};
