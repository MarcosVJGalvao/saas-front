import { OnboardingSummary } from '@features/platform/clients/components/onboarding/OnboardingSummary';
import { OnboardingSteps } from '@features/platform/clients/components/onboarding/OnboardingSteps';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientOnboardingPage } from '@features/platform/clients/hooks/useClientOnboardingPage';
import { layoutSpacing } from '@theme/spacing';
import { shadowTokens } from '@theme/tokens/shadows';

const ClientOnboardingPage = () => {
  const clientOnboardingPage = useClientOnboardingPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Onboarding de novo cliente"
        subtitle="Crie um novo cliente, configure o tenant e o usuário administrador."
      />
      {clientOnboardingPage.errorMessage ? (
        <AppAlert severity="error">{clientOnboardingPage.errorMessage}</AppAlert>
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
            activeStep={clientOnboardingPage.activeStep}
            steps={clientOnboardingPage.steps}
            onBack={clientOnboardingPage.onBack}
            onCancel={clientOnboardingPage.onCancel}
            onNext={() => void clientOnboardingPage.handleNext()}
            isLastStep={clientOnboardingPage.isLastStep}
            nextLoading={clientOnboardingPage.loading && clientOnboardingPage.isLastStep}
            nextLabel={clientOnboardingPage.isLastStep ? 'Finalizar onboarding' : 'Próximo'}
            nextDisabled={clientOnboardingPage.nextDisabled}
          >
            <OnboardingSteps
              activeStep={clientOnboardingPage.activeStep}
              {...clientOnboardingPage.form}
            />
          </StepperWizard>
        </AppPaper>
        <OnboardingSummary
          summary={clientOnboardingPage.committedSummary}
          activeStep={clientOnboardingPage.activeStep}
          maxCompletedStep={clientOnboardingPage.maxCompletedStep}
          onStepSelect={clientOnboardingPage.onStepSelect}
        />
      </AppStack>
    </AppStack>
  );
};

export default ClientOnboardingPage;
