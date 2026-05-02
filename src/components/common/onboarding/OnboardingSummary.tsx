import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { memo } from 'react';
import type { OnboardingSummaryData } from './types';

interface Props {
  summary: OnboardingSummaryData;
  activeStep: number;
  maxCompletedStep: number;
  onStepSelect: (stepIndex: number) => void;
}

const stepLabels = [
  'Dados do Cliente',
  'Configuração do Tenant',
  'Plano e Assinatura',
  'Usuário Administrador',
];
const stepHints = [
  'Informações principais do cliente.',
  'Configuração do identificador do tenant.',
  'Seleção do plano e ciclo de cobrança.',
  'Dados do usuário administrador.',
];

const getSummaryTexts = (summary: OnboardingSummaryData): string[] => [
  summary.client || stepHints[0],
  summary.tenant || stepHints[1],
  summary.plan || stepHints[2],
  summary.admin || stepHints[3],
];

export const OnboardingSummary = memo(
  ({ summary, activeStep, maxCompletedStep, onStepSelect }: Props) => {
    const summaryTexts = getSummaryTexts(summary);
    const completedSteps = Math.max(0, Math.min(maxCompletedStep, stepLabels.length));
    const progress = Math.round((completedSteps / stepLabels.length) * 100);

    return (
      <Stack
        spacing={1.5}
        sx={{ width: { xs: '100%', md: 360, lg: 380 }, maxWidth: '100%', flexShrink: 0 }}
      >
        <Paper
          sx={(theme) => ({
            p: 1.5,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.35 : 0.08)}`,
            bgcolor: 'background.paper',
          })}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
            Resumo do Onboarding
          </Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.25 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {summary.client?.slice(0, 2).toUpperCase() || 'ON'}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
                Preenchimento Geral
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>
                Acompanhe o progresso do onboarding
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.25 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                bgcolor: 'action.disabledBackground',
                '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: 'primary.main' },
              }}
            />
            <Typography
              sx={{ fontSize: 12, color: 'text.secondary', minWidth: 30, textAlign: 'right' }}
            >
              {progress}%
            </Typography>
          </Stack>

          <Stack spacing={0.75} sx={{ mt: 1.25 }}>
            {stepLabels.map((label, index) => {
              const isActive = activeStep === index;
              const isCompleted = index < maxCompletedStep;
              return (
                <Paper
                  key={label}
                  variant="outlined"
                  onClick={() => {
                    if (isCompleted) {
                      onStepSelect(index);
                    }
                  }}
                  sx={(theme) => ({
                    p: 1,
                    borderRadius: 1,
                    borderColor: theme.palette.divider,
                    cursor: isCompleted ? 'pointer' : 'default',
                    bgcolor: isActive
                      ? alpha(
                          theme.palette.primary.main,
                          theme.palette.mode === 'dark' ? 0.16 : 0.06,
                        )
                      : theme.palette.background.paper,
                  })}
                >
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start' }}>
                    <Box
                      sx={(theme) => ({
                        mt: 0.2,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: isActive
                          ? alpha(
                              theme.palette.primary.main,
                              theme.palette.mode === 'dark' ? 0.24 : 0.14,
                            )
                          : alpha(
                              theme.palette.text.primary,
                              theme.palette.mode === 'dark' ? 0.12 : 0.06,
                            ),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      })}
                    >
                      {isCompleted ? (
                        <TaskAltRoundedIcon sx={{ fontSize: 13, color: 'success.main' }} />
                      ) : isActive ? (
                        <InfoOutlinedIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                      ) : (
                        <RadioButtonUncheckedRoundedIcon
                          sx={{ fontSize: 12, color: 'text.disabled' }}
                        />
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25 }}>
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 11.5,
                          color: 'text.secondary',
                          lineHeight: 1.3,
                          mt: 0.15,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {summaryTexts[index]}
                      </Typography>
                    </Box>

                    {isCompleted ? (
                      <CheckCircleOutlineRoundedIcon
                        sx={{ fontSize: 16, color: 'success.light', mt: 0.2 }}
                      />
                    ) : null}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Paper>

        <Paper
          sx={(theme) => ({
            p: 1.5,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.28 : 0.06)}`,
            bgcolor: alpha(theme.palette.info.main, theme.palette.mode === 'dark' ? 0.2 : 0.08),
          })}
        >
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
            <InfoOutlinedIcon sx={{ color: 'primary.main', fontSize: 16 }} />
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Importante</Typography>
          </Stack>
          <Typography sx={{ fontSize: 12.5, lineHeight: 1.45, color: 'text.secondary' }}>
            Ao finalizar o onboarding, cliente, tenant e usuário administrador serão criados
            conforme o contrato da API.
          </Typography>
        </Paper>
      </Stack>
    );
  },
);
