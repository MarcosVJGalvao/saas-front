import { Controller } from 'react-hook-form';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import {
  documentTypeOptions,
  genderOptions,
  studentStatusOptions,
} from '@shared/constants/selectOptions';
import { useStudentCreatePage } from '@features/client/students/hooks/useStudentCreatePage';

const StudentCreatePage = () => {
  const studentCreatePage = useStudentCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo aluno"
        subtitle="Cadastre dados principais do aluno e status acadêmico."
        actionLabel="Voltar"
        onAction={studentCreatePage.onBack}
      />
      {studentCreatePage.errorMessage ? (
        <AppAlert severity="error">{studentCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={studentCreatePage.form}
          onSubmit={studentCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <Controller
            name="fullName"
            control={studentCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppTextField
                {...field}
                label="Nome completo"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="documentNumber"
            control={studentCreatePage.form.control}
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
            control={studentCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppSelect
                {...field}
                label="Tipo de documento"
                options={documentTypeOptions}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="dateOfBirth"
            control={studentCreatePage.form.control}
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
            control={studentCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppSelect
                {...field}
                label="Gênero"
                options={genderOptions}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="registrationCode"
            control={studentCreatePage.form.control}
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
            control={studentCreatePage.form.control}
            render={({ field, fieldState }) => (
              <AppSelect
                {...field}
                label="Status"
                options={studentStatusOptions}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: studentCreatePage.onBack,
              disabled: studentCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void studentCreatePage.form.handleSubmit(studentCreatePage.onSubmit)();
              },
              loading: studentCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default StudentCreatePage;
