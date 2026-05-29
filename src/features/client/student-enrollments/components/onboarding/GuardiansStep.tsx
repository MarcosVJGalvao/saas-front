import AddIcon from '@mui/icons-material/Add';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { GuardianCard } from '@features/client/student-enrollments/components/onboarding/GuardianCard';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

export const GuardiansStep = ({ value, uiExtras, actions }: StudentEnrollmentStepProps) => {
  const guardians = value.student?.legalGuardians ?? [];
  const canRemove = guardians.length > 1;

  return (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <FamilyRestroomOutlinedIcon color="primary" />
        <AppText variant="h6">Responsáveis</AppText>
      </AppStack>
      <AppText variant="body2" color="text.secondary">
        Informe o responsável principal. A matrícula exige ao menos um responsável legal.
      </AppText>

      <AppStack spacing={2}>
        {guardians.map((guardian, index) => (
          <GuardianCard
            key={index}
            guardian={guardian}
            index={index}
            uiExtras={uiExtras}
            actions={actions}
            canRemove={canRemove}
          />
        ))}
      </AppStack>

      <AppButton
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={actions.addGuardian}
        sx={{ alignSelf: 'flex-start' }}
      >
        Adicionar responsável
      </AppButton>
    </AppStack>
  );
};
