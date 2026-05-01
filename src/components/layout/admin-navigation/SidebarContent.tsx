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
import MenuIcon from '@mui/icons-material/Menu';
import { densityMetrics, type DensityMode } from '../../../models/density';
import type { NavigationItem } from '../../../models/navigation';
import type { LayoutBrandConfig } from '../../../models/navigation';
import {
  useSidebarContentState,
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
    {mobileMode ? <CloseIcon /> : isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
  </IconButton>
);

const SidebarItemChildren = ({
  item,
  submenuItemHeight,
  onItemClick,
}: {
  item: SidebarMappedItem;
  submenuItemHeight: number;
  onItemClick: (href?: string) => void;
}) =>
  item.children?.map((child) => (
    <ListItemButton
      key={child.id}
      sx={{ borderRadius: 1.5, minHeight: submenuItemHeight, pl: 3.5 }}
      selected={child.isActive}
      onClick={() => onItemClick(child.href)}
    >
      <ListItemText primary={child.label} />
    </ListItemButton>
  ));

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
  const showExpandIcon = !isCollapsed && item.hasChildren;
  const showChildren = !isCollapsed && item.hasChildren && item.isOpen;

  return (
    <Box key={item.id}>
      <ListItemButton
        selected={item.isActive}
        onClick={() =>
          onSidebarItemClick(item.hasChildren, item.id, item.href, onItemClick, toggleGroup)
        }
        sx={{ borderRadius: 2, minHeight: sidebarItemHeight, color: 'text.primary' }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {item.icon !== undefined ? <item.icon /> : <HomeOutlinedIcon />}
        </ListItemIcon>
        {!isCollapsed ? <ListItemText primary={item.label} /> : null}
        {showExpandIcon ? item.isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon /> : null}
      </ListItemButton>
      {showChildren ? (
        <List sx={{ px: 1, py: 0.75, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <SidebarItemChildren
            item={item}
            submenuItemHeight={submenuItemHeight}
            onItemClick={onItemClick}
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
        <List sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
