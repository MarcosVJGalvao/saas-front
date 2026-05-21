const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const getLocationStateSearch = (state: unknown): string => {
  if (!isRecord(state)) return '';
  return typeof state['search'] === 'string' ? state['search'] : '';
};
