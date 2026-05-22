import { useState } from 'react';
import { useReportCardReferenceOptions } from '@features/client/report-cards/hooks/useReportCardReferenceOptions';
import { reportCardService } from '@features/client/report-cards/services/service';

type PeriodAction = 'finalize' | 'reopen';

type ActionMessage = { type: 'success' | 'error'; text: string };

export const useSchoolClassPeriodActions = (schoolClassId: string) => {
  const referenceOptions = useReportCardReferenceOptions({ includeAcademicPeriods: true });
  const [selectedPeriodId, setSelectedPeriodId] = useState('');
  const [periodAction, setPeriodAction] = useState<PeriodAction | undefined>();
  const [periodMessage, setPeriodMessage] = useState<ActionMessage | undefined>();
  const [reportCardLoading, setReportCardLoading] = useState(false);
  const [reportCardMessage, setReportCardMessage] = useState<ActionMessage | undefined>();

  const runPeriodAction = async (action: PeriodAction): Promise<void> => {
    if (!selectedPeriodId) {
      setPeriodMessage({ type: 'error', text: 'Selecione um período para continuar.' });
      return;
    }
    setPeriodAction(action);
    setPeriodMessage(undefined);
    try {
      if (action === 'finalize') {
        await reportCardService.finalizePeriod(schoolClassId, selectedPeriodId);
        setPeriodMessage({ type: 'success', text: 'Período finalizado com sucesso.' });
      } else {
        await reportCardService.reopenPeriod(schoolClassId, selectedPeriodId);
        setPeriodMessage({ type: 'success', text: 'Período reaberto com sucesso.' });
      }
    } catch {
      setPeriodMessage({
        type: 'error',
        text: 'Não foi possível executar a ação no período.',
      });
    } finally {
      setPeriodAction(undefined);
    }
  };

  const loadClassReportCard = async (): Promise<void> => {
    setReportCardLoading(true);
    setReportCardMessage(undefined);
    try {
      await reportCardService.getClassReportCard(schoolClassId, { page: 1, limit: 10 });
      setReportCardMessage({ type: 'success', text: 'Boletins da turma carregados com sucesso.' });
    } catch {
      setReportCardMessage({
        type: 'error',
        text: 'Não foi possível carregar os boletins da turma.',
      });
    } finally {
      setReportCardLoading(false);
    }
  };

  return {
    academicPeriodOptions: referenceOptions.academicPeriodOptions,
    referenceOptionsLoading: referenceOptions.loading,
    selectedPeriodId,
    onPeriodChange: setSelectedPeriodId,
    isFinalizeLoading: periodAction === 'finalize',
    isReopenLoading: periodAction === 'reopen',
    periodMessage,
    loadClassReportCard,
    reportCardLoading,
    reportCardMessage,
    finalizePeriod: () => runPeriodAction('finalize'),
    reopenPeriod: () => runPeriodAction('reopen'),
  };
};
