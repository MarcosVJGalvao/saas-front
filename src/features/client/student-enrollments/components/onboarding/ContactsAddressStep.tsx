import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppCheckbox } from '@shared/components/inputs/AppCheckbox';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';
import { maskCep, maskPhone } from '@shared/masks/inputMasks';

export const ContactsAddressStep = ({ value, uiExtras, actions }: StudentEnrollmentStepProps) => {
  const studentAddress = value.student?.addresses[0];
  const primaryGuardianAddress = value.student?.legalGuardians[0]?.addresses?.[0];

  const copyAddressFromGuardian = () => {
    if (!primaryGuardianAddress) return;
    actions.updateStudentCep(uiExtras.guardianCeps[0] ?? '');
    actions.updateStudentStreet(primaryGuardianAddress.street);
    actions.updateStudentNumber(primaryGuardianAddress.number);
    actions.updateStudentComplement(primaryGuardianAddress.complement ?? '');
    actions.updateStudentNeighborhood(primaryGuardianAddress.neighborhood);
    actions.updateStudentCity(primaryGuardianAddress.city);
    actions.updateStudentState(primaryGuardianAddress.state);
    actions.updateStudentCountry(primaryGuardianAddress.country);
  };

  return (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <ContactPhoneOutlinedIcon color="primary" />
        <AppText variant="h6">Endereço e Contatos</AppText>
      </AppStack>
      <AppGrid container spacing={1.5}>
        <AppGrid size={{ xs: 12 }}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Contatos do aluno
          </AppText>
        </AppGrid>
        <EnrollmentOnboardingField
          label="E-mail do aluno"
          value={uiExtras.studentEmail}
          onChange={actions.updateStudentEmail}
        />
        <AppGrid size={{ xs: 12, md: 6 }}>
          <AppStack spacing={0.5}>
            <EnrollmentOnboardingField
              label="Telefone do aluno"
              value={maskPhone(uiExtras.studentPhone)}
              onChange={actions.updateStudentPhone}
              gridSize={{ xs: 12 }}
            />
            <AppCheckbox
              checked={uiExtras.studentPhoneIsWhatsApp}
              label={<AppText variant="body2">É também WhatsApp</AppText>}
              onChange={actions.updateStudentPhoneIsWhatsApp}
            />
          </AppStack>
        </AppGrid>
        <AppGrid size={{ xs: 12 }}>
          <AppStack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Endereço do aluno
            </AppText>
            {primaryGuardianAddress && (
              <AppButton
                size="small"
                variant="text"
                startIcon={<ContentCopyOutlinedIcon />}
                onClick={copyAddressFromGuardian}
              >
                Copiar do responsável
              </AppButton>
            )}
          </AppStack>
        </AppGrid>
        <EnrollmentOnboardingField
          label="CEP"
          value={maskCep(uiExtras.studentCep)}
          onChange={actions.updateStudentCep}
        />
        <EnrollmentOnboardingField
          label="Rua"
          value={studentAddress?.street ?? ''}
          onChange={actions.updateStudentStreet}
        />
        <EnrollmentOnboardingField
          label="Número"
          value={studentAddress?.number ?? ''}
          onChange={actions.updateStudentNumber}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Complemento"
          value={studentAddress?.complement ?? ''}
          onChange={actions.updateStudentComplement}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Bairro"
          value={studentAddress?.neighborhood ?? ''}
          onChange={actions.updateStudentNeighborhood}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="Cidade"
          value={studentAddress?.city ?? ''}
          onChange={actions.updateStudentCity}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="Estado"
          value={studentAddress?.state ?? ''}
          onChange={actions.updateStudentState}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="País"
          value={studentAddress?.country ?? 'Brasil'}
          onChange={actions.updateStudentCountry}
        />
      </AppGrid>
    </AppStack>
  );
};
