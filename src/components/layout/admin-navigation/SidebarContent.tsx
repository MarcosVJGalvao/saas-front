import { memo } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { densityMetrics, type DensityMode } from '../../../models/density';
import type { NavigationItem } from '../../../models/navigation';
import type { LayoutBrandConfig } from '../../../models/navigation';
import {
  useSidebarContentState,
  type SidebarChildItem,
  type SidebarMappedItem,
} from '../../../hooks/useSidebarContentState';

interface SidebarContentProps {
  isCollapsed: boolean;
  onToggle: () => void;
  density: DensityMode;
  brand: LayoutBrandConfig;
  items: NavigationItem[];
  mobileMode?: boolean;
  closeMobile?: () => void;
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
  closeMobile?: () => void;
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
    <Divider sx={{ my: 0.5 }} />
  ) : (
    <Typography
      variant="caption"
      sx={{
        px: 1.5,
        pt: 1.5,
        pb: 0.25,
        color: 'text.disabled',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        display: 'block',
      }}
    >
      {label}
    </Typography>
  );

const selectedSx = {
  '&.Mui-selected': { bgcolor: 'action.selected', color: 'primary.main' },
  '&.Mui-selected .MuiListItemIcon-root': { color: 'primary.main' },
} as const;

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
  <>
    {child.children?.map((gc) => (
      <ListItemButton
        key={gc.id}
        selected={gc.isActive}
        onClick={() => onItemClick(gc.href)}
        sx={{
          borderRadius: 1.5,
          minHeight: submenuItemHeight - 8,
          py: 0.25,
          pl: 3.5,
          ...selectedSx,
        }}
      >
        <ListItemIcon sx={{ minWidth: 26, justifyContent: 'center' }}>
          {gc.icon !== undefined ? <gc.icon sx={{ fontSize: 16 }} /> : null}
        </ListItemIcon>
        <ListItemText primary={gc.label} slotProps={{ primary: { variant: 'body2' } }} />
      </ListItemButton>
    ))}
  </>
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
          minHeight: submenuItemHeight - 4,
          py: 0.5,
          pl: 2,
          ...selectedSx,
        }}
      >
        <ListItemIcon sx={{ minWidth: 30, justifyContent: 'center' }}>
          {child.icon !== undefined ? <child.icon sx={{ fontSize: 18 }} /> : null}
        </ListItemIcon>
        <ListItemText primary={child.label} slotProps={{ primary: { variant: 'body2' } }} />
        {child.hasChildren ? (
          child.isOpen ? (
            <ExpandLessIcon sx={{ fontSize: 16 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
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
  return isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />;
};

const getSidebarMenuItemSx = (isCollapsed: boolean, sidebarItemHeight: number) => ({
  borderRadius: 2,
  minHeight: sidebarItemHeight - 8,
  color: 'text.primary',
  justifyContent: isCollapsed ? 'center' : 'flex-start',
  px: isCollapsed ? 0 : 1.5,
  ...selectedSx,
});

const SidebarMenuItemIcon = ({
  icon: Icon,
  isCollapsed,
}: {
  icon: SidebarMappedItem['icon'];
  isCollapsed: boolean;
}) => (
  <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 36, justifyContent: 'center' }}>
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
        {!isCollapsed ? <ListItemText primary={item.label} /> : null}
        {getExpandIndicatorIcon(showExpandIcon, item.isOpen)}
      </ListItemButton>
      {showChildren ? (
        <List sx={{ px: 1, py: 0.25, mt: 0 }}>
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
        <Divider />
        <List
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
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
