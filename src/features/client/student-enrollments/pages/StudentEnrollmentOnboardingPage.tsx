import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { StudentEnrollmentSteps } from '@features/client/student-enrollments/components/onboarding/StudentEnrollmentSteps';
import { StudentEnrollmentSummary } from '@features/client/student-enrollments/components/onboarding/StudentEnrollmentSummary';
import { layoutSpacing } from '@theme/spacing';
import { shadowTokens } from '@theme/tokens/shadows';
import { useStudentEnrollmentOnboardingPageViewModel } from '@features/client/student-enrollments/hooks/useStudentEnrollmentOnboardingPageViewModel';

const StudentEnrollmentOnboardingPage = () => {
  const model = useStudentEnrollmentOnboardingPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Nova Matrícula"
        subtitle="Crie a matrícula, aluno e responsáveis em um fluxo guiado."
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      <AppStack
        direction={{ xs: 'column', md: 'row' }}
        spacing={layoutSpacing.sectionGap}
        sx={{ alignItems: 'flex-start' }}
      >
        <AppPaper
          sx={{
            p: 2,
            flex: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: shadowTokens.card,
          }}
        >
          <StepperWizard
            activeStep={model.activeStep}
            steps={model.steps}
            onBack={model.onBack}
            onCancel={model.onCancel}
            onNext={model.handleNext}
            isLastStep={model.isLastStep}
            nextLoading={model.loading && model.isLastStep}
            nextLabel={model.isLastStep ? 'Finalizar matrícula' : 'Próximo'}
            nextDisabled={model.nextDisabled}
          >
            <StudentEnrollmentSteps activeStep={model.activeStep} {...model.form} />
          </StepperWizard>
        </AppPaper>
        <StudentEnrollmentSummary
          summary={model.committedSummary}
          activeStep={model.activeStep}
          maxCompletedStep={model.maxCompletedStep}
          onStepSelect={model.onStepSelect}
        />
      </AppStack>
    </AppStack>
  );
};

export default StudentEnrollmentOnboardingPage;
