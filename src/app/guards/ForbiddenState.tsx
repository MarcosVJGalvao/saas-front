import { AppAlert } from '@shared/components/feedback/AppAlert';

interface ForbiddenStateProps {
  message?: string;
}

export const ForbiddenState = ({
  message = 'Você não tem permissão para acessar este recurso.',
}: ForbiddenStateProps) => <AppAlert severity="warning">{message}</AppAlert>;
