import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { OnboardingSummary } from '../../../components/common/onboarding/OnboardingSummary';
import { StepperWizard } from '../../../components/common/navigation/StepperWizard';
import { useClientOnboardingPageViewModel } from '../../../hooks/clients/useClientOnboardingPageViewModel';
import { layoutSpacing } from '../../../theme/spacing';

const ClientOnboardingPage = () => {
  const model = useClientOnboardingPageViewModel();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Onboarding de Novo Cliente</Typography>
      <Typography color="text.secondary">
        Crie um novo cliente, configure o tenant e o usuário administrador.
      </Typography>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={layoutSpacing.sectionGap}
        sx={{ alignItems: 'flex-start' }}
      >
        <Paper
          sx={{
            p: 2,
            flex: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
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
            {model.stepContent}
          </StepperWizard>
        </Paper>
        <OnboardingSummary
          summary={model.committedSummary}
          activeStep={model.activeStep}
          maxCompletedStep={model.maxCompletedStep}
          onStepSelect={model.onStepSelect}
        />
      </Stack>
    </Stack>
  );
};

export default ClientOnboardingPage;
