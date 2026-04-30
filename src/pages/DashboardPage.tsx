import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { layoutSpacing } from '../theme/spacing';

const DashboardPage = () => (
  <Box sx={{ width: '100%' }}>
    <Typography
      variant="h2"
      sx={{ mb: layoutSpacing.sectionGap, fontSize: { xs: '1.5rem', md: '1.75rem', xl: '2rem' } }}
    >
      Dashboard
    </Typography>
    <Grid container spacing={layoutSpacing.gridGap}>
      {[1, 2, 3, 4].map((item) => (
        <Grid key={item} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper sx={{ p: layoutSpacing.cardPadding }}>Card {item}</Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default DashboardPage;
