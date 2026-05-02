import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export interface RowActionItem {
  key: string;
  label: string;
  onClick: () => void;
}

interface RowActionsMenuProps {
  actions: RowActionItem[];
}

export const RowActionsMenu = ({ actions }: RowActionsMenuProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {actions.map((action) => (
          <MenuItem
            key={action.key}
            onClick={() => {
              setAnchor(null);
              action.onClick();
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
