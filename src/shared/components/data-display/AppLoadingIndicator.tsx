import CircularProgress from '@mui/material/CircularProgress';
import type { CircularProgressProps } from '@mui/material/CircularProgress';

export type AppLoadingIndicatorProps = CircularProgressProps;

export const AppLoadingIndicator = (props: AppLoadingIndicatorProps) => (
  <CircularProgress {...props} />
);
