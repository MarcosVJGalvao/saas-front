import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { CreateClientRequest } from '../../models/clients';

interface ClientFormProps {
  value: CreateClientRequest;
  loading: boolean;
  onChange: (value: CreateClientRequest) => void;
  onSubmit: () => void;
}

export const ClientForm = ({ value, loading, onChange, onSubmit }: ClientFormProps) => {
  const patch = (field: keyof CreateClientRequest, nextValue: string) =>
    onChange({ ...value, [field]: nextValue });
  return (
    <Stack spacing={2}>
      <TextField
        label="Nome Fantasia"
        value={value.tradeName}
        onChange={(event) => patch('tradeName', event.target.value)}
      />
      <TextField
        label="Raz�o Social"
        value={value.legalName}
        onChange={(event) => patch('legalName', event.target.value)}
      />
      <TextField
        label="Documento"
        value={value.documentNumber}
        onChange={(event) => patch('documentNumber', event.target.value)}
      />
      <TextField
        select
        label="Tipo de Documento"
        value={value.documentType}
        onChange={(event) => patch('documentType', event.target.value)}
      >
        <MenuItem value="CPF">CPF</MenuItem>
        <MenuItem value="CNPJ">CNPJ</MenuItem>
        <MenuItem value="RG">RG</MenuItem>
        <MenuItem value="PASSPORT">PASSPORT</MenuItem>
        <MenuItem value="OTHER">OTHER</MenuItem>
      </TextField>
      <TextField
        label="E-mail"
        value={value.email}
        onChange={(event) => patch('email', event.target.value)}
      />
      <TextField
        label="Telefone"
        value={value.phone}
        onChange={(event) => patch('phone', event.target.value)}
      />
      <TextField
        select
        label="Status"
        value={value.status ?? 'active'}
        onChange={(event) => patch('status', event.target.value)}
      >
        <MenuItem value="active">Ativo</MenuItem>
        <MenuItem value="inactive">Inativo</MenuItem>
      </TextField>
      <Button variant="contained" onClick={onSubmit} disabled={loading}>
        Salvar
      </Button>
    </Stack>
  );
};
