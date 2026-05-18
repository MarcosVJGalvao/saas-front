import type {
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '@shared/types/detailsDrawer';

export type EntityDetailsViewState =
  | 'loading'
  | 'error'
  | 'empty'
  | 'ready'
  | 'unauthorized'
  | 'forbidden';

export type EntityDetailsPageContent = {
  pageTitle: string;
  pageSubtitle?: string | undefined;
  loadingLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  errorFallback: string;
  unauthorizedTitle: string;
  unauthorizedMessage: string;
  forbiddenTitle: string;
  forbiddenMessage: string;
};

export type EntityDetailsPageData = {
  headerData: DetailsHeaderData | null;
  tabs: ReadonlyArray<DetailTab>;
  footerActions?: ReadonlyArray<DetailsFooterAction> | undefined;
};
