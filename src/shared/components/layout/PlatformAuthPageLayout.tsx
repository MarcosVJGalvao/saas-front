import { memo, type ReactNode } from 'react';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '@theme/useThemeMode';
import { fontSizes } from '@theme/fontSizes';
import { getUiColorTokens } from '@theme/uiColors';

const BUILDING_IMAGE_URL = '/assets/auth/buildings.webp';
const PLATFORM_AUTH_MESSAGES = {
  switchToLight: 'Ativar tema claro',
  switchToDark: 'Ativar tema escuro',
  brandPrefix: 'SaaS',
  brandHighlight: 'Platform',
  mainTitle: 'Gestão centralizada da sua plataforma',
  mainDescription:
    'Administre tenants, usuários, planos e configurações de forma segura e eficiente.',
  secureEnvironment: 'Ambiente seguro da plataforma',
  copyright: '© 2024 SaaS Platform. Todos os direitos reservados.',
  cityAlt: 'Cidade',
};

type AuthLayoutMessages = {
  brandPrefix: string;
  brandHighlight: string;
  mainTitle: string;
  mainDescription: string;
  secureEnvironment: string;
  copyright: string;
  cityAlt: string;
};

const HIGHLIGHTS = [
  {
    title: 'Controle total',
    description: 'Gerencie todos os tenants, usuários e permissões em um só lugar.',
    icon: GroupsOutlinedIcon,
  },
  {
    title: 'Segurança avançada',
    description: 'Proteção robusta com autenticação em duas etapas e monitoramento.',
    icon: LockOutlinedIcon,
  },
  {
    title: 'Visão estratégica',
    description: 'Dashboards e relatórios para decisões rápidas e inteligentes.',
    icon: BarChartOutlinedIcon,
  },
];

interface PlatformAuthPageLayoutProps {
  children: ReactNode;
  messages?: Partial<AuthLayoutMessages> | undefined;
}

const HighlightList = memo(({ heroCardBackground }: { heroCardBackground: string }) => (
  <Stack spacing={{ md: 2.4, lg: 2.9 }} sx={{ position: 'relative', zIndex: 2 }}>
    {HIGHLIGHTS.map((item) => {
      const Icon = item.icon;
      return (
        <Stack
          key={item.title}
          direction="row"
          spacing={{ md: 1.1, lg: 1.4 }}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box
            sx={{
              width: { md: 50, lg: 54 },
              height: { md: 50, lg: 54 },
              borderRadius: 2,
              bgcolor: heroCardBackground,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: { md: 21, lg: 23 } }} />
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: { md: fontSizes.md, lg: fontSizes.lg }, fontWeight: 700, mb: 0.3 }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                fontSize: { md: fontSizes.xs, lg: fontSizes.sm },
                lineHeight: 1.42,
                maxWidth: 320,
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Stack>
      );
    })}
  </Stack>
));

