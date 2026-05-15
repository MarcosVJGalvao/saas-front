import { OnboardingSummary } from '@features/platform/clients/components/onboarding/OnboardingSummary';
import { OnboardingSteps } from '@features/platform/clients/components/onboarding/OnboardingSteps';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientOnboardingPageViewModel } from '@features/platform/clients/hooks/useClientOnboardingPageViewModel';
import { layoutSpacing } from '@theme/spacing';
import { shadowTokens } from '@theme/tokens/shadows';

const ClientOnboardingPage = () => {
  const model = useClientOnboardingPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Onboarding de Novo Cliente"
        subtitle="Crie um novo cliente, configure o tenant e o usuário administrador."
      />
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
            nextLabel={model.isLastStep ? 'Finalizar onboarding' : 'Próximo'}
            nextDisabled={model.nextDisabled}
          >
            <OnboardingSteps activeStep={model.activeStep} {...model.form} />
          </StepperWizard>
        </AppPaper>
        <OnboardingSummary
          summary={model.committedSummary}
          activeStep={model.activeStep}
          maxCompletedStep={model.maxCompletedStep}
          onStepSelect={model.onStepSelect}
        />
      </AppStack>
    </AppStack>
  );
};

export default ClientOnboardingPage;
