import { useState } from 'react';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppLoadingButton } from '@shared/components/inputs/AppLoadingButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppTabs } from '@shared/components/navigation/AppTabs';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { useReportCardProcessingsPage } from '@features/client/report-cards/hooks/useReportCardProcessingsPage';

const TABS = [
  { label: 'Consultar', value: 'query' },
  { label: 'Reenviar', value: 'resend' },
];

const ReportCardProcessingsPage = () => {
  const model = useReportCardProcessingsPage();
  const [tab, setTab] = useState('query');
  const isLoading = model.loadingAction !== undefined;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Processamentos"
        subtitle="Acompanhe processamentos de boletim e reenvie falhas."
      />

      {model.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{model.referenceOptions.errorMessage}</AppAlert>
      ) : null}

      <AppTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === 'query' ? (
        <SectionCard title="Consulta de processamento" subtitle="Busque um processamento pelo ID.">
          <AppStack spacing={2}>
            {model.feedback.message ? (
              <AppAlert severity={model.feedback.message.type}>
                {model.feedback.message.text}
              </AppAlert>
            ) : null}
            <ListFilters
              fields={[
                {
                  type: 'text',
                  name: 'processingId',
                  label: 'Processamento',
                  placeholder: 'ID do processamento',
                  mobileOrder: 1,
                },
              ]}
              values={model.values}
              onChange={model.onChange}
              onApply={() => {
                void model.loadProcessing();
              }}
              onClear={model.clear}
              loading={isLoading || model.referenceOptions.loading}
              applyLabel="Consultar"
            />
          </AppStack>
        </SectionCard>
      ) : null}

      {tab === 'resend' ? (
        <SectionCard
          title="Reenvio de falhas"
          subtitle="Reenvie processamentos com falha ou reenvie para uma matrícula específica."
        >
          <AppStack spacing={2}>
            {model.feedback.message ? (
              <AppAlert severity={model.feedback.message.type}>
                {model.feedback.message.text}
              </AppAlert>
            ) : null}
            <ListFilters
              fields={[
                {
                  type: 'text',
                  name: 'processingId',
                  label: 'Processamento',
                  placeholder: 'ID do processamento',
                  mobileOrder: 1,
                },
                {
                  type: 'select',
                  name: 'studentEnrollmentId',
                  label: 'Matrícula',
                  placeholder: 'Selecione a matrícula (opcional para reenvio individual)',
                  options: model.referenceOptions.studentEnrollmentOptions,
                  mobileOrder: 2,
                },
              ]}
              values={model.values}
              onChange={model.onChange}
              onApply={() => {
                void model.resendFailed();
              }}
              onClear={model.clear}
              loading={isLoading || model.referenceOptions.loading}
              applyLabel="Reenviar falhas"
            />
            <AppLoadingButton
              variant="outlined"
              loading={model.loadingAction === 'resend-student'}
              disabled={isLoading}
              onClick={() => {
                void model.resendStudent();
              }}
              sx={{ alignSelf: 'flex-start' }}
            >
              Reenviar matrícula
            </AppLoadingButton>
          </AppStack>
        </SectionCard>
      ) : null}
    </AppStack>
  );
};

export default ReportCardProcessingsPage;
