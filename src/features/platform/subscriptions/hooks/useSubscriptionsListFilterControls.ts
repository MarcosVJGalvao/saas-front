import type { useSubscriptionsListViewModel } from '@features/platform/subscriptions/hooks/useSubscriptionsListViewModel';

const toDateQueryValue = (value: unknown) => (typeof value === 'string' ? value : undefined);

type SubscriptionsListViewModel = ReturnType<typeof useSubscriptionsListViewModel>;

interface FilterChangeDependencies {
  updateSearch: (value: string) => void;
  updateStatus: (value: string) => void;
  updateStartDate: (value: string | undefined) => void;
  updateEndDate: (value: string | undefined) => void;
}

const createFilterChangeHandler =
  (dependencies: FilterChangeDependencies) => (name: string, value: unknown) => {
    const actionByName: Record<string, () => void> = {
      search: () => dependencies.updateSearch(String(value)),
      status: () => dependencies.updateStatus(String(value)),
      startDate: () => dependencies.updateStartDate(toDateQueryValue(value)),
      endDate: () => dependencies.updateEndDate(toDateQueryValue(value)),
    };
    const action = actionByName[name];
    if (action) action();
  };

export const useSubscriptionsListFilterControls = (model: SubscriptionsListViewModel) => ({
  values: {
    search: model.searchValue,
    status: model.statusValue,
    startDate: model.view.list.query.startDate ?? null,
    endDate: model.view.list.query.endDate ?? null,
  },
  handleFilterChange: createFilterChangeHandler({
    updateSearch: model.updateSearch,
    updateStatus: model.updateStatus,
    updateStartDate: (startDate) => model.view.list.updateQuery({ startDate, page: 1 }),
    updateEndDate: (endDate) => model.view.list.updateQuery({ endDate, page: 1 }),
  }),
});
