import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppDivider } from '@shared/components/data-display/AppDivider';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppIconButton } from '@shared/components/inputs/AppIconButton';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { AppLoadingButton } from '@shared/components/inputs/AppLoadingButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { useReportCardBulkRemoveForm } from '@features/client/report-cards/hooks/bulk/useReportCardBulkRemoveForm';
import type { BulkRemoveFormValues } from '@features/client/report-cards/schemas/bulk/bulkRemoveFormSchema';

type BulkRemoveFormProps = {
  schoolClassOptions: AppSelectOption[];
  subjectOptions: AppSelectOption[];
  academicPeriodOptions: AppSelectOption[];
  studentEnrollmentOptions: AppSelectOption[];
  referenceLoading: boolean;
};

export const BulkRemoveForm = ({
  schoolClassOptions,
  subjectOptions,
  academicPeriodOptions,
  studentEnrollmentOptions,
  referenceLoading,
}: BulkRemoveFormProps) => {
  const model = useReportCardBulkRemoveForm();
  const isSubmitting = model.form.formState.isSubmitting || model.loading;

  return (
    <AppStack spacing={3}>
      {model.feedback.message ? (
        <AppAlert severity={model.feedback.message.type}>{model.feedback.message.text}</AppAlert>
      ) : null}

      <AppForm
        form={model.form}
        onSubmit={model.requestSubmit}
        useResponsiveGrid
        columnsByDevice={{ mobile: 1, tablet: 3, desktop: 3 }}
      >
        <FormSelect<BulkRemoveFormValues>
          name="schoolClassId"
          label="Turma"
          options={schoolClassOptions}
          disabled={referenceLoading}
        />
        <FormSelect<BulkRemoveFormValues>
          name="subjectId"
          label="Disciplina"
          options={subjectOptions}
          disabled={referenceLoading}
        />
        <FormSelect<BulkRemoveFormValues>
          name="academicPeriodId"
          label="Período"
          options={academicPeriodOptions}
          disabled={referenceLoading}
        />

        <AppDivider sx={{ gridColumn: '1 / -1' }} />

        <AppText variant="subtitle2" color="text.secondary" sx={{ gridColumn: '1 / -1' }}>
          Lançamentos a remover
        </AppText>

        {model.fields.map((field, index) => (
          <AppGrid
            key={field.id}
            container
            spacing={2}
            sx={{ gridColumn: '1 / -1', alignItems: 'flex-start' }}
          >
            <AppGrid size={{ xs: 12, sm: 5 }}>
              <FormSelect<BulkRemoveFormValues>
                name={`entries.${index}.studentEnrollmentId`}
                label="Matrícula"
                options={studentEnrollmentOptions}
                disabled={referenceLoading}
              />
            </AppGrid>
            <AppGrid size={{ xs: 12, sm: 5 }}>
              <FormSelect<BulkRemoveFormValues>
                name={`entries.${index}.assessmentType`}
                label="Tipo de avaliação"
                options={model.assessmentTypeOptions}
              />
            </AppGrid>
            <AppGrid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
              <AppIconButton
                size="small"
                color="error"
                onClick={() => model.removeRow(index)}
                disabled={model.fields.length === 1 || isSubmitting}
                aria-label="Remover linha"
              >
                <DeleteIcon fontSize="small" />
              </AppIconButton>
            </AppGrid>
          </AppGrid>
        ))}

        <AppLoadingButton
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={model.addRow}
          disabled={isSubmitting}
          sx={{ gridColumn: '1 / -1', alignSelf: 'flex-start' }}
        >
          Adicionar linha
        </AppLoadingButton>

        <FormActions
          primaryAction={{
            type: 'confirm',
            label: 'Remover lote',
            onClick: () => {
              void model.form.handleSubmit(model.requestSubmit)();
            },
            loading: isSubmitting,
          }}
        />
      </AppForm>

      <ConfirmDialog
        open={model.confirmOpen}
        title="Remover lançamentos"
        description="Confirma a remoção dos lançamentos selecionados? Esta ação não pode ser desfeita."
        confirmLabel={model.loading ? 'Removendo...' : 'Remover'}
        onCancel={model.closeConfirm}
        onConfirm={() => {
          void model.confirmSubmit();
        }}
      />
    </AppStack>
  );
};
