import { useState } from 'react';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppTabs } from '@shared/components/navigation/AppTabs';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { reportCardAssessmentTypeOptions } from '@shared/constants/selectOptions';
import { BulkEntryForm } from '@features/client/report-cards/components/BulkEntryForm';
import { BulkRemoveForm } from '@features/client/report-cards/components/BulkRemoveForm';
import { BulkUpdateForm } from '@features/client/report-cards/components/BulkUpdateForm';
import { useReportCardEntriesPage } from '@features/client/report-cards/hooks/useReportCardEntriesPage';
import type { ReportCardEntryFormValues } from '@features/client/report-cards/schemas/reportCardEntryFormSchema';

const TABS = [
  { label: 'Lançamento', value: 'entry' },
  { label: 'Atualização em lote', value: 'update' },
  { label: 'Remoção em lote', value: 'remove' },
];

const ReportCardEntriesPage = () => {
  const model = useReportCardEntriesPage();
  const [tab, setTab] = useState('entry');

  const { referenceOptions } = model;
  const referenceLoading = referenceOptions.loading;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Lançamentos de boletim"
        subtitle="Gerencie lançamentos de notas individualmente ou em lote."
      />

      {referenceOptions.errorMessage ? (
        <AppAlert severity="error">{referenceOptions.errorMessage}</AppAlert>
      ) : null}

      <AppTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === 'entry' ? (
        <SectionCard title="Novo lançamento" subtitle="Cadastre uma nota para um aluno específico.">
          <AppStack spacing={2}>
            {model.feedback.message ? (
              <AppAlert severity={model.feedback.message.type}>
                {model.feedback.message.text}
              </AppAlert>
            ) : null}
            <AppForm
              form={model.form}
              onSubmit={model.createEntry}
              useResponsiveGrid
              columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
            >
              <FormSelect<ReportCardEntryFormValues>
                name="studentEnrollmentId"
                label="Matrícula"
                options={referenceOptions.studentEnrollmentOptions}
                disabled={referenceLoading}
              />
              <FormSelect<ReportCardEntryFormValues>
                name="subjectId"
                label="Disciplina"
                options={referenceOptions.subjectOptions}
                disabled={referenceLoading}
              />
              <FormSelect<ReportCardEntryFormValues>
                name="academicPeriodId"
                label="Período"
                options={referenceOptions.academicPeriodOptions}
                disabled={referenceLoading}
              />
              <FormSelect<ReportCardEntryFormValues>
                name="assessmentType"
                label="Tipo de avaliação"
                options={reportCardAssessmentTypeOptions}
              />
              <FormTextField<ReportCardEntryFormValues>
                name="gradeValue"
                label="Nota"
                placeholder="0,00"
              />
              <FormTextField<ReportCardEntryFormValues>
                name="observations"
                label="Observações"
                placeholder="Observações opcionais"
              />
              <FormActions
                primaryAction={{
                  type: 'confirm',
                  label: 'Cadastrar lançamento',
                  onClick: () => {
                    void model.form.handleSubmit(model.createEntry)();
                  },
                  loading: model.form.formState.isSubmitting,
                }}
              />
            </AppForm>
          </AppStack>
        </SectionCard>
      ) : null}

      {tab === 'entry' ? (
        <SectionCard
          title="Lançamento em lote"
          subtitle="Cadastre notas para vários alunos de uma turma ao mesmo tempo."
        >
          <BulkEntryForm
            schoolClassOptions={referenceOptions.schoolClassOptions}
            subjectOptions={referenceOptions.subjectOptions}
            academicPeriodOptions={referenceOptions.academicPeriodOptions}
            studentEnrollmentOptions={referenceOptions.studentEnrollmentOptions}
            referenceLoading={referenceLoading}
          />
        </SectionCard>
      ) : null}

      {tab === 'update' ? (
        <SectionCard
          title="Atualização em lote"
          subtitle="Corrija notas de vários alunos de uma turma ao mesmo tempo."
        >
          <BulkUpdateForm
            schoolClassOptions={referenceOptions.schoolClassOptions}
            subjectOptions={referenceOptions.subjectOptions}
            academicPeriodOptions={referenceOptions.academicPeriodOptions}
            studentEnrollmentOptions={referenceOptions.studentEnrollmentOptions}
            referenceLoading={referenceLoading}
          />
        </SectionCard>
      ) : null}

      {tab === 'remove' ? (
        <SectionCard
          title="Remoção em lote"
          subtitle="Remova lançamentos de vários alunos de uma turma ao mesmo tempo."
        >
          <BulkRemoveForm
            schoolClassOptions={referenceOptions.schoolClassOptions}
            subjectOptions={referenceOptions.subjectOptions}
            academicPeriodOptions={referenceOptions.academicPeriodOptions}
            studentEnrollmentOptions={referenceOptions.studentEnrollmentOptions}
            referenceLoading={referenceLoading}
          />
        </SectionCard>
      ) : null}
    </AppStack>
  );
};

export default ReportCardEntriesPage;
