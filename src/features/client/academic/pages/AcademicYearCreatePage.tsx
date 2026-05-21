import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { AcademicYearWizardSummary } from '@features/client/academic/components/onboarding/AcademicYearWizardSummary';
import { AcademicYearWizardSteps } from '@features/client/academic/components/onboarding/AcademicYearWizardSteps';
import { useAcademicYearCreatePage } from '@features/client/academic/hooks/useAcademicYearCreatePage';
import { layoutSpacing } from '@theme/spacing';
import { shadowTokens } from '@theme/tokens/shadows';

const AcademicYearCreatePage = () => {
  const academicYearCreatePage = useAcademicYearCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar ano letivo"
        subtitle="Configure o ano letivo por etapas, com períodos acadêmicos e política de boletim."
        actionLabel="Voltar"
        onAction={academicYearCreatePage.onBack}
      />
      {academicYearCreatePage.errorMessage ? (
        <AppAlert severity="error">{academicYearCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppStack
        direction={{ xs: 'column', md: 'row' }}
        spacing={layoutSpacing.sectionGap}
        sx={{ alignItems: 'flex-start' }}
      >
        <AppPaper
          sx={{
            p: 2,
            flex: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: shadowTokens.card,
          }}
        >
          <AppForm form={academicYearCreatePage.form} onSubmit={academicYearCreatePage.onSubmit}>
            <StepperWizard
              activeStep={academicYearCreatePage.activeStep}
              steps={academicYearCreatePage.steps}
              onBack={academicYearCreatePage.onPrevious}
              onCancel={academicYearCreatePage.onBack}
              onStepSelect={academicYearCreatePage.onStepSelect}
              onNext={() => {
                void academicYearCreatePage.onNext();
              }}
              isLastStep={academicYearCreatePage.isLastStep}
              nextLabel={academicYearCreatePage.isLastStep ? 'Cadastrar' : 'Próximo'}
              nextDisabled={academicYearCreatePage.submitting}
              nextLoading={academicYearCreatePage.submitting && academicYearCreatePage.isLastStep}
            >
              <AcademicYearWizardSteps activeStep={academicYearCreatePage.activeStep} />
            </StepperWizard>
          </AppForm>
        </AppPaper>
        <AcademicYearWizardSummary
          values={academicYearCreatePage.committedSummary}
          activeStep={academicYearCreatePage.activeStep}
          maxCompletedStep={academicYearCreatePage.maxCompletedStep}
          showProgress
          onStepSelect={academicYearCreatePage.onStepSelect}
        />
      </AppStack>
    </AppStack>
  );
};

export default AcademicYearCreatePage;
