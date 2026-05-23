import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { alpha, useTheme } from '@mui/material/styles';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import { responsive } from '@theme/utils/responsive';

export interface AppQuickLinkItem {
  id: string;
  label: string;
  description: string;
  to: string;
  icon: ReactNode;
}

interface AppQuickLinksPanelProps {
  title: string;
  description: string;
  links: ReadonlyArray<AppQuickLinkItem>;
}

export const AppQuickLinksPanel = ({ title, description, links }: AppQuickLinksPanelProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppCard
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <AppStack spacing={2}>
        <AppStack spacing={0.5}>
          <AppText variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </AppText>
          <AppText variant="body2" color="text.secondary">
            {description}
          </AppText>
        </AppStack>

        <AppBox
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: responsive({ xs: '1fr', md: '1fr 1fr' }),
          }}
        >
          {links.map((link) => (
            <AppBox
              key={link.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 1,
                p: 2,
                minHeight: 136,
                borderRadius: 2.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                bgcolor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <AppStack spacing={1}>
                <AppBox sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                  {link.icon}
                </AppBox>
                <AppText variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {link.label}
                </AppText>
                <AppText variant="body2" color="text.secondary">
                  {link.description}
                </AppText>
              </AppStack>

              <AppButton
                variant="text"
                endIcon={<ArrowOutwardRoundedIcon />}
                onClick={() => {
                  void navigate(link.to);
                }}
                sx={{ alignSelf: 'flex-start', px: 0 }}
              >
                Abrir
              </AppButton>
            </AppBox>
          ))}
        </AppBox>
      </AppStack>
    </AppCard>
  );
};
