import { screenByDevice, type ResponsiveTier } from '@theme/tokens/breakpoints';

type MuiResponsiveValues<T> = Record<(typeof screenByDevice)[ResponsiveTier], T>;

interface ResponsiveInput<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
}

export const responsive = <T>({
  mobile,
  tablet,
  desktop,
}: ResponsiveInput<T>): MuiResponsiveValues<T> => {
  const tabletValue = tablet ?? mobile;
  return {
    [screenByDevice.mobile]: mobile,
    [screenByDevice.tablet]: tabletValue,
    [screenByDevice.desktop]: desktop ?? tabletValue,
  };
};
