import { useLocation, useParams } from 'react-router-dom';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { AcademicYearWizardSummary } from '@features/client/academic/components/onboarding/AcademicYearWizardSummary';
import { AcademicYearWizardSteps } from '@features/client/academic/components/onboarding/AcademicYearWizardSteps';
import { useAcademicYearEditPage } from '@features/client/academic/hooks/useAcademicYearEditPage';
import { layoutSpacing } from '@theme/spacing';
import { shadowTokens } from '@theme/tokens/shadows';

const AcademicYearEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const academicYearEditPage = useAcademicYearEditPage(id ?? '', location.state);

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar ano letivo"
        subtitle="Atualize o ano letivo por etapas, com períodos acadêmicos e política de boletim."
        actionLabel="Voltar"
        onAction={academicYearEditPage.onBack}
      />
      {academicYearEditPage.errorMessage ? (
        <AppAlert severity="error">{academicYearEditPage.errorMessage}</AppAlert>
      ) : null}
      {academicYearEditPage.loading ? (
        <AppCircularProgress ariaLabel="Carregando formulário do ano letivo" />
      ) : (
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
            <AppForm form={academicYearEditPage.form} onSubmit={academicYearEditPage.onSubmit}>
              <StepperWizard
                activeStep={academicYearEditPage.activeStep}
                steps={academicYearEditPage.steps}
                onBack={academicYearEditPage.onPrevious}
                onCancel={academicYearEditPage.onBack}
                onStepSelect={academicYearEditPage.onStepSelect}
                onNext={() => {
                  void academicYearEditPage.onNext();
                }}
                isLastStep={academicYearEditPage.isLastStep}
                nextLabel={academicYearEditPage.isLastStep ? 'Salvar alterações' : 'Próximo'}
                nextDisabled={academicYearEditPage.submitting}
                nextLoading={academicYearEditPage.submitting && academicYearEditPage.isLastStep}
              >
                <AcademicYearWizardSteps activeStep={academicYearEditPage.activeStep} />
              </StepperWizard>
            </AppForm>
          </AppPaper>
          <AcademicYearWizardSummary
            values={academicYearEditPage.committedSummary}
            activeStep={academicYearEditPage.activeStep}
            maxCompletedStep={academicYearEditPage.maxCompletedStep}
            showProgress={false}
            onStepSelect={academicYearEditPage.onStepSelect}
          />
        </AppStack>
      )}
    </AppStack>
  );
};

export default AcademicYearEditPage;
