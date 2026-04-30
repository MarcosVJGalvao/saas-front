import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const PlatformHomePage = () => (
  <Box sx={{ p: 3 }}>
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography sx={{ fontSize: 34, fontWeight: 700, color: '#10244d', mb: 1 }}>
        Login realizado com sucesso
      </Typography>
      <Typography sx={{ fontSize: 18, color: '#5f7398' }}>
        Você está autenticado na plataforma.
      </Typography>
    </Paper>
  </Box>
);

export default PlatformHomePage;
