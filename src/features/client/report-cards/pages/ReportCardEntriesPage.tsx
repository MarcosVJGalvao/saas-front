import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { reportCardAssessmentTypeOptions } from '@shared/constants/selectOptions';
import { layoutSpacing } from '@theme/spacing';
import { useReportCardEntriesPage } from '@features/client/report-cards/hooks/useReportCardEntriesPage';
import type { ReportCardEntryFormValues } from '@features/client/report-cards/schemas/reportCardEntryFormSchema';

const ReportCardEntriesPage = () => {
  const model = useReportCardEntriesPage();

  return (
    <AppStack spacing={2}>
      <PageHeader title="Lançamentos de boletim" subtitle="Gerencie lançamentos de notas." />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      {model.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{model.referenceOptions.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Novo lançamento individual</AppText>
          <AppForm
            form={model.form}
            onSubmit={model.createEntry}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormSelect<ReportCardEntryFormValues>
              name="studentEnrollmentId"
              label="Matrícula"
              options={model.referenceOptions.studentEnrollmentOptions}
            />
            <FormSelect<ReportCardEntryFormValues>
              name="subjectId"
              label="Disciplina"
              options={model.referenceOptions.subjectOptions}
            />
            <FormSelect<ReportCardEntryFormValues>
              name="academicPeriodId"
              label="Período"
              options={model.referenceOptions.academicPeriodOptions}
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
                loading: model.loading,
              }}
            />
          </AppForm>
        </AppStack>
      </AppPaper>
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Lançamento em lote</AppText>
          <ListFilters
            fields={[
              {
                type: 'select',
                name: 'schoolClassId',
                label: 'Turma',
                placeholder: 'Selecione a turma',
                options: model.referenceOptions.schoolClassOptions,
                mobileOrder: 1,
              },
              {
                type: 'select',
                name: 'subjectId',
                label: 'Disciplina',
                placeholder: 'Selecione a disciplina',
                options: model.referenceOptions.subjectOptions,
                mobileOrder: 2,
              },
              {
                type: 'select',
                name: 'academicPeriodId',
                label: 'Período',
                placeholder: 'Selecione o período',
                options: model.referenceOptions.academicPeriodOptions,
                mobileOrder: 3,
              },
              {
                type: 'select',
                name: 'studentEnrollmentId',
                label: 'Matrícula',
                placeholder: 'Selecione a matrícula',
                options: model.referenceOptions.studentEnrollmentOptions,
                mobileOrder: 4,
              },
              {
                type: 'select',
                name: 'assessmentType',
                label: 'Tipo de avaliação',
                placeholder: 'Selecione o tipo',
                options: reportCardAssessmentTypeOptions,
                mobileOrder: 5,
              },
              {
                type: 'text',
                name: 'gradeValue',
                label: 'Nota',
                placeholder: '0,00',
                mobileOrder: 6,
              },
              {
                type: 'text',
                name: 'observations',
                label: 'Observações',
                placeholder: 'Observações opcionais',
                mobileOrder: 7,
              },
              {
                type: 'select',
                name: 'secondStudentEnrollmentId',
                label: 'Matrícula 2',
                placeholder: 'Selecione a matrícula',
                options: model.referenceOptions.studentEnrollmentOptions,
                mobileOrder: 8,
              },
              {
                type: 'select',
                name: 'secondAssessmentType',
                label: 'Tipo de avaliação 2',
                placeholder: 'Selecione o tipo',
                options: reportCardAssessmentTypeOptions,
                mobileOrder: 9,
              },
              {
                type: 'text',
                name: 'secondGradeValue',
                label: 'Nota 2',
                placeholder: '0,00',
                mobileOrder: 10,
              },
              {
                type: 'text',
                name: 'secondObservations',
                label: 'Observações 2',
                placeholder: 'Observações opcionais',
                mobileOrder: 11,
              },
              {
                type: 'select',
                name: 'thirdStudentEnrollmentId',
                label: 'Matrícula 3',
                placeholder: 'Selecione a matrícula',
                options: model.referenceOptions.studentEnrollmentOptions,
                mobileOrder: 12,
              },
              {
                type: 'select',
                name: 'thirdAssessmentType',
                label: 'Tipo de avaliação 3',
                placeholder: 'Selecione o tipo',
                options: reportCardAssessmentTypeOptions,
                mobileOrder: 13,
              },
              {
                type: 'text',
                name: 'thirdGradeValue',
                label: 'Nota 3',
                placeholder: '0,00',
                mobileOrder: 14,
              },
              {
                type: 'text',
                name: 'thirdObservations',
                label: 'Observações 3',
                placeholder: 'Observações opcionais',
                mobileOrder: 15,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.createBulkEntry();
            }}
            onClear={model.clear}
            loading={model.loading || model.referenceOptions.loading}
            applyLabel="Cadastrar lote"
          />
        </AppStack>
      </AppPaper>
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Atualização de lançamento</AppText>
          <AppText color="text.secondary">
            Informe o lançamento e os novos dados para corrigir nota, período ou tipo de avaliação.
          </AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'updateEntryId',
                label: 'Lançamento',
                placeholder: 'ID do lançamento',
                mobileOrder: 1,
              },
              {
                type: 'select',
                name: 'updateAssessmentType',
                label: 'Tipo de avaliação',
                placeholder: 'Selecione o tipo',
                options: reportCardAssessmentTypeOptions,
                mobileOrder: 2,
              },
              {
                type: 'text',
                name: 'updateGradeValue',
                label: 'Nota',
                placeholder: '0,00',
                mobileOrder: 3,
              },
              {
                type: 'text',
                name: 'updateObservations',
                label: 'Observações',
                placeholder: 'Observações opcionais',
                mobileOrder: 4,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.updateEntry();
            }}
            onClear={model.clear}
            loading={model.loading}
            applyLabel="Atualizar lançamento"
          />
        </AppStack>
      </AppPaper>
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Atualização em lote</AppText>
          <AppText color="text.secondary">
            Informe a turma, os IDs dos lançamentos e os campos avaliativos que serão corrigidos.
          </AppText>
          <ListFilters
            fields={[
              {
                type: 'select',
                name: 'schoolClassId',
                label: 'Turma',
                placeholder: 'Selecione a turma',
                options: model.referenceOptions.schoolClassOptions,
                mobileOrder: 1,
              },
              {
                type: 'text',
                name: 'firstEntryId',
                label: 'Lançamento 1',
                placeholder: 'ID do primeiro lançamento',
                mobileOrder: 2,
              },
              {
                type: 'select',
                name: 'assessmentType',
                label: 'Tipo de avaliação 1',
                placeholder: 'Selecione o tipo',
                options: reportCardAssessmentTypeOptions,
                mobileOrder: 3,
              },
              {
                type: 'text',
                name: 'gradeValue',
                label: 'Nota 1',
                placeholder: '0,00',
                mobileOrder: 4,
              },
              {
                type: 'text',
                name: 'observations',
                label: 'Observações 1',
                placeholder: 'Observações opcionais',
                mobileOrder: 5,
              },
              {
                type: 'text',
                name: 'secondEntryId',
                label: 'Lançamento 2',
                placeholder: 'ID do segundo lançamento',
                mobileOrder: 6,
              },
              {
                type: 'select',
                name: 'secondAssessmentType',
                label: 'Tipo de avaliação 2',
                placeholder: 'Selecione o tipo',
                options: reportCardAssessmentTypeOptions,
                mobileOrder: 7,
              },
              {
                type: 'text',
                name: 'secondGradeValue',
                label: 'Nota 2',
                placeholder: '0,00',
                mobileOrder: 8,
              },
              {
                type: 'text',
                name: 'secondObservations',
                label: 'Observações 2',
                placeholder: 'Observações opcionais',
                mobileOrder: 9,
              },
              {
                type: 'text',
                name: 'thirdEntryId',
                label: 'Lançamento 3',
                placeholder: 'ID do terceiro lançamento',
                mobileOrder: 10,
              },
              {
                type: 'select',
                name: 'thirdAssessmentType',
                label: 'Tipo de avaliação 3',
                placeholder: 'Selecione o tipo',
                options: reportCardAssessmentTypeOptions,
                mobileOrder: 11,
              },
              {
                type: 'text',
                name: 'thirdGradeValue',
                label: 'Nota 3',
                placeholder: '0,00',
                mobileOrder: 12,
              },
              {
                type: 'text',
                name: 'thirdObservations',
                label: 'Observações 3',
                placeholder: 'Observações opcionais',
                mobileOrder: 13,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.updateBulkEntry();
            }}
            onClear={model.clear}
            loading={model.loading}
            applyLabel="Atualizar lote"
          />
        </AppStack>
      </AppPaper>
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Remoção em lote</AppText>
          <AppText color="text.secondary">
            Informe a turma e os IDs dos lançamentos separados por vírgula.
          </AppText>
          <ListFilters
            fields={[
              {
                type: 'select',
                name: 'schoolClassId',
                label: 'Turma',
                placeholder: 'Selecione a turma',
                options: model.referenceOptions.schoolClassOptions,
                mobileOrder: 1,
              },
              {
                type: 'text',
                name: 'bulkEntryIds',
                label: 'Lançamentos',
                placeholder: 'entry-1, entry-2',
                mobileOrder: 2,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={() => {
              void model.removeBulkEntries();
            }}
            onClear={model.clear}
            loading={model.loading}
            applyLabel="Remover lote"
          />
        </AppStack>
      </AppPaper>
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Remoção de lançamento</AppText>
          <AppText color="text.secondary">
            Informe o lançamento para remover registros incorretos antes de um novo envio.
          </AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'entryId',
                label: 'Lançamento',
                placeholder: 'ID do lançamento',
                mobileOrder: 1,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={model.requestRemove}
            onClear={model.clear}
            loading={model.loading}
            applyLabel="Remover"
          />
        </AppStack>
      </AppPaper>
      <ConfirmDialog
        open={model.confirmOpen}
        title="Remover lançamento"
        description="Confirma a remoção deste lançamento de boletim?"
        confirmLabel={model.loading ? 'Removendo...' : 'Remover'}
        onCancel={model.closeConfirm}
        onConfirm={() => {
          void model.confirmRemove();
        }}
      />
    </AppStack>
  );
};

export default ReportCardEntriesPage;
