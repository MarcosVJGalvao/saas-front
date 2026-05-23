import type { ReactNode } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { AppChip } from '@shared/components/data-display/AppChip';
import { AppText } from '@shared/components/data-display/AppText';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import { responsive } from '@theme/utils/responsive';

interface AppHomeHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  badgeLabel?: string | undefined;
  aside?: ReactNode | undefined;
}

export const AppHomeHero = ({
  eyebrow,
  title,
  description,
  badgeLabel,
  aside,
}: AppHomeHeroProps) => {
  const theme = useTheme();

  return (
    <AppBox
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.background.paper, 0.92)} 48%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        px: responsive({ xs: 2.5, md: 4 }),
        py: responsive({ xs: 3, md: 4 }),
      }}
    >
      <AppBox
        aria-hidden
        sx={{
          position: 'absolute',
          top: -36,
          right: -24,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: alpha(theme.palette.primary.main, 0.08),
          filter: 'blur(6px)',
        }}
      />

      <AppBox
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: responsive({
            xs: '1fr',
            lg: 'minmax(0, 1.6fr) minmax(280px, 0.9fr)',
          }),
          alignItems: 'center',
        }}
      >
        <AppStack spacing={1.25} sx={{ position: 'relative', zIndex: 1 }}>
          <AppText
            variant="overline"
            sx={{ letterSpacing: '0.14em', fontWeight: 700, color: 'primary.main' }}
          >
            {eyebrow}
          </AppText>
          <AppText
            variant="h4"
            sx={{
              fontWeight: 800,
              lineHeight: 1.08,
              fontSize: responsive({ xs: '1.8rem', md: '2.5rem' }),
              maxWidth: '16ch',
            }}
          >
            {title}
          </AppText>
          <AppText variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
            {description}
          </AppText>
          {badgeLabel ? (
            <AppChip
              label={badgeLabel}
              color="primary"
              variant="outlined"
              sx={{ width: 'fit-content', mt: 0.5, fontWeight: 600 }}
            />
          ) : null}
        </AppStack>

        {aside ? <AppBox sx={{ position: 'relative', zIndex: 1 }}>{aside}</AppBox> : null}
      </AppBox>
    </AppBox>
  );
};
