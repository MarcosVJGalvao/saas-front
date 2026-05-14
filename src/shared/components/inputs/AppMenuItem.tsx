import MenuItem from '@mui/material/MenuItem';
import type { MenuItemProps } from '@mui/material/MenuItem';

export type AppMenuItemProps = MenuItemProps;

export const AppMenuItem = (props: AppMenuItemProps) => <MenuItem {...props} />;
