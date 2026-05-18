import { AppCard } from '@shared/components/data-display/AppCard';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

const AttendanceRecordsPage = () => (
  <AppStack spacing={2}>
    <PageHeader
      title="Lançamentos de frequência"
      subtitle="Marque presenças, faltas e justificativas por aula."
    />
    <AppAlert severity="info">
      Selecione uma turma com horários configurados para iniciar o lançamento de presença.
    </AppAlert>
    <AppCard>
      <AppStack spacing={1.5} sx={{ p: 2 }}>
        <AppText variant="h6">Fluxo operacional preparado</AppText>
        <AppText color="text.secondary">
          A marcação exige horário, data e alunos matriculados. A próxima etapa é conectar a seleção
          de horário aos alunos retornados pelo backend para evitar lançamento em turma vazia.
        </AppText>
      </AppStack>
    </AppCard>
  </AppStack>
);

export default AttendanceRecordsPage;
