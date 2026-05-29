import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { StudentEnrollmentSteps } from '@features/client/student-enrollments/components/onboarding/StudentEnrollmentSteps';
import { StudentEnrollmentSummary } from '@features/client/student-enrollments/components/onboarding/StudentEnrollmentSummary';
import { layoutSpacing } from '@theme/spacing';
import { shadowTokens } from '@theme/tokens/shadows';
import { useStudentEnrollmentOnboardingPage } from '@features/client/student-enrollments/hooks/useStudentEnrollmentOnboardingPage';

const StudentEnrollmentOnboardingPage = () => {
  const studentEnrollmentOnboardingPage = useStudentEnrollmentOnboardingPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Nova Matrícula"
        subtitle="Crie a matrícula, aluno e responsáveis em um fluxo guiado."
      />
      {studentEnrollmentOnboardingPage.errorMessage ? (
        <AppAlert severity="error">{studentEnrollmentOnboardingPage.errorMessage}</AppAlert>
      ) : null}
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
            activeStep={studentEnrollmentOnboardingPage.activeStep}
            steps={studentEnrollmentOnboardingPage.steps}
            onBack={() => {
              studentEnrollmentOnboardingPage.onBack();
            }}
            onCancel={() => {
              void studentEnrollmentOnboardingPage.onCancel();
            }}
            onNext={() => void studentEnrollmentOnboardingPage.handleNext()}
            isLastStep={studentEnrollmentOnboardingPage.isLastStep}
            nextLoading={
              studentEnrollmentOnboardingPage.loading && studentEnrollmentOnboardingPage.isLastStep
            }
            nextLabel={
              studentEnrollmentOnboardingPage.isLastStep ? 'Finalizar matrícula' : 'Próximo'
            }
            nextDisabled={studentEnrollmentOnboardingPage.nextDisabled}
            nextDisabledTooltip={studentEnrollmentOnboardingPage.nextDisabledTooltip}
          >
            <StudentEnrollmentSteps
              activeStep={studentEnrollmentOnboardingPage.activeStep}
              {...studentEnrollmentOnboardingPage.form}
            />
          </StepperWizard>
        </AppPaper>
        <StudentEnrollmentSummary
          summary={studentEnrollmentOnboardingPage.committedSummary}
          activeStep={studentEnrollmentOnboardingPage.activeStep}
          maxCompletedStep={studentEnrollmentOnboardingPage.maxCompletedStep}
          onStepSelect={studentEnrollmentOnboardingPage.onStepSelect}
        />
      </AppStack>
    </AppStack>
  );
};

export default StudentEnrollmentOnboardingPage;
