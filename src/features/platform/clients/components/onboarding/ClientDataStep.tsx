import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { memo } from 'react';
import { fontSizes } from '@theme/fontSizes';
import { spacingScale } from '@theme/spacing';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { OnboardingField } from '@features/platform/clients/components/onboarding/OnboardingField';
import type { OnboardingStepProps } from '@features/platform/clients/components/onboarding/types';

export const ClientDataStep = memo(
  ({ value, uiExtras, actions, addressLoading }: OnboardingStepProps) => (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.2 }}>
        <AppStack
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'action.selected',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: fontSizes.lg, color: 'text.secondary' }} />
        </AppStack>
        <AppText variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.2 }}>
          Dados do Cliente
        </AppText>
      </AppStack>

      <AppText
        variant="body2"
        color="text.secondary"
        sx={{ ml: 4, mt: -0.15, fontSize: fontSizes.sm, lineHeight: 1.35, fontWeight: 500 }}
      >
        Informações da empresa que será cadastrada na plataforma.
      </AppText>

      <AppGrid container spacing={spacingScale.xs}>
        <OnboardingField
          label="Nome Fantasia"
          value={value.tradeName}
          onChange={actions.updateTradeName}
        />
        <OnboardingField
          label="Razão Social"
          value={value.legalName}
          onChange={actions.updateLegalName}
        />
        <OnboardingField
          label={value.documentType === 'CPF' ? 'CPF' : 'CNPJ'}
          value={
            value.documentType === 'CPF'
              ? maskCpf(value.documentNumber)
              : maskCnpj(value.documentNumber)
          }
          onChange={actions.updateDocumentNumber}
        />
        <OnboardingField
          label="E-mail Principal"
          value={value.clientEmail}
          onChange={actions.updateClientEmail}
        />
        <OnboardingField
          label="Telefone Principal"
          value={maskPhone(value.phone)}
          onChange={actions.updatePhone}
        />
        <OnboardingField
          label="CEP"
          value={maskCep(uiExtras.cep)}
          onChange={actions.updateCep}
          disabled={addressLoading}
          onBlur={actions.resolveAddressByCep}
        />

        <AppGrid size={{ xs: 12 }}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Endereço
          </AppText>
        </AppGrid>

        <OnboardingField label="Rua" value={uiExtras.street} onChange={actions.updateStreet} />
        <OnboardingField
          label="Número"
          value={uiExtras.number}
          onChange={actions.updateNumber}
          gridSize={{ xs: 12, md: 3 }}
        />
        <OnboardingField
          label="Complemento"
          value={uiExtras.complement}
          onChange={actions.updateComplement}
          gridSize={{ xs: 12, md: 3 }}
        />
        <OnboardingField
          label="Bairro"
          value={uiExtras.neighborhood}
          onChange={actions.updateNeighborhood}
          gridSize={{ xs: 12, md: 4 }}
        />
        <OnboardingField
          label="Cidade"
          value={uiExtras.city}
          onChange={actions.updateCity}
          gridSize={{ xs: 12, md: 4 }}
        />
        <OnboardingField
          label="Estado"
          value={uiExtras.state}
          onChange={actions.updateState}
          gridSize={{ xs: 12, md: 4 }}
        />
        <OnboardingField label="País" value={uiExtras.country} onChange={actions.updateCountry} />
      </AppGrid>
    </AppStack>
  ),
);
