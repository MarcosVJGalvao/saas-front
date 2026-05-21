import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MenuItem from '@mui/material/MenuItem';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppSwitch } from '@shared/components/inputs/AppSwitch';
import { AppText } from '@shared/components/data-display/AppText';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import {
  academicYearStatusOptions,
  reportCardCalculationTypeOptions,
  reportCardFinalStatusStrategyOptions,
  reportCardRecoveryStrategyOptions,
} from '@features/client/academic/constants/academicYearWizard';
import type { AcademicYearFormValues } from '@features/client/academic/schemas/academicYearFormSchema';

type AcademicYearWizardStepsProps = {
  activeStep: number;
};

type SelectFieldProps = {
  name: 'status' | 'calculationType' | 'recoveryStrategy' | 'finalStatusStrategy';
  label: string;
  options: { label: string; value: string | number }[];
};

type DateFieldProps = {
  name:
    | 'startDate'
    | 'endDate'
    | `academicPeriods.${number}.startDate`
    | `academicPeriods.${number}.endDate`;
  label: string;
};

const SelectField = ({ name, label, options }: SelectFieldProps) => {
  const form = useFormContext<AcademicYearFormValues>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <AppTextField
          {...field}
          select
          label={label}
          size="small"
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </AppTextField>
      )}
    />
  );
};

const DateField = ({ name, label }: DateFieldProps) => {
  const form = useFormContext<AcademicYearFormValues>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <AppDatePicker
          label={label}
          value={field.value}
          onChange={field.onChange}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          textFieldSlotProps={{
            size: 'small',
            sx: {
              '& .MuiInputBase-root': {
                minHeight: 40,
              },
            },
          }}
        />
      )}
    />
  );
};

const GeneralStep = () => (
  <AppStack spacing={2}>
    <AppText variant="h6">Dados gerais do ano letivo</AppText>
    <AppGrid container spacing={2}>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <FormTextField<AcademicYearFormValues> name="name" label="Nome" size="small" />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <SelectField name="status" label="Status" options={academicYearStatusOptions} />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <DateField name="startDate" label="Data inicial" />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <DateField name="endDate" label="Data final" />
      </AppGrid>
    </AppGrid>
  </AppStack>
);

const PeriodsStep = () => {
  const form = useFormContext<AcademicYearFormValues>();
  const academicPeriodsFieldArray = useFieldArray({
    control: form.control,
    name: 'academicPeriods',
    keyName: 'fieldId',
  });

  return (
    <AppStack spacing={2}>
      <AppStack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <AppText variant="h6">Períodos acadêmicos</AppText>
        <AppButton
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          onClick={() => {
            academicPeriodsFieldArray.append({
              academicPeriodId: undefined,
              name: '',
              code: '',
              sequence: String(academicPeriodsFieldArray.fields.length + 1),
              startDate: '',
              endDate: '',
              weight: '',
              isFinalPeriod: false,
            });
          }}
        >
          Adicionar período
        </AppButton>
      </AppStack>

      {academicPeriodsFieldArray.fields.map((academicPeriodField, periodIndex) => (
        <AppPaper key={academicPeriodField.fieldId} sx={{ p: 2 }}>
          <AppStack spacing={2}>
            <AppStack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
            >
              <AppText variant="h6">{`Período ${periodIndex + 1}`}</AppText>
              {academicPeriodsFieldArray.fields.length > 1 ? (
                <AppButton
                  variant="text"
                  color="error"
                  startIcon={<DeleteOutlineOutlinedIcon />}
                  onClick={() => {
                    academicPeriodsFieldArray.remove(periodIndex);
                  }}
                >
                  Remover
                </AppButton>
              ) : null}
            </AppStack>

            <AppGrid container spacing={2}>
              <AppGrid size={{ xs: 12, md: 6 }}>
                <FormTextField<AcademicYearFormValues>
                  name={`academicPeriods.${periodIndex}.name`}
                  label="Nome do período"
                  size="small"
                />
              </AppGrid>
              <AppGrid size={{ xs: 12, md: 6 }}>
                <FormTextField<AcademicYearFormValues>
                  name={`academicPeriods.${periodIndex}.code`}
                  label="Código do período"
                  size="small"
                />
              </AppGrid>
              <AppGrid size={{ xs: 12, md: 4 }}>
                <FormTextField<AcademicYearFormValues>
                  name={`academicPeriods.${periodIndex}.sequence`}
                  label="Sequência"
                  size="small"
                />
              </AppGrid>
              <AppGrid size={{ xs: 12, md: 4 }}>
                <FormTextField<AcademicYearFormValues>
                  name={`academicPeriods.${periodIndex}.weight`}
                  label="Peso"
                  size="small"
                />
              </AppGrid>
              <AppGrid size={{ xs: 12, md: 4 }}>
                <Controller
                  name={`academicPeriods.${periodIndex}.isFinalPeriod`}
                  control={form.control}
                  render={({ field }) => (
                    <AppSwitch
                      checked={field.value}
                      label="Período final"
                      onChange={field.onChange}
                    />
                  )}
                />
              </AppGrid>
              <AppGrid size={{ xs: 12, md: 6 }}>
                <DateField
                  name={`academicPeriods.${periodIndex}.startDate`}
                  label="Data inicial do período"
                />
              </AppGrid>
              <AppGrid size={{ xs: 12, md: 6 }}>
                <DateField
                  name={`academicPeriods.${periodIndex}.endDate`}
                  label="Data final do período"
                />
              </AppGrid>
            </AppGrid>
          </AppStack>
        </AppPaper>
      ))}
    </AppStack>
  );
};

const ReportCardPolicyStep = () => (
  <AppStack spacing={2}>
    <AppText variant="h6">Política de boletim</AppText>
    <AppGrid container spacing={2}>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <SelectField
          name="calculationType"
          label="Tipo de cálculo"
          options={reportCardCalculationTypeOptions}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <FormTextField<AcademicYearFormValues>
          name="passingGrade"
          label="Nota mínima"
          size="small"
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <FormTextField<AcademicYearFormValues>
          name="minimumAttendancePercentage"
          label="Frequência mínima"
          size="small"
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <SelectField
          name="recoveryStrategy"
          label="Estratégia de recuperação"
          options={reportCardRecoveryStrategyOptions}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12 }}>
        <SelectField
          name="finalStatusStrategy"
          label="Estratégia de status final"
          options={reportCardFinalStatusStrategyOptions}
        />
      </AppGrid>
    </AppGrid>
  </AppStack>
);

export const AcademicYearWizardSteps = ({ activeStep }: AcademicYearWizardStepsProps) => {
  const stepContentByIndex = [
    <GeneralStep key="general-step" />,
    <PeriodsStep key="periods-step" />,
    <ReportCardPolicyStep key="policy-step" />,
  ];

  return stepContentByIndex[activeStep] ?? stepContentByIndex[0];
};
