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
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { useReportCardBulkUpdateForm } from '@features/client/report-cards/hooks/useReportCardBulkUpdateForm';
import type { BulkUpdateFormValues } from '@features/client/report-cards/schemas/bulkUpdateFormSchema';

type BulkUpdateFormProps = {
  schoolClassOptions: AppSelectOption[];
  subjectOptions: AppSelectOption[];
  academicPeriodOptions: AppSelectOption[];
  studentEnrollmentOptions: AppSelectOption[];
  referenceLoading: boolean;
};

export const BulkUpdateForm = ({
  schoolClassOptions,
  subjectOptions,
  academicPeriodOptions,
  studentEnrollmentOptions,
  referenceLoading,
}: BulkUpdateFormProps) => {
  const model = useReportCardBulkUpdateForm();
  const isSubmitting = model.form.formState.isSubmitting;

  return (
    <AppStack spacing={3}>
      {model.feedback.message ? (
        <AppAlert severity={model.feedback.message.type}>{model.feedback.message.text}</AppAlert>
      ) : null}

      <AppForm
        form={model.form}
        onSubmit={model.submit}
        useResponsiveGrid
        columnsByDevice={{ mobile: 1, tablet: 3, desktop: 3 }}
      >
        <FormSelect<BulkUpdateFormValues>
          name="schoolClassId"
          label="Turma"
          options={schoolClassOptions}
          disabled={referenceLoading}
        />
        <FormSelect<BulkUpdateFormValues>
          name="subjectId"
          label="Disciplina"
          options={subjectOptions}
          disabled={referenceLoading}
        />
        <FormSelect<BulkUpdateFormValues>
          name="academicPeriodId"
          label="Período"
          options={academicPeriodOptions}
          disabled={referenceLoading}
        />

        <AppDivider sx={{ gridColumn: '1 / -1' }} />

        <AppText variant="subtitle2" color="text.secondary" sx={{ gridColumn: '1 / -1' }}>
          Lançamentos a atualizar
        </AppText>

        {model.fields.map((field, index) => (
          <AppGrid
            key={field.id}
            container
            spacing={2}
            sx={{ gridColumn: '1 / -1', alignItems: 'flex-start' }}
          >
            <AppGrid size={{ xs: 12, sm: 3 }}>
              <FormSelect<BulkUpdateFormValues>
                name={`entries.${index}.studentEnrollmentId`}
                label="Matrícula"
                options={studentEnrollmentOptions}
                disabled={referenceLoading}
              />
            </AppGrid>
            <AppGrid size={{ xs: 12, sm: 3 }}>
              <FormSelect<BulkUpdateFormValues>
                name={`entries.${index}.assessmentType`}
                label="Tipo de avaliação"
                options={model.assessmentTypeOptions}
              />
            </AppGrid>
            <AppGrid size={{ xs: 12, sm: 2 }}>
              <FormTextField<BulkUpdateFormValues>
                name={`entries.${index}.gradeValue`}
                label="Nova nota"
                placeholder="0,00"
              />
            </AppGrid>
            <AppGrid size={{ xs: 12, sm: 3 }}>
              <FormTextField<BulkUpdateFormValues>
                name={`entries.${index}.observations`}
                label="Observações"
                placeholder="Opcional"
              />
            </AppGrid>
            <AppGrid size={{ xs: 12, sm: 1 }} sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
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
            label: 'Atualizar lote',
            onClick: () => {
              void model.form.handleSubmit(model.submit)();
            },
            loading: isSubmitting,
          }}
        />
      </AppForm>
    </AppStack>
  );
};
