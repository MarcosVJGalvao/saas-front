import { useState } from 'react';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';

type EntryValues = Record<string, unknown>;

const initialValues: EntryValues = {
  entryId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const useReportCardEntriesPageViewModel = () => {
  const [values, setValues] = useState<EntryValues>(initialValues);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const onChange = (name: string, value: unknown): void => {
    setValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const clear = (): void => {
    setValues(initialValues);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
  };

  const requestRemove = (): void => {
    const entryId = getStringValue(values.entryId);
    if (!entryId) {
      setErrorMessage('Informe o lançamento para remover.');
      return;
    }
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    setConfirmOpen(true);
  };

  const confirmRemove = async (): Promise<void> => {
    const entryId = getStringValue(values.entryId);
    if (!entryId) return;
    setLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.removeEntry(entryId);
      setConfirmOpen(false);
      setSuccessMessage('Lançamento removido com sucesso.');
    } catch {
      setErrorMessage('Não foi possível remover o lançamento.');
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    loading,
    confirmOpen,
    errorMessage,
    successMessage,
    onChange,
    clear,
    requestRemove,
    closeConfirm: () => setConfirmOpen(false),
    confirmRemove,
  };
};
