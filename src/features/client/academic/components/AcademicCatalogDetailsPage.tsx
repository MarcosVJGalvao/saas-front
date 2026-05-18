import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import type { EntityDetailsPageContent } from '@shared/components/data-display/details/entityDetails.types';
import { useAcademicCatalogDetailsPageViewModel } from '@features/client/academic/hooks/useAcademicCatalogDetailsPageViewModel';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
} from '@features/client/academic/types/academic.types';

type AcademicCatalogDetailsService = Pick<
  ClientCrudService<
    AcademicCatalogItem,
    AcademicCatalogItem,
    Record<string, unknown>,
    Record<string, unknown>,
    AcademicCatalogQueryParams
  >,
  'getById'
>;

type AcademicCatalogDetailsPageProps = {
  service: AcademicCatalogDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  errorMessageFallback: string;
};

export const AcademicCatalogDetailsPage = ({
  service,
  backPath,
  content,
  errorMessageFallback,
}: AcademicCatalogDetailsPageProps) => {
  const model = useAcademicCatalogDetailsPageViewModel({
    service,
    backPath,
    content,
    errorMessageFallback,
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
