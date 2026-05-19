import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { memo, useCallback, useState } from 'react';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';

interface AppPopoverMenuItem {
  label: string;
  onClick: () => void;
}

interface AppPopoverMenuProps {
  items: AppPopoverMenuItem[];
}

export const AppPopoverMenu = memo(({ items }: AppPopoverMenuProps) => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  }, []);
  const closeMenu = useCallback(() => setAnchor(null), []);

  return (
    <>
      <IconButton onClick={openMenu} aria-label={sharedComponentsI18n.overlays.openMenuAriaLabel}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={closeMenu}
        slotProps={{ transition: { timeout: 180 } }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              closeMenu();
              item.onClick();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});
