import { useCallback } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { AppText } from '@shared/components/data-display/AppText';
import { AppDivider } from '@shared/components/data-display/AppDivider';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppCheckbox } from '@shared/components/inputs/AppCheckbox';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import {
  documentTypeOptions,
  genderOptionsWithPlaceholder,
  guardianRelationshipTypeOptions,
  maritalStatusOptionsWithPlaceholder,
  nationalityOptions,
} from '@shared/constants/selectOptions';
import { useAddressAutoFill } from '@shared/hooks/useAddressAutoFill/useAddressAutoFill';
import { maskCep, maskCnpj, maskCpf, maskCurrency, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import {
  toEnrollmentDocumentType,
  toEnrollmentGender,
  toEnrollmentMaritalStatus,
  toEnrollmentNationality,
  toGuardianRelationshipType,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentFieldNormalizers';
import type { EnrollmentLegalGuardianInput } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type {
  StudentEnrollmentOnboardingActions,
  StudentEnrollmentOnboardingUiExtras,
} from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

type GuardianCardProps = {
  guardian: EnrollmentLegalGuardianInput;
  index: number;
  uiExtras: StudentEnrollmentOnboardingUiExtras;
  actions: StudentEnrollmentOnboardingActions;
  canRemove: boolean;
};

export const GuardianCard = ({
  guardian,
  index,
  uiExtras,
  actions,
  canRemove,
}: GuardianCardProps) => {
  const person = guardian.person;
  const documentType = person?.documentType ?? 'CPF';
  const documentNumber = person?.documentNumber ?? '';
  const guardianAddress = guardian.addresses?.[0];
  const label = guardian.isPrimary
    ? `Responsável ${index + 1} — Principal`
    : `Responsável ${index + 1}`;

  const onAddressResolved = useCallback(
    (fields: { street?: string; neighborhood?: string; city?: string; state?: string }) => {
      if (fields.street) actions.updateGuardianStreet(index, fields.street);
      if (fields.neighborhood) actions.updateGuardianNeighborhood(index, fields.neighborhood);
      if (fields.city) actions.updateGuardianCity(index, fields.city);
      if (fields.state) actions.updateGuardianState(index, fields.state);
    },
    [index, actions],
  );

  const { resolveByCep } = useAddressAutoFill({ onResolved: onAddressResolved });

  const handleCepBlur = useCallback(() => {
    const cep = uiExtras.guardianCeps[index] ?? '';
    if (onlyDigits(cep).length === 8) {
      void resolveByCep(cep);
    }
  }, [resolveByCep, uiExtras.guardianCeps, index]);

  return (
    <AppPaper variant="outlined" sx={{ p: 2 }}>
      <AppStack spacing={2}>
        <AppStack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="subtitle1" sx={{ fontWeight: 600 }}>
            {label}
          </AppText>
          <AppButton
            size="small"
            color="error"
            variant="text"
            disabled={!canRemove}
            startIcon={<DeleteOutlinedIcon />}
            onClick={() => actions.removeGuardian(index)}
          >
            Remover
          </AppButton>
        </AppStack>

        <AppStack spacing={1.5}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            DADOS PESSOAIS
          </AppText>
          <AppDivider />
          <AppGrid container spacing={1.5}>
            <EnrollmentOnboardingField
              select
              label="Vínculo"
              value={guardian.relationshipType ?? 'mother'}
              onChange={(nextValue) => {
                const relationshipType = toGuardianRelationshipType(nextValue);
                if (relationshipType) {
                  actions.updateGuardianRelationshipType(index, relationshipType);
                }
              }}
              options={guardianRelationshipTypeOptions}
            />
            <EnrollmentOnboardingField
              label="Nome completo"
              value={person?.fullName ?? ''}
              onChange={(value) => actions.updateGuardianFullName(index, value)}
            />
            <EnrollmentOnboardingField
              select
              label="Tipo de documento"
              value={documentType}
              onChange={(nextValue) => {
                const nextDocumentType = toEnrollmentDocumentType(nextValue);
                if (nextDocumentType) {
                  actions.updateGuardianDocumentType(index, nextDocumentType);
                }
              }}
              options={documentTypeOptions}
            />
            <EnrollmentOnboardingField
              label="Documento"
              value={documentType === 'CPF' ? maskCpf(documentNumber) : maskCnpj(documentNumber)}
              onChange={(value) => actions.updateGuardianDocumentNumber(index, value)}
            />
            <AppGrid size={{ xs: 12, md: 6 }}>
              <AppDatePicker
                label="Data de nascimento"
                value={person?.dateOfBirth ?? ''}
                onChange={(nextValue) => actions.updateGuardianDateOfBirth(index, nextValue ?? '')}
                textFieldSlotProps={{ size: 'small' }}
              />
            </AppGrid>
            <EnrollmentOnboardingField
              select
              label="Gênero"
              value={person?.gender ?? ''}
              onChange={(nextValue) =>
                actions.updateGuardianGender(index, toEnrollmentGender(nextValue))
              }
              options={genderOptionsWithPlaceholder}
            />
            <EnrollmentOnboardingField
              select
              label="Estado civil"
              value={person?.maritalStatus ?? ''}
              onChange={(nextValue) =>
                actions.updateGuardianMaritalStatus(index, toEnrollmentMaritalStatus(nextValue))
              }
              options={maritalStatusOptionsWithPlaceholder}
            />
            <EnrollmentOnboardingField
              select
              label="Nacionalidade"
              value={person?.nationality ?? 'brazilian'}
              onChange={(nextValue) =>
                actions.updateGuardianNationality(index, toEnrollmentNationality(nextValue))
              }
              options={nationalityOptions}
            />
            <EnrollmentOnboardingField
              label="Renda mensal"
              value={maskCurrency(person?.monthlyIncome ?? '')}
              onChange={(value) => actions.updateGuardianMonthlyIncome(index, value)}
            />
            <AppGrid size={{ xs: 12 }}>
              <AppCheckbox
                checked={guardian.canPickUp ?? true}
                label={<AppText variant="body2">Pode buscar o aluno</AppText>}
                onChange={(checked) => actions.updateGuardianCanPickUp(index, checked)}
              />
            </AppGrid>
          </AppGrid>
        </AppStack>

        <AppStack spacing={1.5}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            CONTATO
          </AppText>
          <AppDivider />
          <AppGrid container spacing={1.5}>
            <EnrollmentOnboardingField
              label="E-mail"
              value={uiExtras.guardianEmails[index] ?? ''}
              onChange={(value) => actions.updateGuardianEmail(index, value)}
            />
            <AppGrid size={{ xs: 12, md: 6 }}>
              <AppStack spacing={0.5}>
                <EnrollmentOnboardingField
                  label="Telefone"
                  value={maskPhone(uiExtras.guardianPhones[index] ?? '')}
                  onChange={(value) => actions.updateGuardianPhone(index, value)}
                  gridSize={{ xs: 12 }}
                />
                <AppCheckbox
                  checked={uiExtras.guardianPhoneIsWhatsApp[index] ?? false}
                  label={<AppText variant="body2">É também WhatsApp</AppText>}
                  onChange={(checked) => actions.updateGuardianPhoneIsWhatsApp(index, checked)}
                />
              </AppStack>
            </AppGrid>
          </AppGrid>
        </AppStack>

        <AppStack spacing={1.5}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            ENDEREÇO
          </AppText>
          <AppDivider />
          <AppGrid container spacing={1.5}>
            <EnrollmentOnboardingField
              label="CEP"
              value={maskCep(uiExtras.guardianCeps[index] ?? '')}
              onChange={(value) => actions.updateGuardianCep(index, value)}
              onBlur={handleCepBlur}
            />
            <EnrollmentOnboardingField
              label="Rua"
              value={guardianAddress?.street ?? ''}
              onChange={(value) => actions.updateGuardianStreet(index, value)}
            />
            <EnrollmentOnboardingField
              label="Número"
              value={guardianAddress?.number ?? ''}
              onChange={(value) => actions.updateGuardianNumber(index, value)}
              gridSize={{ xs: 12, md: 3 }}
            />
            <EnrollmentOnboardingField
              label="Complemento"
              value={guardianAddress?.complement ?? ''}
              onChange={(value) => actions.updateGuardianComplement(index, value)}
              gridSize={{ xs: 12, md: 3 }}
            />
            <EnrollmentOnboardingField
              label="Bairro"
              value={guardianAddress?.neighborhood ?? ''}
              onChange={(value) => actions.updateGuardianNeighborhood(index, value)}
              gridSize={{ xs: 12, md: 4 }}
            />
            <EnrollmentOnboardingField
              label="Cidade"
              value={guardianAddress?.city ?? ''}
              onChange={(value) => actions.updateGuardianCity(index, value)}
              gridSize={{ xs: 12, md: 4 }}
            />
            <EnrollmentOnboardingField
              label="Estado"
              value={guardianAddress?.state ?? ''}
              onChange={(value) => actions.updateGuardianState(index, value)}
              gridSize={{ xs: 12, md: 4 }}
            />
            <EnrollmentOnboardingField
              label="País"
              value={guardianAddress?.country ?? 'Brasil'}
              onChange={(value) => actions.updateGuardianCountry(index, value)}
            />
          </AppGrid>
        </AppStack>
      </AppStack>
    </AppPaper>
  );
};
