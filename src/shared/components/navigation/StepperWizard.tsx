import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomPreferencesOutlinedIcon from '@mui/icons-material/RoomPreferencesOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { layoutSpacing, spacingScale } from '@theme/spacing';

interface StepperWizardProps {
  activeStep: number;
  steps: string[];
  children: ReactNode;
  onBack: () => void;
  onCancel?: (() => void) | undefined;
  onNext: () => void;
  isLastStep: boolean;
  nextLabel?: string | undefined;
  nextDisabled?: boolean | undefined;
  nextLoading?: boolean | undefined;
}

const stepIcons = [
  PersonOutlineOutlinedIcon,
  RoomPreferencesOutlinedIcon,
  BadgeOutlinedIcon,
  DescriptionOutlinedIcon,
  HomeRepairServiceOutlinedIcon,
];

export const StepperWizard = ({
  activeStep,
  steps,
  children,
  onBack,
  onCancel,
  onNext,
  isLastStep,
  nextLabel,
  nextDisabled,
  nextLoading = false,
}: StepperWizardProps) => (
  <Box>
    <Stack
      direction="row"
      sx={(theme) => ({
        width: '100%',
        mb: spacingScale.md,
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
      })}
    >
      {steps.map((label, index) => {
        const isActive = activeStep === index;
        const Icon = stepIcons[index % stepIcons.length] ?? PersonOutlineOutlinedIcon;

        return (
          <Stack
            key={label}
            sx={(theme) => ({
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.65,
              py: 1.1,
              borderBottom: '2px solid',
              borderColor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? 'primary.main' : 'text.secondary',
              transition: theme.transitions.create(['color', 'border-color'], {
                duration: theme.transitions.duration.shorter,
              }),
            })}
          >
            <Icon sx={{ fontSize: 19 }} />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: isActive ? 600 : 500,
                color: 'inherit',
                textAlign: 'center',
              }}
            >
              {label}
            </Typography>
          </Stack>
        );
      })}
    </Stack>

    <Box>{children}</Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: layoutSpacing.sectionGap }}>
      <Button
        onClick={activeStep === 0 ? (onCancel ?? onBack) : onBack}
        variant="text"
        color={activeStep === 0 ? 'error' : 'secondary'}
        sx={{ fontWeight: 500 }}
      >
        {activeStep === 0 ? 'Cancelar' : 'Voltar'}
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        sx={(theme) => ({
          px: 3,
          py: 0.9,
          boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.45 : 0.3)}`,
        })}
        startIcon={
          nextLoading ? (
            <CircularProgress size={16} color="inherit" aria-label="Carregando" />
          ) : null
        }
      >
        {nextLoading
          ? 'Finalizando...'
          : (nextLabel ?? (isLastStep ? 'Finalizar' : 'Salvar e continuar'))}
      </Button>
    </Box>
  </Box>
);
