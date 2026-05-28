import DeleteIcon from '@mui/icons-material/Delete';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppChip } from '@shared/components/data-display/AppChip';
import { AppTable } from '@shared/components/data-display/AppTable';
import { AppTableBody } from '@shared/components/data-display/AppTableBody';
import { AppTableCell } from '@shared/components/data-display/AppTableCell';
import { AppTableContainer } from '@shared/components/data-display/AppTableContainer';
import { AppTableHead } from '@shared/components/data-display/AppTableHead';
import { AppTableRow } from '@shared/components/data-display/AppTableRow';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppIconButton } from '@shared/components/inputs/AppIconButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { responsive } from '@theme/utils/responsive';
import { useClassGradeEntryForm } from '@features/client/report-cards/hooks/useClassGradeEntryForm';
import type { ClassGradeEntryFormValues } from '@features/client/report-cards/schemas/classGradeEntry/classGradeEntryFormSchema';

const TABLE_COLUMNS = ['Aluno', 'Nota', 'Observações', 'Ações'];

export const ClassGradeEntryForm = () => {
  const model = useClassGradeEntryForm();
  const isLoading = model.optionsLoading || model.profileLoading;
  const isSubmitting = model.form.formState.isSubmitting;
  const hasEntries = model.fields.length > 0;

  return (
    <AppForm form={model.form} onSubmit={model.submit}>
      <AppStack spacing={3}>
        {model.feedback.message ? (
          <AppAlert severity={model.feedback.message.type}>{model.feedback.message.text}</AppAlert>
        ) : null}

        {model.optionsError ? <AppAlert severity="error">{model.optionsError}</AppAlert> : null}

        <SectionCard title="Configuração do Lançamento">
          <AppBox
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: responsive({
                xs: 'repeat(1, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              }),
            }}
          >
            <FormSelect<ClassGradeEntryFormValues>
              name="schoolClassId"
              label="Turma"
              options={model.schoolClassOptions}
              disabled={isLoading || isSubmitting}
            />
            <FormSelect<ClassGradeEntryFormValues>
              name="teacherSubjectId"
              label="Professor/Disciplina"
              options={model.teacherSubjectOptions}
              disabled={isLoading || model.classLoading || isSubmitting || model.isTeacher}
            />
            <FormSelect<ClassGradeEntryFormValues>
              name="academicPeriodId"
              label="Período"
              options={model.academicPeriodOptions}
              disabled={isLoading || isSubmitting}
            />
            <FormSelect<ClassGradeEntryFormValues>
              name="assessmentType"
              label="Tipo de avaliação"
              options={model.assessmentTypeOptions}
              disabled={isSubmitting}
            />
          </AppBox>
        </SectionCard>

        <SectionCard
          title="Notas dos Alunos"
          actions={
            hasEntries ? (
              <AppChip label={`${model.fields.length} aluno(s)`} color="primary" size="small" />
            ) : undefined
          }
        >
          {!hasEntries ? (
            <AppAlert severity="info">
              Selecione uma turma e um professor/disciplina para carregar os alunos e lançar as
              notas.
            </AppAlert>
          ) : (
            <AppStack spacing={2}>
              <AppTableContainer>
                <AppTable>
                  <AppTableHead>
                    <AppTableRow>
                      {TABLE_COLUMNS.map((col) => (
                        <AppTableCell key={col}>
                          <AppText variant="subtitle2">{col}</AppText>
                        </AppTableCell>
                      ))}
                    </AppTableRow>
                  </AppTableHead>
                  <AppTableBody>
                    {model.fields.map((field, index) => (
                      <AppTableRow key={field.id}>
                        <AppTableCell sx={{ minWidth: 200 }}>
                          <AppText variant="body2">
                            {model.studentNames[field.studentEnrollmentId] ??
                              field.studentEnrollmentId}
                          </AppText>
                        </AppTableCell>
                        <AppTableCell sx={{ minWidth: 130 }}>
                          <FormTextField<ClassGradeEntryFormValues>
                            name={`entries.${index}.gradeValue`}
                            label="Nota"
                            placeholder="0,00"
                            disabled={isSubmitting}
                          />
                        </AppTableCell>
                        <AppTableCell sx={{ minWidth: 200 }}>
                          <FormTextField<ClassGradeEntryFormValues>
                            name={`entries.${index}.observations`}
                            label="Observações"
                            placeholder="Opcional"
                            disabled={isSubmitting}
                          />
                        </AppTableCell>
                        <AppTableCell>
                          <AppIconButton
                            size="small"
                            color="error"
                            onClick={() => model.removeRow(index)}
                            disabled={model.fields.length === 1 || isSubmitting}
                            aria-label="Remover aluno"
                          >
                            <DeleteIcon fontSize="small" />
                          </AppIconButton>
                        </AppTableCell>
                      </AppTableRow>
                    ))}
                  </AppTableBody>
                </AppTable>
              </AppTableContainer>
            </AppStack>
          )}
        </SectionCard>

        {hasEntries ? (
          <FormActions
            primaryAction={{
              type: 'confirm',
              label: 'Salvar',
              onClick: () => {
                void model.form.handleSubmit(model.submit)();
              },
              loading: isSubmitting,
            }}
            secondaryAction={{
              type: 'cancel',
              label: 'Cancelar',
              onClick: () => {
                model.form.reset();
              },
              disabled: isSubmitting,
            }}
          />
        ) : null}
      </AppStack>
    </AppForm>
  );
};
