import type { ComponentProps } from 'react';
import { DetailsInfoCards } from '@shared/components/data-display/DetailsInfoCards';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppText } from '@shared/components/data-display/AppText';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';

type DetailsSections = ComponentProps<typeof DetailsInfoCards>['sections'];

interface SubscriptionDetailsContentProps {
  viewState: 'loading' | 'error' | 'empty' | 'ready';
  errorMessage?: string | undefined;
  emptyMessage: string;
  sections: DetailsSections;
  onRetry: () => void;
}

export const SubscriptionDetailsContent = ({
  viewState,
  errorMessage,
  emptyMessage,
  sections,
  onRetry,
}: SubscriptionDetailsContentProps) => {
  const viewByState = {
    loading: <AppCircularProgress ariaLabel="Carregando detalhes da assinatura" />,
    error: (
      <AppErrorState message={errorMessage ?? 'Erro ao carregar assinatura.'} onRetry={onRetry} />
    ),
    empty: <AppText>{emptyMessage}</AppText>,
    ready: <DetailsInfoCards pageTitle="Detalhes da Assinatura" sections={sections} />,
  };

  return viewByState[viewState];
};
