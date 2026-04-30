import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }: PageHeaderProps) => (
  <Stack spacing={1.5} sx={{ mb: 3 }}>
    {breadcrumbs.length > 0 ? (
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLastItem = index === breadcrumbs.length - 1;
          if (breadcrumb.href !== undefined && !isLastItem) {
            return (
              <Link
                key={`${breadcrumb.label}-${index}`}
                underline="hover"
                color="inherit"
                href={breadcrumb.href}
              >
                {breadcrumb.label}
              </Link>
            );
          }
          return (
            <Typography key={`${breadcrumb.label}-${index}`} color="text.primary">
              {breadcrumb.label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    ) : null}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box>
        <Typography variant="h2">{title}</Typography>
        {subtitle !== undefined ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions}
    </Box>
  </Stack>
);
