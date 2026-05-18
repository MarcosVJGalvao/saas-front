import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type { EntityDetailsPageContent } from '@shared/components/data-display/details/entityDetails.types';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import { useFinancialEntityDetailsPageViewModel } from '@features/client/financial/hooks/useFinancialEntityDetailsPageViewModel';
import type {
  FinancialEntity,
  FinancialEntityPayload,
  FinancialEntityQueryParams,
} from '@features/client/financial/types/financial.types';

type FinancialEntityDetailsService = Pick<
  ClientCrudService<
    FinancialEntity,
    FinancialEntity,
    FinancialEntityPayload,
    FinancialEntityPayload,
    FinancialEntityQueryParams
  >,
  'getById'
>;

type FinancialEntityDetailsPageProps = {
  service: FinancialEntityDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  errorMessageFallback: string;
  fallbackSubtitle: string;
  includeType?: boolean | undefined;
};

export const FinancialEntityDetailsPage = ({
  service,
  backPath,
  content,
  errorMessageFallback,
  fallbackSubtitle,
  includeType = false,
}: FinancialEntityDetailsPageProps) => {
  const model = useFinancialEntityDetailsPageViewModel({
    service,
    backPath,
    content,
    errorMessageFallback,
    fallbackSubtitle,
    includeType,
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
