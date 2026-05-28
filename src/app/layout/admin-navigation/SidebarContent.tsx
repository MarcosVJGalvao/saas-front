import { memo } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { densityMetrics, type DensityMode } from '@shared/types/density';
import type { NavigationItem } from '@shared/types/navigation';
import type { LayoutBrandConfig } from '@shared/types/navigation';
import {
  useSidebarContentState,
  type SidebarChildItem,
  type SidebarMappedItem,
} from '@shared/hooks/useSidebarContentState';

interface SidebarContentProps {
  isCollapsed: boolean;
  onToggle: () => void;
  density: DensityMode;
  brand: LayoutBrandConfig;
  items: NavigationItem[];
  mobileMode?: boolean | undefined;
  closeMobile?: (() => void) | undefined;
}

const SidebarMenuButton = ({
  isCollapsed,
  mobileMode,
  onToggle,
  closeMobile,
}: {
  isCollapsed: boolean;
  mobileMode: boolean;
  onToggle: () => void;
  closeMobile?: (() => void) | undefined;
}) => (
  <IconButton
    onClick={mobileMode ? () => closeMobile?.() : onToggle}
    size="small"
    aria-label={mobileMode ? 'Fechar menu lateral' : 'Alternar menu lateral'}
  >
    {mobileMode ? (
      <CloseIcon />
    ) : (
      <ChevronLeftIcon sx={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }} />
    )}
  </IconButton>
);

const SidebarSectionHeader = ({ label, isCollapsed }: { label: string; isCollapsed: boolean }) =>
  isCollapsed ? (
    <Divider sx={{ my: 1 }} />
  ) : (
    <Typography
      variant="caption"
      sx={{
        px: 1.5,
        pt: 2.5,
        pb: 0.5,
        mt: 0.5,
        color: 'text.disabled',
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        display: 'block',
      }}
    >
      {label}
    </Typography>
  );

const selectedSx: SxProps<Theme> = {
  '&.Mui-selected': {
    bgcolor: (theme) =>
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.18)
        : theme.palette.primary.main,
    color: 'primary.contrastText',
    '&:hover': {
      bgcolor: (theme) =>
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.primary.main, 0.24)
          : theme.palette.primary.dark,
    },
  },
  '&.Mui-selected .MuiListItemIcon-root': {
    color: (theme) =>
      theme.palette.mode === 'dark'
        ? theme.palette.primary.light
        : theme.palette.primary.contrastText,
  },
};

const subSelectedSx: SxProps<Theme> = {
  '&.Mui-selected': {
    bgcolor: (theme) =>
      theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.12) : 'action.selected',
    color: (theme) =>
      theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    fontWeight: 600,
  },
  '&.Mui-selected .MuiListItemIcon-root': {
    color: (theme) =>
      theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
  },
};

const sidebarPrimaryTextSx = {
  noWrap: true,
  sx: {
    fontSize: '0.9rem',
    lineHeight: 1.2,
    fontWeight: 500,
  },
};

// Level 3 — leaf items (no children)
const SidebarLeafItems = ({
  child,
  submenuItemHeight,
  onItemClick,
}: {
  child: SidebarChildItem;
  submenuItemHeight: number;
  onItemClick: (href?: string) => void;
}) => (
  <Box
    sx={{
      ml: 1.5,
      pl: 1.25,
      borderLeft: '1.5px solid',
      borderColor: 'divider',
    }}
  >
    {child.children?.map((gc) => (
      <ListItemButton
        key={gc.id}
        selected={gc.isActive}
        onClick={() => onItemClick(gc.href)}
        sx={{
          borderRadius: 1.5,
          minHeight: submenuItemHeight - 12,
          py: 0.25,
          pl: 1,
          pr: 1,
          ...subSelectedSx,
        }}
      >
        {gc.icon !== undefined ? (
          <ListItemIcon sx={{ minWidth: 22, justifyContent: 'center' }}>
            <gc.icon sx={{ fontSize: 15 }} />
          </ListItemIcon>
        ) : null}
        <ListItemText primary={gc.label} slotProps={{ primary: sidebarPrimaryTextSx }} />
      </ListItemButton>
    ))}
  </Box>
);

// Level 2 — sub-items (may have children)
const SidebarSubItem = ({
  child,
  submenuItemHeight,
  onItemClick,
  toggleGroup,
}: {
  child: SidebarChildItem;
  submenuItemHeight: number;
  onItemClick: (href?: string) => void;
  toggleGroup: (itemId: string) => void;
}) => {
  const showGrandchildren = child.hasChildren && child.isOpen;

  const handleClick = () => {
    if (child.hasChildren) {
      toggleGroup(child.id);
    } else {
      onItemClick(child.href);
    }
  };

  return (
    <Box>
      <ListItemButton
        selected={child.isActive}
        onClick={handleClick}
        sx={{
          borderRadius: 1.5,
          minHeight: submenuItemHeight - 8,
          py: 0.5,
          pl: 1.25,
          pr: 1,
          ...subSelectedSx,
        }}
      >
        <ListItemIcon sx={{ minWidth: 26, justifyContent: 'center' }}>
          {child.icon !== undefined ? <child.icon sx={{ fontSize: 17 }} /> : null}
        </ListItemIcon>
        <ListItemText primary={child.label} slotProps={{ primary: sidebarPrimaryTextSx }} />
        {child.hasChildren ? (
          child.isOpen ? (
            <ExpandLessIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
          )
        ) : null}
      </ListItemButton>
      {showGrandchildren ? (
        <List sx={{ py: 0 }}>
          <SidebarLeafItems
            child={child}
            submenuItemHeight={submenuItemHeight}
            onItemClick={onItemClick}
          />
        </List>
      ) : null}
    </Box>
  );
};

