import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { AppLinearProgress } from '@shared/components/data-display/AppLinearProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import type { AcademicYearFormValues } from '@features/client/academic/schemas/academicYearFormSchema';
import { translateAcademicYearStatus } from '@shared/i18n/pt-BR/enums';
import { fontSizes } from '@theme/fontSizes';
import { alphaColor } from '@theme/utils/alphaColor';

type AcademicYearWizardSummaryValues = Pick<
  AcademicYearFormValues,
  'name' | 'status' | 'academicPeriods' | 'passingGrade' | 'minimumAttendancePercentage'
>;

type AcademicYearWizardSummaryProps = {
  values: AcademicYearWizardSummaryValues;
  activeStep: number;
  maxCompletedStep: number;
  showProgress: boolean;
  onStepSelect: (stepIndex: number) => void;
};

const summaryTitles = ['Ano letivo', 'Períodos', 'Boletim'];

const buildSummaryTexts = (values: AcademicYearWizardSummaryValues): string[] => [
  [
    values.name || 'Nome pendente',
    values.status ? translateAcademicYearStatus(values.status) : 'Status pendente',
  ].join(' - '),
  `${values.academicPeriods.length} período(s) configurado(s)`,
  `Nota mínima ${values.passingGrade || '-'} - Frequência ${values.minimumAttendancePercentage || '-'}%`,
];

const getInitials = (name: string): string => {
  const trimmedName = name.trim();
  return trimmedName.length > 0 ? trimmedName.slice(0, 2).toUpperCase() : 'AL';
};

export const AcademicYearWizardSummary = ({
  values,
  activeStep,
  maxCompletedStep,
  showProgress,
  onStepSelect,
}: AcademicYearWizardSummaryProps) => {
  const summaryTexts = buildSummaryTexts(values);
  const completedSteps = Math.max(0, Math.min(maxCompletedStep, summaryTitles.length));
  const progress = Math.round((completedSteps / summaryTitles.length) * 100);

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
          Resumo do Ano Letivo
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
            {getInitials(values.name)}
          </AppBox>
          <AppBox sx={{ minWidth: 0 }}>
            <AppText sx={{ fontSize: fontSizes.md, fontWeight: 600, lineHeight: 1.3 }}>
              Preenchimento Geral
            </AppText>
            <AppText sx={{ fontSize: fontSizes.xs, color: 'text.secondary', lineHeight: 1.3 }}>
              Acompanhe o progresso da configuração
            </AppText>
          </AppBox>
        </AppStack>

        {showProgress ? (
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
        ) : null}

        <AppStack spacing={0.75} sx={{ mt: 1.25 }}>
          {summaryTitles.map((summaryTitle, stepIndex) => {
            const isActive = activeStep === stepIndex;
            const isCompleted = stepIndex < maxCompletedStep;

            return (
              <AppPaper
                key={summaryTitle}
                variant="outlined"
                onClick={() => {
                  onStepSelect(stepIndex);
                }}
                sx={(theme) => ({
                  p: 1,
                  borderRadius: 1,
                  borderColor: theme.palette.divider,
                  cursor: 'pointer',
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
                      <TaskAltRoundedIcon sx={{ fontSize: fontSizes.sm, color: 'success.main' }} />
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
                      {summaryTitle}
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
                      {summaryTexts[stepIndex]}
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
          bgcolor: alphaColor(theme.palette.info.main, theme.palette.mode === 'dark' ? 0.2 : 0.08),
        })}
      >
        <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
          <InfoOutlinedIcon sx={{ color: 'primary.main', fontSize: fontSizes.lg }} />
          <AppText sx={{ fontWeight: 600, fontSize: fontSizes.md }}>Importante</AppText>
        </AppStack>
        <AppText sx={{ fontSize: fontSizes.sm, lineHeight: 1.45, color: 'text.secondary' }}>
          Revise períodos e regras do boletim antes de concluir, porque essa configuração afeta o
          comportamento acadêmico do ano letivo.
        </AppText>
      </AppPaper>
    </AppStack>
  );
};
