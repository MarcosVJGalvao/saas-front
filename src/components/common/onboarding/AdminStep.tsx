import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { CreateClientOnboardingRequest } from '../../../models/clients';
import { maskCnpj, maskCpf, maskCurrency } from '../../../utils/mask';
import { onlyDigits } from '../../../utils/parse';
import type { OnboardingStepProps } from './types';

const getSelectValue = (value: unknown): string => (typeof value === 'string' ? value : '');

const toDocumentType = (
  value: string,
): CreateClientOnboardingRequest['employee']['person']['documentType'] | undefined => {
  switch (value) {
    case 'CPF':
    case 'CNPJ':
    case 'RG':
    case 'PASSPORT':
    case 'OTHER':
      return value;
    default:
      return undefined;
  }
};

const toGender = (
  value: string,
): NonNullable<CreateClientOnboardingRequest['employee']['person']['gender']> | undefined => {
  switch (value) {
    case 'male':
    case 'female':
    case 'other':
    case 'prefer_not_to_say':
      return value;
    default:
      return undefined;
  }
};

const toMaritalStatus = (
  value: string,
):
  | NonNullable<CreateClientOnboardingRequest['employee']['person']['maritalStatus']>
  | undefined => {
  switch (value) {
    case 'single':
    case 'married':
    case 'divorced':
    case 'widowed':
    case 'other':
      return value;
    default:
      return undefined;
  }
};

const maskDateOfBirth = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d{1,4})$/, '$1/$2');
};

export const AdminStep = ({ value, setValue }: OnboardingStepProps) => (
  <Stack spacing={1.5}>
    <Typography variant="h6">Usuário Administrador</Typography>
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Nome do Admin"
          value={value.employee.person.fullName}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: { ...value.employee.person, fullName: event.target.value },
              },
            })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="E-mail do Admin"
          value={value.employee.contacts[0]?.value ?? ''}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                contacts: [{ type: 'email', value: event.target.value }],
              },
            })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          select
          label="Tipo Documento Admin"
          value={value.employee.person.documentType}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  documentType:
                    toDocumentType(getSelectValue(event.target.value)) ??
                    value.employee.person.documentType,
                },
              },
            })
          }
        >
          <MenuItem value="CPF">CPF</MenuItem>
          <MenuItem value="CNPJ">CNPJ</MenuItem>
          <MenuItem value="RG">RG</MenuItem>
          <MenuItem value="PASSPORT">PASSAPORTE</MenuItem>
          <MenuItem value="OTHER">OUTRO</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Documento do Admin"
          value={
            value.employee.person.documentType === 'CPF'
              ? maskCpf(value.employee.person.documentNumber)
              : maskCnpj(value.employee.person.documentNumber)
          }
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  documentNumber: onlyDigits(event.target.value),
                },
              },
            })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Data de Nascimento"
          value={maskDateOfBirth(value.employee.person.dateOfBirth ?? '')}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  dateOfBirth: onlyDigits(event.target.value) || undefined,
                },
              },
            })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          select
          label="Gênero"
          value={value.employee.person.gender ?? ''}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  gender: toGender(getSelectValue(event.target.value)),
                },
              },
            })
          }
        >
          <MenuItem value="">Selecione</MenuItem>
          <MenuItem value="male">Masculino</MenuItem>
          <MenuItem value="female">Feminino</MenuItem>
          <MenuItem value="other">Outro</MenuItem>
          <MenuItem value="prefer_not_to_say">Prefiro não informar</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          select
          label="Estado Civil"
          value={value.employee.person.maritalStatus ?? ''}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  maritalStatus: toMaritalStatus(getSelectValue(event.target.value)),
                },
              },
            })
          }
        >
          <MenuItem value="">Selecione</MenuItem>
          <MenuItem value="single">Solteiro(a)</MenuItem>
          <MenuItem value="married">Casado(a)</MenuItem>
          <MenuItem value="divorced">Divorciado(a)</MenuItem>
          <MenuItem value="widowed">Viúvo(a)</MenuItem>
          <MenuItem value="other">Outro</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Renda Mensal"
          value={maskCurrency(value.employee.person.monthlyIncome ?? '')}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  monthlyIncome: onlyDigits(event.target.value) || undefined,
                },
              },
            })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          type="password"
          label="Senha Inicial"
          value={value.adminPassword}
          onChange={(event) => setValue({ ...value, adminPassword: event.target.value })}
        />
      </Grid>
    </Grid>
  </Stack>
);
