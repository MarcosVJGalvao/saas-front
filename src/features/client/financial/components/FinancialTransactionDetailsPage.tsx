import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type { EntityDetailsPageContent } from '@shared/components/data-display/details/entityDetails.types';
import { useFinancialTransactionDetailsPageViewModel } from '@features/client/financial/hooks/useFinancialTransactionDetailsPageViewModel';
import type { FinancialTransaction } from '@features/client/financial/types/financial.types';

type FinancialTransactionDetailsService = {
  getById: (id: string) => Promise<FinancialTransaction>;
};

type FinancialTransactionDetailsPageProps = {
  service: FinancialTransactionDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
};

export const FinancialTransactionDetailsPage = ({
  service,
  backPath,
  content,
}: FinancialTransactionDetailsPageProps) => {
  const model = useFinancialTransactionDetailsPageViewModel({
    service,
    backPath,
    content,
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
