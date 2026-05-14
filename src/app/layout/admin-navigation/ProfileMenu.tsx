import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import ViewDayOutlinedIcon from '@mui/icons-material/ViewDayOutlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { DENSITY_MODE, type DensityMode } from '@models/density';
import type { ThemeMode } from '@models/themeMode';
import { getUiColorTokens } from '@theme/uiColors';
import { appLayoutMessages } from '@app/layout/admin-navigation/messages';

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  userName: string;
  userInitials: string;
  userEmail: string;
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
  userEmail,
  theme,
  density,
  onSetTheme,
  onSetDensity,
  onLogout,
}: ProfileMenuProps) => {
  const themeObj = useTheme();
  const uiColors = getUiColorTokens(themeObj.palette.mode);

  return (
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
            backgroundColor: uiColors.menuBackdrop,
            border: 1,
            borderColor: uiColors.menuBorder,
            boxShadow: uiColors.menuShadow,
            transition: themeObj.transitions.create(['opacity', 'transform']),
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1.5 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            color: 'common.white',
            fontWeight: 700,
          }}
        >
          {userInitials}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>{userName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {userEmail}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1.25, borderColor: uiColors.menuDivider }} />

      <MenuItem sx={{ borderRadius: 2, mb: 1.25, gap: 1.25, minHeight: 38, px: 0.5 }}>
        <PersonOutlineOutlinedIcon fontSize="small" />
        {appLayoutMessages.profile}
      </MenuItem>

      <Box sx={{ px: 0.25, py: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WbSunnyOutlinedIcon fontSize="small" />
            <Typography variant="body1">{appLayoutMessages.theme}</Typography>
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
                borderColor: uiColors.menuBorder,
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
                borderColor: uiColors.menuBorder,
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
            <Typography variant="body1">{appLayoutMessages.density}</Typography>
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
              borderColor: uiColors.menuBorder,
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
              borderColor: uiColors.menuBorder,
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
              borderColor: uiColors.menuBorder,
              px: 0.5,
            }}
          >
            <ViewDayOutlinedIcon sx={{ fontSize: 17 }} />
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 0.75, borderColor: uiColors.menuDivider }} />

      <MenuItem onClick={onLogout} sx={{ color: 'error.main', borderRadius: 2, gap: 1.25 }}>
        <LogoutOutlinedIcon fontSize="small" />
        {appLayoutMessages.logout}
      </MenuItem>
    </Menu>
  );
};
