import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import type { CreateClientOnboardingRequest } from '../../models/clients';

const steps = [
  'Dados do Cliente',
  'Configuração do Tenant',
  'Plano e Assinatura',
  'Usuário Administrador',
];

interface Props {
  loading: boolean;
  onSubmit: (value: CreateClientOnboardingRequest) => void;
}

type UiExtras = {
  stateRegistration: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  segment: string;
  companySize: string;
  financeEmail: string;
  financePhone: string;
};

const initialValue: CreateClientOnboardingRequest = {
  legalName: '',
  tradeName: '',
  documentNumber: '',
  documentType: 'CNPJ',
  clientEmail: '',
  phone: '',
  tenantName: '',
  tenantSlug: '',
  timezone: '',
  locale: '',
  currency: '',
  planId: '',
  adminPassword: '',
  employee: {
    person: { fullName: '', documentNumber: '', documentType: 'CPF' },
    contacts: [{ type: 'email', value: '' }],
    department: '',
  },
};

const initialUiExtras: UiExtras = {
  stateRegistration: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  city: '',
  state: '',
  country: 'Brasil',
  segment: '',
  companySize: '',
  financeEmail: '',
  financePhone: '',
};

const StepClientData = ({
  value,
  uiExtras,
  setValue,
  setUiExtras,
}: {
  value: CreateClientOnboardingRequest;
  uiExtras: UiExtras;
  setValue: (v: CreateClientOnboardingRequest) => void;
  setUiExtras: (v: UiExtras) => void;
}) => (
  <Stack spacing={2}>
    <Typography variant="h6">Dados do Cliente</Typography>
    <Typography variant="body2" color="text.secondary">
      Informações da empresa que será cadastrada na plataforma.
    </Typography>
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Nome Fantasia"
          value={value.tradeName}
          onChange={(event) => setValue({ ...value, tradeName: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Razão Social"
          value={value.legalName}
          onChange={(event) => setValue({ ...value, legalName: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="CNPJ"
          value={value.documentNumber}
          onChange={(event) => setValue({ ...value, documentNumber: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Inscrição Estadual"
          value={uiExtras.stateRegistration}
          onChange={(event) => setUiExtras({ ...uiExtras, stateRegistration: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="E-mail Principal"
          value={value.clientEmail}
          onChange={(event) => setValue({ ...value, clientEmail: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Telefone Principal"
          value={value.phone}
          onChange={(event) => setValue({ ...value, phone: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          label="CEP"
          value={uiExtras.cep}
          onChange={(event) => setUiExtras({ ...uiExtras, cep: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <TextField
          fullWidth
          label="Rua"
          value={uiExtras.street}
          onChange={(event) => setUiExtras({ ...uiExtras, street: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="Número"
          value={uiExtras.number}
          onChange={(event) => setUiExtras({ ...uiExtras, number: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="Complemento"
          value={uiExtras.complement}
          onChange={(event) => setUiExtras({ ...uiExtras, complement: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Cidade"
          value={uiExtras.city}
          onChange={(event) => setUiExtras({ ...uiExtras, city: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Estado"
          value={uiExtras.state}
          onChange={(event) => setUiExtras({ ...uiExtras, state: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="País"
          value={uiExtras.country}
          onChange={(event) => setUiExtras({ ...uiExtras, country: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Segmento de Atuação"
          value={uiExtras.segment}
          onChange={(event) => setUiExtras({ ...uiExtras, segment: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Porte da Empresa"
          value={uiExtras.companySize}
          onChange={(event) => setUiExtras({ ...uiExtras, companySize: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="E-mail Financeiro"
          value={uiExtras.financeEmail}
          onChange={(event) => setUiExtras({ ...uiExtras, financeEmail: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Telefone Financeiro"
          value={uiExtras.financePhone}
          onChange={(event) => setUiExtras({ ...uiExtras, financePhone: event.target.value })}
        />
      </Grid>
    </Grid>
  </Stack>
);

const StepTenant = ({
  value,
  setValue,
}: {
  value: CreateClientOnboardingRequest;
  setValue: (v: CreateClientOnboardingRequest) => void;
}) => (
  <Stack spacing={1.5}>
    <Typography variant="h6">Configuração do Tenant</Typography>
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Nome do Tenant"
          value={value.tenantName}
          onChange={(event) => setValue({ ...value, tenantName: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Slug do Tenant"
          value={value.tenantSlug}
          onChange={(event) => setValue({ ...value, tenantSlug: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Timezone"
          value={value.timezone ?? ''}
          onChange={(event) => setValue({ ...value, timezone: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Locale"
          value={value.locale ?? ''}
          onChange={(event) => setValue({ ...value, locale: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Moeda"
          value={value.currency ?? ''}
          onChange={(event) => setValue({ ...value, currency: event.target.value })}
        />
      </Grid>
    </Grid>
  </Stack>
);

const StepPlan = ({
  value,
  setValue,
}: {
  value: CreateClientOnboardingRequest;
  setValue: (v: CreateClientOnboardingRequest) => void;
}) => (
  <Stack spacing={1.5}>
    <Typography variant="h6">Plano e Assinatura</Typography>
    <TextField
      fullWidth
      select
      label="Plano"
      value={value.planId}
      onChange={(event) => setValue({ ...value, planId: event.target.value })}
    >
      <MenuItem value="">Selecione</MenuItem>
      <MenuItem value="pro">Pro</MenuItem>
      <MenuItem value="starter">Starter</MenuItem>
    </TextField>
  </Stack>
);

const StepAdmin = ({
  value,
  setValue,
}: {
  value: CreateClientOnboardingRequest;
  setValue: (v: CreateClientOnboardingRequest) => void;
}) => (
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
          label="Documento do Admin"
          value={value.employee.person.documentNumber}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: { ...value.employee.person, documentNumber: event.target.value },
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

const OnboardingSummary = ({
  summary,
}: {
  summary: { client: string; tenant: string; plan: string; admin: string };
}) => (
  <Stack spacing={2} sx={{ width: { xs: '100%', xl: 360 } }}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Resumo do Onboarding</Typography>
      <Typography variant="body2" color="text.secondary">
        Acompanhe as informações que você já definiu.
      </Typography>
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="subtitle2">1. Dados do Cliente</Typography>
          <Typography variant="caption" color="text.secondary">
            {summary.client || 'Preencha os dados do cliente.'}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="subtitle2">2. Configuração do Tenant</Typography>
          <Typography variant="caption" color="text.secondary">
            {summary.tenant || 'Configure o identificador do tenant.'}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="subtitle2">3. Plano e Assinatura</Typography>
          <Typography variant="caption" color="text.secondary">
            {summary.plan || 'Selecione o plano de cobrança.'}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="subtitle2">4. Usuário Administrador</Typography>
          <Typography variant="caption" color="text.secondary">
            {summary.admin || 'Informe o administrador.'}
          </Typography>
        </Paper>
      </Stack>
    </Paper>
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Importante
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Ao finalizar o onboarding, cliente, tenant e usuário administrador serão criados conforme o
        contrato da API.
      </Typography>
    </Paper>
  </Stack>
);

export const ClientOnboardingForm = ({ loading, onSubmit }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<CreateClientOnboardingRequest>(initialValue);
  const [uiExtras, setUiExtras] = useState<UiExtras>(initialUiExtras);

  const summary = useMemo(
    () => ({
      client: [value.tradeName, value.documentNumber, value.clientEmail]
        .filter(Boolean)
        .join(' • '),
      tenant: [value.tenantName, value.tenantSlug].filter(Boolean).join(' • '),
      plan: value.planId,
      admin: [value.employee.person.fullName, value.employee.contacts[0]?.value]
        .filter(Boolean)
        .join(' • '),
    }),
    [value],
  );

  return (
    <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2}>
      <Paper sx={{ p: 2, flex: 1 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((stepLabel) => (
            <Step key={stepLabel}>
              <StepLabel>{stepLabel}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
          <StepClientData
            value={value}
            uiExtras={uiExtras}
            setValue={setValue}
            setUiExtras={setUiExtras}
          />
        ) : null}
        {activeStep === 1 ? <StepTenant value={value} setValue={setValue} /> : null}
        {activeStep === 2 ? <StepPlan value={value} setValue={setValue} /> : null}
        {activeStep === 3 ? <StepAdmin value={value} setValue={setValue} /> : null}

        <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 2 }}>
          <Button
            onClick={() => setActiveStep((stepIndex) => Math.max(0, stepIndex - 1))}
            disabled={activeStep === 0}
          >
            Voltar
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() =>
                setActiveStep((stepIndex) => Math.min(steps.length - 1, stepIndex + 1))
              }
            >
              Salvar e continuar
            </Button>
          ) : (
            <Button variant="contained" onClick={() => onSubmit(value)} disabled={loading}>
              Finalizar onboarding
            </Button>
          )}
        </Stack>
      </Paper>

      <OnboardingSummary summary={summary} />
    </Stack>
  );
};
