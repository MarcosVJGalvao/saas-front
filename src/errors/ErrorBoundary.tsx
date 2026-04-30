import type { ReactNode } from 'react';
import { Component } from 'react';
import Alert from '@mui/material/Alert';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <Alert severity="error">Erro de renderização capturado pelo ErrorBoundary.</Alert>;
    }

    return this.props.children;
  }
}