// Level 2 wrapper — iterates children of a level-1 item
const SidebarItemChildren = ({
  item,
  submenuItemHeight,
  onItemClick,
  toggleGroup,
}: {
  item: SidebarMappedItem;
  submenuItemHeight: number;
  onItemClick: (href?: string) => void;
  toggleGroup: (itemId: string) => void;
}) => (
  <>
    {item.children?.map((child) => (
      <SidebarSubItem
        key={child.id}
        child={child}
        submenuItemHeight={submenuItemHeight}
        onItemClick={onItemClick}
        toggleGroup={toggleGroup}
      />
    ))}
  </>
);

const onSidebarItemClick = (
  hasChildren: boolean,
  itemId: string,
  href: string | undefined,
  onItemClickHandler: (nextHref?: string) => void,
  toggleGroupHandler: (nextItemId: string) => void,
) => {
  if (hasChildren) {
    toggleGroupHandler(itemId);
    return;
  }
  onItemClickHandler(href);
};

const getExpandIndicatorIcon = (showExpandIcon: boolean, isOpen: boolean) => {
  if (!showExpandIcon) return null;
  return isOpen ? (
    <ExpandLessIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
  ) : (
    <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
  );
};

const getSidebarMenuItemSx = (isCollapsed: boolean, sidebarItemHeight: number) => ({
  borderRadius: 1.5,
  minHeight: sidebarItemHeight - 14,
  color: 'text.primary',
  justifyContent: isCollapsed ? 'center' : 'flex-start',
  px: isCollapsed ? 0 : 1,
  py: 0.625,
  transition: 'background-color 0.15s ease, color 0.15s ease',
  ...selectedSx,
});

const SidebarMenuItemIcon = ({
  icon: Icon,
  isCollapsed,
}: {
  icon: SidebarMappedItem['icon'];
  isCollapsed: boolean;
}) => (
  <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 30, justifyContent: 'center' }}>
    {Icon !== undefined ? <Icon /> : <HomeOutlinedIcon />}
  </ListItemIcon>
);

// Level 1 — top-level menu items
const SidebarMenuItem = ({
  item,
  isCollapsed,
  sidebarItemHeight,
  submenuItemHeight,
  onItemClick,
  toggleGroup,
}: {
  item: SidebarMappedItem;
  isCollapsed: boolean;
  sidebarItemHeight: number;
  submenuItemHeight: number;
  onItemClick: (href?: string) => void;
  toggleGroup: (itemId: string) => void;
}) => {
  if (item.type === 'section') {
    return <SidebarSectionHeader label={item.label} isCollapsed={isCollapsed} />;
  }

  const showExpandIcon = !isCollapsed && item.hasChildren;
  const showChildren = !isCollapsed && item.hasChildren && item.isOpen;
  const itemSx = getSidebarMenuItemSx(isCollapsed, sidebarItemHeight);

  return (
    <Box>
      <ListItemButton
        selected={item.isActive}
        onClick={() =>
          onSidebarItemClick(item.hasChildren, item.id, item.href, onItemClick, toggleGroup)
        }
        sx={itemSx}
      >
        <SidebarMenuItemIcon icon={item.icon} isCollapsed={isCollapsed} />
        {!isCollapsed ? (
          <ListItemText primary={item.label} slotProps={{ primary: sidebarPrimaryTextSx }} />
        ) : null}
        {getExpandIndicatorIcon(showExpandIcon, item.isOpen)}
      </ListItemButton>
      {showChildren ? (
        <List sx={{ px: 0.5, py: 0.25, mt: 0 }}>
          <SidebarItemChildren
            item={item}
            submenuItemHeight={submenuItemHeight}
            onItemClick={onItemClick}
            toggleGroup={toggleGroup}
          />
        </List>
      ) : null}
    </Box>
  );
};

export const SidebarContent = memo(
  ({
    isCollapsed,
    onToggle,
    density,
    brand,
    items,
    mobileMode = false,
    closeMobile,
  }: SidebarContentProps) => {
    const { mappedItems, onItemClick, toggleGroup } = useSidebarContentState(items, closeMobile);
    const Logo = brand.logo;
    const sidebarItemHeight = densityMetrics[density].sidebarItemHeight;
    const submenuItemHeight = densityMetrics[density].submenuItemHeight;
    const sidebarHeaderHeight = densityMetrics[density].appBarHeight;

    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: sidebarHeaderHeight,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Logo color="primary" />
            {!isCollapsed ? (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {brand.label}
              </Typography>
            ) : null}
          </Box>
          <SidebarMenuButton
            isCollapsed={isCollapsed}
            mobileMode={mobileMode}
            onToggle={onToggle}
            closeMobile={closeMobile}
          />
        </Box>
        <List
          sx={{
            p: 0.75,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.125,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {mappedItems.map((item) => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              sidebarItemHeight={sidebarItemHeight}
              submenuItemHeight={submenuItemHeight}
              onItemClick={onItemClick}
              toggleGroup={toggleGroup}
            />
          ))}
        </List>
      </Box>
    );
  },
);
