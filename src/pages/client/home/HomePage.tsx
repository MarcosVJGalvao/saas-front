import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useClientHomePageViewModel } from '@/hooks/client-auth/useClientHomePageViewModel';
import { fontSizes } from '@/theme/fontSizes';

const ClientHomePage = () => {
  const model = useClientHomePageViewModel();

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {model.messages.title}
        </Typography>
        <Typography sx={{ fontSize: fontSizes.lg, color: 'text.secondary', mb: 3 }}>
          {model.messages.success}
        </Typography>
        {model.content}
      </Paper>
    </Box>
  );
};

export default ClientHomePage;
