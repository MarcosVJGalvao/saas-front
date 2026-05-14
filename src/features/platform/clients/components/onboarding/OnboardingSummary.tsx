import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppLinearProgress } from '@shared/components/data-display/AppLinearProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { alphaColor } from '@theme/utils/alphaColor';
import { memo } from 'react';
import { fontSizes } from '@theme/fontSizes';
import type { OnboardingSummaryData } from '@features/platform/clients/types/clientOnboarding';

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
      <AppStack
        spacing={1.5}
        sx={{ width: { xs: '100%', md: 360, lg: 380 }, maxWidth: '100%', flexShrink: 0 }}
      >
        <AppPaper
          sx={(theme) => ({
            p: 1.5,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: `0 2px 12px ${alphaColor(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.35 : 0.08)}`,
            bgcolor: 'background.paper',
          })}
        >
          <AppText sx={{ fontSize: fontSizes.lg, fontWeight: 700, lineHeight: 1.2 }}>
            Resumo do Onboarding
          </AppText>

          <AppStack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.25 }}>
            <AppBox
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSizes.md,
                fontWeight: 700,
              }}
            >
              {summary.client?.slice(0, 2).toUpperCase() || 'ON'}
            </AppBox>
            <AppBox sx={{ minWidth: 0 }}>
              <AppText sx={{ fontSize: fontSizes.md, fontWeight: 600, lineHeight: 1.3 }}>
                Preenchimento Geral
              </AppText>
              <AppText sx={{ fontSize: fontSizes.xs, color: 'text.secondary', lineHeight: 1.3 }}>
                Acompanhe o progresso do onboarding
              </AppText>
            </AppBox>
          </AppStack>

          <AppStack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.25 }}>
            <AppLinearProgress
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
            <AppText
              sx={{
                fontSize: fontSizes.xs,
                color: 'text.secondary',
                minWidth: 30,
                textAlign: 'right',
              }}
            >
              {progress}%
            </AppText>
          </AppStack>

          <AppStack spacing={0.75} sx={{ mt: 1.25 }}>
            {stepLabels.map((label, index) => {
              const isActive = activeStep === index;
              const isCompleted = index < maxCompletedStep;
              return (
                <AppPaper
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
                      ? alphaColor(
                          theme.palette.primary.main,
                          theme.palette.mode === 'dark' ? 0.16 : 0.06,
                        )
                      : theme.palette.background.paper,
                  })}
                >
                  <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start' }}>
                    <AppBox
                      sx={(theme) => ({
                        mt: 0.2,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: isActive
                          ? alphaColor(
                              theme.palette.primary.main,
                              theme.palette.mode === 'dark' ? 0.24 : 0.14,
                            )
                          : alphaColor(
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
                        <TaskAltRoundedIcon
                          sx={{ fontSize: fontSizes.sm, color: 'success.main' }}
                        />
                      ) : isActive ? (
                        <InfoOutlinedIcon sx={{ fontSize: fontSizes.xs, color: 'primary.main' }} />
                      ) : (
                        <RadioButtonUncheckedRoundedIcon
                          sx={{ fontSize: fontSizes.xs, color: 'text.disabled' }}
                        />
                      )}
                    </AppBox>

                    <AppBox sx={{ flex: 1, minWidth: 0 }}>
                      <AppText sx={{ fontSize: fontSizes.sm, fontWeight: 600, lineHeight: 1.25 }}>
                        {label}
                      </AppText>
                      <AppText
                        sx={{
                          fontSize: fontSizes.xs,
                          color: 'text.secondary',
                          lineHeight: 1.3,
                          mt: 0.15,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {summaryTexts[index]}
                      </AppText>
                    </AppBox>

                    {isCompleted ? (
                      <CheckCircleOutlineRoundedIcon
                        sx={{ fontSize: fontSizes.lg, color: 'success.light', mt: 0.2 }}
                      />
                    ) : null}
                  </AppStack>
                </AppPaper>
              );
            })}
          </AppStack>
        </AppPaper>

        <AppPaper
          sx={(theme) => ({
            p: 1.5,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: `0 2px 12px ${alphaColor(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.28 : 0.06)}`,
            bgcolor: alphaColor(
              theme.palette.info.main,
              theme.palette.mode === 'dark' ? 0.2 : 0.08,
            ),
          })}
        >
          <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
            <InfoOutlinedIcon sx={{ color: 'primary.main', fontSize: fontSizes.lg }} />
            <AppText sx={{ fontWeight: 600, fontSize: fontSizes.md }}>Importante</AppText>
          </AppStack>
          <AppText sx={{ fontSize: fontSizes.sm, lineHeight: 1.45, color: 'text.secondary' }}>
            Ao finalizar o onboarding, cliente, tenant e usuário administrador serão criados
            conforme o contrato da API.
          </AppText>
        </AppPaper>
      </AppStack>
    );
  },
);
