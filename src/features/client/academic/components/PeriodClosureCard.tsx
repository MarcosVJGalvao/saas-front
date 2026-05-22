import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppLoadingButton } from '@shared/components/inputs/AppLoadingButton';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { layoutSpacing, radiusScale } from '@theme/spacing';

type PeriodClosureCardProps = {
  academicPeriodOptions: AppSelectOption[];
  selectedPeriodId: string;
  onPeriodChange: (periodId: string) => void;
  onFinalize: () => void;
  onReopen: () => void;
  isFinalizeLoading: boolean;
  isReopenLoading: boolean;
  message: { type: 'success' | 'error'; text: string } | undefined;
};

export const PeriodClosureCard = ({
  academicPeriodOptions,
  selectedPeriodId,
  onPeriodChange,
  onFinalize,
  onReopen,
  isFinalizeLoading,
  isReopenLoading,
  message,
}: PeriodClosureCardProps) => {
  const anyLoading = isFinalizeLoading || isReopenLoading;

  return (
    <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: radiusScale.md }}>
      <AppStack spacing={2}>
        <AppBox>
          <AppText variant="subtitle1" sx={{ fontWeight: 600 }}>
            Fechamento de período
          </AppText>
          <AppText variant="body2" color="text.secondary">
            Finalize ou reabra um período letivo desta turma.
          </AppText>
        </AppBox>
        {message ? <AppAlert severity={message.type}>{message.text}</AppAlert> : null}
        <AppSelect
          label="Período"
          options={academicPeriodOptions}
          value={selectedPeriodId}
          onChange={(changeEvent) => onPeriodChange(changeEvent.target.value)}
          disabled={anyLoading}
          size="small"
        />
        <AppStack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <AppLoadingButton
            variant="contained"
            onClick={onFinalize}
            loading={isFinalizeLoading}
            disabled={anyLoading || selectedPeriodId === ''}
          >
            Finalizar período
          </AppLoadingButton>
          <AppLoadingButton
            variant="outlined"
            onClick={onReopen}
            loading={isReopenLoading}
            disabled={anyLoading || selectedPeriodId === ''}
          >
            Reabrir período
          </AppLoadingButton>
        </AppStack>
      </AppStack>
    </AppPaper>
  );
};
