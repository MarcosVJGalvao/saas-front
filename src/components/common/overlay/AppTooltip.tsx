import Tooltip from '@mui/material/Tooltip';
import type { ReactElement } from 'react';

interface AppTooltipProps {
  title: string;
  children: ReactElement;
}

export const AppTooltip = ({ title, children }: AppTooltipProps) => (
  <Tooltip title={title}>{children}</Tooltip>
);
