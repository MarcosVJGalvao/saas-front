import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { layoutSpacing } from '@theme/spacing';

type ReportCardQueryCardProps = {
  loading: boolean;
  message: { type: 'success' | 'error'; text: string } | undefined;
  onQuery: () => void;
};

export const ReportCardQueryCard = ({ loading, message, onQuery }: ReportCardQueryCardProps) => (
  <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
    <AppStack spacing={2}>
      <AppBox>
        <AppText variant="subtitle1" sx={{ fontWeight: 600 }}>
          Boletim
        </AppText>
        <AppText variant="body2" color="text.secondary">
          Consulte o histórico de avaliações e notas do aluno.
        </AppText>
      </AppBox>
      {message ? <AppAlert severity={message.type}>{message.text}</AppAlert> : null}
      <AppButton
        variant="outlined"
        onClick={onQuery}
        disabled={loading}
        sx={{ alignSelf: 'flex-start' }}
      >
        {loading ? 'Consultando...' : 'Ver boletim'}
      </AppButton>
    </AppStack>
  </AppPaper>
);
