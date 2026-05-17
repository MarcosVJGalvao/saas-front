import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { responsive } from '@theme/utils/responsive';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';

const accessOptions = [
  {
    title: 'Acesso plataforma',
    description: 'Área administrativa para gestão de clientes, planos, assinaturas e operação.',
    href: '/platform/login',
    icon: <AdminPanelSettingsOutlinedIcon fontSize="large" />,
    actionLabel: 'Entrar como plataforma',
  },
  {
    title: 'Acesso cliente',
    description:
      'Área do cliente para acompanhar informações e acessar recursos do próprio tenant.',
    href: '/client/login',
    icon: <BusinessOutlinedIcon fontSize="large" />,
    actionLabel: 'Entrar como cliente',
  },
];

const HomePage = () => (
  <AppBox
    component="main"
    sx={(theme) => ({
      minHeight: '100dvh',
      bgcolor: 'background.default',
      color: 'text.primary',
      display: 'flex',
      alignItems: 'center',
      px: responsive({ mobile: 2, tablet: 4, desktop: 8 }),
      py: responsive({ mobile: 4, tablet: 6, desktop: 8 }),
      backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
    })}
  >
    <AppStack
      spacing={responsive({ mobile: 4, desktop: 6 })}
      sx={{
        width: '100%',
        maxWidth: 1120,
        mx: 'auto',
      }}
    >
      <AppStack spacing={2} sx={{ maxWidth: 760 }}>
        <AppText component="p" variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
          Plataforma SaaS
        </AppText>
        <AppText
          component="h1"
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: responsive({ mobile: '2rem', tablet: '2.75rem', desktop: '3.25rem' }),
            lineHeight: 1.08,
          }}
        >
          Escolha o ambiente de acesso
        </AppText>
        <AppText component="p" variant="h6" color="text.secondary" sx={{ maxWidth: 680 }}>
          Esta é uma entrada temporária para separar o login administrativo da plataforma e o login
          do cliente.
        </AppText>
      </AppStack>

      <AppBox
        sx={{
          display: 'grid',
          gridTemplateColumns: responsive({ mobile: '1fr', tablet: 'repeat(2, minmax(0, 1fr))' }),
          gap: responsive({ mobile: 2, tablet: 3 }),
        }}
      >
        {accessOptions.map((option) => (
          <AppStack
            key={option.href}
            spacing={3}
            sx={(theme) => ({
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: responsive({ mobile: 3, desktop: 4 }),
              boxShadow: theme.shadows[2],
            })}
          >
            <AppStack spacing={2}>
              <AppBox
                aria-hidden="true"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {option.icon}
              </AppBox>
              <AppStack spacing={1}>
                <AppText component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                  {option.title}
                </AppText>
                <AppText component="p" variant="body1" color="text.secondary">
                  {option.description}
                </AppText>
              </AppStack>
            </AppStack>

            <AppButton
              href={option.href}
              endIcon={<ArrowForwardOutlinedIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {option.actionLabel}
            </AppButton>
          </AppStack>
        ))}
      </AppBox>
    </AppStack>
  </AppBox>
);

export default HomePage;
