import { Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useStudentEditPage } from '@features/client/students/hooks/useStudentEditPage';

const StudentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const studentEditPage = useStudentEditPage(id ?? '');

  if (!id) return null;

  if (studentEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando aluno" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar aluno"
        subtitle="Atualize os dados principais do aluno e status acadêmico."
        actionLabel="Voltar"
        onAction={studentEditPage.onBack}
      />
      {studentEditPage.errorMessage ? (
        <AppAlert severity="error">{studentEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppStack spacing={2}>
          <AppTextField
            label="Nome completo"
            value={studentEditPage.entity?.person?.fullName ?? ''}
            disabled
          />
          <AppForm
            form={studentEditPage.form}
            onSubmit={studentEditPage.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <Controller
              name="documentNumber"
              control={studentEditPage.form.control}
              render={({ field, fieldState }) => (
                <AppTextField
                  {...field}
                  label="Documento"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="documentType"
              control={studentEditPage.form.control}
              render={({ field, fieldState }) => (
                <AppSelect
                  {...field}
                  label="Tipo de documento"
                  options={[
                    { value: 'CPF', label: 'CPF' },
                    { value: 'CNPJ', label: 'CNPJ' },
                    { value: 'RG', label: 'RG' },
                    { value: 'PASSPORT', label: 'Passaporte' },
                    { value: 'OTHER', label: 'Outro' },
                  ]}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="dateOfBirth"
              control={studentEditPage.form.control}
              render={({ field, fieldState }) => (
                <AppDatePicker
                  label="Nascimento"
                  value={field.value ?? null}
                  onChange={field.onChange}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="gender"
              control={studentEditPage.form.control}
              render={({ field, fieldState }) => (
                <AppSelect
                  {...field}
                  label="Gênero"
                  options={[
                    { value: 'male', label: 'Masculino' },
                    { value: 'female', label: 'Feminino' },
                    { value: 'other', label: 'Outro' },
                    { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
                  ]}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="registrationCode"
              control={studentEditPage.form.control}
              render={({ field, fieldState }) => (
                <AppTextField
                  {...field}
                  label="Código do aluno"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="status"
              control={studentEditPage.form.control}
              render={({ field, fieldState }) => (
                <AppSelect
                  {...field}
                  label="Status"
                  options={[
                    { value: 'active', label: 'Ativo' },
                    { value: 'inactive', label: 'Inativo' },
                    { value: 'cancelled', label: 'Cancelado' },
                  ]}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: studentEditPage.onBack,
                disabled: studentEditPage.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: 'Salvar alterações',
                onClick: () => {
                  void studentEditPage.form.handleSubmit(studentEditPage.onSubmit)();
                },
                loading: studentEditPage.submitting,
              }}
            />
          </AppForm>
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default StudentEditPage;
