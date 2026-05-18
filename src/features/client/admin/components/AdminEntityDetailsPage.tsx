import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type { EntityDetailsPageContent } from '@shared/components/data-display/details/entityDetails.types';
import { useAdminEntityDetailsPageViewModel } from '@features/client/admin/hooks/useAdminEntityDetailsPageViewModel';
import type { ClientAdminEntity } from '@features/client/admin/types/admin.types';

type AdminEntityDetailsService = {
  getById: (id: string) => Promise<ClientAdminEntity>;
};

type AdminEntityDetailsPageProps = {
  service: AdminEntityDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  fallbackSubtitle: string;
  showRole?: boolean | undefined;
  showPermissions?: boolean | undefined;
};

export const AdminEntityDetailsPage = ({
  service,
  backPath,
  content,
  fallbackSubtitle,
  showRole = false,
  showPermissions = false,
}: AdminEntityDetailsPageProps) => {
  const model = useAdminEntityDetailsPageViewModel({
    service,
    backPath,
    content,
    fallbackSubtitle,
    showRole,
    showPermissions,
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
