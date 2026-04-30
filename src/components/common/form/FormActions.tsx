import type { ActionButtonConfig } from '../actions/ActionButtons';
import { ActionButtons } from '../actions/ActionButtons';

interface FormActionsProps {
  primaryAction: ActionButtonConfig;
  secondaryAction?: ActionButtonConfig;
  tertiaryAction?: ActionButtonConfig;
}

export const FormActions = ({
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: FormActionsProps) => {
  const actions = [tertiaryAction, secondaryAction, primaryAction].filter(
    (item) => item !== undefined,
  );
  return <ActionButtons actions={actions} direction="row" fullWidthOnMobile />;
};
