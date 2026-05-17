import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { CardProps } from '@mui/material/Card';
import type { ReactNode } from 'react';

interface AppCardProps extends CardProps {
  children: ReactNode;
  padded?: boolean;
}

export const AppCard = ({ children, padded = true, ...props }: AppCardProps) => (
  <Card {...props}>{padded ? <CardContent>{children}</CardContent> : children}</Card>
);
