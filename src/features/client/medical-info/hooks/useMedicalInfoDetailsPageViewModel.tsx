import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { medicalInfoService } from '@features/client/medical-info/services/medicalInfoServices';
import type { MedicalInfo } from '@features/client/medical-info/types/medicalInfo.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes médicos',
  pageSubtitle: 'Consulte informações médicas e contato de emergência.',
  loadingLabel: 'Carregando informações médicas...',
  emptyTitle: 'Informações médicas não encontradas',
  emptyMessage: 'Não encontramos o registro médico solicitado.',
  errorFallback: 'Erro ao carregar informações médicas.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este registro.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este registro.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatPhone = (value: string | undefined): string => {
  if (!value) return '-';
  return maskPhone(onlyDigits(value));
};

export const useMedicalInfoDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setMedicalInfo(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await medicalInfoService.getById(id);
      setMedicalInfo(response);
    } catch {
      setErrorMessage('Erro ao carregar informações médicas.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : medicalInfo
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: medicalInfo
        ? {
            title: medicalInfo.person?.fullName ?? medicalInfo.personId ?? 'Registro médico',
            subtitle: medicalInfo.bloodType ?? 'Sem tipo sanguíneo',
            avatarFallback: 'M',
          }
        : null,
      tabs: medicalInfo
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'person',
                  title: 'Pessoa',
                  items: [
                    { label: 'Pessoa', value: medicalInfo.person?.fullName ?? '-' },
                    {
                      label: 'ID da pessoa',
                      value: medicalInfo.personId ?? medicalInfo.person?.id ?? '-',
                    },
                  ],
                },
                {
                  id: 'medical',
                  title: 'Informações médicas',
                  items: [
                    { label: 'Tipo sanguíneo', value: medicalInfo.bloodType ?? '-' },
                    { label: 'Alergias', value: medicalInfo.allergies ?? '-' },
                    { label: 'Doenças crônicas', value: medicalInfo.chronicDiseases ?? '-' },
                    { label: 'Medicamentos', value: medicalInfo.medications ?? '-' },
                    { label: 'Observações', value: medicalInfo.notes ?? '-' },
                  ],
                },
                {
                  id: 'emergency',
                  title: 'Contato de emergência',
                  items: [
                    { label: 'Nome', value: medicalInfo.emergencyContactName ?? '-' },
                    { label: 'Telefone', value: formatPhone(medicalInfo.emergencyContactPhone) },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(medicalInfo.createdAt) },
                    { label: 'Atualizado em', value: formatDate(medicalInfo.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [medicalInfo],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/medical-info'),
    onRetry: load,
  };
};

export const MedicalInfoDetailsPageContent = () => {
  const model = useMedicalInfoDetailsPageViewModel();
  return (
    <EntityDetailsPage
      viewState={model.viewState}
      content={model.content}
      data={model.data}
      errorMessage={model.errorMessage}
      onBack={model.onBack}
      onRetry={() => {
        void model.onRetry();
      }}
    />
  );
};
