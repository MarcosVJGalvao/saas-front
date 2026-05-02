import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { memo, useCallback } from 'react';
import { useAddressAutoFill } from '../../../hooks/useAddressAutoFill/useAddressAutoFill';
import { spacingScale } from '../../../theme/spacing';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '../../../utils/mask';
import { onlyDigits } from '../../../utils/parse';
import type { OnboardingStepProps } from './types';

type FieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  size?: { xs: number; md?: number };
  disabled?: boolean;
  onBlur?: () => void;
};

const Field = memo(({ label, value, onChange, size, disabled, onBlur }: FieldProps) => (
  <Grid size={size ?? { xs: 12, md: 6 }}>
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      onBlur={onBlur}
    />
  </Grid>
));

export const ClientDataStep = memo(
  ({ value, uiExtras, setValue, setUiExtras }: OnboardingStepProps) => {
    const patchValue = useCallback(
      (field: 'tradeName' | 'legalName' | 'clientEmail' | 'phone', nextValue: string) => {
        setValue((previous) => ({ ...previous, [field]: nextValue }));
      },
      [setValue],
    );

    const patchUiExtras = useCallback(
      (
        field:
          | 'cep'
          | 'street'
          | 'number'
          | 'complement'
          | 'neighborhood'
          | 'city'
          | 'state'
          | 'country',
        nextValue: string,
      ) => {
        setUiExtras((previous) => ({ ...previous, [field]: nextValue }));
      },
      [setUiExtras],
    );

    const onTradeName = useCallback((next: string) => patchValue('tradeName', next), [patchValue]);
    const onLegalName = useCallback((next: string) => patchValue('legalName', next), [patchValue]);
    const onClientEmail = useCallback(
      (next: string) => patchValue('clientEmail', next),
      [patchValue],
    );
    const onPhone = useCallback(
      (next: string) => patchValue('phone', onlyDigits(next)),
      [patchValue],
    );

    const onStreet = useCallback((next: string) => patchUiExtras('street', next), [patchUiExtras]);
    const onNumber = useCallback((next: string) => patchUiExtras('number', next), [patchUiExtras]);
    const onComplement = useCallback(
      (next: string) => patchUiExtras('complement', next),
      [patchUiExtras],
    );
    const onNeighborhood = useCallback(
      (next: string) => patchUiExtras('neighborhood', next),
      [patchUiExtras],
    );
    const onCity = useCallback((next: string) => patchUiExtras('city', next), [patchUiExtras]);
    const onState = useCallback((next: string) => patchUiExtras('state', next), [patchUiExtras]);
    const onCountry = useCallback(
      (next: string) => patchUiExtras('country', next),
      [patchUiExtras],
    );
    const onCep = useCallback(
      (next: string) => patchUiExtras('cep', onlyDigits(next)),
      [patchUiExtras],
    );

    const onDocumentNumber = useCallback(
      (next: string) => {
        setValue((previous) => ({ ...previous, documentNumber: onlyDigits(next) }));
      },
      [setValue],
    );

    const addressAutoFill = useAddressAutoFill({
      onResolved: (fields) =>
        setUiExtras((previous) => ({
          ...previous,
          cep: fields.zipCode ?? previous.cep,
          street: fields.street ?? previous.street,
          complement: fields.complement ?? previous.complement,
          neighborhood: fields.neighborhood ?? previous.neighborhood,
          city: fields.city ?? previous.city,
          state: fields.state ?? previous.state,
          country: previous.country || 'Brasil',
          number: previous.number,
        })),
    });

    const onCepBlur = useCallback(() => {
      if (onlyDigits(uiExtras.cep).length === 8) void addressAutoFill.resolveByCep(uiExtras.cep);
    }, [addressAutoFill, uiExtras.cep]);

    return (
      <Stack spacing={1.75}>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.2 }}>
          <Stack
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: 'action.selected',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Stack>
          <Typography variant="h6" sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
            Dados do Cliente
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 4, mt: -0.15, fontSize: 13, lineHeight: 1.35, fontWeight: 500 }}
        >
          Informações da empresa que será cadastrada na plataforma.
        </Typography>

        <Grid container spacing={spacingScale.xs}>
          <Field label="Nome Fantasia" value={value.tradeName} onChange={onTradeName} />
          <Field label="Razão Social" value={value.legalName} onChange={onLegalName} />
          <Field
            label={value.documentType === 'CPF' ? 'CPF' : 'CNPJ'}
            value={
              value.documentType === 'CPF'
                ? maskCpf(value.documentNumber)
                : maskCnpj(value.documentNumber)
            }
            onChange={onDocumentNumber}
          />
          <Field label="E-mail Principal" value={value.clientEmail} onChange={onClientEmail} />
          <Field label="Telefone Principal" value={maskPhone(value.phone)} onChange={onPhone} />
          <Field
            label="CEP"
            value={maskCep(uiExtras.cep)}
            onChange={onCep}
            disabled={addressAutoFill.loading}
            onBlur={onCepBlur}
          />

          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Endereço
            </Typography>
          </Grid>

          <Field label="Rua" value={uiExtras.street} onChange={onStreet} />
          <Field
            label="Número"
            value={uiExtras.number}
            onChange={onNumber}
            size={{ xs: 12, md: 3 }}
          />
          <Field
            label="Complemento"
            value={uiExtras.complement}
            onChange={onComplement}
            size={{ xs: 12, md: 3 }}
          />
          <Field
            label="Bairro"
            value={uiExtras.neighborhood}
            onChange={onNeighborhood}
            size={{ xs: 12, md: 4 }}
          />
          <Field label="Cidade" value={uiExtras.city} onChange={onCity} size={{ xs: 12, md: 4 }} />
          <Field
            label="Estado"
            value={uiExtras.state}
            onChange={onState}
            size={{ xs: 12, md: 4 }}
          />
          <Field label="País" value={uiExtras.country} onChange={onCountry} />
        </Grid>
      </Stack>
    );
  },
);
