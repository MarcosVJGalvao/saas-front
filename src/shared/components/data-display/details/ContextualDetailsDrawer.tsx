import type { ComponentProps } from 'react';
import { EntityDetailsDrawer } from '@shared/components/data-display/details/EntityDetailsDrawer';

type ContextualDetailsDrawerProps = ComponentProps<typeof EntityDetailsDrawer>;

export const ContextualDetailsDrawer = (props: ContextualDetailsDrawerProps) => (
  <EntityDetailsDrawer {...props} />
);
