type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface ResponsiveInput<T> {
  xs: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export const responsive = <const T>({
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}: ResponsiveInput<T>): Partial<Record<Breakpoint, T>> => {
  const result: Partial<Record<Breakpoint, T>> = { xs };
  if (sm !== undefined) result.sm = sm;
  if (md !== undefined) result.md = md;
  if (lg !== undefined) result.lg = lg;
  if (xl !== undefined) result.xl = xl;
  if (xxl !== undefined) result.xxl = xxl;
  return result;
};
