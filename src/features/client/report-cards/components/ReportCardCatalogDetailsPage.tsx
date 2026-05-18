import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type { EntityDetailsPageContent } from '@shared/components/data-display/details/entityDetails.types';
import { useReportCardCatalogDetailsPageViewModel } from '@features/client/report-cards/hooks/useReportCardCatalogDetailsPageViewModel';
import type { ReportCardCatalogEntity } from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

type ReportCardCatalogDetailsService = {
  getById: (id: string) => Promise<ReportCardCatalogEntity>;
};

type ReportCardCatalogDetailsPageProps = {
  mode: ReportCardCatalogMode;
  service: ReportCardCatalogDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  fallbackSubtitle: string;
};

export const ReportCardCatalogDetailsPage = ({
  mode,
  service,
  backPath,
  content,
  fallbackSubtitle,
}: ReportCardCatalogDetailsPageProps) => {
  const model = useReportCardCatalogDetailsPageViewModel({
    mode,
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
