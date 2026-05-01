import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import ViewDayOutlinedIcon from '@mui/icons-material/ViewDayOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import { DENSITY_MODE, type DensityMode } from '../../../models/density';
import type { ThemeMode } from '../../../models/themeMode';

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  userName: string;
  userInitials: string;
  theme: ThemeMode;
  density: DensityMode;
  onSetTheme: (mode: ThemeMode) => void;
  onSetDensity: (mode: DensityMode) => void;
  onLogout: () => void;
}

export const ProfileMenu = ({
  anchorEl,
  open,
  onClose,
  userName,
  userInitials,
  theme,
  density,
  onSetTheme,
  onSetDensity,
  onLogout,
}: ProfileMenuProps) => (
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    slotProps={{
      paper: {
        sx: {
          width: 300,
          maxWidth: '94vw',
          borderRadius: 2.5,
          p: 1.75,
          mt: 0.75,
          backdropFilter: 'blur(18px)',
          backgroundColor: (themeObj) =>
            themeObj.palette.mode === 'dark' ? 'rgba(8,16,30,0.94)' : 'rgba(255,255,255,0.96)',
          border: 1,
          borderColor: (themeObj) =>
            themeObj.palette.mode === 'dark' ? 'rgba(125,179,255,0.18)' : 'divider',
          boxShadow: (themeObj) =>
            themeObj.palette.mode === 'dark'
              ? '0 24px 60px rgba(1,8,22,0.58)'
              : '0 20px 60px rgba(0,0,0,0.24)',
        },
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1.5 }}>
      <Avatar
        sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: '#fff', fontWeight: 700 }}
      >
        {userInitials}
      </Avatar>
      <Box>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>{userName}</Typography>
        <Typography variant="body2" color="text.secondary">
          dev.admin@sistema.com
        </Typography>
      </Box>
    </Box>
    <Divider sx={{ mb: 1.25, borderColor: 'rgba(125,179,255,0.16)' }} />
    <MenuItem sx={{ borderRadius: 2, mb: 1.25, gap: 1.25, minHeight: 38, px: 0.5 }}>
      <PersonOutlineOutlinedIcon fontSize="small" />
      Meu perfil
    </MenuItem>
    <Box sx={{ px: 0.25, py: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WbSunnyOutlinedIcon fontSize="small" />
          <Typography variant="body1">Tema</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0, width: 'fit-content' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSetTheme('light')}
            sx={{
              borderRadius: '10px 0 0 10px',
              minHeight: 34,
              minWidth: 36,
              borderColor: 'rgba(125,179,255,0.35)',
              px: 0,
            }}
          >
            <WbSunnyOutlinedIcon sx={{ fontSize: 17 }} />
          </Button>
          <Button
            variant={theme === 'dark' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onSetTheme('dark')}
            sx={{
              borderRadius: '0 10px 10px 0',
              minHeight: 34,
              minWidth: 36,
              borderColor: 'rgba(125,179,255,0.35)',
              px: 0,
            }}
          >
            <Brightness2OutlinedIcon sx={{ fontSize: 17 }} />
          </Button>
        </Box>
      </Box>
    </Box>
    <Box sx={{ px: 0.25, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewStreamOutlinedIcon fontSize="small" />
          <Typography variant="body1">Densidade</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, width: 'fit-content', ml: 4 }}>
        <Button
          variant={density === DENSITY_MODE.COMPACT ? 'contained' : 'outlined'}
          size="small"
          onClick={() => onSetDensity(DENSITY_MODE.COMPACT)}
          sx={{
            borderRadius: 1.5,
            minHeight: 32,
            minWidth: 52,
            borderColor: 'rgba(125,179,255,0.35)',
            px: 0.5,
          }}
        >
          <ViewAgendaOutlinedIcon sx={{ fontSize: 17 }} />
        </Button>
        <Button
          variant={density === DENSITY_MODE.NORMAL ? 'contained' : 'outlined'}
          size="small"
          onClick={() => onSetDensity(DENSITY_MODE.NORMAL)}
          sx={{
            borderRadius: 1.5,
            minHeight: 32,
            minWidth: 52,
            borderColor: 'rgba(125,179,255,0.35)',
            px: 0.5,
          }}
        >
          <ViewStreamOutlinedIcon sx={{ fontSize: 17 }} />
        </Button>
        <Button
          variant={density === DENSITY_MODE.WIDE ? 'contained' : 'outlined'}
          size="small"
          onClick={() => onSetDensity(DENSITY_MODE.WIDE)}
          sx={{
            borderRadius: 1.5,
            minHeight: 32,
            minWidth: 52,
            borderColor: 'rgba(125,179,255,0.35)',
            px: 0.5,
          }}
        >
          <ViewDayOutlinedIcon sx={{ fontSize: 17 }} />
        </Button>
      </Box>
    </Box>
    <Divider sx={{ my: 0.75, borderColor: 'rgba(125,179,255,0.16)' }} />
    <MenuItem onClick={onLogout} sx={{ color: 'error.main', borderRadius: 2, gap: 1.25 }}>
      <LogoutOutlinedIcon fontSize="small" />
      Sair da conta
    </MenuItem>
  </Menu>
);
