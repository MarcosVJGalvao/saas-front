import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type { EntityDetailsPageContent } from '@shared/components/data-display/details/entityDetails.types';
import { useFinancialRecordDetailsPageViewModel } from '@features/client/financial/hooks/useFinancialRecordDetailsPageViewModel';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

type FinancialRecordDetailsService = {
  getById: (id: string) => Promise<FinancialRecord>;
};

type FinancialRecordDetailsPageProps = {
  service: FinancialRecordDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  fallbackSubtitle: string;
};

export const FinancialRecordDetailsPage = ({
  service,
  backPath,
  content,
  fallbackSubtitle,
}: FinancialRecordDetailsPageProps) => {
  const model = useFinancialRecordDetailsPageViewModel({
    service,
    backPath,
    content,
    fallbackSubtitle,
  });

  return (
    <EntityDetailsPage
      viewState={model.viewState}
      content={model.content}
      data={model.data}
      errorMessage={model.errorMessage}
      onBack={model.onBack}
      onRetry={() => {
        void model.onRetry();
      }}
    />
  );
};
