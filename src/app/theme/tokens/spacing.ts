export const spacingBaseUnit = 8;

export const spacing = spacingBaseUnit;

export const spacingScale = {
  none: 0,
  xxxs: 0.5,
  xxs: 1,
  xs: 1.5,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
  xxl: 8,
};

export const layoutSpacing = {
  appBarPaddingX: {
    xs: spacingScale.sm,
    sm: spacingScale.md,
    md: spacingScale.lg,
    lg: spacingScale.xl,
  },
  pagePaddingX: {
    xs: spacingScale.sm,
    sm: spacingScale.md,
    md: spacingScale.lg,
    lg: spacingScale.xl,
  },
  pagePaddingY: { xs: spacingScale.sm, md: spacingScale.md },
  sectionGap: spacingScale.md,
  gridGap: { xs: spacingScale.sm, md: spacingScale.md },
  cardPadding: { xs: spacingScale.sm, md: spacingScale.md },
  formGap: spacingScale.sm,
  formContainerPadding: { xs: spacingScale.sm, sm: spacingScale.md, md: spacingScale.lg },
};
