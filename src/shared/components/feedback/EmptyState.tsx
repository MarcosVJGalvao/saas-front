import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
}
export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  sx,
}: EmptyStateProps) => (
  <AppStack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 6, ...sx }}>
    {icon}
    <AppText variant="h5">{title}</AppText>
    {description !== undefined ? <AppText color="text.secondary">{description}</AppText> : null}
    {actionLabel !== undefined && onAction !== undefined ? (
      <AppButton onClick={onAction} variant="contained">
        {actionLabel}
      </AppButton>
    ) : null}
  </AppStack>
);
