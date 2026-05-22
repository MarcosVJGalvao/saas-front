import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { layoutSpacing } from '@theme/spacing';

type ClassReportCardCardProps = {
  loading: boolean;
  message: { type: 'success' | 'error'; text: string } | undefined;
  onQuery: () => void;
};

export const ClassReportCardCard = ({ loading, message, onQuery }: ClassReportCardCardProps) => (
  <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
    <AppStack spacing={2}>
      <AppBox>
        <AppText variant="subtitle1" sx={{ fontWeight: 600 }}>
          Boletins da turma
        </AppText>
        <AppText variant="body2" color="text.secondary">
          Consulte os boletins de todos os alunos desta turma.
        </AppText>
      </AppBox>
      {message ? <AppAlert severity={message.type}>{message.text}</AppAlert> : null}
      <AppButton
        variant="outlined"
        onClick={onQuery}
        disabled={loading}
        sx={{ alignSelf: 'flex-start' }}
      >
        {loading ? 'Consultando...' : 'Ver boletins da turma'}
      </AppButton>
    </AppStack>
  </AppPaper>
);
