import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { UseFormReturn } from 'react-hook-form';
import type { AddressFormFields } from '../../models/address';
import { maskCep } from '../../utils/mask';

interface AddressFieldsProps {
  form: UseFormReturn<AddressFormFields>;
  loading: boolean;
  onSearchCep: () => void;
}

export const AddressFields = ({ form, loading, onSearchCep }: AddressFieldsProps) => (
  <Stack spacing={2}>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        label="CEP"
        value={maskCep(form.watch('zipCode'))}
        onChange={(event) => form.setValue('zipCode', event.target.value)}
        fullWidth
      />
      <Button variant="outlined" onClick={onSearchCep} disabled={loading}>
        Buscar CEP
      </Button>
    </Stack>

    <TextField
      label="Rua"
      value={form.watch('street')}
      onChange={(event) => form.setValue('street', event.target.value)}
      fullWidth
    />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        label="Número"
        value={form.watch('number')}
        onChange={(event) => form.setValue('number', event.target.value)}
        fullWidth
      />
      <TextField
        label="Complemento"
        value={form.watch('complement')}
        onChange={(event) => form.setValue('complement', event.target.value)}
        fullWidth
      />
    </Stack>
    <TextField
      label="Bairro"
      value={form.watch('neighborhood')}
      onChange={(event) => form.setValue('neighborhood', event.target.value)}
      fullWidth
    />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        label="Cidade"
        value={form.watch('city')}
        onChange={(event) => form.setValue('city', event.target.value)}
        fullWidth
      />
      <TextField
        label="UF"
        value={form.watch('state')}
        onChange={(event) => form.setValue('state', event.target.value)}
        fullWidth
      />
    </Stack>
    <TextField
      label="Código IBGE"
      value={form.watch('cityIbgeCode')}
      onChange={(event) => form.setValue('cityIbgeCode', event.target.value)}
      fullWidth
    />
  </Stack>
);
