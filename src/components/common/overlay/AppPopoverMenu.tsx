import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

interface AppPopoverMenuItem {
  label: string;
  onClick: () => void;
}

interface AppPopoverMenuProps {
  items: AppPopoverMenuItem[];
}

export const AppPopoverMenu = ({ items }: AppPopoverMenuProps) => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton onClick={(event) => setAnchor(event.currentTarget)} aria-label="Abrir menu">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              setAnchor(null);
              item.onClick();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