export const PlatformAuthPageLayout = ({ children, messages }: PlatformAuthPageLayoutProps) => {
  const theme = useTheme();
  const { mode: themeMode, setMode } = useThemeMode();
  const authUi = getUiColorTokens(theme.palette.mode);
  const layoutMessages: AuthLayoutMessages = {
    brandPrefix: messages?.brandPrefix ?? PLATFORM_AUTH_MESSAGES.brandPrefix,
    brandHighlight: messages?.brandHighlight ?? PLATFORM_AUTH_MESSAGES.brandHighlight,
    mainTitle: messages?.mainTitle ?? PLATFORM_AUTH_MESSAGES.mainTitle,
    mainDescription: messages?.mainDescription ?? PLATFORM_AUTH_MESSAGES.mainDescription,
    secureEnvironment: messages?.secureEnvironment ?? PLATFORM_AUTH_MESSAGES.secureEnvironment,
    copyright: messages?.copyright ?? PLATFORM_AUTH_MESSAGES.copyright,
    cityAlt: messages?.cityAlt ?? PLATFORM_AUTH_MESSAGES.cityAlt,
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        height: '100dvh',
        p: { xs: 0, md: 1.25 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <IconButton
        aria-label={
          themeMode === 'dark'
            ? PLATFORM_AUTH_MESSAGES.switchToLight
            : PLATFORM_AUTH_MESSAGES.switchToDark
        }
        onClick={() => setMode(themeMode === 'dark' ? 'light' : 'dark')}
        sx={{
          position: 'absolute',
          top: { xs: 10, md: 18 },
          right: { xs: 10, md: 18 },
          zIndex: 5,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {themeMode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
      <Box
        sx={{
          height: { xs: '100dvh', md: 'calc(100dvh - 34px)' },
          borderRadius: { xs: 0, md: 3 },
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '44% 56%' },
          boxShadow: theme.shadows[4],
        }}
      >
        <Box
          sx={{
            background: authUi.heroGradient,
            color: 'common.white',
            px: { md: 4, lg: 5 },
            pt: { md: 8, lg: 9 },
            pb: { md: 3, lg: 3 },
            position: 'relative',
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' },
            '&::before': { display: 'none' },
          }}
        >
          <Stack
            direction="row"
            spacing={1.4}
            sx={{ mb: { md: 3.5, lg: 4.5 }, position: 'relative', zIndex: 2, alignItems: 'center' }}
          >
            <Box
              sx={{
                width: { md: 48, lg: 52 },
                height: { md: 48, lg: 52 },
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <VerifiedUserOutlinedIcon fontSize="small" />
            </Box>
            <Typography
              sx={{ fontSize: { md: '1.125rem', lg: '1.0625rem' }, fontWeight: 700, lineHeight: 1 }}
            >
              {layoutMessages.brandPrefix}{' '}
              <Box component="span" sx={{ color: authUi.heroAccent }}>
                {layoutMessages.brandHighlight}
              </Box>
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: { md: '1.875rem', lg: '2.25rem' },
              fontWeight: 700,
              lineHeight: 1.18,
              mb: { md: 1.6, lg: 2.2 },
              maxWidth: { md: 320, lg: 380 },
              position: 'relative',
              zIndex: 2,
            }}
          >
            {layoutMessages.mainTitle}
          </Typography>
          <Typography
            sx={{
              fontSize: { md: fontSizes.md, lg: fontSizes.lg },
              lineHeight: 1.45,
              maxWidth: { md: 320, lg: 380 },
              position: 'relative',
              zIndex: 2,
            }}
          >
            {layoutMessages.mainDescription}
          </Typography>
          <Box
            sx={{
              width: { md: 52, lg: 55 },
              height: 3,
              bgcolor: authUi.heroLine,
              mt: { md: 2.5, lg: 3 },
              mb: { md: 2.8, lg: 3.2 },
              position: 'relative',
              zIndex: 2,
            }}
          />
          <HighlightList heroCardBackground={authUi.heroCardBackground} />
          <Box
            component="img"
            src={BUILDING_IMAGE_URL}
            alt={layoutMessages.cityAlt}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              zIndex: 1,
              display: 'block',
              userSelect: 'none',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)',
            }}
          />
        </Box>
        <Box
          sx={{
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, md: 3 },
            pt: { xs: 7, md: 3 },
            pb: { xs: 2, md: 3 },
          }}
        >
          {children}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, color: 'text.secondary', alignItems: 'center' }}
          >
            <SecurityOutlinedIcon fontSize="small" />
            <Typography sx={{ fontSize: fontSizes.md }}>
              {layoutMessages.secureEnvironment}
            </Typography>
          </Stack>
        </Box>
      </Box>
      <Typography
        sx={{ textAlign: 'center', color: 'text.secondary', pt: 0.5, fontSize: fontSizes.sm }}
      >
        {layoutMessages.copyright}
      </Typography>
    </Box>
  );
};
