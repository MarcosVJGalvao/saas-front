import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import type { ReactNode } from 'react';

interface StepperWizardProps {
  activeStep: number;
  steps: string[];
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
}

export const StepperWizard = ({
  activeStep,
  steps,
  children,
  onBack,
  onNext,
  isLastStep,
}: StepperWizardProps) => (
  <Box>
    <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
    <Box>{children}</Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button onClick={onBack} disabled={activeStep === 0}>
        Voltar
      </Button>
      <Button variant="contained" onClick={onNext}>
        {isLastStep ? 'Finalizar' : 'Avançar'}
      </Button>
    </Box>
  </Box>
);
