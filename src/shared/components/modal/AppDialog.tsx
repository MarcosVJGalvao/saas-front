import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog';

export type AppDialogProps = DialogProps;

export const AppDialog = (props: AppDialogProps) => <Dialog {...props} />;
