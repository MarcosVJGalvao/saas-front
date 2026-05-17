import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}

export const SectionCard = ({ title, subtitle, children, actions, footer }: SectionCardProps) => (
  <Card>
    {title !== undefined ? (
      <CardHeader title={title} subheader={subtitle} action={actions} />
    ) : null}
    <CardContent>{children}</CardContent>
    {footer !== undefined ? <CardActions>{footer}</CardActions> : null}
  </Card>
);
