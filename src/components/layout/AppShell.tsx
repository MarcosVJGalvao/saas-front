import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import { THEME_MODE } from '../../models/themeMode';
import { useColorMode } from '../../hooks/useColorMode/useColorMode';
import { layoutSpacing } from '../../theme/spacing';

export const AppShell = () => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ px: layoutSpacing.appBarPaddingX }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SaaS Platform
          </Typography>
          <IconButton aria-label="Alternar tema" onClick={toggleColorMode}>
            {mode === THEME_MODE.LIGHT ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: layoutSpacing.pagePaddingX, py: layoutSpacing.pagePaddingY }}>
        <Outlet />
      </Box>
    </Box>
  );
};
