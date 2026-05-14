import { AdminStep } from '@features/platform/clients/components/onboarding/AdminStep';
import { ClientDataStep } from '@features/platform/clients/components/onboarding/ClientDataStep';
import { OnboardingSummary } from '@features/platform/clients/components/onboarding/OnboardingSummary';
import { PlanStep } from '@features/platform/clients/components/onboarding/PlanStep';
import { TenantStep } from '@features/platform/clients/components/onboarding/TenantStep';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientOnboardingPageViewModel } from '@features/platform/clients/hooks/useClientOnboardingPageViewModel';
import { layoutSpacing } from '@theme/spacing';
import { shadowTokens } from '@theme/tokens/shadows';

const ClientOnboardingPage = () => {
  const model = useClientOnboardingPageViewModel();
  const sharedStepProps = {
    value: model.form.value,
    uiExtras: model.form.uiExtras,
    actions: model.form.actions,
    addressLoading: model.form.addressLoading,
  };
  const stepContentByIndex = [
    <ClientDataStep key="client-data" {...sharedStepProps} />,
    <TenantStep key="tenant" {...sharedStepProps} />,
    <PlanStep
      key="plan"
      {...sharedStepProps}
      planOptions={model.form.planOptions}
      plansLoading={model.form.plansLoading}
    />,
    <AdminStep key="admin" {...sharedStepProps} />,
  ];
  const stepContent = stepContentByIndex[model.activeStep] ?? stepContentByIndex[0];

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
            {stepContent}
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
