import Alert from '@mui/material/Alert';
import type { AlertProps } from '@mui/material/Alert';

export type AppAlertProps = AlertProps;

export const AppAlert = (props: AppAlertProps) => <Alert {...props} />;
