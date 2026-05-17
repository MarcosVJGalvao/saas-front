export type ResponsiveTier = 'mobile' | 'tablet' | 'desktop';

export const breakpointValues = {
  mobile: 0,
  tablet: 900,
  desktop: 1200,
};

export const breakpoints = {
  values: {
    xs: breakpointValues.mobile,
    sm: 600,
    md: breakpointValues.tablet,
    lg: breakpointValues.desktop,
    xl: 1536,
  },
};

export const screenByDevice: Record<ResponsiveTier, string> = {
  mobile: 'xs',
  tablet: 'md',
  desktop: 'lg',
};
