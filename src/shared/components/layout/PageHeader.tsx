import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { PermissionGate } from '@app/guards/PermissionGate';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string | undefined;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string | undefined;
  breadcrumbs?: PageHeaderBreadcrumb[] | undefined;
  actions?: ReactNode | undefined;
  actionLabel?: string | undefined;
  actionIcon?: ReactNode | undefined;
  canShowAction?: boolean | undefined;
  onAction?: (() => void) | undefined;
  sx?: SxProps<Theme> | undefined;
}

const renderPrimaryAction = ({
  actionIcon,
  actionLabel,
  canShowAction = true,
  onAction,
}: Pick<PageHeaderProps, 'actionIcon' | 'actionLabel' | 'canShowAction' | 'onAction'>) => {
  if (actionLabel === undefined || onAction === undefined) {
    return null;
  }

  return (
    <PermissionGate allowed={canShowAction} fallback={null}>
      <AppButton startIcon={actionIcon} variant="contained" onClick={onAction}>
        {actionLabel}
      </AppButton>
    </PermissionGate>
  );
};

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  actionLabel,
  actionIcon,
  canShowAction,
  onAction,
  sx,
}: PageHeaderProps) => (
  <AppBox sx={sx}>
    <AppStack spacing={1.5} sx={{ mb: 3 }}>
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
              <AppText key={`${breadcrumb.label}-${index}`} color="text.primary">
                {breadcrumb.label}
              </AppText>
            );
          })}
        </Breadcrumbs>
      ) : null}
      <AppBox
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
      >
        <AppBox>
          <AppText variant="h5" sx={{ fontWeight: 700 }}>
            {title}
          </AppText>
          {subtitle !== undefined ? (
            <AppText variant="body2" color="text.secondary">
              {subtitle}
            </AppText>
          ) : null}
        </AppBox>
        <AppStack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {actions}
          {renderPrimaryAction({ actionIcon, actionLabel, canShowAction, onAction })}
        </AppStack>
      </AppBox>
    </AppStack>
  </AppBox>
);
