import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const PlatformHomePage = () => (
  <Box sx={{ p: 3 }}>
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Chip
          label="Ambiente Platform"
          color="primary"
          variant="outlined"
          sx={{ width: 'fit-content' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Painel administrativo da plataforma
        </Typography>
        <Typography sx={{ fontSize: 16, color: 'text.secondary' }}>
          Voce esta autenticado no dominio de administracao. Aqui voce gerencia tenants, acessos e
          configuracoes globais.
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'action.hover',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Proximos passos recomendados</Typography>
          <Typography variant="body2">1. Revisar usuarios e permissoes de tenants.</Typography>
          <Typography variant="body2">2. Validar politicas de seguranca e MFA.</Typography>
          <Typography variant="body2">3. Acompanhar indicadores de operacao.</Typography>
        </Box>
      </Stack>
    </Paper>
  </Box>
);

export default PlatformHomePage;
